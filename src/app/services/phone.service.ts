import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  private apiUrl = 'http://localhost:8081/api/users/reset-password-phone'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer le code de réinitialisation
  sendResetCode(phone: string): Observable<any> {
    return this.http.post(this.apiUrl, { phone });
  }

  // Vous pouvez ajouter d'autres méthodes si nécessaire, par exemple pour vérifier le code ou réinitialiser le mot de passe
}
