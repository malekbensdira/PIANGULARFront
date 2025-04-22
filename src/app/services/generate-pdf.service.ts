// pdf.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = 'http://127.0.0.1:5000/generate-pdf';

  constructor(private http: HttpClient) { }

  generateContract(data: any) {
    return this.http.post(this.apiUrl, data, { 
      responseType: 'blob' // Important pour recevoir le PDF
    });
  }
}