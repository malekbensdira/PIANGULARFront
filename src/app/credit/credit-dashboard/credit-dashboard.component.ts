import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { Credit, CreditStatus, CreditType } from '../../models/credit.model';

@Component({
  selector: 'app-credit-dashboard',
  templateUrl: './credit-dashboard.component.html',
  styleUrls: ['./credit-dashboard.component.css']
})
export class CreditDashboardComponent implements OnInit {
  credits: Credit[] = [];
  loading: boolean = true;
  error: string = '';
  
  // Dashboard statistics
  totalCredits: number = 0;
  totalLoanAmount: number = 0;
  averageLoanAmount: number = 0;
  
  // Status counts
  statusCounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
    closed: 0
  };
  
  // Credit type distribution
  typeDistribution = {
    business: 0,
    agriculture: 0,
    house: 0,
    smallAmount: 0
  };
  
  // Chart data for credit status
  statusChartData: any = {
    labels: ['Pending', 'Approved', 'Rejected', 'Closed'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#17a2b8']
    }]
  };
  
  // Chart data for credit type
  typeChartData: any = {
    labels: ['Business', 'Agriculture', 'House', 'Small Amount'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#007bff', '#6f42c1', '#fd7e14', '#20c997']
    }]
  };
  
  // Chart options
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      }
    }
  };

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
        this.calculateStatistics();
        this.prepareChartData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching credits:', err);
        this.error = 'Failed to load credit data. Please try again later.';
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalCredits = this.credits.length;
    
    // Calculate total and average loan amount
    if (this.totalCredits > 0) {
      this.totalLoanAmount = this.credits.reduce((sum, credit) => sum + credit.loanAmount, 0);
      this.averageLoanAmount = this.totalLoanAmount / this.totalCredits;
    }
    
    // Reset counts
    this.statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      closed: 0
    };
    
    this.typeDistribution = {
      business: 0,
      agriculture: 0,
      house: 0,
      smallAmount: 0
    };
    
    // Calculate status counts and type distribution
    this.credits.forEach(credit => {
      // Status counts
      switch (credit.creditStatus) {
        case CreditStatus.PENDING:
          this.statusCounts.pending++;
          break;
        case CreditStatus.APPROVED:
          this.statusCounts.approved++;
          break;
        case CreditStatus.REJECTED:
          this.statusCounts.rejected++;
          break;
        case CreditStatus.CLOSED:
          this.statusCounts.closed++;
          break;
      }
      
      // Credit type distribution
      switch (credit.creditType) {
        case CreditType.BUSINESS:
          this.typeDistribution.business++;
          break;
        case CreditType.AGRICULTURE:
          this.typeDistribution.agriculture++;
          break;
        case CreditType.HOUSE:
          this.typeDistribution.house++;
          break;
        case CreditType.SMALL_AMOUNT:
          this.typeDistribution.smallAmount++;
          break;
      }
    });
  }

  prepareChartData(): void {
    // Update status chart data
    this.statusChartData.datasets[0].data = [
      this.statusCounts.pending,
      this.statusCounts.approved,
      this.statusCounts.rejected,
      this.statusCounts.closed
    ];
    
    // Update type chart data
    this.typeChartData.datasets[0].data = [
      this.typeDistribution.business,
      this.typeDistribution.agriculture,
      this.typeDistribution.house,
      this.typeDistribution.smallAmount
    ];
  }

  navigateToCreditList(): void {
    this.router.navigate(['/credit']);
  }

  navigateToNewCredit(): void {
    this.router.navigate(['/credit/new']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}