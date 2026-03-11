import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';

// Map routes to required permissions
const routePermissions: Record<string, keyof ReturnType<typeof getPermissions>> = {
  '/map': 'canViewMap',
  '/audit': 'canViewAudit',
  '/reports': 'canViewReports',
  '/risk-flags': 'canViewRiskFlags',
  '/exports': 'canExport',
  '/backup': 'canTriggerBackup',
  '/bulk-import': 'canBulkImport',
  '/settings': 'canManageRoles',
};

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Check route-level permissions
  if (user) {
    const perms = getPermissions(user.role);
    const requiredPerm = routePermissions[location.pathname];
    if (requiredPerm && !perms[requiredPerm]) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Treasurer cannot access certain routes
    if (user.role === 'treasurer') {
      const treasurerAllowed = ['/dashboard', '/repayments', '/members', '/loans', '/loans/create'];
      const isLoanDetail = location.pathname.startsWith('/loans/');
      if (!treasurerAllowed.includes(location.pathname) && !isLoanDetail) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  return <>{children}</>;
}
