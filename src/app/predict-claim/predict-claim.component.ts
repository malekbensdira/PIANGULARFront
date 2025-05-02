import { Component, AfterViewInit } from '@angular/core';
import { ServiceService } from '../Service/service.service';

interface ClaimPrediction {
  damageCategory: string;
  claimType: string;
  price: number;
}

@Component({
  selector: 'app-predict-claim',
  templateUrl: './predict-claim.component.html',
  styleUrls: ['./predict-claim.component.css']
})
export class PredictClaimComponent implements AfterViewInit {
  damageCategories: string[] = [
    'Crack',
    'Scratch',
    'Tire Flat',
    'Dent',
    'Glass Shatter',
    'Lamp Broken'
  ];
  selectedCategory: string | null = null;
  predictionResult: ClaimPrediction | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isDomReady: boolean = false;

  constructor(private insuranceService: ServiceService) {}

  ngAfterViewInit(): void {
    // Ensure DOM is fully rendered before allowing state changes
    setTimeout(() => {
      this.isDomReady = true;
    }, 0);
  }

  onCategorySelected(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory = select.value;
    this.predictionResult = null;
    this.errorMessage = null;
    console.log('Selected Category:', this.selectedCategory);
  }

  predictClaim(): void {
    if (!this.isDomReady) {
      console.warn('DOM not ready yet, delaying predictClaim');
      setTimeout(() => this.predictClaim(), 100);
      return;
    }

    if (this.selectedCategory) {
      this.isLoading = true;
      this.errorMessage = null;
      this.predictionResult = null;
      this.insuranceService.predictClaim(this.selectedCategory).subscribe({
        next: (result: any) => {
          console.log('Prediction Result:', result);
          this.predictionResult = {
            damageCategory: result.damageCategory,
            claimType: result.claimType,
            price: result.price
          };
          this.isLoading = false;
        },
        error: (err: Error) => {
          console.error('Prediction Error:', err);
          this.errorMessage = err.message || 'Failed to predict claim. Please try again.';
          this.predictionResult = null;
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Please select a damage category.';
    }
  }

  clearForm(): void {
    this.selectedCategory = null;
    this.predictionResult = null;
    this.errorMessage = null;
    this.isLoading = false;
    console.log('Form cleared');
  }
}