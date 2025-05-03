import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { ChatMessage } from '../models/ChatMessage.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';
  private msgUrl = 'http://localhost:8081/api/messages';
  private baseUrl = 'http://localhost:8081/api/statistics';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() });
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile?email=${email}`, { headers: this.getHeaders() }).pipe(
      tap(response => console.log("Réponse du backend:", response))
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() });
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload-image`, formData, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`, { headers: this.getHeaders() });
  }

  getContacts(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contacts/${userId}`, { headers: this.getHeaders() });
  }

  sendMessage(message: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.msgUrl}/send`, message, { headers: this.getHeaders() });
  }

  getMessagesBetweenUsers(userId1: number, userId2: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.msgUrl}/messages/${userId1}/${userId2}`, { headers: this.getHeaders() });
  }

  getUnreadCount(senderId: number, receiverId: number) {
    return this.http.get<number>(`${this.msgUrl}/unreadCount/${senderId}/${receiverId}`, { headers: this.getHeaders() });
  }

  markMessagesAsRead(senderId: number, receiverId: number) {
    return this.http.put(`${this.msgUrl}/markAsRead/${senderId}/${receiverId}`, {}, { headers: this.getHeaders() });
  }

  getAgentFeedbackStats(agentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${agentId}`, { headers: this.getHeaders() });
  }

  downloadPdf(agentId: number) {
    return this.http.get(`${this.baseUrl}/${agentId}/pdf`, { headers: this.getHeaders(), responseType: 'blob' });
  }
}