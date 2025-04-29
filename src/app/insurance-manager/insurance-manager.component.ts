import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ServiceService } from '../Service/service.service';
import { PolicyType } from '../models/policy-type.enum';
import { ClaimStatus } from '../models/claim-status.enum';
import { Insurance } from '../models/insurance.model';

@Component({
  selector: 'app-insurance-manager',
  templateUrl: './insurance-manager.component.html',
  styleUrls: ['./insurance-manager.component.css']
})
export class InsuranceManagerComponent implements OnInit {
  policyTypes = PolicyType; // Enum for policy types
  insurances: Insurance[] = [];
  newInsurance: Insurance = {
    userId: 0,
    policyType: PolicyType.AUTO_INSURANCE,
    premium: 0,
    coverageAmount: 0,
    startDate: '',
    endDate: '',
    claimStatus: ClaimStatus.PENDING
  };
  claimAmount: number = 0;
  selectedInsuranceId: number | null = null;
  isEditing = false; // Track edit mode
  kpis = {
    rejectionRatio: 0,
    lossRatio: 0,
    solvencyRatio: 0,
    claimSettlementSpeed: 0
  };
  errorMessage: string | null = null;

  constructor(private insuranceService: ServiceService) {}

  ngOnInit(): void {
    this.loadInsurances();
    this.loadKpis();
  }

  // Format policy type for display
  formatPolicyType(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase();
  }

  // Get CSS class for claim status
  getStatusClass(status: ClaimStatus): string {
    switch (status) {
      case ClaimStatus.PENDING:
        return 'status-pending';
      case ClaimStatus.APPROVED:
        return 'status-approved';
      case ClaimStatus.REJECTED:
        return 'status-rejected';
      default:
        return 'status-null';
    }
  }

  // Load all insurance policies
  loadInsurances(): void {
    this.insuranceService.getAllInsurance().subscribe({
      next: (data: Insurance[]) => (this.insurances = data),
      error: (err: Error) => (this.errorMessage = err.message)
    });
  }

  // Load KPIs
  loadKpis(): void {
    this.insuranceService.getClaimsRejectionRatio().subscribe({
      next: (data: number) => (this.kpis.rejectionRatio = data),
      error: (err: Error) => console.error(err)
    });
    this.insuranceService.getLossRatio().subscribe({
      next: (data: number) => (this.kpis.lossRatio = data),
      error: (err: Error) => console.error(err)
    });
    this.insuranceService.getSolvencyRatio().subscribe({
      next: (data: number) => (this.kpis.solvencyRatio = data),
      error: (err: Error) => console.error(err)
    });
    this.insuranceService.getClaimSettlementSpeed().subscribe({
      next: (data: number) => (this.kpis.claimSettlementSpeed = data),
      error: (err: Error) => console.error(err)
    });
  }

  // Handle form submission (create or update)
  onSubmit(): void {
    if (this.isEditing) {
      this.updateInsurance();
    } else {
      this.createInsurance();
    }
  }

  // Create a new insurance policy
  createInsurance(): void {
    this.insuranceService.createInsurance(this.newInsurance).subscribe({
      next: (insurance: Insurance) => {
        this.insurances.push(insurance);
        this.resetNewInsurance();
      },
      error: (err: Error) => (this.errorMessage = err.message)
    });
  }

  // View insurance details
  viewInsurance(id: number): void {
    this.insuranceService.getInsuranceById(id).subscribe({
      next: (insurance: Insurance) => {
        this.selectedInsuranceId = insurance.id || null;
        alert(
          `Policy Details:\nID: ${insurance.id}\nType: ${this.formatPolicyType(
            insurance.policyType
          )}\nCoverage: ${insurance.coverageAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\nPremium: ${
            insurance.premium.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
          }\nStart Date: ${insurance.startDate}\nEnd Date: ${
            insurance.endDate
          }\nClaim Status: ${insurance.claimStatus}`
        );
      },
      error: (err: Error) => (this.errorMessage = err.message)
    });
  }

  // Edit an insurance policy
  editInsurance(insurance: Insurance): void {
    this.newInsurance = { ...insurance };
    this.isEditing = true;
  }

  // Update an insurance policy
  updateInsurance(): void {
    if (this.newInsurance.id) {
      this.insuranceService.updateInsurance(this.newInsurance.id, this.newInsurance).subscribe({
        next: (updatedInsurance: Insurance) => {
          const index = this.insurances.findIndex(i => i.id === updatedInsurance.id);
          if (index !== -1) {
            this.insurances[index] = updatedInsurance;
          }
          this.resetNewInsurance();
        },
        error: (err: Error) => (this.errorMessage = err.message)
      });
    }
  }

  // Delete an insurance policy
  deleteInsurance(id: number): void {
    if (confirm('Are you sure you want to delete this insurance policy?')) {
      this.insuranceService.deleteInsurance(id).subscribe({
        next: () => {
          this.insurances = this.insurances.filter(i => i.id !== id);
        },
        error: (err: Error) => (this.errorMessage = err.message)
      });
    }
  }

  // Submit a claim
  submitClaim(): void {
    if (this.selectedInsuranceId && this.claimAmount > 0) {
      this.insuranceService.claimInsurance(this.selectedInsuranceId, this.claimAmount).subscribe({
        next: (updatedInsurance: Insurance) => {
          const index = this.insurances.findIndex(i => i.id === updatedInsurance.id);
          if (index !== -1) {
            this.insurances[index] = updatedInsurance;
          }
          this.claimAmount = 0;
          this.selectedInsuranceId = null;
          alert('Claim submitted successfully');
        },
        error: (err: Error) => (this.errorMessage = err.message)
      });
    } else {
      this.errorMessage = 'Please enter a valid claim amount';
    }
  }

  // Download KPI report
  downloadReport(): void {
    this.insuranceService.exportInsurancePdf().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'insurance_kpi_report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: Error) => (this.errorMessage = err.message)
    });
  }

  // Send KPI report via email
  sendReport(email: string): void {
    this.insuranceService.sendInsuranceReport(email).subscribe({
      next: (message: string) => alert(message),
      error: (err: Error) => (this.errorMessage = err.message)
    });
  }

  // Reset the form
  resetNewInsurance(): void {
    this.newInsurance = {
      userId: 0,
      policyType: PolicyType.AUTO_INSURANCE,
      premium: 0,
      coverageAmount: 0,
      startDate: '',
      endDate: '',
      claimStatus: ClaimStatus.PENDING
    };
    this.isEditing = false;
  }

  // Cancel editing
  cancelEdit(): void {
    this.resetNewInsurance();
  }

  // Getter for premiumAmount (maps to premium)
  get premiumAmount(): number {
    return this.newInsurance.premium;
  }

  // Getter for insuredAmount (maps to coverageAmount)
  get insuredAmount(): number {
    return this.newInsurance.coverageAmount;
  }

};
