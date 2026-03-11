import { mockMembers, mockVSLAs, formatCurrency } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Phone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MembersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [vslaFilter, setVslaFilter] = useState('all');

  if (!user) return null;
  const perms = getPermissions(user.role);

  // Filter members based on role/assignments
  let members = (user.role === 'super_admin' || user.role === 'admin' || user.role === 'auditor')
    ? mockMembers
    : mockMembers.filter(m => user.assignedVslaIds.includes(m.vslaId));

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.vslaName.toLowerCase().includes(search.toLowerCase()) ||
      m.friendlyId.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);
    const matchVsla = vslaFilter === 'all' || m.vslaId === vslaFilter;
    return matchSearch && matchVsla;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Members</h1>
          <p className="page-subtitle">All registered VSLA members ({filtered.length} results)</p>
        </div>
        {perms.canCreateMember && (
          <Button onClick={() => toast.info('Member creation form coming soon')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, ID, or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
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
                <th>ID</th>
                <th>Name</th>
                <th>VSLA</th>
                <th>Phone</th>
                <th>Active Loan</th>
                <th>Total Borrowed</th>
                <th>Total Repaid</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(m => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="text-xs font-mono text-muted-foreground">{m.friendlyId}</td>
                  <td className="font-medium text-foreground">{m.name}</td>
                  <td>{m.vslaName}</td>
                  <td className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {m.phone}
                  </td>
                  <td>
                    {m.hasActiveLoan ? (
                      <span className="status-badge status-active">Yes</span>
                    ) : (
                      <span className="status-badge bg-muted text-muted-foreground">No</span>
                    )}
                  </td>
                  <td>{formatCurrency(m.totalBorrowed, m.currencySymbol)}</td>
                  <td>{formatCurrency(m.totalRepaid, m.currencySymbol)}</td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="text-center text-muted-foreground py-8">No members found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
