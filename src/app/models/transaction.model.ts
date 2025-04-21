import { User } from './user.model';
export enum TypeTransaction {
    INSURANCE = 'INSURANCE',
    CREDIT = 'CREDIT',
    DONATION = 'DONATION'
  }
  
  export enum StatusTransaction {
    FAILED = 'FAILED',
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED'
  }
export interface Transaction {
  idTransaction?: number;
  cardNumber: string;
  cardPassword: string;
  cardExpiryDate: string;
  receiverId: number;
  typeTransaction: TypeTransaction;
  dateTransaction: string;
  dateRemboursement?: string;
  amount: number;
  statusTransaction: StatusTransaction;
  stripePaymentIntentId?: string;
  invoiceUrl?: string;
  invoicePdfUrl?: string;
  paymentMethodId?: string;
  user: { id: number };
}
