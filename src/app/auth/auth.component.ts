import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez entrer un email et un mot de passe';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // ✅ Stocker l'utilisateur connecté
        this.authService.setAuthenticatedUser({ email: this.email, role: response });

        // ✅ Stocker l'email dans le localStorage
        localStorage.setItem('email', this.email);
        console.log('Email enregistré dans le localStorage:', this.email);

        // 🔁 Redirection selon le rôle
        if (response === 'Back') {
          this.router.navigate(['/admin']);
        } else if (response === 'Front') {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }
}
