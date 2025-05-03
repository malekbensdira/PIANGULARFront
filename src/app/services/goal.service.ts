import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal } from '../models/goal.model';
@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = 'http://localhost:8081/api/goals'; // Spécifiez l'adresse complète du serveur Spring Boot
 // Adjust to your backend API

  constructor(private http: HttpClient) {}

  // Create a new goal
  createGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, goal);
  }

  // Update goal status
 
  updateGoalStatus(id: number, status: boolean): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, { status });
  }
  

 
  // Update goal fields
  updateGoalFields(id: number, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/updateFields/${id}`, goal);
  }

  // Get goals by email
  getGoalsByEmail(email: string): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/by-email?email=${email}`);
  }

 // Delete a goal
deleteGoal(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

}
