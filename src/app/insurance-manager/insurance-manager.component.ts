// src/app/components/insurance-manager/insurance-manager.component.ts
import { Component, OnInit } from '@angular/core';
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
  
  policyTypes = PolicyType;  // added to fix the template error

  insurances: Insurance[] = [];
  newInsurance: Insurance = {
    userId: 0,
    policyType: PolicyType.AUTO_INSURANCE,
    premium: 0,
    coverageAmount: 0,
    startDate: '',
    endDate: '',
    claimStatus: ClaimStatus.PENDING,
  };
  claimAmount: number = 0;
  selectedInsuranceId: number | null = null;
  kpis = {
    rejectionRatio: 0,
    lossRatio: 0,
    solvencyRatio: 0,
    claimSettlementSpeed: 0,
  };
  errorMessage: string | null = null;

  constructor(private insuranceService: ServiceService) {}

  ngOnInit(): void {
    this.loadInsurances();
    this.loadKpis();
  }

  formatPolicyType(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase();
  }

  loadInsurances(): void {
    this.insuranceService.getAllInsurance().subscribe({
      next: (data: Insurance[]) => (this.insurances = data),
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  loadKpis(): void {
    this.insuranceService.getClaimsRejectionRatio().subscribe({
      next: (data: number) => (this.kpis.rejectionRatio = data),
      error: (err: Error) => console.error(err),
    });
    this.insuranceService.getLossRatio().subscribe({
      next: (data: number) => (this.kpis.lossRatio = data),
      error: (err: Error) => console.error(err),
    });
    this.insuranceService.getSolvencyRatio().subscribe({
      next: (data: number) => (this.kpis.solvencyRatio = data),
      error: (err: Error) => console.error(err),
    });
    this.insuranceService.getClaimSettlementSpeed().subscribe({
      next: (data: number) => (this.kpis.claimSettlementSpeed = data),
      error: (err: Error) => console.error(err),
    });
  }

  createInsurance(): void {
    this.insuranceService.createInsurance(this.newInsurance).subscribe({
      next: (insurance: Insurance) => {
        this.insurances.push(insurance);
        this.resetNewInsurance();
      },
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  submitClaim(): void {
    if (this.selectedInsuranceId && this.claimAmount > 0) {
      this.insuranceService.claimInsurance(this.selectedInsuranceId, this.claimAmount).subscribe({
        next: (updatedInsurance: Insurance) => {
          this.loadInsurances();
          this.claimAmount = 0;
          this.selectedInsuranceId = null;
        },
        error: (err: Error) => (this.errorMessage = err.message),
      });
    }
  }

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
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  sendReport(email: string): void {
    this.insuranceService.sendInsuranceReport(email).subscribe({
      next: (message: string) => alert(message),
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  resetNewInsurance(): void {
    this.newInsurance = {
      userId: 0,
      policyType: PolicyType.AUTO_INSURANCE,
      premium: 0,
      coverageAmount: 0,
      startDate: '',
      endDate: '',
      claimStatus: ClaimStatus.PENDING,
    };
  }

  // Getter for premiumAmount (maps to premium)
  get premiumAmount(): number {
    return this.newInsurance.premium;
  }

  // Getter for insuredAmount (maps to coverageAmount)
  get insuredAmount(): number {
    return this.newInsurance.coverageAmount;
  }
}
