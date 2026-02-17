import { useNavigate } from 'react-router-dom';
import { Receipt, Users, CreditCard } from 'lucide-react';
import { mockMembers, mockLoans, formatCurrency } from '@/data/mockData';

export default function TreasurerDashboard() {
  const navigate = useNavigate();

  // Simulated data for assigned VSLA
  const vslaMembers = mockMembers.filter(m => m.vslaId === 'v1');
  const activeLoans = mockLoans.filter(l => l.vslaId === 'v1' && (l.status === 'ACTIVE' || l.status === 'OVERDUE'));

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <h1 className="page-header">Umoja Women Group</h1>
        <p className="page-subtitle">Treasurer Dashboard</p>
      </div>

      {/* Big Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/repayments')}
          className="treasurer-btn bg-primary text-primary-foreground flex items-center justify-center gap-4 hover:opacity-90"
        >
          <Receipt className="h-8 w-8" />
          Collect Payment
        </button>
        <button
          onClick={() => navigate('/members')}
          className="treasurer-btn bg-secondary text-secondary-foreground flex items-center justify-center gap-4 hover:opacity-90"
        >
          <Users className="h-8 w-8" />
          View Members
        </button>
        <button
          onClick={() => navigate('/loans/create')}
          className="treasurer-btn bg-card text-foreground border border-border flex items-center justify-center gap-4 hover:bg-muted"
        >
          <CreditCard className="h-8 w-8" />
          New Loan
        </button>
      </div>

      {/* Quick Summary */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-3">Active Loans</h2>
        <div className="space-y-3">
          {activeLoans.map(loan => (
            <div
              key={loan.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate(`/loans/${loan.id}`)}
            >
              <div>
                <p className="font-medium text-foreground">{loan.memberName}</p>
                <p className="text-xs text-muted-foreground">
                  Balance: {formatCurrency(loan.remainingBalance, loan.currencySymbol)}
                </p>
              </div>
              <span className={`status-badge ${loan.status === 'OVERDUE' ? 'status-overdue' : 'status-active'}`}>
                {loan.status}
              </span>
            </div>
          ))}
          {activeLoans.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No active loans</p>
          )}
        </div>
      </div>
    </div>
  );
}
