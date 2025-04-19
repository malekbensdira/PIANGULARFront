import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-after-signin',
  templateUrl: './header-after-signin.component.html',
  styleUrls: ['./header-after-signin.component.css']
})
export class HeaderAfterSigninComponent implements OnInit {
  userImageUrl: string = '';
  userName: string = '';
  dropdownOpen: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.userName = user.nom + ' ' + user.prenom;
          this.userImageUrl = user.image || '';
        },
        error: err => {
          console.error('Erreur lors de la récupération de l’utilisateur:', err);
        }
      });
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => this.dropdownOpen = false, 200);
  }

 

  goToProfile(): void {
    this.router.navigate(['/profile-settings']);
    this.dropdownOpen = false;
  }
  

  logout() {
    console.log("Déconnexion en cours...");
    localStorage.clear();
    this.router.navigate(['/auth']); // à adapter selon ta page de login
  }
}
