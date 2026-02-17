import { StatCard } from '@/components/StatCard';
import { mockLoans, mockAuditLog, mockVSLAs } from '@/data/mockData';
import { CreditCard, AlertTriangle, CheckCircle, ClipboardList, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuditorDashboard() {
  const totalLoans = mockLoans.length;
  const overdue = mockLoans.filter(l => l.status === 'OVERDUE').length;
  const completed = mockLoans.filter(l => l.status === 'COMPLETED').length;
  const avgHealth = Math.round(mockVSLAs.reduce((s, v) => s + v.healthScore, 0) / mockVSLAs.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Auditor Dashboard</h1>
          <p className="page-subtitle">Read-only system overview</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Loans" value={totalLoans} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Overdue" value={overdue} icon={<AlertTriangle className="h-5 w-5 text-destructive" />} />
        <StatCard title="Completed" value={completed} icon={<CheckCircle className="h-5 w-5 text-success" />} />
        <StatCard title="Avg Health" value={avgHealth} icon={<ClipboardList className="h-5 w-5" />} />
      </div>

      {/* Recent Audit Entries */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Recent Audit Trail</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity</th>
                <th>User</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLog.map(entry => (
                <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                  <td>
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground">
                      {entry.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{entry.entity}</td>
                  <td className="font-medium text-foreground">{entry.userName}</td>
                  <td className="text-muted-foreground">{new Date(entry.timestamp).toLocaleDateString()}</td>
                  <td className="text-sm text-muted-foreground max-w-xs truncate">{entry.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
