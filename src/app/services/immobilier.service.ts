import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Immobilier, ApiImmobilierResponse } from '../models/immobilier.model';

@Injectable({ 
  providedIn: 'root' 
})
export class ImmobilierService {
  private readonly apiUrl = 'http://localhost:8081/api/immobilier';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Immobilier[]> {
    return this.http.get<ApiImmobilierResponse[]>(this.apiUrl).pipe(
      map(data => data.map(item => this.transformResponse(item))),
      catchError(this.handleError)
    );
  }

  createWithImages(formData: FormData): Observable<Immobilier> {
    return this.http.post<ApiImmobilierResponse>(this.apiUrl, formData).pipe(
      map(response => this.transformResponse(response)),
      catchError(this.handleError)
    );
  }

  private transformResponse(response: ApiImmobilierResponse): Immobilier {
    return {
      ...response,
      photoPath: this.normalizeImagePath(response.mainPhotoPath),
      images: response.photoPaths?.map(img => this.normalizeImagePath(img) || '') || []
    };
  }

  getById(id: number): Observable<Immobilier> {
    return this.http.get<ApiImmobilierResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => this.transformResponse(response)),
      catchError(this.handleError)
    );
  }

  updateImmobilier(id: number, immobilier: Immobilier): Observable<Immobilier> {
    return this.http.put<ApiImmobilierResponse>(`${this.apiUrl}/${id}`, immobilier).pipe(
      map(response => this.transformResponse(response)),
      catchError(this.handleError)
    );
  }

  deleteImmobilier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  estimatePrice(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post('http://localhost:5000/predict', {
      type_immobilier: data.type,
      superficie: data.superficie,
      latitude: data.latitude,
      longitude: data.longitude,
      nombrePieces: data.nombrePieces,
      distanceCentre: data.distanceCentre,
      distanceEcoles: data.distanceEcoles
    }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private normalizeImagePath(path?: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `http://localhost:8081${path}`;
    return `http://localhost:8081/uploads/${path}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur: ${error.status} - ${error.message}`;
      if (error.status === 0) {
        errorMessage = 'Le serveur n\'est pas accessible';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}