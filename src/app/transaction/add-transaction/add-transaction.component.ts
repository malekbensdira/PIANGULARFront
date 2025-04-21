import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  transactionForm!: FormGroup;
  stripe!: Stripe | null;
  card!: StripeCardElement;
  errorMessage = '';

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {}

  async ngOnInit() {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      typeTransaction: ['', Validators.required],
      userId: [1, Validators.required]  // Simule un utilisateur connecté
    });

    this.stripe = await loadStripe('pk_test_51RCPVWH59EG0IcqZLCS2sgBfxnY6Zg06OBYkurXfGrcUzwE3gyCyEI2snSF3tCw7J5k2ZK8I0VRtyXKZrDLQ8hGT00K3DmeTFI');

    if (this.stripe) {
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount('#card-element');
    } else {
      this.errorMessage = "Stripe n'a pas pu être chargé.";
    }
  }

  async submitTransaction() {
    if (!this.transactionForm.valid) {
      this.errorMessage = "Formulaire invalide.";
      return;
    }

    if (!this.stripe || !this.card) {
      this.errorMessage = "Stripe n'est pas prêt.";
      return;
    }

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card
    });

    if (error) {
      this.errorMessage = error.message || 'Erreur de création de méthode de paiement.';
      return;
    }

    const transactionData = {
      amount: this.transactionForm.value.amount,
      typeTransaction: this.transactionForm.value.typeTransaction,
      user: { id: this.transactionForm.value.userId },
      paymentMethodId: paymentMethod.id
    };

    this.transactionService.createTransaction(transactionData).subscribe({
      next: res => {
        alert('Transaction status: ' + res.status);
        this.errorMessage = '';
        this.transactionForm.reset({ userId: 1 });
        this.card.clear();
      },
      error: err => {
        this.errorMessage = err.error?.error || 'Erreur serveur lors de la transaction.';
      }
    });
  }
}
