import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit } from '../models/credit.model';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:5000/predict-credit';

  constructor(private http: HttpClient) {}

  predictCreditApproval(creditData: any): Observable<any> {
    return this.http.post(this.apiUrl, creditData);
  }
  
  updateCreditStatus(creditId: number, status: string): Observable<any> {
    return this.http.put(`http://localhost:8080/api/credits/${creditId}/status`, { status });
  }
}