import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { HealthScore } from '@/components/HealthScore';
import { mockLoans, mockVSLAs, formatCurrency } from '@/data/mockData';
import { CreditCard, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ManagerDashboard() {
  const assignedVslas = mockVSLAs.slice(0, 3); // Simulated
  const [selectedVsla, setSelectedVsla] = useState(assignedVslas[0]?.id || '');
  const navigate = useNavigate();

  const vslaLoans = mockLoans.filter(l => l.vslaId === selectedVsla);
  const active = vslaLoans.filter(l => l.status === 'ACTIVE').length;
  const overdue = vslaLoans.filter(l => l.status === 'OVERDUE').length;
  const completed = vslaLoans.filter(l => l.status === 'COMPLETED').length;
  const currentVsla = assignedVslas.find(v => v.id === selectedVsla);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Manager Dashboard</h1>
          <p className="page-subtitle">Your assigned VSLAs</p>
        </div>
        <Select value={selectedVsla} onValueChange={setSelectedVsla}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select VSLA" />
          </SelectTrigger>
          <SelectContent>
            {assignedVslas.map(v => (
              <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Loans" value={active} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Overdue" value={overdue} icon={<AlertTriangle className="h-5 w-5 text-destructive" />} />
        <StatCard title="Completed" value={completed} icon={<CheckCircle className="h-5 w-5 text-success" />} />
        <StatCard
          title="Health Score"
          value={currentVsla?.healthScore || 0}
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Loans</h2>
          <Button size="sm" onClick={() => navigate('/loans/create')}>
            + New Loan
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vslaLoans.length > 0 ? vslaLoans.map(loan => (
                <tr key={loan.id} className="hover:bg-muted/30 transition-colors">
                  <td className="font-medium text-foreground">{loan.memberName}</td>
                  <td>{formatCurrency(loan.principal, loan.currencySymbol)}</td>
                  <td>{formatCurrency(loan.remainingBalance, loan.currencySymbol)}</td>
                  <td><StatusBadge status={loan.status} /></td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/loans/${loan.id}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center text-muted-foreground py-8">No loans for this VSLA</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
