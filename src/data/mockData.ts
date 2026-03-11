import type {
  User, Country, Province, Community, VSLA, Loan, Member, Repayment,
  AuditEntry, RiskFlag, LoanRepaymentSchedule, FxDailyRate, FxLock,
  VslaAggregate, VslaHealthScore, BackupLog, UserVslaAssignment
} from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Grace Nakamura', email: 'grace@vsla.org', role: 'super_admin', assignedVslaIds: [], createdAt: '2025-01-01T00:00:00Z' },
  { id: 'u2', name: 'Jean-Pierre Habimana', email: 'jp@vsla.org', role: 'admin', assignedVslaIds: [], countryId: 'c1', createdAt: '2025-01-15T00:00:00Z' },
  { id: 'u3', name: 'Amina Diallo', email: 'amina@vsla.org', role: 'vsla_manager', assignedVslaIds: ['v1', 'v2', 'v3'], createdAt: '2025-02-01T00:00:00Z' },
  { id: 'u4', name: 'Emmanuel Uwimana', email: 'emmanuel@vsla.org', role: 'treasurer', assignedVslaIds: ['v1'], createdAt: '2025-02-15T00:00:00Z' },
  { id: 'u5', name: 'Sarah Mukamana', email: 'sarah@vsla.org', role: 'auditor', assignedVslaIds: [], createdAt: '2025-03-01T00:00:00Z' },
];

export const mockCountries: Country[] = [
  { id: 'c1', name: 'Rwanda', currency: 'RWF', currencySymbol: 'FRw', iso2Code: 'RW', iso3Code: 'RWA', currencyCode: 'RWF', currencyDecimalPlaces: 0 },
  { id: 'c2', name: 'Uganda', currency: 'UGX', currencySymbol: 'USh', iso2Code: 'UG', iso3Code: 'UGA', currencyCode: 'UGX', currencyDecimalPlaces: 0 },
  { id: 'c3', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', iso2Code: 'TZ', iso3Code: 'TZA', currencyCode: 'TZS', currencyDecimalPlaces: 0 },
  { id: 'c4', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', iso2Code: 'KE', iso3Code: 'KEN', currencyCode: 'KES', currencyDecimalPlaces: 2 },
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
  { id: 'v1', friendlyId: 'VSLA-RW-001', name: 'Umoja Women Group', communityId: 'cm1', provinceName: 'Kigali', countryName: 'Rwanda', communityName: 'Nyarugenge', memberCount: 25, healthScore: 87, totalLoans: 48, outstandingBalance: 1250000, lat: -1.9403, lng: 29.8739, createdAt: '2025-01-10T00:00:00Z' },
  { id: 'v2', friendlyId: 'VSLA-RW-002', name: 'Tujenge Savings', communityId: 'cm2', provinceName: 'Kigali', countryName: 'Rwanda', communityName: 'Gasabo', memberCount: 18, healthScore: 72, totalLoans: 32, outstandingBalance: 890000, lat: -1.9167, lng: 30.0833, createdAt: '2025-02-01T00:00:00Z' },
  { id: 'v3', friendlyId: 'VSLA-RW-003', name: 'Amahoro Circle', communityId: 'cm3', provinceName: 'Eastern Province', countryName: 'Rwanda', communityName: 'Rwamagana', memberCount: 22, healthScore: 94, totalLoans: 55, outstandingBalance: 670000, lat: -1.9500, lng: 30.4333, createdAt: '2025-02-15T00:00:00Z' },
  { id: 'v4', friendlyId: 'VSLA-UG-001', name: 'Kampala Savers', communityId: 'cm4', provinceName: 'Kampala', countryName: 'Uganda', communityName: 'Makindye', memberCount: 30, healthScore: 65, totalLoans: 41, outstandingBalance: 2100000, lat: 0.2986, lng: 32.5811, createdAt: '2025-03-01T00:00:00Z' },
  { id: 'v5', friendlyId: 'VSLA-TZ-001', name: 'Dar Unity Fund', communityId: 'cm5', provinceName: 'Dar es Salaam', countryName: 'Tanzania', communityName: 'Kinondoni', memberCount: 20, healthScore: 81, totalLoans: 28, outstandingBalance: 1500000, lat: -6.7924, lng: 39.2083, createdAt: '2025-03-15T00:00:00Z' },
];

export const mockMembers: Member[] = [
  { id: 'm1', friendlyId: 'MBR-001', name: 'Claudine Uwase', phone: '+250 788 123 456', vslaId: 'v1', vslaName: 'Umoja Women Group', hasActiveLoan: true, totalBorrowed: 150000, totalRepaid: 95000, currency: 'RWF', currencySymbol: 'FRw', createdAt: '2025-02-01T00:00:00Z' },
  { id: 'm2', friendlyId: 'MBR-002', name: 'Jean Bosco', phone: '+250 788 234 567', vslaId: 'v1', vslaName: 'Umoja Women Group', hasActiveLoan: false, totalBorrowed: 200000, totalRepaid: 200000, currency: 'RWF', currencySymbol: 'FRw', createdAt: '2025-02-01T00:00:00Z' },
  { id: 'm3', friendlyId: 'MBR-003', name: 'Marie Claire', phone: '+250 788 345 678', vslaId: 'v1', vslaName: 'Umoja Women Group', hasActiveLoan: true, totalBorrowed: 100000, totalRepaid: 45000, currency: 'RWF', currencySymbol: 'FRw', createdAt: '2025-03-01T00:00:00Z' },
  { id: 'm4', friendlyId: 'MBR-004', name: 'Patrick Niyonzima', phone: '+250 788 456 789', vslaId: 'v2', vslaName: 'Tujenge Savings', hasActiveLoan: true, totalBorrowed: 180000, totalRepaid: 120000, currency: 'RWF', currencySymbol: 'FRw', createdAt: '2025-03-15T00:00:00Z' },
  { id: 'm5', friendlyId: 'MBR-005', name: 'Alice Mukamusoni', phone: '+250 788 567 890', vslaId: 'v2', vslaName: 'Tujenge Savings', hasActiveLoan: false, totalBorrowed: 120000, totalRepaid: 120000, currency: 'RWF', currencySymbol: 'FRw', createdAt: '2025-04-01T00:00:00Z' },
  { id: 'm6', friendlyId: 'MBR-006', name: 'Joseph Kalisa', phone: '+250 788 678 901', vslaId: 'v3', vslaName: 'Amahoro Circle', hasActiveLoan: true, totalBorrowed: 250000, totalRepaid: 175000, currency: 'RWF', currencySymbol: 'FRw', createdAt: '2025-04-15T00:00:00Z' },
  { id: 'm7', friendlyId: 'MBR-007', name: 'Grace Ingabire', phone: '+256 700 123 456', vslaId: 'v4', vslaName: 'Kampala Savers', hasActiveLoan: true, totalBorrowed: 500000, totalRepaid: 200000, currency: 'UGX', currencySymbol: 'USh', createdAt: '2025-05-01T00:00:00Z' },
  { id: 'm8', friendlyId: 'MBR-008', name: 'Hassan Juma', phone: '+255 712 345 678', vslaId: 'v5', vslaName: 'Dar Unity Fund', hasActiveLoan: false, totalBorrowed: 300000, totalRepaid: 300000, currency: 'TZS', currencySymbol: 'TSh', createdAt: '2025-05-15T00:00:00Z' },
];

export const mockLoans: Loan[] = [
  { id: 'l1', friendlyId: 'LN-RW-001', memberId: 'm1', memberName: 'Claudine Uwase', vslaId: 'v1', vslaName: 'Umoja Women Group', principal: 150000, interestRate: 10, interestAmount: 15000, totalDue: 165000, amountPaid: 95000, remainingBalance: 70000, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 6, frequency: 'monthly', status: 'ACTIVE', createdAt: '2025-08-15', expectedCompletionDate: '2026-02-15', usdEquivalent: 120, createdBy: 'u3' },
  { id: 'l2', friendlyId: 'LN-RW-002', memberId: 'm3', memberName: 'Marie Claire', vslaId: 'v1', vslaName: 'Umoja Women Group', principal: 100000, interestRate: 10, interestAmount: 10000, totalDue: 110000, amountPaid: 45000, remainingBalance: 65000, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 4, frequency: 'weekly', status: 'OVERDUE', createdAt: '2025-10-01', expectedCompletionDate: '2026-02-01', usdEquivalent: 80, createdBy: 'u3' },
  { id: 'l3', friendlyId: 'LN-RW-003', memberId: 'm4', memberName: 'Patrick Niyonzima', vslaId: 'v2', vslaName: 'Tujenge Savings', principal: 180000, interestRate: 8, interestAmount: 14400, totalDue: 194400, amountPaid: 120000, remainingBalance: 74400, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 6, frequency: 'monthly', status: 'ACTIVE', createdAt: '2025-09-01', expectedCompletionDate: '2026-03-01', usdEquivalent: 145, createdBy: 'u3' },
  { id: 'l4', friendlyId: 'LN-RW-004', memberId: 'm6', memberName: 'Joseph Kalisa', vslaId: 'v3', vslaName: 'Amahoro Circle', principal: 250000, interestRate: 10, interestAmount: 25000, totalDue: 275000, amountPaid: 175000, remainingBalance: 100000, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 8, frequency: 'monthly', status: 'ACTIVE', createdAt: '2025-07-01', expectedCompletionDate: '2026-03-01', usdEquivalent: 200, createdBy: 'u3' },
  { id: 'l5', friendlyId: 'LN-UG-001', memberId: 'm7', memberName: 'Grace Ingabire', vslaId: 'v4', vslaName: 'Kampala Savers', principal: 500000, interestRate: 12, interestAmount: 60000, totalDue: 560000, amountPaid: 200000, remainingBalance: 360000, currency: 'UGX', currencySymbol: 'USh', durationMonths: 10, frequency: 'monthly', status: 'OVERDUE', createdAt: '2025-06-01', expectedCompletionDate: '2026-04-01', usdEquivalent: 135, createdBy: 'u2' },
  { id: 'l6', friendlyId: 'LN-RW-005', memberId: 'm2', memberName: 'Jean Bosco', vslaId: 'v1', vslaName: 'Umoja Women Group', principal: 200000, interestRate: 10, interestAmount: 20000, totalDue: 220000, amountPaid: 220000, remainingBalance: 0, currency: 'RWF', currencySymbol: 'FRw', durationMonths: 6, frequency: 'monthly', status: 'COMPLETED', createdAt: '2025-03-01', expectedCompletionDate: '2025-09-01', usdEquivalent: 160, createdBy: 'u3' },
];

export const mockRepaymentSchedules: LoanRepaymentSchedule[] = [
  // Loan l1 - 6 monthly installments of 27500
  { id: 'rs1', loanId: 'l1', installmentNumber: 1, dueDate: '2025-09-15', scheduledAmount: 27500, paidAmount: 27500, isPaid: true },
  { id: 'rs2', loanId: 'l1', installmentNumber: 2, dueDate: '2025-10-15', scheduledAmount: 27500, paidAmount: 27500, isPaid: true },
  { id: 'rs3', loanId: 'l1', installmentNumber: 3, dueDate: '2025-11-15', scheduledAmount: 27500, paidAmount: 27500, isPaid: true },
  { id: 'rs4', loanId: 'l1', installmentNumber: 4, dueDate: '2025-12-15', scheduledAmount: 27500, paidAmount: 12500, isPaid: false },
  { id: 'rs5', loanId: 'l1', installmentNumber: 5, dueDate: '2026-01-15', scheduledAmount: 27500, paidAmount: 0, isPaid: false },
  { id: 'rs6', loanId: 'l1', installmentNumber: 6, dueDate: '2026-02-15', scheduledAmount: 27500, paidAmount: 0, isPaid: false },
  // Loan l2 - 16 weekly installments
  { id: 'rs7', loanId: 'l2', installmentNumber: 1, dueDate: '2025-10-08', scheduledAmount: 6875, paidAmount: 6875, isPaid: true },
  { id: 'rs8', loanId: 'l2', installmentNumber: 2, dueDate: '2025-10-15', scheduledAmount: 6875, paidAmount: 6875, isPaid: true },
  { id: 'rs9', loanId: 'l2', installmentNumber: 3, dueDate: '2025-10-22', scheduledAmount: 6875, paidAmount: 6875, isPaid: true },
  { id: 'rs10', loanId: 'l2', installmentNumber: 4, dueDate: '2025-10-29', scheduledAmount: 6875, paidAmount: 6875, isPaid: true },
  { id: 'rs11', loanId: 'l2', installmentNumber: 5, dueDate: '2025-11-05', scheduledAmount: 6875, paidAmount: 6875, isPaid: true },
  { id: 'rs12', loanId: 'l2', installmentNumber: 6, dueDate: '2025-11-12', scheduledAmount: 6875, paidAmount: 6875, isPaid: true },
  { id: 'rs13', loanId: 'l2', installmentNumber: 7, dueDate: '2025-11-19', scheduledAmount: 6875, paidAmount: 3625, isPaid: false },
  { id: 'rs14', loanId: 'l2', installmentNumber: 8, dueDate: '2025-11-26', scheduledAmount: 6875, paidAmount: 0, isPaid: false },
];

export const mockRepayments: Repayment[] = [
  { id: 'r1', loanId: 'l1', scheduleId: 'rs3', memberId: 'm1', memberName: 'Claudine Uwase', amount: 27500, currency: 'RWF', usdEquivalent: 22, fxRate: 1250, fxVariance: 1.2, fxGainLoss: 0.26, remainingBalanceAfter: 70000, date: '2026-01-15', isBackdated: false, flagged: false, enteredBy: 'u4' },
  { id: 'r2', loanId: 'l1', scheduleId: 'rs2', memberId: 'm1', memberName: 'Claudine Uwase', amount: 27500, currency: 'RWF', usdEquivalent: 21, fxRate: 1310, fxVariance: 3.5, fxGainLoss: -0.74, remainingBalanceAfter: 97500, date: '2025-12-15', isBackdated: false, flagged: false, enteredBy: 'u4' },
  { id: 'r3', loanId: 'l2', memberId: 'm3', memberName: 'Marie Claire', amount: 15000, currency: 'RWF', usdEquivalent: 12, fxRate: 1250, fxVariance: 0.8, fxGainLoss: 0.1, remainingBalanceAfter: 65000, date: '2025-11-15', isBackdated: false, flagged: false, enteredBy: 'u4' },
  { id: 'r4', loanId: 'l5', memberId: 'm7', memberName: 'Grace Ingabire', amount: 50000, currency: 'UGX', usdEquivalent: 13.5, fxRate: 3700, fxVariance: 6.2, fxGainLoss: -0.84, remainingBalanceAfter: 360000, date: '2026-01-10', isBackdated: true, flagged: true, enteredBy: 'u4', fxLockId: 'fxl2' },
  { id: 'r5', loanId: 'l3', memberId: 'm4', memberName: 'Patrick Niyonzima', amount: 32400, currency: 'RWF', usdEquivalent: 26, fxRate: 1246, fxVariance: 0.5, fxGainLoss: 0.13, remainingBalanceAfter: 74400, date: '2026-02-01', isBackdated: false, flagged: false, enteredBy: 'u4' },
  { id: 'r6', loanId: 'l4', memberId: 'm6', memberName: 'Joseph Kalisa', amount: 34375, currency: 'RWF', usdEquivalent: 27.5, fxRate: 1250, fxVariance: 0.0, fxGainLoss: 0.0, remainingBalanceAfter: 100000, date: '2026-01-20', isBackdated: false, flagged: false, enteredBy: 'u4' },
];

export const mockFxDailyRates: FxDailyRate[] = [
  { id: 'fx1', currencyCode: 'RWF', referenceRate: 1250, rateDate: '2026-03-11' },
  { id: 'fx2', currencyCode: 'UGX', referenceRate: 3680, rateDate: '2026-03-11' },
  { id: 'fx3', currencyCode: 'TZS', referenceRate: 2580, rateDate: '2026-03-11' },
  { id: 'fx4', currencyCode: 'KES', referenceRate: 152, rateDate: '2026-03-11' },
  { id: 'fx5', currencyCode: 'RWF', referenceRate: 1248, rateDate: '2026-03-10' },
  { id: 'fx6', currencyCode: 'UGX', referenceRate: 3675, rateDate: '2026-03-10' },
  { id: 'fx7', currencyCode: 'RWF', referenceRate: 1252, rateDate: '2026-03-09' },
  { id: 'fx8', currencyCode: 'UGX', referenceRate: 3690, rateDate: '2026-03-09' },
];

export const mockFxLocks: FxLock[] = [
  { id: 'fxl1', currencyCode: 'RWF', lockedRate: 1250, lockedAt: '2026-03-11T10:00:00Z', expiresAt: '2026-03-11T10:10:00Z' },
  { id: 'fxl2', currencyCode: 'UGX', lockedRate: 3700, lockedAt: '2026-01-10T13:20:00Z', expiresAt: '2026-01-10T13:30:00Z', usedByRepaymentId: 'r4' },
];

export const mockVslaAggregates: VslaAggregate[] = [
  { id: 'va1', vslaId: 'v1', totalLoans: 48, activeLoans: 2, overdueLoans: 1, completedLoans: 45, totalOutstandingLocal: 1250000, totalDisbursedLocal: 4500000, lastUpdated: '2026-03-11T00:00:00Z' },
  { id: 'va2', vslaId: 'v2', totalLoans: 32, activeLoans: 1, overdueLoans: 0, completedLoans: 31, totalOutstandingLocal: 890000, totalDisbursedLocal: 3200000, lastUpdated: '2026-03-11T00:00:00Z' },
  { id: 'va3', vslaId: 'v3', totalLoans: 55, activeLoans: 1, overdueLoans: 0, completedLoans: 54, totalOutstandingLocal: 670000, totalDisbursedLocal: 5500000, lastUpdated: '2026-03-11T00:00:00Z' },
  { id: 'va4', vslaId: 'v4', totalLoans: 41, activeLoans: 0, overdueLoans: 1, completedLoans: 40, totalOutstandingLocal: 2100000, totalDisbursedLocal: 4100000, lastUpdated: '2026-03-11T00:00:00Z' },
  { id: 'va5', vslaId: 'v5', totalLoans: 28, activeLoans: 0, overdueLoans: 0, completedLoans: 28, totalOutstandingLocal: 1500000, totalDisbursedLocal: 2800000, lastUpdated: '2026-03-11T00:00:00Z' },
];

export const mockVslaHealthScores: VslaHealthScore[] = [
  { id: 'vh1', vslaId: 'v1', repaymentSuccessRate: 92, delinquencyRate: 4, avgDelayDays: 2.3, loanVolume: 48, repaymentSpeed: 95, finalScore: 87, evaluatedAt: '2026-03-11T00:00:00Z' },
  { id: 'vh2', vslaId: 'v2', repaymentSuccessRate: 85, delinquencyRate: 8, avgDelayDays: 5.1, loanVolume: 32, repaymentSpeed: 82, finalScore: 72, evaluatedAt: '2026-03-11T00:00:00Z' },
  { id: 'vh3', vslaId: 'v3', repaymentSuccessRate: 98, delinquencyRate: 1, avgDelayDays: 0.8, loanVolume: 55, repaymentSpeed: 99, finalScore: 94, evaluatedAt: '2026-03-11T00:00:00Z' },
  { id: 'vh4', vslaId: 'v4', repaymentSuccessRate: 75, delinquencyRate: 15, avgDelayDays: 8.5, loanVolume: 41, repaymentSpeed: 70, finalScore: 65, evaluatedAt: '2026-03-11T00:00:00Z' },
  { id: 'vh5', vslaId: 'v5', repaymentSuccessRate: 90, delinquencyRate: 5, avgDelayDays: 3.0, loanVolume: 28, repaymentSpeed: 88, finalScore: 81, evaluatedAt: '2026-03-11T00:00:00Z' },
];

export const mockAuditLog: AuditEntry[] = [
  { id: 'a1', action: 'LOAN_CREATED', entity: 'Loan', entityId: 'l1', userId: 'u3', userName: 'Amina Diallo', timestamp: '2025-08-15T10:30:00Z', after: 'Loan LN-RW-001 of FRw 150,000 for Claudine Uwase', performedBy: 'u3' },
  { id: 'a2', action: 'REPAYMENT_RECORDED', entity: 'Repayment', entityId: 'r1', userId: 'u4', userName: 'Emmanuel Uwimana', timestamp: '2026-01-15T14:20:00Z', after: 'FRw 27,500 payment recorded for loan LN-RW-001', performedBy: 'u4' },
  { id: 'a3', action: 'STATUS_CHANGED', entity: 'Loan', entityId: 'l2', userId: 'u3', userName: 'Amina Diallo', timestamp: '2026-02-02T09:00:00Z', before: 'ACTIVE', after: 'OVERDUE', performedBy: 'u3' },
  { id: 'a4', action: 'LOAN_COMPLETED', entity: 'Loan', entityId: 'l6', userId: 'u4', userName: 'Emmanuel Uwimana', timestamp: '2025-09-01T16:45:00Z', after: 'Loan LN-RW-005 fully repaid — balance 0', performedBy: 'u4' },
  { id: 'a5', action: 'MEMBER_ADDED', entity: 'Member', entityId: 'm8', userId: 'u3', userName: 'Amina Diallo', timestamp: '2025-11-20T11:00:00Z', after: 'Hassan Juma (MBR-008) added to Dar Unity Fund', performedBy: 'u3' },
  { id: 'a6', action: 'FX_RATE_FLAGGED', entity: 'Repayment', entityId: 'r4', userId: 'u1', userName: 'System', timestamp: '2026-01-10T13:30:00Z', after: 'FX variance 6.2% exceeds 5% threshold on UGX repayment', performedBy: 'u1' },
  { id: 'a7', action: 'ROLE_CHANGED', entity: 'User', entityId: 'u4', userId: 'u1', userName: 'Grace Nakamura', timestamp: '2025-02-15T08:00:00Z', before: 'vsla_manager', after: 'treasurer', performedBy: 'u1' },
  { id: 'a8', action: 'LOAN_CREATED', entity: 'Loan', entityId: 'l5', userId: 'u2', userName: 'Jean-Pierre Habimana', timestamp: '2025-06-01T11:00:00Z', after: 'Loan LN-UG-001 of USh 500,000 for Grace Ingabire', performedBy: 'u2' },
  { id: 'a9', action: 'BACKUP_CREATED', entity: 'System', entityId: 'backup-1', userId: 'u1', userName: 'Grace Nakamura', timestamp: '2026-03-10T18:00:00Z', after: 'Manual backup created — 2.4MB', performedBy: 'u1' },
  { id: 'a10', action: 'MEMBER_UPDATED', entity: 'Member', entityId: 'm1', userId: 'u3', userName: 'Amina Diallo', timestamp: '2026-02-20T10:00:00Z', before: 'phone: +250 788 000 000', after: 'phone: +250 788 123 456', performedBy: 'u3' },
];

export const mockRiskFlags: RiskFlag[] = [
  { id: 'rf1', type: 'fx_variance', description: 'FX variance of 6.2% on UGX transaction exceeds 5% threshold', severity: 'high', entityId: 'r4', entityType: 'Repayment', riskScore: 85, timestamp: '2026-01-10T13:30:00Z', resolved: false },
  { id: 'rf2', type: 'backdated_payment', description: 'Backdated repayment entry for Grace Ingabire — payment date 2026-01-10 entered later', severity: 'medium', entityId: 'r4', entityType: 'Repayment', riskScore: 60, timestamp: '2026-01-10T13:30:00Z', resolved: false },
  { id: 'rf3', type: 'quick_repay', description: 'Loan LN-RW-005 repaid in full within 6 months — unusually fast pattern', severity: 'low', entityId: 'l6', entityType: 'Loan', riskScore: 30, timestamp: '2025-09-01T16:45:00Z', resolved: true },
  { id: 'rf4', type: 'multiple_loans', description: 'Attempt to create second active loan for member MBR-001 blocked', severity: 'medium', entityId: 'm1', entityType: 'Member', riskScore: 55, timestamp: '2026-02-01T09:15:00Z', resolved: true },
];

export const mockBackupLogs: BackupLog[] = [
  { id: 'bk1', performedBy: 'u1', performedByName: 'Grace Nakamura', performedAt: '2026-03-10T18:00:00Z', fileSize: '2.4 MB', status: 'completed', fileName: 'vsla_backup_20260310.csv' },
  { id: 'bk2', performedBy: 'u1', performedByName: 'Grace Nakamura', performedAt: '2026-03-09T18:00:00Z', fileSize: '2.3 MB', status: 'completed', fileName: 'vsla_backup_20260309.csv' },
  { id: 'bk3', performedBy: 'u1', performedByName: 'Grace Nakamura', performedAt: '2026-03-08T18:00:00Z', fileSize: '2.3 MB', status: 'completed', fileName: 'vsla_backup_20260308.csv' },
];

export const mockUserVslaAssignments: UserVslaAssignment[] = [
  { id: 'uva1', userId: 'u3', vslaId: 'v1' },
  { id: 'uva2', userId: 'u3', vslaId: 'v2' },
  { id: 'uva3', userId: 'u3', vslaId: 'v3' },
  { id: 'uva4', userId: 'u4', vslaId: 'v1' },
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

// Utility: Get current FX rate for a currency
export function getCurrentFxRate(currencyCode: string): FxDailyRate | undefined {
  const today = new Date().toISOString().split('T')[0];
  return mockFxDailyRates.find(r => r.currencyCode === currencyCode && r.rateDate === today)
    || mockFxDailyRates.find(r => r.currencyCode === currencyCode);
}

// Utility: Check if member has an active loan
export function memberHasActiveLoan(memberId: string): boolean {
  return mockLoans.some(l => l.memberId === memberId && (l.status === 'ACTIVE' || l.status === 'OVERDUE' || l.status === 'NEW'));
}

// Utility: Generate CSV from data
export function generateCSV(headers: string[], rows: string[][]): string {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  return csvContent;
}

// Utility: Download CSV file
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
