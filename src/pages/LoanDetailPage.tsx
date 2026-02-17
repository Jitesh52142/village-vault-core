import { useParams, useNavigate } from 'react-router-dom';
import { mockLoans, mockRepayments, formatCurrency } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Receipt } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';

export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const loan = mockLoans.find(l => l.id === id);
  if (!loan) return <div className="text-center py-20 text-muted-foreground">Loan not found</div>;

  const repayments = mockRepayments.filter(r => r.loanId === id);
  const perms = user ? getPermissions(user.role) : null;
  const progressPct = Math.round((loan.amountPaid / loan.totalDue) * 100);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="page-header">{loan.memberName}</h1>
          <p className="page-subtitle">{loan.vslaName}</p>
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
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Due</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(loan.totalDue, loan.currencySymbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Remaining</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(loan.remainingBalance, loan.currencySymbol)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Interest Rate</p>
            <p className="text-lg font-semibold text-foreground mt-1">{loan.interestRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
            <p className="text-lg font-semibold text-foreground mt-1">{loan.durationMonths} months</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Frequency</p>
            <p className="text-lg font-semibold text-foreground mt-1 capitalize">{loan.frequency}</p>
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

        {perms?.canRecordRepayment && loan.status !== 'COMPLETED' && (
          <Button className="mt-5" onClick={() => navigate('/repayments')}>
            <Receipt className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        )}
      </div>

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
                      {r.flagged && <span className="status-badge status-overdue">FX Flag</span>}
                      {r.isBackdated && <span className="status-badge status-new ml-1">Backdated</span>}
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
