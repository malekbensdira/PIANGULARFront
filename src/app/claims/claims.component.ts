import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClaimService } from '../claim.service';
import { Subscription } from 'rxjs';

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

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit, OnDestroy {
  showModal = false;
  showDisplayModal = false;
  selectedClaim: Claim | null = null;
  claims: Claim[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private claimService: ClaimService) {}

  ngOnInit() {
    this.loadClaims();
    this.subscription.add(
      this.claimService.onClaimsUpdated().subscribe(() => {
        this.loadClaims();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadClaims() {
    const email = localStorage.getItem('email') || '';
    if (email) {
      this.claimService.getClaimsByEmail(email).subscribe({
        next: (claims) => {
          this.claims = claims;
        },
        error: (error) => {
          console.error('Error fetching claims:', error);
        }
      });
    }
  }

  getStatusLabel(status: boolean): string {
    return status ? 'Treated' : 'Not treated';
  }

  openClaimModal() {
    this.showModal = true;
  }

  closeClaimModal() {
    this.showModal = false;
    this.loadClaims();
  }

  openDisplayModal(claim: Claim) {
    this.selectedClaim = claim;
    this.showDisplayModal = true;
  }

  closeDisplayModal() {
    this.showDisplayModal = false;
    this.selectedClaim = null;
  }
}