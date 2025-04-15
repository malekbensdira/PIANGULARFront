import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';  // Import du modèle 'User'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';  // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Méthode pour enregistrer un utilisateur avec son image
  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  // Méthode pour récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);  // Appel à l'API pour récupérer tous les utilisateurs
  }

  // Méthode pour récupérer un utilisateur par son ID (si besoin pour un affichage détaillé)
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  // Méthode pour récupérer les rôles (utile pour l'enregistrement ou autres fonctionnalités)
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  // Méthode pour mettre à jour un utilisateur
  updateUser(userId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${userId}`, formData);
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${userId}`);
  }



  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile?email=${email}`);
  }
}
