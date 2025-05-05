import { Component } from '@angular/core';
import { ServiceService } from '../Service/service.service';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css']
})
export class ClassificationComponent {
  isDarkMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  classificationResult: string | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(private insuranceService: ServiceService) {}
  loadDarkMode(): void {
    const darkModePref = localStorage.getItem('darkMode');
    this.isDarkMode = darkModePref === 'true';
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }

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