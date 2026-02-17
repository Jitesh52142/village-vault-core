import type { UserRole } from '@/types';

export interface Permission {
  canCreateLoan: boolean;
  canEditLoan: boolean;
  canDeleteRecord: boolean;
  canManageRoles: boolean;
  canExport: boolean;
  canViewMap: boolean;
  canViewAudit: boolean;
  canTriggerBackup: boolean;
  canViewAllCountries: boolean;
  canViewReports: boolean;
  canRecordRepayment: boolean;
  canBulkImport: boolean;
  canViewRiskFlags: boolean;
}

const permissionsByRole: Record<UserRole, Permission> = {
  super_admin: {
    canCreateLoan: true, canEditLoan: true, canDeleteRecord: true, canManageRoles: true,
    canExport: true, canViewMap: true, canViewAudit: true, canTriggerBackup: true,
    canViewAllCountries: true, canViewReports: true, canRecordRepayment: true,
    canBulkImport: true, canViewRiskFlags: true,
  },
  admin: {
    canCreateLoan: false, canEditLoan: false, canDeleteRecord: false, canManageRoles: true,
    canExport: true, canViewMap: true, canViewAudit: true, canTriggerBackup: false,
    canViewAllCountries: true, canViewReports: true, canRecordRepayment: false,
    canBulkImport: true, canViewRiskFlags: true,
  },
  vsla_manager: {
    canCreateLoan: true, canEditLoan: false, canDeleteRecord: false, canManageRoles: false,
    canExport: false, canViewMap: true, canViewAudit: false, canTriggerBackup: false,
    canViewAllCountries: false, canViewReports: true, canRecordRepayment: false,
    canBulkImport: false, canViewRiskFlags: false,
  },
  treasurer: {
    canCreateLoan: true, canEditLoan: false, canDeleteRecord: false, canManageRoles: false,
    canExport: false, canViewMap: false, canViewAudit: false, canTriggerBackup: false,
    canViewAllCountries: false, canViewReports: false, canRecordRepayment: true,
    canBulkImport: false, canViewRiskFlags: false,
  },
  auditor: {
    canCreateLoan: false, canEditLoan: false, canDeleteRecord: false, canManageRoles: false,
    canExport: true, canViewMap: true, canViewAudit: true, canTriggerBackup: false,
    canViewAllCountries: true, canViewReports: true, canRecordRepayment: false,
    canBulkImport: false, canViewRiskFlags: true,
  },
};

export function getPermissions(role: UserRole): Permission {
  return permissionsByRole[role];
}
