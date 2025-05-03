import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { Credit, CreditStatus } from '../../models/credit.model';

@Component({
  selector: 'app-credit-list',
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.css']
})
export class CreditListComponent implements OnInit {
  credits: Credit[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private creditService: CreditService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCredits();
  }

  loadCredits(): void {
    this.loading = true;
    this.creditService.getAllCredits().subscribe({
      next: (data) => {
        this.credits = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching credits:', err);
        this.error = 'Failed to load credits. Please try again later.';
        this.loading = false;
      }
    });
  }

  viewCreditDetails(creditId: number | undefined): void {
    if (creditId !== undefined) {
    this.router.navigate(['/credit', creditId]);
    }
  }

  createNewCredit(): void {
    this.router.navigate(['/credit/new']);
  }
  backToDashboard(): void {
    this.router.navigate(['/credit']);
  }

  editCredit(creditId: number | undefined): void {
    if (creditId !== undefined) {
    this.router.navigate(['/credit/edit', creditId]);
    }
  }

  deleteCredit(creditId: number | undefined): void {
    if (creditId !== undefined)
    if (confirm('Are you sure you want to delete this credit?')) {
      this.creditService.deleteCredit(creditId).subscribe({
        next: () => {
          this.credits = this.credits.filter(credit => credit.creditId !== creditId);
        },
        error: (err) => {
          console.error('Error deleting credit:', err);
          alert('Failed to delete credit. Please try again later.');
        }
      });
    }
  }

  getStatusClass(status: CreditStatus): string {
    switch (status) {
      case CreditStatus.APPROVED:
        return 'status-approved';
      case CreditStatus.PENDING:
        return 'status-pending';
      case CreditStatus.REJECTED:
        return 'status-rejected';
      case CreditStatus.CLOSED:
        return 'status-closed';
      default:
        return '';
    }
  }
  

  

}