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
    this.email = localStorage.getItem('resetEmail');
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

    // Vérification du code
    this.http.post(`http://localhost:8081/api/email/verifyCode`, {
      email: this.email,
      code: this.code
    }).subscribe({
      next: (verifyResponse: any) => {
        console.log("Réponse de verifyCode:", verifyResponse);
        if (verifyResponse.error) {
          this.errorMessage = verifyResponse.error;
          return;
        }
        
        // Réinitialisation du mot de passe
        this.http.post(`http://localhost:8081/api/users/reset-password`, {
          email: this.email,
          code: this.code,
          newPassword: this.newPassword
        }).subscribe({
          next: (resetResponse: any) => {
            console.log("Réponse de reset-password:", resetResponse);
            if (resetResponse.error) {
              this.errorMessage = resetResponse.error;
              return;
            }
            this.successMessage = resetResponse.message || "Password has been successfully reset!";
            localStorage.removeItem('resetEmail');
            setTimeout(() => {
              this.router.navigate(['/auth']);
            }, 2000);
          },
          error: (error) => {
            console.error("Erreur lors de la réinitialisation du mot de passe:", error);
            this.errorMessage = error.error?.error || "Failed to reset password. Please try again.";
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors de la vérification du code:", error);
        this.errorMessage = error.error?.error || "Invalid or expired code!";
      }
    });
  }
}