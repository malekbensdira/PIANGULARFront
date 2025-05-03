import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/users';
  private authenticatedUser: any = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasLocalUser());

  constructor(private http: HttpClient) {}

  // Authentification backend
  login(email: string, password: string): Observable<{ redirect?: string; error?: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, mdp: password };
    console.log('Login request payload:', body);
    return this.http.post<{ redirect?: string; error?: string }>(`${this.apiUrl}/login`, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Login error response:', error);
        const errorMessage = error.error?.error || error.error || 'Login failed. Please check your credentials.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Stockage utilisateur
  setAuthenticatedUser(user: any): void {
    this.authenticatedUser = user;
    localStorage.setItem('user', JSON.stringify(user));
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
    localStorage.removeItem('email');
    this.isAuthenticatedSubject.next(false);
  }

  private hasLocalUser(): boolean {
    return !!localStorage.getItem('user');
  }

  // Récupérer l'email de l'utilisateur connecté
  getAuthenticatedEmail(): string | null {
    const user = this.getAuthenticatedUser();
    return user ? user.email : null;
  }

  // Récupérer l'utilisateur par son email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile?email=${email}`);
  }
}