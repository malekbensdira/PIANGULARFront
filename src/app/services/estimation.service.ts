import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EstimationService {
  private flaskApiUrl = 'http://localhost:5000'; // URL de votre API Flask

  constructor(private http: HttpClient) {}

  estimateProperty(data: any) {
    return this.http.post(`${this.flaskApiUrl}/predict`, data);
  }
}