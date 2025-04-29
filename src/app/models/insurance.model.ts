// src/app/models/insurance.model.ts
import { ClaimStatus } from './claim-status.enum';
import { PolicyType } from './policy-type.enum';

export interface Insurance {
  id?: number;
  userId: number;
  policyType: PolicyType;
  premium: number;
  coverageAmount: number;
  startDate: string; // Les dates sont souvent reçues sous forme de chaînes (ISO format)
  endDate: string;
  claimStatus: ClaimStatus;
  claimDate?: string;
  claimAmount?: number;
}