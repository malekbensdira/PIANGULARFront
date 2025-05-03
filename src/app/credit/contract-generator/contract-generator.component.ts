import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '../../services/contract.service';
import { Credit } from '../../models/credit.model';

@Component({
  selector: 'app-contract-generator',
  templateUrl: './contract-generator.component.html',
  styleUrls: ['./contract-generator.component.css']
})
export class ContractGeneratorComponent {
  @Input() credit: Credit | null = null;
  
  contractForm: FormGroup;
  generating: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService
  ) {
    this.contractForm = this.createForm();
  }

  ngOnChanges(): void {
    if (this.credit) {
      // Pre-fill form with credit data
      this.contractForm.patchValue({
        credit_amount: this.credit.loanAmount,
        loan_term: this.credit.loanTerm,
        interest_rate: 5.5 // Default interest rate
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      customer_name: ['', Validators.required],
      customer_id_card: ['', Validators.required],
      bank_name: ['AMENA Bank', Validators.required],
      bank_representative: ['John Doe', Validators.required],
      credit_amount: [0, [Validators.required, Validators.min(1)]],
      loan_term: [0, [Validators.required, Validators.min(1)]],
      interest_rate: [5.5, [Validators.required, Validators.min(0)]]
    });
  }

  generateContract(): void {
    if (this.contractForm.invalid) {
      Object.keys(this.contractForm.controls).forEach(key => {
        this.contractForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.generating = true;
    this.error = '';

    this.contractService.generateContract(this.contractForm.value).subscribe({
      next: (response) => {
        this.generating = false;
        this.downloadPdf(response);
      },
      error: (err) => {
        console.error('Error generating contract:', err);
        this.error = 'Failed to generate contract. Please try again later.';
        this.generating = false;
      }
    });
  }

  downloadPdf(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit_contract.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}