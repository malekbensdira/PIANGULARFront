import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { SharedService } from '../services/Shared.service';
import { User } from '../models/user.model';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  feedbackStats: any = null;
  showFeedbackModal: boolean = false;
  downloading: boolean = false;
  searchQuery: string = '';
  pdfErrorMessage: string = ''; // Added for error display

  // Pie chart properties
  public pieChartLabels: Label[] = [];
  public pieChartDatasets: { data: number[] }[] = [{ data: [] }];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [ChartDataLabels];
  public pieChartColors: Color[] = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.9)',
        'rgba(54, 162, 235, 0.9)',
        'rgba(255, 206, 86, 0.9)',
        'rgba(75, 192, 192, 0.9)',
        'rgba(153, 102, 255, 0.9)'
      ],
      borderColor: '#fff',
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ]
    }
  ];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: Math.PI * 0.1,
    circumference: Math.PI * 2,
    elements: {
      arc: {
        borderWidth: 4
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: 12,
        padding: 15
      }
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const dataset = ctx.dataset.data as number[];
          const total = dataset.reduce((acc, val) => acc + val, 0);
          const percentage = total ? ((value / total) * 100).toFixed(1) + '%' : '';
          return percentage;
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
          family: 'Poppins, sans-serif'
        },
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowBlur: 4
      }
    },
  };

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: User[]) => {
        console.log('Users loaded:', data);
        this.users = data;
        this.filteredUsers = [...this.users];
        this.sharedService.setUsers(data);
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const email = currentUser.email || localStorage.getItem('email');
        if (email) {
          const user = data.find(u => u.email === email);
          if (user) {
            this.sharedService.setCurrentUser(user);
            console.log('Current user set:', user);
          }
        }
        this.updateChartData();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      (user.prenom?.toLowerCase().includes(query) || '') ||
      (user.nom?.toLowerCase().includes(query) || '') ||
      (user.email?.toLowerCase().includes(query) || '') ||
      (user.role.nomRole?.toLowerCase().includes(query) || '') ||
      (user.cin?.toString().includes(query) || '') ||
      (user.tel?.toString().includes(query) || '') ||
      (user.adresse?.toLowerCase().includes(query) || '') ||
      (user.age?.toString().includes(query) || '') ||
      (user.sexe?.toLowerCase().includes(query) || '') ||
      (user.rib?.toLowerCase().includes(query) || '') ||
      (user.soldeCourant?.toString().includes(query) || '')
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.filteredUsers = [...this.users];
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.feedbackStats = null;
  }

  viewFeedback(): void {
    if (this.selectedUser && this.selectedUser.role.nomRole === 'AGENT') {
      this.http.get(`http://localhost:8081/statistics/${this.selectedUser.id}`, { responseType: 'text' }).subscribe(
        (response: string) => {
          this.feedbackStats = this.parseFeedbackResponse(response);
          this.showFeedbackModal = true;
        },
        (error) => {
          console.error('Error fetching feedback statistics:', error);
          this.feedbackStats = { error: 'Could not load feedback data' };
          this.showFeedbackModal = true;
        }
      );
    }
  }

  showWarningNotification(): boolean {
    return this.feedbackStats && 
           this.feedbackStats.negativePercentage >= 70 && 
           !this.feedbackStats.warningShown;
  }

  private parseFeedbackResponse(response: string): any {
    const stats = {
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 0,
      warningShown: false
    };

    const positiveMatch = response.match(/Positive: ([\d,]+)%/);
    const negativeMatch = response.match(/Negative: ([\d,]+)%/);
    const neutralMatch = response.match(/Neutral: ([\d,]+)%/);

    if (positiveMatch) stats.positivePercentage = parseFloat(positiveMatch[1].replace(',', '.'));
    if (negativeMatch) stats.negativePercentage = parseFloat(negativeMatch[1].replace(',', '.'));
    if (neutralMatch) stats.neutralPercentage = parseFloat(negativeMatch[1].replace(',', '.'));

    return stats;
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
  }

  updateChartData(): void {
    if (!this.users || this.users.length === 0) {
      console.log('No users available for chart');
      this.pieChartDatasets = [{ data: [] }];
      this.pieChartLabels = [];
      return;
    }

    const roleCounts: { [key: string]: number } = {};
    this.users.forEach(user => {
      const role = user.role.nomRole;
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    const totalUsers = this.users.length;
    const rolePercentages = Object.keys(roleCounts).map(role => ({
      role,
      percentage: (roleCounts[role] / totalUsers) * 100
    }));

    this.pieChartLabels = rolePercentages.map(item => `${item.role} (${item.percentage.toFixed(1)}%)`);
    this.pieChartDatasets = [{ data: rolePercentages.map(item => item.percentage) }];
    console.log('Chart data:', this.pieChartDatasets, 'Labels:', this.pieChartLabels);
  }

  downloadPdf(agentId: number): void {
    if (this.downloading) return;
    this.downloading = true;
    this.pdfErrorMessage = '';
    console.log('Attempting to download PDF for agentId:', agentId);

    this.userService.downloadPdf(agentId).subscribe({
      next: (response) => {
        console.log('PDF response received:', response);
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Statistics_Agent_${agentId}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.downloading = false;
      },
      error: (error) => {
        console.error('Error downloading the PDF:', error);
        this.pdfErrorMessage = 'Failed to download PDF. Please try again or contact support.';
        this.downloading = false;
      },
      complete: () => {
        console.log('PDF download request completed');
        this.downloading = false;
      }
    });
  }

  navigateToWelcome(): void {
    this.router.navigate(['/welcome']);
  }
}