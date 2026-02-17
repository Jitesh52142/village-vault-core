import { StatCard } from '@/components/StatCard';
import { HealthScore } from '@/components/HealthScore';
import { StatusBadge } from '@/components/StatusBadge';
import { mockLoans, mockVSLAs, mockCountries, mockRiskFlags, formatCurrency } from '@/data/mockData';
import { CreditCard, AlertTriangle, CheckCircle, TrendingUp, Globe, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [countryFilter, setCountryFilter] = useState('all');

  const totalLoans = mockLoans.length;
  const outstanding = mockLoans.reduce((s, l) => s + l.remainingBalance, 0);
  const overdue = mockLoans.filter(l => l.status === 'OVERDUE').length;
  const completed = mockLoans.filter(l => l.status === 'COMPLETED').length;
  const avgHealth = Math.round(mockVSLAs.reduce((s, v) => s + v.healthScore, 0) / mockVSLAs.length);
  const unresolvedFlags = mockRiskFlags.filter(f => !f.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">System Overview</h1>
          <p className="page-subtitle">Multi-country loan performance dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {mockCountries.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Loans" value={totalLoans} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Outstanding" value={`$${(outstanding / 1000).toFixed(0)}K`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Overdue" value={overdue} icon={<AlertTriangle className="h-5 w-5 text-destructive" />} />
        <StatCard title="Completed" value={completed} icon={<CheckCircle className="h-5 w-5 text-success" />} />
        <StatCard title="Avg Health" value={avgHealth} icon={<Globe className="h-5 w-5" />} />
        <StatCard title="Risk Flags" value={unresolvedFlags} icon={<ShieldAlert className="h-5 w-5 text-warning" />} />
      </div>

      {/* Province Performance */}
      <div className="bg-card rounded-xl border border-border shadow-sm animate-fade-in">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">VSLA Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>VSLA</th>
                <th>Country</th>
                <th>Province</th>
                <th>Members</th>
                <th>Loans</th>
                <th>Outstanding</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {mockVSLAs.map(v => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="font-medium text-foreground">{v.name}</td>
                  <td>{v.countryName}</td>
                  <td>{v.provinceName}</td>
                  <td>{v.memberCount}</td>
                  <td>{v.totalLoans}</td>
                  <td>{formatCurrency(v.outstandingBalance, 'FRw')}</td>
                  <td><HealthScore score={v.healthScore} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Flags */}
      {unresolvedFlags > 0 && (
        <div className="bg-card rounded-xl border border-destructive/20 shadow-sm animate-fade-in">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <h2 className="text-base font-semibold text-foreground">Active Risk Flags</h2>
          </div>
          <div className="p-5 space-y-3">
            {mockRiskFlags.filter(f => !f.resolved).map(flag => (
              <div key={flag.id} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  flag.severity === 'high' ? 'text-destructive' : flag.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{flag.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {flag.type.replace('_', ' ')} · {new Date(flag.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Loans */}
      <div className="bg-card rounded-xl border border-border shadow-sm animate-fade-in">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Recent Loans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>VSLA</th>
                <th>Amount</th>
                <th>Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLoans.map(loan => (
                <tr key={loan.id} className="hover:bg-muted/30 transition-colors">
                  <td className="font-medium text-foreground">{loan.memberName}</td>
                  <td>{loan.vslaName}</td>
                  <td>{formatCurrency(loan.principal, loan.currencySymbol)}</td>
                  <td>{formatCurrency(loan.remainingBalance, loan.currencySymbol)}</td>
                  <td><StatusBadge status={loan.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
