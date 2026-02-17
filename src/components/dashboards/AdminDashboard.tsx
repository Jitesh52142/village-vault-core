import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { HealthScore } from '@/components/HealthScore';
import { mockLoans, mockVSLAs, mockCountries, formatCurrency } from '@/data/mockData';
import { CreditCard, AlertTriangle, CheckCircle, TrendingUp, Download } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [countryFilter, setCountryFilter] = useState('all');

  const totalLoans = mockLoans.length;
  const outstanding = mockLoans.reduce((s, l) => s + l.remainingBalance, 0);
  const overdue = mockLoans.filter(l => l.status === 'OVERDUE').length;
  const completed = mockLoans.filter(l => l.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Admin Dashboard</h1>
          <p className="page-subtitle">Territory management and oversight</p>
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
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Loans" value={totalLoans} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Outstanding" value={`$${(outstanding / 1000).toFixed(0)}K`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Overdue Loans" value={overdue} icon={<AlertTriangle className="h-5 w-5 text-destructive" />} />
        <StatCard title="Completed" value={completed} icon={<CheckCircle className="h-5 w-5 text-success" />} />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">VSLA Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>VSLA</th>
                <th>Country</th>
                <th>Members</th>
                <th>Outstanding</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {mockVSLAs.map(v => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="font-medium text-foreground">{v.name}</td>
                  <td>{v.countryName}</td>
                  <td>{v.memberCount}</td>
                  <td>{formatCurrency(v.outstandingBalance, 'FRw')}</td>
                  <td><HealthScore score={v.healthScore} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
