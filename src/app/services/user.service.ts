import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  // Get all users - for admin panel
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  // Get user by ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  // Get user by email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile?email=${email}`);
  }

  // Register a new user with image
  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  // Create a new user (admin function)
  createUser(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, userData);
  }

  // Update user
  updateUser(userId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${userId}`, formData);
  }

  // Update user (JSON data - no file upload)
  updateUserData(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update-data/${userId}`, userData);
  }

  // Delete user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${userId}`);
  }

  // Get available roles
  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }

  // Change user role (admin only)
  changeUserRole(userId: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/change-role/${userId}`, { role });
  }

  // Reset password
  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
  }

  // Change password
  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password/${userId}`, {
      currentPassword,
      newPassword
    });
  }

  // Update user account balance (admin function)
  updateUserBalance(userId: number, amount: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update-balance/${userId}`, { amount });
  }

  // Get user statistics (count by role, etc.)
  getUserStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }
}