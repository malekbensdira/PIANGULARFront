import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-sms',
  templateUrl: './reset-sms.component.html',
  styleUrls: ['./reset-sms.component.css']
})
export class ResetSmsComponent {
  smsCode: string = '';  // Modèle pour le code SMS
  message: string = '';  // Message de confirmation
  codeSent: boolean = false;  // Statut de l'envoi du code

  constructor(private http: HttpClient, private router: Router) {}

  sendCode() {
    const phoneNumber = '96348060'; // Remplace par le numéro entré par l'utilisateur
    
    // Stocker le numéro de téléphone dans le localStorage
    localStorage.setItem('phoneNumber', phoneNumber);
  
    this.http.post<string>(`http://localhost:8081/api/users/forgot-password?tel=${phoneNumber}`, {}, { responseType: 'text' as 'json' })
      .subscribe(
        response => {
          console.log('Response from server:', response);
          if (response && response.includes("Reset code sent successfully")) {
            this.message = 'Code sent successfully!';
            this.codeSent = true;
          } else {
            this.message = 'Failed to send code. Please try again!';
            this.codeSent = false;
          }
        },
        error => {
          console.error('Error occurred while sending the code:', error);
          this.message = 'Failed to send code. Please try again!';
          this.codeSent = false;
        }
      );
  }
  

  // Méthode de redirection vers la page de réinitialisation du mot de passe
  goToResetPassword() {
    this.router.navigate(['/reset-sms-formulaire']); // Redirection vers la page de réinitialisation du mot de passe
  }
  
}
