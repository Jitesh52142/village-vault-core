import { Button } from '@/components/ui/button';
import { Database, Download, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { mockBackupLogs, generateCSV, downloadCSV, mockLoans, mockMembers, mockRepayments } from '@/data/mockData';

export default function BackupPage() {
  const [lastBackup, setLastBackup] = useState(mockBackupLogs[0]?.performedAt || '');
  const [showReminder, setShowReminder] = useState(false);

  // 24-hour backup reminder check
  useEffect(() => {
    if (lastBackup) {
      const lastBackupTime = new Date(lastBackup).getTime();
      const now = Date.now();
      const hoursSince = (now - lastBackupTime) / (1000 * 60 * 60);
      if (hoursSince >= 24) {
        setShowReminder(true);
      }
    } else {
      setShowReminder(true);
    }
  }, [lastBackup]);

  const handleBackup = () => {
    const timestamp = new Date().toISOString();
    setLastBackup(timestamp);
    setShowReminder(false);

    // Generate actual backup CSV
    const headers = ['Table', 'Record Count', 'Backup Timestamp'];
    const rows = [
      ['Loans', String(mockLoans.length), timestamp],
      ['Members', String(mockMembers.length), timestamp],
      ['Repayments', String(mockRepayments.length), timestamp],
    ];
    downloadCSV('vsla_manual_backup', generateCSV(headers, rows));

    toast.success('Backup completed and file downloaded!');
  };

  const handleDownloadLatest = () => {
    const headers = ['Loan ID', 'Member', 'Principal', 'Status', 'Remaining'];
    const rows = mockLoans.map(l => [l.friendlyId, l.memberName, String(l.principal), l.status, String(l.remainingBalance)]);
    downloadCSV('vsla_latest_backup', generateCSV(headers, rows));
    toast.success('Latest backup downloaded');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-header">System Backup</h1>
        <p className="page-subtitle">Manual backup and data download — Super Admin only</p>
      </div>

      {/* 24-hour reminder */}
      {showReminder && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-[hsl(var(--warning))] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground text-sm">Backup Reminder</p>
            <p className="text-sm text-muted-foreground">It has been more than 24 hours since the last backup. Please create a manual backup now.</p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Last Backup</p>
            <p className="text-sm text-muted-foreground">
              {lastBackup ? new Date(lastBackup).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleBackup} className="w-full py-6 text-lg">
            <Database className="h-5 w-5 mr-3" />
            Create Manual Backup (Overwrites Previous)
          </Button>
          <Button variant="outline" className="w-full" onClick={handleDownloadLatest}>
            <Download className="h-4 w-4 mr-2" />
            Download Latest Backup (CSV)
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-[hsl(var(--info))]/5 border border-[hsl(var(--info))]/10 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Automatic Cloud Backups</p>
          <p>Cloud backups run in parallel every 24 hours. Manual backups create additional snapshots that overwrite the previous file.</p>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Backup History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Performed By</th>
                <th>File</th>
                <th>Size</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockBackupLogs.map(log => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="text-sm">{new Date(log.performedAt).toLocaleString()}</td>
                  <td className="font-medium text-foreground">{log.performedByName}</td>
                  <td className="text-xs font-mono text-muted-foreground">{log.fileName}</td>
                  <td>{log.fileSize}</td>
                  <td>
                    <span className="status-badge status-completed">{log.status}</span>
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
