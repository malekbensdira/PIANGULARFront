// src/app/services/contract.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  generateContract(contractData: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate-credit-contract`, contractData, {
      responseType: 'blob'
    });
  }
  
  submitSignedContract(signedData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-signed-contract`, signedData);
  }
  
  getSignedContracts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/signed-contracts`);
  }
  
  downloadContract(contractId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-contract/${contractId}`, {
      responseType: 'blob'
    });
  }
}