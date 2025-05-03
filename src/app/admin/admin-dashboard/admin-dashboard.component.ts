import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CreditService } from '../../services/credit.service';
import { AuthMockService } from 'src/app/services/auth-mock.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalCredits: number = 0;
  pendingCredits: number = 0;
  approvedCredits: number = 0;
  
  loading: boolean = true;
  error: string = '';
  
  // Chart data for credit status
  statusChartData: any = {
    labels: ['Pending', 'Approved', 'Rejected', 'Closed'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#17a2b8']
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
    private userService: UserService,
    private creditService: CreditService,
    private authService: AuthMockService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Get users count
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        
        // After getting users, get credits data
        this.creditService.getAllCredits().subscribe({
          next: (credits) => {
            this.totalCredits = credits.length;
            this.pendingCredits = credits.filter(c => c.creditStatus === 'PENDING').length;
            this.approvedCredits = credits.filter(c => c.creditStatus === 'APPROVED').length;
            
            // Update chart data
            this.statusChartData.datasets[0].data = [
              credits.filter(c => c.creditStatus === 'PENDING').length,
              credits.filter(c => c.creditStatus === 'APPROVED').length,
              credits.filter(c => c.creditStatus === 'REJECTED').length,
              credits.filter(c => c.creditStatus === 'CLOSED').length
            ];
            
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading credits:', err);
            this.error = 'Failed to load credit data';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load user data';
        this.loading = false;
      }
    });
  }
}