import type { UserRole } from '@/types';

export interface Permission {
  // Data access
  canViewAllCountries: boolean;
  canViewAllVslas: boolean;

  // Loan operations
  canCreateLoan: boolean;
  canEditLoan: boolean;
  canEditLoanFinancials: boolean;  // Only super_admin
  canDeleteRecord: boolean;

  // Repayments
  canRecordRepayment: boolean;

  // Members
  canCreateMember: boolean;
  canEditMember: boolean;

  // Administration
  canManageRoles: boolean;
  canManageAssignments: boolean;

  // Views
  canViewMap: boolean;
  canViewAudit: boolean;
  canViewReports: boolean;
  canViewRiskFlags: boolean;

  // VSLA Management
  canManageVslas: boolean;

  // System
  canExport: boolean;
  canTriggerBackup: boolean;
  canBulkImport: boolean;

  // Security
  canModifyAuditLogs: boolean;
  canSelfPromote: boolean; // Always false
}

const permissionsByRole: Record<UserRole, Permission> = {
  super_admin: {
    canViewAllCountries: true,
    canViewAllVslas: true,
    canCreateLoan: true,
    canEditLoan: true,
    canEditLoanFinancials: true,
    canDeleteRecord: true,
    canRecordRepayment: true,
    canCreateMember: true,
    canEditMember: true,
    canManageRoles: true,
    canManageAssignments: true,
    canViewMap: true,
    canViewAudit: true,
    canViewReports: true,
    canViewRiskFlags: true,
    canExport: true,
    canTriggerBackup: true,
    canBulkImport: true,
    canModifyAuditLogs: true,
    canSelfPromote: false,
  },
  admin: {
    canViewAllCountries: true,
    canViewAllVslas: true,
    canCreateLoan: false,
    canEditLoan: false,
    canEditLoanFinancials: false,  // Cannot modify loan financial data
    canDeleteRecord: false,
    canRecordRepayment: false,
    canCreateMember: false,
    canEditMember: false,
    canManageRoles: true,
    canManageAssignments: false,
    canViewMap: true,
    canViewAudit: true,
    canViewReports: true,
    canViewRiskFlags: true,
    canExport: true,
    canTriggerBackup: false,
    canBulkImport: true,
    canModifyAuditLogs: false,
    canSelfPromote: false,
  },
  vsla_manager: {
    canViewAllCountries: false,
    canViewAllVslas: false,
    canCreateLoan: true,
    canEditLoan: true,
    canEditLoanFinancials: false,
    canDeleteRecord: false,
    canRecordRepayment: false,
    canCreateMember: true,
    canEditMember: true,
    canManageRoles: false,
    canManageAssignments: false,
    canViewMap: true,
    canViewAudit: false,
    canViewReports: true,
    canViewRiskFlags: true,
    canExport: false,
    canTriggerBackup: false,
    canBulkImport: false,
    canModifyAuditLogs: false,
    canSelfPromote: false,
  },
  treasurer: {
    canViewAllCountries: false,
    canViewAllVslas: false,
    canCreateLoan: true,
    canEditLoan: false,
    canEditLoanFinancials: false,
    canDeleteRecord: false,
    canRecordRepayment: true,  // INSERT only — immutable
    canCreateMember: false,
    canEditMember: false,
    canManageRoles: false,
    canManageAssignments: false,
    canViewMap: false,
    canViewAudit: false,
    canViewReports: false,
    canViewRiskFlags: false,
    canExport: false,
    canTriggerBackup: false,
    canBulkImport: false,
    canModifyAuditLogs: false,
    canSelfPromote: false,
  },
  auditor: {
    canViewAllCountries: true,
    canViewAllVslas: true,
    canCreateLoan: false,
    canEditLoan: false,
    canEditLoanFinancials: false,
    canDeleteRecord: false,
    canRecordRepayment: false,
    canCreateMember: false,
    canEditMember: false,
    canManageRoles: false,
    canManageAssignments: false,
    canViewMap: true,
    canViewAudit: true,
    canViewReports: true,
    canViewRiskFlags: true,
    canExport: true,
    canTriggerBackup: false,
    canBulkImport: false,
    canModifyAuditLogs: false,
    canSelfPromote: false,
  },
};

export function getPermissions(role: UserRole): Permission {
  return permissionsByRole[role];
}

// Validate loan status transition
export function canTransitionLoanStatus(from: string, to: string): boolean {
  const { VALID_LOAN_TRANSITIONS } = require('@/types');
  const allowed = VALID_LOAN_TRANSITIONS[from as keyof typeof VALID_LOAN_TRANSITIONS];
  return allowed ? allowed.includes(to) : false;
}
