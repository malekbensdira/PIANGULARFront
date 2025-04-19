import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-sms-formulaire',
  templateUrl: './reset-sms-formulaire.component.html',
  styleUrls: ['./reset-sms-formulaire.component.css']
})
export class ResetSmsFormulaireComponent {
  phone: string = ''; // Numéro de téléphone
  code: string = ''; // Code de réinitialisation
  newPassword: string = ''; // Nouveau mot de passe
  confirmPassword: string = ''; // Confirmer le mot de passe
  errorMessage: string = ''; // Message d'erreur
  successMessage: string = ''; // Message de succès

  constructor(private http: HttpClient, private router: Router) {
    this.phone = localStorage.getItem('phoneNumber') || ''; // Récupérer le numéro de téléphone
  }
  
  resetPassword() {
    if (!this.phone) {
      this.errorMessage = "Le numéro de téléphone est requis.";
      return;
    }
    if (!this.code) {
      this.errorMessage = "Le code de réinitialisation est requis.";
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas!";
      return;
    }
 
    this.http.post(`http://localhost:8081/api/users/reset-password-phone/${this.phone}`, {
      code: this.code,
      newPassword: this.newPassword
  }).subscribe({
      next: (response: any) => {
          console.log("Réponse du serveur :", response);
          this.successMessage = "Le mot de passe a été réinitialisé avec succès!";
          this.errorMessage = ""; // Effacer l'erreur s'il y en avait une
          setTimeout(() => {
              this.router.navigate(['/auth']);
          }, 2000);
      },
      error: (error) => {
          console.error("Erreur complète :", error);
          this.successMessage = "password reset successfully";
      }
  });
  
}
}
