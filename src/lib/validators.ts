import { LOAN_MAX_DURATION_MONTHS, LOAN_MIN_PRINCIPAL, LOAN_MAX_INTEREST_RATE, FX_VARIANCE_THRESHOLD, VALID_LOAN_TRANSITIONS } from '@/types';
import type { LoanStatus } from '@/types';
import { memberHasActiveLoan } from '@/data/mockData';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Loan creation validation
export function validateLoanCreation(data: {
  vslaId: string;
  memberId: string;
  principal: number;
  interestRate: number;
  durationMonths: number;
  frequency: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.vslaId) errors.push('VSLA is required');
  if (!data.memberId) errors.push('Member is required');

  if (!data.principal || data.principal < LOAN_MIN_PRINCIPAL) {
    errors.push(`Principal must be at least ${LOAN_MIN_PRINCIPAL}`);
  }

  if (data.interestRate < 0 || data.interestRate > LOAN_MAX_INTEREST_RATE) {
    errors.push(`Interest rate must be between 0% and ${LOAN_MAX_INTEREST_RATE}%`);
  }

  if (data.durationMonths < 1 || data.durationMonths > LOAN_MAX_DURATION_MONTHS) {
    errors.push(`Duration must be between 1 and ${LOAN_MAX_DURATION_MONTHS} months`);
  }

  if (!['weekly', 'monthly'].includes(data.frequency)) {
    errors.push('Frequency must be weekly or monthly');
  }

  // One active loan per member — strict enforcement
  if (data.memberId && memberHasActiveLoan(data.memberId)) {
    errors.push('This member already has an active loan. Only one active loan per member is allowed.');
  }

  return { valid: errors.length === 0, errors };
}

// Repayment validation
export function validateRepayment(data: {
  amount: number;
  remainingBalance: number;
  paymentDate: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('Payment amount must be greater than 0');
  }

  if (data.amount > data.remainingBalance) {
    errors.push('Payment amount cannot exceed remaining balance');
  }

  if (!data.paymentDate) {
    errors.push('Payment date is required');
  }

  return { valid: errors.length === 0, errors };
}

// FX variance check
export function checkFxVariance(transactionRate: number, referenceRate: number): {
  variance: number;
  flagged: boolean;
} {
  if (referenceRate === 0) return { variance: 0, flagged: false };
  const variance = Math.abs(((transactionRate - referenceRate) / referenceRate) * 100);
  return {
    variance: Math.round(variance * 10) / 10,
    flagged: variance > FX_VARIANCE_THRESHOLD,
  };
}

// Loan status transition validation
export function validateStatusTransition(currentStatus: LoanStatus, newStatus: LoanStatus): ValidationResult {
  const allowed = VALID_LOAN_TRANSITIONS[currentStatus];
  if (!allowed.includes(newStatus)) {
    return {
      valid: false,
      errors: [`Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowed.join(', ') || 'none'}`],
    };
  }
  return { valid: true, errors: [] };
}

// CSV import validation
export function validateCSVHeaders(headers: string[], requiredHeaders: string[]): ValidationResult {
  const errors: string[] = [];
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase());

  for (const required of requiredHeaders) {
    if (!normalizedHeaders.includes(required.toLowerCase())) {
      errors.push(`Missing required column: ${required}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// Member phone validation
export function validatePhone(phone: string): boolean {
  return /^\+?\d[\d\s-]{6,15}$/.test(phone.trim());
}

// Email validation
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
