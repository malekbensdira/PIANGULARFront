import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServiceService } from '../Service/service.service';
import { Insurance } from '../models/insurance.model';
import { PolicyType } from '../models/policy-type.enum';
import { ClaimStatus } from '../models/claim-status.enum';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { Subscription } from 'rxjs';

// Extend the Insurance interface to include animation flags
interface AnimatedInsurance extends Insurance {
  isNew?: boolean;
  isDeleting?: boolean;
}

// Base subscription request interface
interface BaseSubscriptionRequest {
  id: number;
  name: string;
  email: string;
  policyType: PolicyType;
}

// Interfaces for policy-specific fields
interface AutoSubscriptionRequest extends BaseSubscriptionRequest {
  policyType: PolicyType.AUTO_INSURANCE;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  kilometers?: number;
}

interface HealthSubscriptionRequest extends BaseSubscriptionRequest {
  policyType: PolicyType.HEALTH_INSURANCE;
  age?: number;
  hasPreExistingCondition?: boolean;
}

interface HomeSubscriptionRequest extends BaseSubscriptionRequest {
  policyType: PolicyType.HOME_INSURANCE;
  propertyAddress?: string;
  propertyValue?: number;
}

// Union type for all subscription requests
type SubscriptionRequest = AutoSubscriptionRequest | HealthSubscriptionRequest | HomeSubscriptionRequest | BaseSubscriptionRequest;

@Component({
  selector: 'app-insurance-manager',
  templateUrl: './insurance-manager.component.html',
  styleUrls: ['./insurance-manager.component.css']
})
export class InsuranceManagerComponent implements OnInit, OnDestroy {
  insurances: AnimatedInsurance[] = [];
  newInsurance: AnimatedInsurance = this.resetNewInsurance();
  isEditing: boolean = false;
  selectedInsuranceId: number | null = null;
  selectedSubscriptionId: number | null = null; // Track selected subscription for detailed view
  selectedSubscription: SubscriptionRequest | null = null; // Store the selected subscription for display
  claimAmount: number = 0;
  errorMessage: string | null = null;
  policyTypes = PolicyType;
  isLoadingKpis: boolean = false;
  isDarkMode: boolean = false;
  isLoading: boolean = false;
  showKpis: boolean = false;
  showNotifications: boolean = false; // Toggle for notification view
  pendingSubscriptions: SubscriptionRequest[] = [];
  private subscriptionCheckInterval?: any;

  // Chart properties
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartOptions = { responsive: true };
  barChartType: ChartType = 'bar';

  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  pieChartOptions: ChartOptions = { responsive: true };
  pieChartType: ChartType = 'pie';

  minCoverageAmount: number | null = null;
  maxCoverageAmount: number | null = null;
  minPremium: number | null = null;
  maxPremium: number | null = null;

  constructor(private insuranceService: ServiceService) {}

  ngOnInit(): void {
    this.loadInsurances();
    this.loadDarkMode();
    this.startSubscriptionCheck();
  }

  ngOnDestroy(): void {
    if (this.subscriptionCheckInterval) {
      clearInterval(this.subscriptionCheckInterval);
    }
  }

  startSubscriptionCheck(): void {
    this.checkSubscriptions();
    this.subscriptionCheckInterval = setInterval(() => {
      this.checkSubscriptions();
    }, 30000); // Check every 30 seconds
  }

  checkSubscriptions(): void {
    this.insuranceService.getPendingSubscriptions().subscribe({
      next: (subscriptions: SubscriptionRequest[]) => {
        this.pendingSubscriptions = subscriptions;
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Failed to load pending subscriptions.';
      }
    });
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
    this.errorMessage = null;
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

  toggleKpis(): void {
    this.showKpis = !this.showKpis;
    this.showNotifications = false; // Hide notifications when showing KPIs
    if (this.showKpis && !(this.barChartData.labels ?? []).length) {
      this.loadKpis(); // Load KPIs only if not already loaded
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showKpis = false; // Hide KPIs when showing notifications
    if (this.showNotifications) {
      this.checkSubscriptions(); // Refresh subscriptions when opening notifications
    }
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

  createFromSubscription(subscription: SubscriptionRequest): void {
    // Prefill the form with subscription data
    this.newInsurance = {
      userId: 0, // Admin should set this, as subscription doesn't have userId
      policyType: subscription.policyType,
      coverageAmount: 0, // Admin will fill this
      premium: 0, // Admin will fill this
      startDate: '', // Admin will fill this
      endDate: '', // Admin will fill this
      claimStatus: ClaimStatus.PENDING,
      isNew: false,
      isDeleting: false
    };
    // Ensure the form is in "create mode" and visible
    this.isEditing = false;
    this.showNotifications = false; // Hide notifications to show the form
    this.showKpis = false; // Hide KPIs to show the form
    this.selectedSubscriptionId = null; // Close the subscription modal
    this.selectedSubscription = null;
  }

  rejectSubscription(id: number): void {
    this.insuranceService.rejectSubscription(id).subscribe({
      next: () => {
        this.pendingSubscriptions = this.pendingSubscriptions.filter(s => s.id !== id);
        this.errorMessage = 'Subscription rejected successfully.';
        this.selectedSubscriptionId = null; // Clear selected subscription if it was being viewed
        this.selectedSubscription = null;
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Failed to reject subscription.';
      }
    });
  }

  viewSubscription(id: number): void {
    this.selectedSubscriptionId = id;
    this.selectedSubscription = this.pendingSubscriptions.find(sub => sub.id === id) || null;
  }

  createInsurance(): void {
    console.log('Creating insurance with payload:', this.newInsurance);
    this.insuranceService.createInsurance(this.newInsurance).subscribe({
      next: (insurance: AnimatedInsurance) => {
        insurance.isNew = true;
        insurance.isDeleting = false;
        this.insurances.push(insurance);
        this.newInsurance = this.resetNewInsurance();
      },
      error: (err: any) => {
        console.error('Error creating insurance:', err);
        this.errorMessage = err.error?.message || err.message || 'Failed to create insurance. Please check the server logs for more details.';
      }
    });
  }

  updateInsurance(): void {
    if (this.newInsurance.id) {
      this.insuranceService.updateInsurance(this.newInsurance.id, this.newInsurance).subscribe({
        next: (insurance: AnimatedInsurance) => {
          const index = this.insurances.findIndex(i => i.id === insurance.id);
          if (index !== -1) {
            insurance.isNew = false;
            insurance.isDeleting = false;
            this.insurances[index] = insurance;
          }
          this.isEditing = false;
          this.newInsurance = this.resetNewInsurance();
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
    this.newInsurance = this.resetNewInsurance();
  }

  deleteInsurance(id: number): void {
    if (confirm('Are you sure you want to delete this insurance policy?')) {
      const index = this.insurances.findIndex(i => i.id === id);
      if (index !== -1) {
        this.insurances[index].isDeleting = true;
        setTimeout(() => {
          this.insuranceService.deleteInsurance(id).subscribe({
            next: () => {
              this.insurances = this.insurances.filter(i => i.id !== id);
            },
            error: (err: Error) => {
              this.errorMessage = err.message || 'Failed to delete insurance.';
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

  searchInsurance(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.insuranceService.searchInsurance(
      this.minCoverageAmount || undefined,
      this.maxCoverageAmount || undefined,
      this.minPremium || undefined,
      this.maxPremium || undefined
    ).subscribe({
      next: (data) => {
        console.log('Search Results:', data);
        this.insurances = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search Error:', err);
        this.errorMessage = err.message || 'Failed to fetch insurance data.';
        this.insurances = [];
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.minCoverageAmount = null;
    this.maxCoverageAmount = null;
    this.minPremium = null;
    this.maxPremium = null;
    this.searchInsurance();
  }

  // Methods for modal handling
  closeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedSubscriptionId = null;
    this.selectedSubscription = null;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}