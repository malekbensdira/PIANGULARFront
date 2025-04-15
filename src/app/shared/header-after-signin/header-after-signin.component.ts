import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service'; // Assurez-vous d'importer le UserService ici
import { User } from '../../models/user.model'; // adapte le chemin si nécessaire



@Component({
  selector: 'app-header-after-signin',
  templateUrl: './header-after-signin.component.html',
  styleUrls: ['./header-after-signin.component.css']
})
export class HeaderAfterSigninComponent implements OnInit {
  userImageUrl: string = '';
  userName: string = '';

  // Injectez UserService dans le constructeur
  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.userName = user.nom + ' ' + user.prenom;
          this.userImageUrl = user.image;  // ici on récupère bien l'URL complète
          console.log("Image URL:", this.userImageUrl); // debug
        },
        error: err => {
          console.error('Erreur lors de la récupération de l’utilisateur:', err);
        }
      });
    }
  }
  
}
