import { useParams, useNavigate } from 'react-router-dom';
import { mockLoans, mockRepayments, mockRepaymentSchedules, formatCurrency } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Receipt, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';
import { VALID_LOAN_TRANSITIONS, LOAN_STATUS_LABELS } from '@/types';
import type { LoanStatus } from '@/types';
import { toast } from 'sonner';

export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const loan = mockLoans.find(l => l.id === id);
  if (!loan) return <div className="text-center py-20 text-muted-foreground">Loan not found</div>;

  const repayments = mockRepayments.filter(r => r.loanId === id);
  const schedule = mockRepaymentSchedules.filter(s => s.loanId === id);
  const perms = user ? getPermissions(user.role) : null;
  const progressPct = Math.round((loan.amountPaid / loan.totalDue) * 100);
  const allowedTransitions = VALID_LOAN_TRANSITIONS[loan.status] || [];

  const handleStatusChange = (newStatus: LoanStatus) => {
    toast.success(`Loan status changed from ${loan.status} to ${newStatus}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="page-header">{loan.memberName}</h1>
          <p className="page-subtitle">{loan.vslaName} · {loan.friendlyId}</p>
        </div>
        <StatusBadge status={loan.status} />
      </div>

      {/* Loan Details */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Principal</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(loan.principal, loan.currencySymbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Interest ({loan.interestRate}%)</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(loan.interestAmount, loan.currencySymbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Due</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(loan.totalDue, loan.currencySymbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Remaining</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(loan.remainingBalance, loan.currencySymbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
            <p className="text-lg font-semibold text-foreground mt-1">{loan.durationMonths} months ({loan.frequency})</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">USD Equivalent</p>
            <p className="text-lg font-semibold text-foreground mt-1">${loan.usdEquivalent}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Created</p>
            <p className="text-sm font-medium text-foreground mt-1">{new Date(loan.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Expected Completion</p>
            <p className="text-sm font-medium text-foreground mt-1">{new Date(loan.expectedCompletionDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Repayment Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap gap-3">
          {perms?.canRecordRepayment && loan.status !== 'COMPLETED' && loan.status !== 'WRITTEN_OFF' && (
            <Button onClick={() => navigate('/repayments')}>
              <Receipt className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          )}

          {/* Status Transition Buttons */}
          {perms?.canEditLoan && allowedTransitions.length > 0 && (
            <>
              {allowedTransitions.map(status => (
                <Button key={status} variant="outline" size="sm" onClick={() => handleStatusChange(status)}>
                  Mark as {LOAN_STATUS_LABELS[status]}
                </Button>
              ))}
            </>
          )}
        </div>

        {/* Invalid transitions info */}
        {loan.status === 'COMPLETED' && (
          <div className="mt-3 p-3 rounded-lg bg-[hsl(var(--success))]/5 border border-[hsl(var(--success))]/20 text-sm text-muted-foreground">
            ✅ This loan is fully repaid. No further status changes allowed.
          </div>
        )}
        {loan.status === 'WRITTEN_OFF' && (
          <div className="mt-3 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
            This loan has been written off. No further status changes allowed.
          </div>
        )}
      </div>

      {/* Repayment Schedule */}
      {schedule.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Repayment Schedule</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Due Date</th>
                  <th>Scheduled</th>
                  <th>Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(s => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td>{s.installmentNumber}</td>
                    <td>{new Date(s.dueDate).toLocaleDateString()}</td>
                    <td>{formatCurrency(s.scheduledAmount, loan.currencySymbol)}</td>
                    <td className="font-medium text-foreground">{formatCurrency(s.paidAmount, loan.currencySymbol)}</td>
                    <td>
                      {s.isPaid ? (
                        <span className="status-badge status-completed">Paid</span>
                      ) : s.paidAmount > 0 ? (
                        <span className="status-badge status-active">Partial</span>
                      ) : new Date(s.dueDate) < new Date() ? (
                        <span className="status-badge status-overdue">Overdue</span>
                      ) : (
                        <span className="status-badge status-new">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Repayment History */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Repayment History</h2>
        </div>
        {repayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>USD Equiv.</th>
                  <th>FX Rate</th>
                  <th>FX Variance</th>
                  <th>Flags</th>
                </tr>
              </thead>
              <tbody>
                {repayments.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td className="font-medium text-foreground">{formatCurrency(r.amount, loan.currencySymbol)}</td>
                    <td>${r.usdEquivalent.toFixed(2)}</td>
                    <td>{r.fxRate.toLocaleString()}</td>
                    <td>
                      <span className={r.fxVariance > 5 ? 'text-destructive font-medium' : ''}>
                        {r.fxVariance}%
                      </span>
                    </td>
                    <td className="flex gap-1">
                      {r.flagged && <span className="status-badge status-overdue">FX Flag</span>}
                      {r.isBackdated && <span className="status-badge status-new">Backdated</span>}
                      {!r.flagged && !r.isBackdated && <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-5 text-center text-muted-foreground">No repayments recorded yet</p>
        )}
      </div>
    </div>
  );
}
