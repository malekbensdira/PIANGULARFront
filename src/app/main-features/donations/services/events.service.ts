import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = 'http://localhost:8082'; // URL de votre backend

  constructor(private httpClient: HttpClient) { }

  getEventsList(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/events`)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des événements:', error);
          return throwError(() => error);
        })
      );
  }
}
