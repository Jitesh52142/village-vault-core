import { mockAuditLog } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function AuditLogPage() {
  const [search, setSearch] = useState('');

  const filtered = mockAuditLog.filter(e =>
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.userName.toLowerCase().includes(search.toLowerCase()) ||
    (e.after || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Audit Log</h1>
        <p className="page-subtitle">Immutable record of all system changes</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search audit log..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Entity</th>
                <th>User</th>
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
                  <td className="text-sm text-muted-foreground">{entry.before || '—'}</td>
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
