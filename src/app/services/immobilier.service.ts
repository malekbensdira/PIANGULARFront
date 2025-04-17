import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Immobilier, TypeImmobilier } from '../models/immobilier.model';

@Injectable({ 
  providedIn: 'root' 
})
export class ImmobilierService {
  private readonly apiUrl = 'http://localhost:8081/api/immobilier';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Immobilier[]> {
    return this.http.get<Immobilier[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        ...item,
        photoPath: this.normalizeImagePath(item.photoPath),
        images: item.images?.map(img => this.normalizeImagePath(img) || '') || []
      }))),
      catchError(this.handleError)
    );
  }

  // immobilier.service.ts
uploadImages(files: File[]): Observable<string[]> {
  if (!files || files.length === 0) {
    return throwError(() => new Error('Aucun fichier sélectionné'));
  }

  // Vérification des types de fichiers avant envoi
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const invalidFiles = files.filter(file => !validTypes.includes(file.type));
  
  if (invalidFiles.length > 0) {
    return throwError(() => new Error(
      `Types de fichiers non supportés: ${invalidFiles.map(f => f.type).join(', ')}`
    ));
  }

  // Vérification de la taille des fichiers (max 5MB par exemple)
  const maxSize = 5 * 1024 * 1024; // 5MB
  const oversizedFiles = files.filter(file => file.size > maxSize);
  
  if (oversizedFiles.length > 0) {
    return throwError(() => new Error(
      `Fichiers trop volumineux: ${oversizedFiles.map(f => (f.size/1024/1024).toFixed(2)+'MB').join(', ')}`
    ));
  }

  const formData = new FormData();
  files.forEach(file => formData.append('files', file, file.name));

  return this.http.post<string[]>(`${this.apiUrl}/upload-images`, formData, {
    reportProgress: true, // Pour suivre la progression
    observe: 'response' // Pour avoir accès à toute la réponse
  }).pipe(
    map(response => {
      if (!response.body) {
        throw new Error('Réponse vide du serveur');
      }
      return response.body;
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Détails de l\'erreur:', error);
      
      let errorMsg = 'Erreur lors de l\'upload';
      if (error.status === 400) {
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else {
          errorMsg = 'Format de fichier non supporté ou taille trop grande. Max: 5MB, Types: JPEG/PNG/WEBP';
        }
      } else if (error.status === 413) {
        errorMsg = 'La taille totale des fichiers dépasse la limite autorisée';
      }
      
      return throwError(() => new Error(errorMsg));
    })
  );
}

  addImmobilier(immobilier: Immobilier): Observable<Immobilier> {
    return this.http.post<Immobilier>(this.apiUrl, immobilier).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Immobilier> {
    return this.http.get<Immobilier>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateImmobilier(id: number, immobilier: Immobilier): Observable<Immobilier> {
    return this.http.put<Immobilier>(`${this.apiUrl}/${id}`, immobilier).pipe(
      catchError(this.handleError)
    );
  }

  deleteImmobilier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  estimatePrice(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/predict', {
      type_immobilier: data.type,
      superficie: data.superficie,
      latitude: data.latitude,
      longitude: data.longitude,
      nombrePieces: data.nombrePieces,
      distanceCentre: data.distanceCentre,
      distanceEcoles: data.distanceEcoles
    }).pipe(
      catchError(this.handleError)
    );
  }

  private normalizeImagePath(path: string | undefined): string | undefined {
    if (!path) return undefined;
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
        errorMessage = 'Le serveur n\'est pas accessible. Vérifiez que le backend est bien lancé.';
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}