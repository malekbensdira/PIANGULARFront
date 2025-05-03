import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Remboursement } from '../../models/credit.model';

@Component({
  selector: 'app-repayment-chart',
  templateUrl: './repayment-chart.component.html',
  styleUrls: ['./repayment-chart.component.css']
})
export class RepaymentChartComponent implements OnChanges {
  @Input() remboursements: Remboursement[] = [];
  
  // Properly define chartData with the correct type
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Principal Payment',
        data: [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      },
      {
        label: 'Interest Payment',
        data: [],
        borderColor: '#FF5722',
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Define chart options
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Payment Period'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount'
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['remboursements'] && this.remboursements && this.remboursements.length > 0) {
      this.updateChartData();
    }
  }

  updateChartData(): void {
    // Extract data from remboursements using the correct property names
    const labels = this.remboursements.map((payment) => `Month ${payment.month}`);
    const principalData = this.remboursements.map(payment => payment.capitalRepayment || 0);
    const interestData = this.remboursements.map(payment => payment.interest || 0);
    
    // Update the chart data
    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Principal Payment',
          data: principalData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4
        },
        {
          label: 'Interest Payment',
          data: interestData,
          borderColor: '#FF5722',
          backgroundColor: 'rgba(255, 87, 34, 0.1)',
          tension: 0.4
        }
      ]
    };
  }
}