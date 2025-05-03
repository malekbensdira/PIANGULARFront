import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClaimService } from '../claim.service';

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
  selector: 'app-claim-display-modal',
  templateUrl: './claim-display-modal.component.html',
  styleUrls: ['./claim-display-modal.component.css']
})
export class ClaimDisplayModalComponent {
  @Input() claim: Claim | null = null;
  @Output() closeModal = new EventEmitter<void>();
  isEditMode = false;
  isDeleteConfirmMode = false;
  editedClaim: Claim | null = null;

  // Define possible values for dropdowns
  problemTypeOptions = ['INSURANCE', 'CREDIT', 'TRANSACTION', 'REAL_ESTATE', 'DONATION', 'USER_SERVICES', 'OTHER'];
  requestedSolutionOptions = ['REFUND', 'APOLOGY', 'VOUCHER', 'DISCOUNT', 'CANCELLATION', 'EXPLANATION', 'OTHER'];

  constructor(private claimService: ClaimService) {}

  getStatusLabel(status: boolean): string {
    return status ? 'Treated' : 'Not treated';
  }

  onClose() {
    this.isEditMode = false;
    this.isDeleteConfirmMode = false;
    this.editedClaim = null;
    this.closeModal.emit();
  }

  toggleEditMode() {
    if (this.isEditMode) {
      // Revert changes
      this.editedClaim = null;
    } else {
      // Enter edit mode, create a copy of the claim
      this.editedClaim = this.claim ? { ...this.claim } : null;
    }
    this.isEditMode = !this.isEditMode;
  }

  // Set priority based on problemType
  setPriorityBasedOnProblemType(claim: Claim): void {
    switch (claim.problemType) {
      case 'CREDIT':
      case 'TRANSACTION':
        claim.priority = 'HIGH';
        break;
      case 'INSURANCE':
      case 'REAL_ESTATE':
      case 'USER_SERVICES':
        claim.priority = 'MEDIUM';
        break;
      case 'DONATION':
      case 'OTHER':
        claim.priority = 'LOW';
        break;
      default:
        claim.priority = 'LOW'; // Fallback for invalid problemType
    }
  }

  saveChanges() {
    if (this.editedClaim && this.claim) {
      // Update priority based on problemType before saving
      this.setPriorityBasedOnProblemType(this.editedClaim);
      this.claimService.updateClaim(this.editedClaim).subscribe({
        next: () => {
          // Update the original claim with edited values
          Object.assign(this.claim, this.editedClaim);
          this.isEditMode = false;
          this.editedClaim = null;
          this.claimService.notifyClaimsUpdated();
        },
        error: (error) => {
          console.error('Error updating claim:', error);
          alert('Failed to update claim. Please try again.');
        }
      });
    }
  }

  showDeleteConfirmation() {
    this.isDeleteConfirmMode = true;
  }

  cancelDelete() {
    this.isDeleteConfirmMode = false;
  }

  confirmDelete() {
    if (this.claim) {
      this.claimService.deleteClaim(this.claim.idComplaint).subscribe({
        next: () => {
          this.claimService.notifyClaimsUpdated();
          this.onClose();
        },
        error: (error) => {
          console.error('Error deleting claim:', error);
          alert('Failed to delete claim. Please try again.');
        }
      });
    }
  }
}