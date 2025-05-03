import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ClaimService } from '../claim.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

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

interface ClaimCountByDate {
  date: string;
  count: number;
}

interface ProblemTypeCount {
  type: string;
  count: number;
}

@Component({
  selector: 'app-claim-section-admin',
  templateUrl: './claim-section-admin.component.html',
  styleUrls: ['./claim-section-admin.component.css']
})
export class ClaimSectionAdminComponent implements OnInit {
  claims: Claim[] = [];
  isSidebarAnimationDone = false;
  isLoading: boolean = true; 
  originalClaims: Claim[] = [];
  selectedClaim: Claim | null = null;
  isSorted: boolean = false;
  treatedPercentage: number = 0;
  mostFrequentProblemType: ProblemTypeCount | null = null;
  leastFrequentProblemType: ProblemTypeCount | null = null;

  chartDatasets: ChartDataSets[] = [{
    data: [],
    label: 'Claims per Day',
    borderColor: '#224393',
    backgroundColor: 'rgba(34, 67, 147, 0.2)',
    fill: true,
    lineTension: 0.4
  }];
  chartLabels: Label[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Date'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Number of Claims'
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1
        }
      }]
    },
    legend: {
      display: true
    },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };

  

  problemTypeChartDatasets: ChartDataSets[] = [{
    data: [],
    label: 'Claims by Problem Type',
    backgroundColor: ['#224393', '#4caf50', '#f44336', '#ff9800', '#9c27b0'],
    borderColor: '#ffffff',
    borderWidth: 2
  }];
  problemTypeChartLabels: Label[] = [];
  problemTypeChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
      labels: {
        fontFamily: 'Poppins, sans-serif',
        fontColor: '#333'
      }
    },
    plugins: {
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          family: 'Poppins, sans-serif'
        },
        formatter: (value: number, ctx: any) => {
          const data = ctx.dataset.data as number[];
          const total = data.reduce((acc, val) => acc + val, 0) || 1;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        }
      }
    }
  };

  constructor(private http: HttpClient, private router: Router, private claimService: ClaimService) {}

  ngOnInit() {
    this.loadClaims();
    this.loadClaimCounts();
    this.loadProblemTypeCounts();
    this.claimService.claimsUpdated$.subscribe(() => {
      this.loadClaims();
      this.loadProblemTypeCounts();
    });
  }

  

  loadClaims() {
    this.http.get<Claim[]>(`${environment.apiUrl}/api/claims/all`).subscribe({
      next: (claims) => {
        this.originalClaims = [...claims];
        this.claims = this.isSorted ? this.sortClaimsByPriority(claims) : claims;
        this.updateTreatedPercentage();
      },
      error: (error) => {
        console.error('Error fetching claims:', error);
      }
    });
  }

  loadClaimCounts() {
    this.http.get<ClaimCountByDate[]>(`${environment.apiUrl}/api/claims/count-by-date`).subscribe({
      next: (data) => {
        this.chartLabels = data.map(item => item.date);
        this.chartDatasets[0].data = data.map(item => item.count);
      },
      error: (error) => {
        console.error('Error fetching claim counts:', error);
      }
    });
  }

  loadProblemTypeCounts() {
    this.http.get<ProblemTypeCount[]>(`${environment.apiUrl}/api/claims/count-by-problem-type`).subscribe({
      next: (data) => {
        this.problemTypeChartLabels = data.map(item => item.type);
        this.problemTypeChartDatasets[0].data = data.map(item => item.count);
        this.updateProblemTypeInsights(data);
      },
      error: (error) => {
        console.error('Error fetching problem type counts:', error);
      }
    });
  }

  updateProblemTypeInsights(data: ProblemTypeCount[]) {
    if (data.length === 0) {
      this.mostFrequentProblemType = null;
      this.leastFrequentProblemType = null;
      return;
    }
    this.mostFrequentProblemType = data.reduce((max, item) => item.count > max.count ? item : max, data[0]);
    this.leastFrequentProblemType = data.reduce((min, item) => item.count < min.count ? item : min, data[0]);
  }

  updateTreatedPercentage() {
    if (this.claims.length === 0) {
      this.treatedPercentage = 0;
      return;
    }
    const treatedCount = this.claims.filter(claim => claim.status).length;
    this.treatedPercentage = (treatedCount / this.claims.length) * 100;
  }

  sortClaimsByPriority(claims: Claim[]): Claim[] {
    const priorityOrder: { [key: string]: number } = {
      'HIGH': 1,
      'MEDIUM': 2,
      'LOW': 3
    };
    return [...claims].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  toggleSort() {
    this.isSorted = !this.isSorted;
    this.claims = this.isSorted ? this.sortClaimsByPriority(this.originalClaims) : [...this.originalClaims];
  }

  onSidebarAnimationEnd(): void {
    this.isLoading = false; // Show content after sidebar animation
    this.loadClaims(); // Load claims
  }


  selectClaim(claim: Claim) {
    this.selectedClaim = claim;
  }

  getStatusLabel(status: boolean): string {
    return status ? 'Treated' : 'Not treated';
  }

  navigateToWelcome() {
    this.router.navigate(['/welcome']);
  }

  toggleStatus(claim: Claim) {
    if (!claim.status) {
      this.http.put<Claim>(`${environment.apiUrl}/api/claims/${claim.idComplaint}/status`, { status: true }).subscribe({
        next: (updatedClaim) => {
          const index = this.claims.findIndex(c => c.idComplaint === claim.idComplaint);
          if (index !== -1) {
            this.claims[index] = updatedClaim;
            this.originalClaims[this.originalClaims.findIndex(c => c.idComplaint === claim.idComplaint)] = updatedClaim;
            if (this.selectedClaim?.idComplaint === claim.idComplaint) {
              this.selectedClaim = updatedClaim;
            }
            this.updateTreatedPercentage();
          }
          this.claimService.notifyClaimsUpdated();
        },
        error: (error) => {
          console.error('Error updating claim status:', error);
        }
      });
    }
  }
}