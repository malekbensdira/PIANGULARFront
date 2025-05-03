import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

interface Claim {
  idComplaint: number;
  description: string;
  priority: string;
  problemType: string;
  emailUser: string;
  nomUser: string;
  prenomUser: string;
  dateHeure: string;
  status: boolean;
  requestedSolution: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiUrl = 'http://localhost:8081/api/claims';
  private claimsUpdated = new Subject<void>();

  // Define allowed values for problemType and requestedSolution
  problemTypes = ['INSURANCE', 'CREDIT', 'TRANSACTION', 'REAL_ESTATE', 'DONATION', 'USER_SERVICES', 'OTHER'];
  requestedSolutions = ['REFUND', 'APOLOGY', 'VOUCHER', 'DISCOUNT', 'CANCELLATION', 'EXPLANATION', 'OTHER'];

  constructor(private http: HttpClient) {}

  public claimsUpdated$: Observable<void> = this.claimsUpdated.asObservable();

  getClaimsByEmail(email: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/by-email?email=${email}`);
  }

  notifyClaimsUpdated() {
    this.claimsUpdated.next();
  }

  onClaimsUpdated(): Observable<void> {
    return this.claimsUpdated.asObservable();
  }

  updateClaim(claim: Claim): Observable<Claim> {
    return this.http.put<Claim>(`${this.apiUrl}/${claim.idComplaint}`, claim);
  }

  deleteClaim(idComplaint: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idComplaint}`);
  }
}