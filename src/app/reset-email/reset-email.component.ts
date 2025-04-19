import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-email',
  templateUrl: './reset-email.component.html',
  styleUrls: ['./reset-email.component.css']
})
export class ResetEmailComponent {
  email: string = '';
  codeSent: boolean = false;
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  sendResetCode() {
    this.http.post('http://localhost:8081/api/email/sendCode', { email: this.email }).subscribe({
      next: (response: any) => {
        console.log('Code envoyé avec succès', response);
        localStorage.setItem('resetEmail', this.email); // Stocker l'email
        this.message = 'Code sent successfully!';
        this.codeSent = true; // Afficher le bouton de redirection
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du code', error);
        this.message = 'Erreur lors de l\'envoi du code !';
      }
    });
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']); // Redirection vers la page de réinitialisation du mot de passe
  }
}