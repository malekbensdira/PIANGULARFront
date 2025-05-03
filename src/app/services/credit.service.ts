import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit, CreditResponse } from '../models/credit.model';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = 'http://localhost:8081/api/credits';

  constructor(private http: HttpClient) {}

  // Create a new credit
  createCredit(credit: Credit): Observable<Credit> {
    return this.http.post<Credit>(this.apiUrl, credit);
  }

  // Get all credits
  getAllCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl);
  }

  // Get credit by ID
  getCreditById(id: number): Observable<Credit> {
    return this.http.get<Credit>(`${this.apiUrl}/${id}`);
  }

  // Update credit
  updateCredit(id: number, credit: Credit): Observable<Credit> {
    return this.http.put<Credit>(`${this.apiUrl}/${id}`, credit);
  }

  // Delete credit
  deleteCredit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search and filter credits
  searchAndFilterCredits(params: any): Observable<CreditResponse[]> {
    // Convert params object to query string
    const queryParams = Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return this.http.get<CreditResponse[]>(`${this.apiUrl}/search?${queryParams}`);
  }
}