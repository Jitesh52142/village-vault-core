export type UserRole = 'super_admin' | 'admin' | 'vsla_manager' | 'treasurer' | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedVslaIds: string[];
  countryId?: string;
  authUserId?: string;
  roleId?: string;
  phone?: string;
  createdBy?: string;
  createdAt?: string;
  editedBy?: string;
  editedAt?: string;
}

export interface Country {
  id: string;
  name: string;
  currency: string;
  currencySymbol: string;
  iso2Code?: string;
  iso3Code?: string;
  currencyCode?: string;
  currencyDecimalPlaces?: number;
}

export interface Province {
  id: string;
  name: string;
  countryId: string;
}

export interface Community {
  id: string;
  name: string;
  provinceId: string;
}

export interface VSLA {
  id: string;
  friendlyId: string;
  name: string;
  communityId: string;
  provinceName: string;
  countryName: string;
  communityName: string;
  memberCount: number;
  healthScore: number;
  totalLoans: number;
  outstandingBalance: number;
  lat?: number;
  lng?: number;
  createdBy?: string;
  createdAt?: string;
}

export type LoanStatus = 'NEW' | 'ACTIVE' | 'OVERDUE' | 'COMPLETED' | 'WRITTEN_OFF';

// Valid loan status transitions
export const VALID_LOAN_TRANSITIONS: Record<LoanStatus, LoanStatus[]> = {
  NEW: ['ACTIVE'],
  ACTIVE: ['OVERDUE', 'COMPLETED', 'WRITTEN_OFF'],
  OVERDUE: ['ACTIVE', 'COMPLETED', 'WRITTEN_OFF'],
  COMPLETED: [],
  WRITTEN_OFF: [],
};

export interface Loan {
  id: string;
  friendlyId: string;
  memberId: string;
  memberName: string;
  vslaId: string;
  vslaName: string;
  principal: number;
  interestRate: number;
  interestAmount: number;
  totalDue: number;
  amountPaid: number;
  remainingBalance: number;
  currency: string;
  currencySymbol: string;
  durationMonths: number;
  frequency: 'weekly' | 'monthly';
  status: LoanStatus;
  createdAt: string;
  expectedCompletionDate: string;
  usdEquivalent: number;
  createdBy?: string;
  editedBy?: string;
  editedAt?: string;
}

export interface LoanRepaymentSchedule {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  scheduledAmount: number;
  paidAmount: number;
  isPaid: boolean;
}

export interface Member {
  id: string;
  friendlyId: string;
  name: string;
  phone: string;
  vslaId: string;
  vslaName: string;
  hasActiveLoan: boolean;
  totalBorrowed: number;
  totalRepaid: number;
  currency: string;
  currencySymbol: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  scheduleId?: string;
  memberId: string;
  memberName: string;
  amount: number;
  currency: string;
  usdEquivalent: number;
  fxRate: number;
  fxVariance: number;
  fxGainLoss?: number;
  remainingBalanceAfter?: number;
  date: string;
  isBackdated: boolean;
  flagged: boolean;
  enteredBy?: string;
  fxLockId?: string;
}

export interface FxDailyRate {
  id: string;
  currencyCode: string;
  referenceRate: number;
  rateDate: string;
}

export interface FxLock {
  id: string;
  currencyCode: string;
  lockedRate: number;
  lockedAt: string;
  expiresAt: string;
  usedByRepaymentId?: string;
}

export interface VslaAggregate {
  id: string;
  vslaId: string;
  totalLoans: number;
  activeLoans: number;
  overdueLoans: number;
  completedLoans: number;
  totalOutstandingLocal: number;
  totalDisbursedLocal: number;
  lastUpdated: string;
}

export interface VslaHealthScore {
  id: string;
  vslaId: string;
  repaymentSuccessRate: number;
  delinquencyRate: number;
  avgDelayDays: number;
  loanVolume: number;
  repaymentSpeed: number;
  finalScore: number;
  evaluatedAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userName: string;
  timestamp: string;
  before?: string;
  after?: string;
  performedBy?: string;
}

export interface RiskFlag {
  id: string;
  type: 'fx_variance' | 'quick_repay' | 'multiple_loans' | 'backdated_payment';
  description: string;
  severity: 'low' | 'medium' | 'high';
  entityId: string;
  entityType: string;
  riskScore?: number;
  timestamp: string;
  resolved: boolean;
}

export interface BackupLog {
  id: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  fileSize?: string;
  status: 'completed' | 'failed' | 'in_progress';
  fileName?: string;
}

export interface UserVslaAssignment {
  id: string;
  userId: string;
  vslaId: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  vsla_manager: 'VSLA Manager',
  treasurer: 'Treasurer',
  auditor: 'Auditor',
};

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  NEW: 'New',
  ACTIVE: 'Active',
  OVERDUE: 'Overdue',
  COMPLETED: 'Completed',
  WRITTEN_OFF: 'Written Off',
};

// Validation constants
export const LOAN_MAX_DURATION_MONTHS = 12;
export const LOAN_MIN_PRINCIPAL = 1;
export const LOAN_MAX_INTEREST_RATE = 100;
export const FX_VARIANCE_THRESHOLD = 5; // percent
export const FX_LOCK_DURATION_MINUTES = 10;
export const NEW_LOAN_GRACE_DAYS = 7;
