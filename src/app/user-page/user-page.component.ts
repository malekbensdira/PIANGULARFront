// user-page.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  isLoggedIn: boolean = false;
  welcomeMessage: string = 'Welcome to Amena!';
  router: any;
  imageUrl: string = ''; 
  messageAlreadyDismissed: boolean = false;

  userRole: string = '';
  userName: string = '';
  showFloatingMessage: boolean = true;
  isGif9: boolean = true;
  showMessageBubble: boolean = true;
  nomUser: string = ''; // pour afficher dans la bulle

  showChatWindow: boolean = false;
  chatInput: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.isLoggedIn = true;
      this.userService.getUserByEmail(email).subscribe({
        next: (user: User) => {
          localStorage.setItem('id', user.id.toString());
          const nom = user.nom;
          this.userName = nom;

          const roleNom = user.role ? user.role.nomRole : 'User';
          this.userRole = roleNom; // Ajout pour le contrôle d’affichage
          this.welcomeMessage = `Welcome ${roleNom} ${nom}`;

          // 🔥 Charger l'image depuis le champ `photo` du backend
          if (user.image) {
            this.imageUrl = user.image; // exemple : "photo_123.png"
          }
        },
        error: err => {
          console.error('Erreur de récupération de l’utilisateur:', err);
          this.welcomeMessage = 'Welcome to Amena!';
        }
      });
    }
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

    // Toggle fenêtre chat aussi
    this.showChatWindow = !this.showChatWindow;
  }

  closeChat(): void {
    this.showChatWindow = false;
  }

  sendMessage(): void {
    if (this.chatInput.trim()) {
      console.log("Message envoyé :", this.chatInput);
      // Ajoute ici l’enregistrement ou l’affichage du message dans le chat
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
