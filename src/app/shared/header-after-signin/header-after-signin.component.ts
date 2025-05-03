import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header-after-signin',
  templateUrl: './header-after-signin.component.html',
  styleUrls: ['./header-after-signin.component.css']
})
export class HeaderAfterSigninComponent implements OnInit {
  userImageUrl: string = '';
  userName: string = '';

  constructor(
    private authService: AuthService, 
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.userName = user.nom + ' ' + user.prenom;
          this.userImageUrl = user.image;
          console.log("Image URL:", this.userImageUrl);
        },
        error: err => {
          console.error('Erreur lors de la récupération de lutilisateur:', err);
        }
      });
    }
  }

  navigateToCredit(): void {
    this.router.navigate(['/credit']);
  }
}