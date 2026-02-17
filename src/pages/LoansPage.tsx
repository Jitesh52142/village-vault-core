import { mockLoans, formatCurrency } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';

export default function LoansPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  if (!user) return null;
  const perms = getPermissions(user.role);

  const filtered = mockLoans.filter(l =>
    l.memberName.toLowerCase().includes(search.toLowerCase()) ||
    l.vslaName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Loans</h1>
          <p className="page-subtitle">Manage and track all loans</p>
        </div>
        {perms.canCreateLoan && (
          <Button onClick={() => navigate('/loans/create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Loan
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search loans..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>VSLA</th>
                <th>Principal</th>
                <th>Total Due</th>
                <th>Remaining</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(loan => (
                <tr key={loan.id} className="hover:bg-muted/30 transition-colors">
                  <td className="font-medium text-foreground">{loan.memberName}</td>
                  <td>{loan.vslaName}</td>
                  <td>{formatCurrency(loan.principal, loan.currencySymbol)}</td>
                  <td>{formatCurrency(loan.totalDue, loan.currencySymbol)}</td>
                  <td>{formatCurrency(loan.remainingBalance, loan.currencySymbol)}</td>
                  <td className="capitalize">{loan.frequency}</td>
                  <td><StatusBadge status={loan.status} /></td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/loans/${loan.id}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
