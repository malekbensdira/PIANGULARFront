import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  code: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  email: string | null = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.email = localStorage.getItem('resetEmail'); // Récupérer l'email stocké
    console.log('Email récupéré depuis localStorage:', this.email);
    if (!this.email) {
      this.errorMessage = "Email not found. Please restart the process.";
    }
  }

  resetPassword() {
    if (!this.email) {
      this.errorMessage = "Email not found. Please restart the process.";
      return;
    }
    
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match!";
      return;
    }

    // Vérification du code avec les paramètres correctement envoyés
    this.http.post(`http://localhost:8081/api/email/verifyCode`, {}, {
      params: { email: this.email, code: this.code }
    }).subscribe({
      next: (verifyResponse: any) => {
        console.log("Code vérifié avec succès", verifyResponse);
        
        // Réinitialisation du mot de passe
        this.http.post(`http://localhost:8081/api/users/reset-password`, {
          email: this.email,
          code: this.code,
          newPassword: this.newPassword
        }).subscribe(
          () => {
            this.successMessage = "Password has been successfully reset!";
            localStorage.removeItem('resetEmail'); // Nettoyer après succès
            setTimeout(() => {
              this.router.navigate(['/auth']); // Redirection vers login
            }, 2000);
          },
          (error) => {
            this.errorMessage = "Invalid reset code or request failed!";
            console.error("Erreur lors de la réinitialisation du mot de passe:", error);
          }
        );
      },
      error: (error) => {
        this.errorMessage = "Invalid or expired code!";
        console.error("Erreur lors de la vérification du code:", error);
      }
    });
  }
}
