import { LoanStatus } from '@/types';

interface StatusBadgeProps {
  status: LoanStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const classMap: Record<LoanStatus, string> = {
    NEW: 'status-badge status-new',
    ACTIVE: 'status-badge status-active',
    OVERDUE: 'status-badge status-overdue',
    COMPLETED: 'status-badge status-completed',
    WRITTEN_OFF: 'status-badge status-written-off',
  };

  return <span className={classMap[status]}>{status}</span>;
}
