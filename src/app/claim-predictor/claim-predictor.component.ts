// src/app/components/claim-predictor/claim-predictor.component.ts
import { Component } from '@angular/core';
import { ServiceService } from '../Service/service.service';

@Component({
  selector: 'app-claim-predictor',
  templateUrl: './claim-predictor.component.html',
  styleUrls: ['./claim-predictor.component.css'],
})
export class ClaimPredictorComponent {
  selectedFile: File | null = null;
  damageCategory: string = '';
  prediction: any = null;
  errorMessage: string | null = null;

  constructor(private insuranceService: ServiceService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.insuranceService.uploadFileForClassification(this.selectedFile).subscribe({
        next: (result: string) => {
          this.prediction = JSON.parse(result);
          this.errorMessage = null;
        },
        error: (err: Error) => (this.errorMessage = err.message), // Type explicite
      });
    }
  }
  
  predictClaim(): void {
    if (this.damageCategory) {
      this.insuranceService.predictClaim(this.damageCategory).subscribe({
        next: (result: { damageCategory: string; claimType: string; price: number }) => {
          this.prediction = result;
          this.errorMessage = null;
        },
        error: (err: Error) => (this.errorMessage = err.message), // Type explicite
      });
    }
  }
}