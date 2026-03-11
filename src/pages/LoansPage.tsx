import { mockLoans, mockMembers, mockVSLAs, formatCurrency, generateCSV, downloadCSV } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter } from 'lucide-react';
import { useState } from 'react';
import type { LoanStatus } from '@/types';

export default function LoansPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vslaFilter, setVslaFilter] = useState<string>('all');

  if (!user) return null;
  const perms = getPermissions(user.role);

  // Filter loans based on role/assignments
  let loans = user.role === 'super_admin' || user.role === 'admin' || user.role === 'auditor'
    ? mockLoans
    : mockLoans.filter(l => user.assignedVslaIds.includes(l.vslaId));

  // Apply filters
  const filtered = loans.filter(l => {
    const matchSearch = l.memberName.toLowerCase().includes(search.toLowerCase()) ||
      l.vslaName.toLowerCase().includes(search.toLowerCase()) ||
      l.friendlyId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchVsla = vslaFilter === 'all' || l.vslaId === vslaFilter;
    return matchSearch && matchStatus && matchVsla;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Loans</h1>
          <p className="page-subtitle">Manage and track all loans ({filtered.length} results)</p>
        </div>
        {perms.canCreateLoan && (
          <Button onClick={() => navigate('/loans/create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Loan
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by member, VSLA, or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="WRITTEN_OFF">Written Off</SelectItem>
          </SelectContent>
        </Select>
        <Select value={vslaFilter} onValueChange={setVslaFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="VSLA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All VSLAs</SelectItem>
            {mockVSLAs.map(v => (
              <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan ID</th>
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
              {filtered.length > 0 ? filtered.map(loan => (
                <tr key={loan.id} className="hover:bg-muted/30 transition-colors">
                  <td className="text-xs font-mono text-muted-foreground">{loan.friendlyId}</td>
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
              )) : (
                <tr><td colSpan={9} className="text-center text-muted-foreground py-8">No loans found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
