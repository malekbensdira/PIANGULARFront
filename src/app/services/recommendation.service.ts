// recommendation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
    private flaskApiUrl = 'http://localhost:5000';
    apiUrl: any;

  constructor(private http: HttpClient) { }

  getRecommendations(data: {
    superficie: number,
    latitude: number,
    longitude: number,
    nombrePieces: number,
    distanceCentre: number,
    distanceEcoles: number
  }) {
    return this.http.post<{recommended_properties: any[]}>(`${this.apiUrl}/recommend`, data);
  }
}