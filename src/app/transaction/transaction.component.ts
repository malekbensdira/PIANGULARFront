import { Component, OnInit } from '@angular/core';
import { Transaction, TypeTransaction, StatusTransaction } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[] = [];
  errorMessage = '';
  isLoading = false;
  statusTransaction = StatusTransaction;
  typeTransaction = TypeTransaction;

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error loading transactions.';
        this.isLoading = false;
      }
    });
  }

  openAddTransactionModal(): void {
    this.router.navigate(['/transactions/add']);
  }

  editTransaction(transaction: Transaction): void {
    if (transaction.idTransaction) {
      this.router.navigate(['/transactions/edit', transaction.idTransaction]);
    }
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          console.log('Transaction deleted successfully');
          this.loadTransactions();
        },
        error: (error) => {
          this.errorMessage = 'Error deleting transaction: ' + (error.error?.message || 'Server error');
        }
      });
    }
  }

  getTypeTransactionLabel(type: TypeTransaction): string {
    switch (type) {
      case TypeTransaction.INSURANCE:
        return 'Insurance';
      case TypeTransaction.CREDIT:
        return 'Credit';
      case TypeTransaction.DONATION:
        return 'Donation';
      default:
        return type;
    }
  }

  getStatusTransactionLabel(status: StatusTransaction): string {
    switch (status) {
      case StatusTransaction.FAILED:
        return 'Failed';
      case StatusTransaction.PENDING:
        return 'Pending';
      case StatusTransaction.COMPLETED:
        return 'Completed';
      default:
        return status;
    }
  }
}
