import { Component } from '@angular/core';
import { ServiceService } from '../Service/service.service';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css']
})
export class ClassificationComponent {
  selectedFile: File | null = null;
  imagePreview: string | null = null; // Added for image preview
  classificationResult: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private insuranceService: ServiceService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.classificationResult = null;
      this.errorMessage = null;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  classifyImage(): void {
    if (this.selectedFile) {
      this.isLoading = true;
      this.insuranceService.uploadFileForClassification(this.selectedFile).subscribe({
        next: (result: string) => {
          console.log('Classification Result:', result);
          this.classificationResult = result;
          this.errorMessage = null;
          this.isLoading = false;
        },
        error: (err: Error) => {
          console.error('Classification Error:', err);
          this.errorMessage = err.message || 'Failed to classify image. Please try again.';
          this.classificationResult = null;
          this.isLoading = false;
        }
      });
    }
  }

  clearForm(): void { // Added clear functionality
    this.selectedFile = null;
    this.imagePreview = null;
    this.classificationResult = null;
    this.errorMessage = null;
    this.isLoading = false;
  }
}