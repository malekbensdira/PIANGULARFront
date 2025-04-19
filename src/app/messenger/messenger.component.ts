import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
  isGif9: boolean = true;
  showChatWindow: boolean = false;

  @Input() userName: string = '';
  @Input() isLoggedIn: boolean = false;

  welcomeMessage: string = 'Welcome to Amena!';
  router: any;
  imageUrl: string = '';
  messageAlreadyDismissed: boolean = false;
  contacts: User[] = [];
  message: string = '';
  selectedAgent: any = null;
  chatInput: string = '';
  showFloatingMessage: boolean = true;
  showMessageBubble: boolean = true;
  nomUser: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.isLoggedIn = true;

      this.userService.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.userName = user.nom;
          const roleNom = user.role ? user.role.nomRole : '';

          // Définir le message selon le rôle
          if (roleNom === 'AGENT') {
            this.message = 'Choose an investor to reach';
          } else if (roleNom === 'INVESTOR') {
            this.message = 'Choose an agent to reach';
          }

          // Charger les contacts
          this.userService.getContacts(user.id).subscribe({
            next: (contacts: User[]) => {
              this.contacts = contacts;
            },
            error: err => console.error('Erreur lors de la récupération des contacts:', err)
          });
        },
        error: err => console.error('Erreur de récupération de l’utilisateur:', err)
      });
    }
  }

  extractImageName(fullPath: string): string {
    const parts = fullPath.split('\\');
    return parts[parts.length - 1];
  }

  dismissFloatingMessage(): void {
    this.showFloatingMessage = false;
    this.isGif9 = false;
  }

  selectAgent(contact: any) {
    // Stocker les infos dans localStorage
    localStorage.setItem('selectedAgentEmail', contact.email);
    localStorage.setItem('selectedAgentNom', contact.nom);
    localStorage.setItem('selectedAgentPrenom', contact.prenom);
    localStorage.setItem('selectedAgentRole', contact.role?.nomRole || '');
    localStorage.setItem('selectedAgentImage', contact.image || '');

    // Définir l’agent sélectionné pour l’afficher dans la conversation
    this.selectedAgent = contact;
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

  handleGifClick(): void {
    this.isGif9 = !this.isGif9;

    this.showChatWindow = !this.isGif9 ? true : false;
  }

  sendMessage(): void {
    if (this.chatInput.trim()) {
      console.log("Message envoyé :", this.chatInput);
      this.chatInput = '';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const content = document.getElementById('content');
      if (content) {
        content.classList.add('visible');
      }
    }, 3000);
  }

  onLoginClick() {
    this.navigateToUserPage();
  }

  navigateToUserPage() {
    this.router.navigate(['/user']);
  }
}
