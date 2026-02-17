import { mockMembers, formatCurrency } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Search, Phone } from 'lucide-react';
import { useState } from 'react';

export default function MembersPage() {
  const [search, setSearch] = useState('');

  const filtered = mockMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.vslaName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Members</h1>
        <p className="page-subtitle">All registered VSLA members</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>VSLA</th>
                <th>Phone</th>
                <th>Active Loan</th>
                <th>Total Borrowed</th>
                <th>Total Repaid</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
