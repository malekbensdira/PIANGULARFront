export enum Gender {
    FEMALE = 'FEMALE',
    MALE = 'MALE'
  }
  
  export enum Married {
    YES = 'YES',
    NO = 'NO'
  }
  
  export enum Education {
    GRADUATE = 'GRADUATE',
    NOT_GRADUATE = 'NOT_GRADUATE'
  }
  
  export enum SelfEmployed {
    YES = 'YES',
    NO = 'NO'
  }
  
  export enum CreditType {
    BUSINESS = 'BUSINESS',
    AGRICULTURE = 'AGRICULTURE',
    HOUSE = 'HOUSE',
    SMALL_AMOUNT = 'SMALL_AMOUNT'
  }
  
  export enum CreditStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CLOSED = 'CLOSED'
  }
  
  export enum InterestType {
    CONSTANT = 'CONSTANT',
    NON_CONSTANT = 'NON_CONSTANT',
    BLOC = 'BLOC'
  }
  
  export interface Remboursement {
    id?: number;
    month: number;
    annuite: number;
    capitalRepayment: number;
    interest: number;
    remainingCapital: number;
  }
  
  export interface Credit {
    creditId?: number;
    gender: Gender;
    married: Married;
    education: Education;
    selfEmployed: SelfEmployed;
    income: number;
    loanAmount: number;
    loanTerm: number;
    creditType: CreditType;
    creditStatus: CreditStatus;
    interestType: InterestType;
    remboursements?: Remboursement[];
  }
  
  export interface CreditResponse {
    credit: Credit;
    repaymentSchedule: Remboursement[];
  }