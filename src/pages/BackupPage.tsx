import { Button } from '@/components/ui/button';
import { Database, Download, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function BackupPage() {
  const [lastBackup, setLastBackup] = useState('2026-02-16 18:00 UTC');

  const handleBackup = () => {
    setLastBackup(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    toast.success('Backup completed successfully!');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-header">System Backup</h1>
        <p className="page-subtitle">Manual backup and data download</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Last Backup</p>
            <p className="text-sm text-muted-foreground">{lastBackup}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleBackup} className="w-full py-6 text-lg">
            <Database className="h-5 w-5 mr-3" />
            Create Manual Backup
          </Button>
          <Button variant="outline" className="w-full" onClick={() => toast.success('Downloading backup file...')}>
            <Download className="h-4 w-4 mr-2" />
            Download Latest Backup (CSV)
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-info/5 border border-info/10 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Automatic Backups</p>
          <p>Cloud backups run in parallel every 24 hours. Manual backups create additional snapshots that you can download.</p>
        </div>
      </div>
    </div>
  );
}
