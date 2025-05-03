import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { Credit, Remboursement } from '../../models/credit.model';

@Component({
  selector: 'app-credit-detail',
  templateUrl: './credit-detail.component.html',
  styleUrls: ['./credit-detail.component.css']
})
export class CreditDetailComponent implements OnInit {
  creditId: number;
  credit: Credit | null = null;
  remboursements: Remboursement[] = [];
  loading: boolean = true;
  error: string = '';
  activeTab: string = 'overview';

  constructor(
    private creditService: CreditService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.creditId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadCredit();
  }

  loadCredit(): void {
    this.loading = true;
    this.creditService.getCreditById(this.creditId).subscribe({
      next: (data) => {
        this.credit = data;
        this.remboursements = data.remboursements || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching credit:', err);
        this.error = 'Failed to load credit details. Please try again later.';
        this.loading = false;
      }
    });
  }

  goToEdit(): void {
    this.router.navigate(['/credit/edit', this.creditId]);
  }

  goBack(): void {
    this.router.navigate(['/credit']);
  }

  deleteCredit(): void {
    if (confirm('Are you sure you want to delete this credit?')) {
      this.creditService.deleteCredit(this.creditId).subscribe({
        next: () => {
          this.router.navigate(['/credit']);
        },
        error: (err) => {
          console.error('Error deleting credit:', err);
          alert('Failed to delete credit. Please try again later.');
        }
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Calculate total loan cost
  getTotalCost(): number {
    if (!this.remboursements || this.remboursements.length === 0) {
      return 0;
    }
    
    return this.remboursements.reduce((sum, r) => sum + r.annuite, 0);
  }

  // Calculate total interest
  getTotalInterest(): number {
    if (!this.remboursements || this.remboursements.length === 0) {
      return 0;
    }
    
    return this.remboursements.reduce((sum, r) => sum + r.interest, 0);
  }

  // Format currency with commas and decimals
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}