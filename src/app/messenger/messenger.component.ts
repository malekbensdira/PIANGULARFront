import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ChatMessage } from '../models/ChatMessage.model';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() userName: string = '';
  @Input() isLoggedIn: boolean = false;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  isGif9: boolean = true;
  showChatWindow: boolean = false;
  welcomeMessage: string = 'Welcome to Amena!';
  imageUrl: string = '';
  messageAlreadyDismissed: boolean = false;
  contacts: User[] = [];
  message: string = '';
  selectedAgent: User | null = null;
  chatInput: string = '';
  showFloatingMessage: boolean = true;
  showMessageBubble: boolean = true;
  nomUser: string = '';
  messages: ChatMessage[] = [];
  myId: number | null = null;
  unreadCounts: { [agentId: number]: number } = {};
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    const id = localStorage.getItem('id');
    this.myId = id && !isNaN(Number(id)) ? Number(id) : null;

    if (!email || !this.myId) {
      this.errorMessage = 'Utilisateur non connecté ou ID invalide. Veuillez vous reconnecter.';
      this.isLoggedIn = false;
      this.router.navigate(['/auth']);
      return;
    }

    console.log('Initialisation avec myId:', this.myId, 'email:', email);
    this.isLoggedIn = true;

    this.userService.getUserByEmail(email).subscribe({
      next: (user: User) => {
        this.userName = user.nom;
        const roleNom = user.role ? user.role.nomRole : '';
        this.message = roleNom === 'AGENT'
          ? 'Choisissez un investisseur à contacter'
          : 'Choisissez un agent à contacter';

        this.userService.getContacts(user.id).subscribe({
          next: (contacts: User[]) => {
            console.log('Contacts récupérés:', contacts);
            this.contacts = contacts;
            this.contacts.forEach(agent => {
              console.log('Récupération des messages non lus pour agentId:', agent.id, 'myId:', this.myId);
              this.userService.getUnreadCount(agent.id, this.myId!).subscribe({
                next: (count: number) => {
                  console.log('Messages non lus pour agentId', agent.id, ':', count);
                  this.unreadCounts[agent.id] = count;
                  this.cdr.detectChanges();
                },
                error: err => {
                  console.error(`Erreur récupération des messages non lus pour l'agent ${agent.id}:`, err);
                  this.errorMessage = 'Erreur lors du chargement des messages non lus.';
                }
              });
            });

            const storedAgentId = localStorage.getItem('selectedAgentId');
            if (storedAgentId) {
              const previousAgent = contacts.find(agent => agent.id === Number(storedAgentId));
              if (previousAgent) this.selectAgent(previousAgent);
            }
          },
          error: err => {
            console.error('Erreur récupération contacts:', err);
            this.errorMessage = 'Erreur lors du chargement des contacts.';
          }
        });
      },
      error: err => {
        console.error('Erreur récupération utilisateur:', err);
        this.errorMessage = 'Erreur lors du chargement des informations utilisateur.';
      }
    });
  }

  extractImageName(fullPath: string): string {
    return fullPath.split('\\').pop() || fullPath;
  }

  dismissFloatingMessage(): void {
    this.showFloatingMessage = false;
    this.isGif9 = false;
  }

  toggleGif(): void {
    this.isGif9 = !this.isGif9;
    if (!this.isGif9 && !this.messageAlreadyDismissed) {
      this.showFloatingMessage = false;
      this.messageAlreadyDismissed = true;
    }
    this.showChatWindow = !this.showChatWindow;
  }

  closeChat(): void {
    this.showChatWindow = false;
  }

  selectAgent(agent: User): void {
    if (!this.myId) {
      this.errorMessage = 'Utilisateur non connecté. Veuillez vous reconnecter.';
      this.router.navigate(['/auth']);
      return;
    }

    console.log('Agent sélectionné: agentId=', agent.id, 'myId=', this.myId);
    this.selectedAgent = agent;
    localStorage.setItem('selectedAgentId', agent.id.toString());
    localStorage.setItem('selectedAgentEmail', agent.email);
    localStorage.setItem('selectedAgentNom', agent.nom);
    this.loadMessagesWithAgent(agent.id);

    this.userService.markMessagesAsRead(agent.id, this.myId).subscribe({
      next: () => {
        console.log('Messages marqués comme lus pour agentId:', agent.id);
        this.unreadCounts[agent.id] = 0;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur lors de la mise à jour des messages comme lus:', err);
        this.errorMessage = 'Erreur lors du marquage des messages comme lus.';
      }
    });
  }

  sendMessage(): void {
    if (!this.myId || this.myId <= 0 || !this.selectedAgent) {
      this.errorMessage = 'Utilisateur non connecté ou ID invalide.';
      this.router.navigate(['/auth']);
      return;
    }

    if (this.chatInput.trim()) {
      const message: ChatMessage = {
        senderId: this.myId,
        receiverId: this.selectedAgent.id,
        content: this.chatInput,
        timestamp: new Date()
      };

      console.log('Envoi de message:', message);
      this.userService.sendMessage(message).subscribe({
        next: (msg: ChatMessage) => {
          console.log('Message envoyé:', msg);
          this.messages.push(msg);
          this.chatInput = '';
          this.sortMessages();
          this.scrollToBottom();
        },
        error: err => {
          console.error('Erreur envoi message:', err);
          this.errorMessage = 'Erreur lors de l\'envoi du message.';
        }
      });
    }
  }

  loadMessagesWithAgent(agentId: number): void {
    if (!this.myId || !agentId) {
      this.errorMessage = 'Utilisateur ou agent non valide.';
      return;
    }

    console.log('Chargement des messages: myId=', this.myId, 'agentId=', agentId);
    this.userService.getMessagesBetweenUsers(this.myId, agentId).subscribe({
      next: (msgs: ChatMessage[]) => {
        console.log('Messages récupérés:', msgs);
        this.messages = msgs;
        this.sortMessages();
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: err => {
        console.error('Erreur chargement messages:', err);
        this.errorMessage = 'Erreur lors du chargement des messages.';
      }
    });
  }

  sortMessages(): void {
    this.messages.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 100);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  navigateToUserPage(): void {
    this.router.navigate(['/user']);
  }
}