import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Insurance } from '../models/insurance.model';
import { ClaimStatus } from '../models/claim-status.enum';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:8082/amena/api/insurance'; // URL de l'API

  constructor(private http: HttpClient) {}

  // Créer une assurance
  createInsurance(insurance: Insurance): Observable<Insurance> {
    return this.http.post<Insurance>(`${this.apiUrl}/insurance`, insurance).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer toutes les assurances
  getAllInsurance(): Observable<Insurance[]> {
    return this.http.get<Insurance[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer une assurance par ID
  getInsuranceById(id: number): Observable<Insurance> {
    return this.http.get<Insurance>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour une assurance
  updateInsurance(id: number, insurance: Insurance): Observable<Insurance> {
    return this.http.put<Insurance>(`${this.apiUrl}/${id}`, insurance).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer une assurance
  deleteInsurance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Soumettre une réclamation
  claimInsurance(id: number, claimAmount: number): Observable<Insurance> {
    const params = new HttpParams().set('claimAmount', claimAmount.toString());
    return this.http.post<Insurance>(`${this.apiUrl}/${id}/claim`, null, { params }).pipe(
      catchError((error) => {
        // Personnaliser les messages d'erreur basés sur les exceptions du backend
        if (error.status === 400) {
          return throwError(() => new Error(error.error || 'Invalid claim request'));
        } else if (error.status === 404) {
          return throwError(() => new Error('Insurance policy not found'));
        }
        return this.handleError(error);
      })
    );
  }

  // Récupérer le taux de rejet des réclamations
  getClaimsRejectionRatio(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/claims/rejection-ratio`).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer le ratio de perte
  getLossRatio(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/loss-ratio`).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer le ratio de solvabilité
  getSolvencyRatio(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/solvency-ratio`).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer la vitesse de règlement des réclamations
  getClaimSettlementSpeed(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/claim-settlement-speed`).pipe(
      catchError(this.handleError)
    );
  }

  // Exporter le rapport PDF
  exportInsurancePdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/pdf`, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  // Envoyer le rapport par email
  sendInsuranceReport(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.http.post<string>(`${this.apiUrl}/send-report`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Rechercher des assurances
  searchInsurance(
    minCoverageAmount?: number,
    maxCoverageAmount?: number,
    minPremium?: number,
    maxPremium?: number
  ): Observable<Insurance[]> {
    let params = new HttpParams();
    if (minCoverageAmount) params = params.set('minCoverageAmount', minCoverageAmount.toString());
    if (maxCoverageAmount) params = params.set('maxCoverageAmount', maxCoverageAmount.toString());
    if (minPremium) params = params.set('minPremium', minPremium.toString());
    if (maxPremium) params = params.set('maxPremium', maxPremium.toString());

    return this.http.get<Insurance[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Prédire une réclamation basée sur la catégorie de dommage
  predictClaim(damageCategory: string): Observable<any> {
    const params = new HttpParams().set('damageCategory', damageCategory);
    return this.http.get<any>(`${this.apiUrl}/predict-claim`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Prédire la fraude
  predictFraud(text: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/predict`, text, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Uploader une image pour classification
  uploadFileForClassification(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ label: string }>(`${this.apiUrl}/classify`, formData).pipe(
      map(response => {
        console.log('Raw API Response:', response); // Debug log
        if (response && response.label) {
          return response.label; // Extract the 'label' field
        }
        throw new Error('Label field not found in response');
      }),
      catchError(this.handleError)
    );
  }

  // Gérer les erreurs HTTP
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Something went wrong; please try again later.'));
  }
}