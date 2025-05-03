import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-claim-modal',
  templateUrl: './claim-modal.component.html',
  styleUrls: ['./claim-modal.component.css']
})
export class ClaimModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  claimForm: FormGroup;
  problemTypes = ['INSURANCE', 'CREDIT', 'TRANSACTION', 'REAL_ESTATE', 'DONATION', 'USER_SERVICES', 'OTHER'];
  requestedSolutions = ['REFUND', 'APOLOGY', 'VOUCHER', 'DISCOUNT', 'CANCELLATION', 'EXPLANATION', 'OTHER'];
  showConfirmation = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.claimForm = this.fb.group({
      description: ['', Validators.required],
      problemType: ['', Validators.required],
      otherProblemType: [{ value: '', disabled: true }],
      requestedSolution: ['', Validators.required],
      otherSolution: [{ value: '', disabled: true }]
    });

    // Enable/disable other fields based on selection
    this.claimForm.get('problemType')?.valueChanges.subscribe(value => {
      const otherProblemTypeControl = this.claimForm.get('otherProblemType');
      if (value === 'OTHER') {
        otherProblemTypeControl?.enable();
        otherProblemTypeControl?.setValidators(Validators.required);
      } else {
        otherProblemTypeControl?.disable();
        otherProblemTypeControl?.clearValidators();
        otherProblemTypeControl?.setValue('');
      }
      otherProblemTypeControl?.updateValueAndValidity();
    });

    this.claimForm.get('requestedSolution')?.valueChanges.subscribe(value => {
      const otherSolutionControl = this.claimForm.get('otherSolution');
      if (value === 'OTHER') {
        otherSolutionControl?.enable();
        otherSolutionControl?.setValidators(Validators.required);
      } else {
        otherSolutionControl?.disable();
        otherSolutionControl?.clearValidators();
        otherSolutionControl?.setValue('');
      }
      otherSolutionControl?.updateValueAndValidity();
    });
  }

  close() {
    this.showConfirmation = false;
    this.claimForm.reset();
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.claimForm.valid) {
      const formValue = this.claimForm.value;

      // Retrieve email from localStorage
      const email = localStorage.getItem('email') || '';

      if (!email) {
        alert('User email not found. Please log in again.');
        return;
      }

      // Fetch user details from backend using email
      this.http.get(`${environment.apiUrl}/api/users/profile`, { params: { email } }).subscribe({
        next: (user: any) => {
          const claimData = {
            description: formValue.description,
            problemType: formValue.problemType,
            otherProblemType: formValue.otherProblemType || null,
            requestedSolution: formValue.requestedSolution,
            otherSolution: formValue.otherSolution || null,
            emailUser: email,
            nomUser: user.nom || '',
            prenomUser: user.prenom || ''
          };

          // Validate required fields
          if (!claimData.nomUser || !claimData.prenomUser) {
            alert('User information is incomplete. Please ensure your profile has a first name and last name.');
            return;
          }

          // Send claim to backend
          this.http.post(`${environment.apiUrl}/api/claims`, claimData).subscribe({
            next: (response) => {
              console.log('Claim submitted:', response);
              this.showConfirmation = true; // Show confirmation message
              this.claimForm.reset(); // Reset form
            },
            error: (error) => {
              console.error('Error submitting claim:', error);
              alert('Failed to submit claim: ' + (error.error?.message || 'Please try again.'));
            }
          });
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          alert('Failed to fetch user details: ' + (error.error?.message || 'Please try again.'));
        }
      });
    }
  }
}