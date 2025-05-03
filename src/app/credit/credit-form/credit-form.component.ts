import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import {
  Credit,
  Gender,
  Married,
  Education,
  SelfEmployed,
  CreditType,
  CreditStatus,
  InterestType
} from '../../models/credit.model';

@Component({
  selector: 'app-credit-form',
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css']
})
export class CreditFormComponent implements OnInit {
  creditForm: FormGroup;
  isEditMode: boolean = false;
  creditId: number | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  error: string = '';
  
  // Enum values for dropdowns
  genderOptions = Object.values(Gender);
  marriedOptions = Object.values(Married);
  educationOptions = Object.values(Education);
  selfEmployedOptions = Object.values(SelfEmployed);
  creditTypeOptions = Object.values(CreditType);
  creditStatusOptions = Object.values(CreditStatus);
  interestTypeOptions = Object.values(InterestType);

  constructor(
    private fb: FormBuilder,
    private creditService: CreditService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.creditForm = this.createForm();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.creditId = +idParam;
      this.loadCreditData(this.creditId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      gender: [Gender.MALE, Validators.required],
      married: [Married.NO, Validators.required],
      education: [Education.GRADUATE, Validators.required],
      selfEmployed: [SelfEmployed.NO, Validators.required],
      income: [0, [Validators.required, Validators.min(0)]],
      loanAmount: [0, [Validators.required, Validators.min(0)]],
      loanTerm: [12, [Validators.required, Validators.min(1)]],
      creditType: [CreditType.BUSINESS, Validators.required],
      creditStatus: [CreditStatus.PENDING, Validators.required],
      interestType: [InterestType.CONSTANT, Validators.required]
    });
  }

  loadCreditData(id: number): void {
    this.loading = true;
    this.creditService.getCreditById(id).subscribe({
      next: (credit: Credit) => {
        this.creditForm.patchValue(credit);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching credit:', err);
        this.error = 'Failed to load credit data. Please try again later.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.creditForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.creditForm.controls).forEach(key => {
        const control = this.creditForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const creditData: Credit = this.creditForm.value;
    this.submitting = true;

    if (this.isEditMode && this.creditId) {
      this.creditService.updateCredit(this.creditId, creditData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/credit']);
        },
        error: (err) => {
          console.error('Error updating credit:', err);
          this.error = 'Failed to update credit. Please try again later.';
          this.submitting = false;
        }
      });
    } else {
      this.creditService.createCredit(creditData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/credit']);
        },
        error: (err) => {
          console.error('Error creating credit:', err);
          this.error = 'Failed to create credit. Please try again later.';
          this.submitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/credit']);
  }
}