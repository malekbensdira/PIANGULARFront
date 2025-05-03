import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent implements OnInit {
  userImageUrl: string = '';
  userName: string = '';
  dropdownOpen: boolean = false;
  welcomeMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.userName = `${user.nom} ${user.prenom}`;
          this.userImageUrl = user.image || 'assets/img/default-profile.png';
          this.welcomeMessage = `Welcome Admin ${user.nom}`;
        },
        error: err => {
          console.error('Erreur récupération utilisateur:', err);
          this.welcomeMessage = 'Welcome to the Admin Panel!';
        }
      });
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => (this.dropdownOpen = false), 200);
  }

  goToProfile(): void {
    this.router.navigate(['/adminProfile-settings']);
    this.dropdownOpen = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}
