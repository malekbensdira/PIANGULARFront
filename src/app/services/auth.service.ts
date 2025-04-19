import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/users/login';
  private authenticatedUser: any = null;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasLocalUser());

  constructor(private http: HttpClient) {}

  // Authentification backend
  login(email: string, mdp: string): Observable<string> {
    return this.http.post(this.apiUrl, { email, mdp }, { responseType: 'text' });
  }

  // Stockage utilisateur
  setAuthenticatedUser(user: any): void {
    this.authenticatedUser = user;
    localStorage.setItem('user', JSON.stringify(user));  // Stockage de l'utilisateur dans localStorage
    this.isAuthenticatedSubject.next(true);
  }

  getAuthenticatedUser(): any {
    if (!this.authenticatedUser) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.authenticatedUser = JSON.parse(userData);
      }
    }
    return this.authenticatedUser;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  logout(): void {
    this.authenticatedUser = null;
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  private hasLocalUser(): boolean {
    return !!localStorage.getItem('user');
  }

  // Récupérer l'email de l'utilisateur connecté (stocké dans le localStorage)
  getAuthenticatedEmail(): string | null {
    const user = this.getAuthenticatedUser();
    return user ? user.email : null;
  }

  // Récupérer l'utilisateur par son email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/by-email?email=${email}`);
  }
}
