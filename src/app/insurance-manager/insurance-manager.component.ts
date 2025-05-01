import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../Service/service.service';
import { Insurance } from '../models/insurance.model';
import { PolicyType } from '../models/policy-type.enum';
import { ClaimStatus } from '../models/claim-status.enum';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

// Extend the Insurance interface to include animation flags
interface AnimatedInsurance extends Insurance {
  isNew?: boolean;
  isDeleting?: boolean;
}

@Component({
  selector: 'app-insurance-manager',
  templateUrl: './insurance-manager.component.html',
  styleUrls: ['./insurance-manager.component.css']
})
export class InsuranceManagerComponent implements OnInit {
  insurances: AnimatedInsurance[] = [];
  newInsurance: AnimatedInsurance = this.resetNewInsurance();
  isEditing: boolean = false;
  selectedInsuranceId: number | null = null;
  claimAmount: number = 0;
  errorMessage: string | null = null;
  policyTypes = PolicyType;
  isLoadingKpis: boolean = false;
  isDarkMode: boolean = false;

  // Chart properties
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartOptions = { responsive: true };
  barChartType: ChartType = 'bar';

  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  pieChartOptions: ChartOptions = { responsive: true };
  pieChartType: ChartType = 'pie';

  constructor(private insuranceService: ServiceService) {}

  ngOnInit(): void {
    this.loadInsurances();
    this.loadKpis();
    this.loadDarkMode();
  }

  loadInsurances(): void {
    this.insuranceService.getAllInsurance().subscribe({
      next: (insurances: AnimatedInsurance[]) => {
        this.insurances = insurances.map(insurance => ({ ...insurance, isNew: false, isDeleting: false }));
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Failed to load insurances.';
      }
    });
  }

  loadKpis(): void {
    this.isLoadingKpis = true;
    Promise.all([
      this.insuranceService.getClaimsRejectionRatio().toPromise(),
      this.insuranceService.getLossRatio().toPromise(),
      this.insuranceService.getSolvencyRatio().toPromise(),
      this.insuranceService.getClaimSettlementSpeed().toPromise()
    ]).then(([claimsRejectionRatio, lossRatio, solvencyRatio, claimSettlementSpeed]) => {
      this.barChartData = {
        labels: ['Claims Rejection Ratio', 'Loss Ratio', 'Solvency Ratio'],
        datasets: [
          {
            label: 'Financial Ratios (%)',
            data: [
              claimsRejectionRatio || 0,
              lossRatio || 0,
              solvencyRatio || 0
            ],
            backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
            borderColor: ['#4f46e5', '#10b981', '#f59e0b'],
            borderWidth: 1
          }
        ]
      };

      const speed = claimSettlementSpeed || 0;
      this.pieChartData = {
        labels: ['Claim Settlement Speed', 'Remaining'],
        datasets: [
          {
            data: [speed, 60 - speed],
            backgroundColor: ['#4f46e5', '#e5e7eb'],
            borderColor: ['#4f46e5', '#e5e7eb'],
            borderWidth: 1
          }
        ]
      };

      this.isLoadingKpis = false;
    }).catch(err => {
      this.errorMessage = err.message || 'Failed to load KPIs.';
      this.isLoadingKpis = false;
    });
  }

  resetNewInsurance(): AnimatedInsurance {
    return {
      userId: 0,
      policyType: PolicyType.AUTO_INSURANCE,
      coverageAmount: 0,
      premium: 0,
      startDate: '',
      endDate: '',
      claimStatus: ClaimStatus.PENDING,
      isNew: false,
      isDeleting: false
    };
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateInsurance();
    } else {
      this.createInsurance();
    }
  }

  createInsurance(): void {
    this.insuranceService.createInsurance(this.newInsurance).subscribe({
      next: (insurance: AnimatedInsurance) => {
        // Mark the new insurance as "new" for animation
        insurance.isNew = true;
        insurance.isDeleting = false;
        this.insurances.push(insurance);
        this.resetNewInsurance();
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Failed to create insurance.';
      }
    });
  }

  updateInsurance(): void {
    if (this.newInsurance.id) {
      this.insuranceService.updateInsurance(this.newInsurance.id, this.newInsurance).subscribe({
        next: (insurance: AnimatedInsurance) => {
          const index = this.insurances.findIndex(i => i.id === insurance.id);
          if (index !== -1) {
            insurance.isNew = false; // Ensure updated rows don't animate as new
            insurance.isDeleting = false;
            this.insurances[index] = insurance;
          }
          this.isEditing = false;
          this.resetNewInsurance();
        },
        error: (err: Error) => {
          this.errorMessage = err.message || 'Failed to update insurance.';
        }
      });
    }
  }

  editInsurance(insurance: AnimatedInsurance): void {
    this.newInsurance = { ...insurance };
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetNewInsurance();
  }

  deleteInsurance(id: number): void {
    if (confirm('Are you sure you want to delete this insurance policy?')) {
      const index = this.insurances.findIndex(i => i.id === id);
      if (index !== -1) {
        // Mark the row as "deleting" to trigger the exit animation
        this.insurances[index].isDeleting = true;
        // Wait for the animation to complete (500ms) before removing the row
        setTimeout(() => {
          this.insuranceService.deleteInsurance(id).subscribe({
            next: () => {
              this.insurances = this.insurances.filter(i => i.id !== id);
            },
            error: (err: Error) => {
              this.errorMessage = err.message || 'Failed to delete insurance.';
              // Reset the deleting flag if the request fails
              if (index !== -1) {
                this.insurances[index].isDeleting = false;
              }
            }
          });
        }, 500);
      }
    }
  }

  viewInsurance(id: number): void {
    this.selectedInsuranceId = id;
  }

  submitClaim(): void {
    if (this.selectedInsuranceId && this.claimAmount > 0) {
      this.insuranceService.claimInsurance(this.selectedInsuranceId, this.claimAmount).subscribe({
        next: (insurance: AnimatedInsurance) => {
          const index = this.insurances.findIndex(i => i.id === insurance.id);
          if (index !== -1) {
            insurance.isNew = false;
            insurance.isDeleting = false;
            this.insurances[index] = insurance;
          }
          this.selectedInsuranceId = null;
          this.claimAmount = 0;
        },
        error: (err: Error) => {
          this.errorMessage = err.message || 'Failed to submit claim.';
        }
      });
    }
  }

  formatPolicyType(policyType: string): string {
    return policyType.toLowerCase().replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-null';
    switch (status.toUpperCase()) {
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

  downloadReport(): void {
    this.insuranceService.exportInsurancePdf().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'insurance-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Failed to download report.';
      }
    });
  }

  // Load dark mode preference from localStorage
  loadDarkMode(): void {
    const darkModePref = localStorage.getItem('darkMode');
    this.isDarkMode = darkModePref === 'true';
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Toggle dark mode and save preference to localStorage
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    console.log('Dark mode toggled to:', this.isDarkMode);
    console.log('HTML classes:', document.documentElement.classList.toString());
  }
}