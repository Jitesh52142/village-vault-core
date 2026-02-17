import type { User, Country, Province, Community, VSLA, Loan, Member, Repayment, AuditEntry, RiskFlag } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Grace Nakamura', email: 'grace@vsla.org', role: 'super_admin', assignedVslaIds: [] },
  { id: 'u2', name: 'Jean-Pierre Habimana', email: 'jp@vsla.org', role: 'admin', assignedVslaIds: [], countryId: 'c1' },
  { id: 'u3', name: 'Amina Diallo', email: 'amina@vsla.org', role: 'vsla_manager', assignedVslaIds: ['v1', 'v2', 'v3'] },
  { id: 'u4', name: 'Emmanuel Uwimana', email: 'emmanuel@vsla.org', role: 'treasurer', assignedVslaIds: ['v1'] },
  { id: 'u5', name: 'Sarah Mukamana', email: 'sarah@vsla.org', role: 'auditor', assignedVslaIds: [] },
];

export const mockCountries: Country[] = [
  { id: 'c1', name: 'Rwanda', currency: 'RWF', currencySymbol: 'FRw' },
  { id: 'c2', name: 'Uganda', currency: 'UGX', currencySymbol: 'USh' },
  { id: 'c3', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh' },
  { id: 'c4', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh' },
];

export const mockProvinces: Province[] = [
  { id: 'p1', name: 'Kigali', countryId: 'c1' },
  { id: 'p2', name: 'Eastern Province', countryId: 'c1' },
  { id: 'p3', name: 'Kampala', countryId: 'c2' },
  { id: 'p4', name: 'Dar es Salaam', countryId: 'c3' },
  { id: 'p5', name: 'Nairobi', countryId: 'c4' },
];

export const mockCommunities: Community[] = [
  { id: 'cm1', name: 'Nyarugenge', provinceId: 'p1' },
  { id: 'cm2', name: 'Gasabo', provinceId: 'p1' },
  { id: 'cm3', name: 'Rwamagana', provinceId: 'p2' },
  { id: 'cm4', name: 'Makindye', provinceId: 'p3' },
  { id: 'cm5', name: 'Kinondoni', provinceId: 'p4' },
];

export const mockVSLAs: VSLA[] = [
  { id: 'v1', name: 'Umoja Women Group', communityId: 'cm1', provinceName: 'Kigali', countryName: 'Rwanda', communityName: 'Nyarugenge', memberCount: 25, healthScore: 87, totalLoans: 48, outstandingBalance: 1250000, lat: -1.9403, lng: 29.8739 },
  { id: 'v2', name: 'Tujenge Savings', communityId: 'cm2', provinceName: 'Kigali', countryName: 'Rwanda', communityName: 'Gasabo', memberCount: 18, healthScore: 72, totalLoans: 32, outstandingBalance: 890000, lat: -1.9167, lng: 30.0833 },
  { id: 'v3', name: 'Amahoro Circle', communityId: 'cm3', provinceName: 'Eastern Province', countryName: 'Rwanda', communityName: 'Rwamagana', memberCount: 22, healthScore: 94, totalLoans: 55, outstandingBalance: 670000, lat: -1.9500, lng: 30.4333 },
  { id: 'v4', name: 'Kampala Savers', communityId: 'cm4', provinceName: 'Kampala', countryName: 'Uganda', communityName: 'Makindye', memberCount: 30, healthScore: 65, totalLoans: 41, outstandingBalance: 2100000, lat: 0.2986, lng: 32.5811 },
  { id: 'v5', name: 'Dar Unity Fund', communityId: 'cm5', provinceName: 'Dar es Salaam', countryName: 'Tanzania', communityName: 'Kinondoni', memberCount: 20, healthScore: 81, totalLoans: 28, outstandingBalance: 1500000, lat: -6.7924, lng: 39.2083 },
];

export const mockMembers: Member[] = [
  { id: 'm1', name: 'Claudine Uwase', phone: '+250 788 123 456', vslaId: 'v1', vslaName: 'Umoja Women Group', hasActiveLoan: true, totalBorrowed: 150000, totalRepaid: 95000, currency: 'RWF', currencySymbol: 'FRw' },
  { id: 'm2', name: 'Jean Bosco', phone: '+250 788 234 567', vslaId: 'v1', vslaName: 'Umoja Women Group', hasActiveLoan: false, totalBorrowed: 200000, totalRepaid: 200000, currency: 'RWF', currencySymbol: 'FRw' },
  { id: 'm3', name: 'Marie Claire', phone: '+250 788 345 678', vslaId: 'v1', vslaName: 'Umoja Women Group', hasActiveLoan: true, totalBorrowed: 100000, totalRepaid: 45000, currency: 'RWF', currencySymbol: 'FRw' },
  { id: 'm4', name: 'Patrick Niyonzima', phone: '+250 788 456 789', vslaId: 'v2', vslaName: 'Tujenge Savings', hasActiveLoan: true, totalBorrowed: 180000, totalRepaid: 120000, currency: 'RWF', currencySymbol: 'FRw' },
  { id: 'm5', name: 'Alice Mukamusoni', phone: '+250 788 567 890', vslaId: 'v2', vslaName: 'Tujenge Savings', hasActiveLoan: false, totalBorrowed: 120000, totalRepaid: 120000, currency: 'RWF', currencySymbol: 'FRw' },
  { id: 'm6', name: 'Joseph Kalisa', phone: '+250 788 678 901', vslaId: 'v3', vslaName: 'Amahoro Circle', hasActiveLoan: true, totalBorrowed: 250000, totalRepaid: 175000, currency: 'RWF', currencySymbol: 'FRw' },
  { id: 'm7', name: 'Grace Ingabire', phone: '+256 700 123 456', vslaId: 'v4', vslaName: 'Kampala Savers', hasActiveLoan: true, totalBorrowed: 500000, totalRepaid: 200000, currency: 'UGX', currencySymbol: 'USh' },
  { id: 'm8', name: 'Hassan Juma', phone: '+255 712 345 678', vslaId: 'v5', vslaName: 'Dar Unity Fund', hasActiveLoan: false, totalBorrowed: 300000, totalRepaid: 300000, currency: 'TZS', currencySymbol: 'TSh' },
];

export const mockLoans: Loan[] = [
  { id: 'l1', memberId: 'm1', memberName: 'Claudine Uwase', vslaId: 'v1', vslaName: 'Umoja Women Group', principal: 150000, interestRate: 10, totalDue: 165000, amountPaid: 95000, remainingBalance: 70000, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 6, frequency: 'monthly', status: 'ACTIVE', createdAt: '2025-08-15', expectedCompletionDate: '2026-02-15', usdEquivalent: 120 },
  { id: 'l2', memberId: 'm3', memberName: 'Marie Claire', vslaId: 'v1', vslaName: 'Umoja Women Group', principal: 100000, interestRate: 10, totalDue: 110000, amountPaid: 45000, remainingBalance: 65000, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 4, frequency: 'weekly', status: 'OVERDUE', createdAt: '2025-10-01', expectedCompletionDate: '2026-02-01', usdEquivalent: 80 },
  { id: 'l3', memberId: 'm4', memberName: 'Patrick Niyonzima', vslaId: 'v2', vslaName: 'Tujenge Savings', principal: 180000, interestRate: 8, totalDue: 194400, amountPaid: 120000, remainingBalance: 74400, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 6, frequency: 'monthly', status: 'ACTIVE', createdAt: '2025-09-01', expectedCompletionDate: '2026-03-01', usdEquivalent: 145 },
  { id: 'l4', memberId: 'm6', memberName: 'Joseph Kalisa', vslaId: 'v3', vslaName: 'Amahoro Circle', principal: 250000, interestRate: 10, totalDue: 275000, amountPaid: 175000, remainingBalance: 100000, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 8, frequency: 'monthly', status: 'ACTIVE', createdAt: '2025-07-01', expectedCompletionDate: '2026-03-01', usdEquivalent: 200 },
  { id: 'l5', memberId: 'm7', memberName: 'Grace Ingabire', vslaId: 'v4', vslaName: 'Kampala Savers', principal: 500000, interestRate: 12, totalDue: 560000, amountPaid: 200000, remainingBalance: 360000, currency: 'UGX', currencySymbol: 'USh', durationMonths: 10, frequency: 'monthly', status: 'OVERDUE', createdAt: '2025-06-01', expectedCompletionDate: '2026-04-01', usdEquivalent: 135 },
  { id: 'l6', memberId: 'm2', memberName: 'Jean Bosco', vslaId: 'v1', vslaName: 'Umoja Women Group', principal: 200000, interestRate: 10, totalDue: 220000, amountPaid: 220000, remainingBalance: 0, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 6, frequency: 'monthly', status: 'COMPLETED', createdAt: '2025-03-01', expectedCompletionDate: '2025-09-01', usdEquivalent: 160 },
];

export const mockRepayments: Repayment[] = [
  { id: 'r1', loanId: 'l1', memberId: 'm1', memberName: 'Claudine Uwase', amount: 27500, currency: 'RWF', usdEquivalent: 22, fxRate: 1250, fxVariance: 1.2, date: '2026-01-15', isBackdated: false, flagged: false },
  { id: 'r2', loanId: 'l1', memberId: 'm1', memberName: 'Claudine Uwase', amount: 27500, currency: 'RWF', usdEquivalent: 21, fxRate: 1310, fxVariance: 3.5, date: '2025-12-15', isBackdated: false, flagged: false },
  { id: 'r3', loanId: 'l2', memberId: 'm3', memberName: 'Marie Claire', amount: 15000, currency: 'RWF', usdEquivalent: 12, fxRate: 1250, fxVariance: 0.8, date: '2025-11-15', isBackdated: false, flagged: false },
  { id: 'r4', loanId: 'l5', memberId: 'm7', memberName: 'Grace Ingabire', amount: 50000, currency: 'UGX', usdEquivalent: 13.5, fxRate: 3700, fxVariance: 6.2, date: '2026-01-10', isBackdated: true, flagged: true },
];

export const mockAuditLog: AuditEntry[] = [
  { id: 'a1', action: 'LOAN_CREATED', entity: 'Loan', entityId: 'l1', userId: 'u3', userName: 'Amina Diallo', timestamp: '2025-08-15T10:30:00Z', after: 'Loan of FRw 150,000 for Claudine Uwase' },
  { id: 'a2', action: 'REPAYMENT_RECORDED', entity: 'Repayment', entityId: 'r1', userId: 'u4', userName: 'Emmanuel Uwimana', timestamp: '2026-01-15T14:20:00Z', after: 'FRw 27,500 payment recorded' },
  { id: 'a3', action: 'STATUS_CHANGED', entity: 'Loan', entityId: 'l2', userId: 'u3', userName: 'Amina Diallo', timestamp: '2026-02-02T09:00:00Z', before: 'ACTIVE', after: 'OVERDUE' },
  { id: 'a4', action: 'LOAN_COMPLETED', entity: 'Loan', entityId: 'l6', userId: 'u4', userName: 'Emmanuel Uwimana', timestamp: '2025-09-01T16:45:00Z', after: 'Loan fully repaid' },
  { id: 'a5', action: 'MEMBER_ADDED', entity: 'Member', entityId: 'm8', userId: 'u3', userName: 'Amina Diallo', timestamp: '2025-11-20T11:00:00Z', after: 'Hassan Juma added to Dar Unity Fund' },
  { id: 'a6', action: 'FX_RATE_FLAGGED', entity: 'Repayment', entityId: 'r4', userId: 'u1', userName: 'System', timestamp: '2026-01-10T13:30:00Z', after: 'FX variance 6.2% exceeds threshold' },
];

export const mockRiskFlags: RiskFlag[] = [
  { id: 'rf1', type: 'fx_variance', description: 'FX variance of 6.2% on UGX transaction exceeds 5% threshold', severity: 'high', entityId: 'r4', entityType: 'Repayment', timestamp: '2026-01-10T13:30:00Z', resolved: false },
  { id: 'rf2', type: 'backdated_payment', description: 'Backdated repayment entry for Grace Ingabire', severity: 'medium', entityId: 'r4', entityType: 'Repayment', timestamp: '2026-01-10T13:30:00Z', resolved: false },
  { id: 'rf3', type: 'quick_repay', description: 'Unusually fast loan repayment pattern detected', severity: 'low', entityId: 'l6', entityType: 'Loan', timestamp: '2025-09-01T16:45:00Z', resolved: true },
];

export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol} ${amount.toLocaleString()}`;
}

export function getHealthColor(score: number): string {
  if (score >= 80) return 'health-good';
  if (score >= 60) return 'health-moderate';
  return 'health-poor';
}

export function getHealthLabel(score: number): string {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Moderate';
  return 'Poor';
}
