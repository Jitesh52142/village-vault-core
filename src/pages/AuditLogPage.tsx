import { mockAuditLog } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Shield } from 'lucide-react';
import { useState } from 'react';

const ACTION_TYPES = [...new Set(mockAuditLog.map(e => e.action))];

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = mockAuditLog.filter(e => {
    const matchSearch =
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.userName.toLowerCase().includes(search.toLowerCase()) ||
      (e.after || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.before || '').toLowerCase().includes(search.toLowerCase()) ||
      e.entity.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || e.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="page-header">Audit Log</h1>
          <p className="page-subtitle">Immutable, append-only record of all system changes ({filtered.length} entries)</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search audit log..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {ACTION_TYPES.map(a => (
              <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Immutability notice */}
      <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground flex items-center gap-2">
        <Shield className="h-4 w-4 flex-shrink-0" />
        <span>This log is append-only. Records cannot be modified or deleted. Even Super Admin edits create new audit entries.</span>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Performed By</th>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                  <td className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground">
                      {entry.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{entry.entity} #{entry.entityId}</td>
                  <td className="font-medium text-foreground">{entry.userName}</td>
                  <td className="text-sm text-muted-foreground max-w-[150px] truncate">{entry.before || '—'}</td>
                  <td className="text-sm text-muted-foreground max-w-xs truncate">{entry.after || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
