export type UserRole = 'super_admin' | 'admin' | 'vsla_manager' | 'treasurer' | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedVslaIds: string[];
  countryId?: string;
}

export interface Country {
  id: string;
  name: string;
  currency: string;
  currencySymbol: string;
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
}

export type LoanStatus = 'NEW' | 'ACTIVE' | 'OVERDUE' | 'COMPLETED' | 'WRITTEN_OFF';

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  vslaId: string;
  vslaName: string;
  principal: number;
  interestRate: number;
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
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  vslaId: string;
  vslaName: string;
  hasActiveLoan: boolean;
  totalBorrowed: number;
  totalRepaid: number;
  currency: string;
  currencySymbol: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  memberId: string;
  memberName: string;
  amount: number;
  currency: string;
  usdEquivalent: number;
  fxRate: number;
  fxVariance: number;
  date: string;
  isBackdated: boolean;
  flagged: boolean;
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
}

export interface RiskFlag {
  id: string;
  type: 'fx_variance' | 'quick_repay' | 'multiple_loans' | 'backdated_payment';
  description: string;
  severity: 'low' | 'medium' | 'high';
  entityId: string;
  entityType: string;
  timestamp: string;
  resolved: boolean;
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
