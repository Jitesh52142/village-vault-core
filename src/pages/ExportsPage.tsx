import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportsPage() {
  const handleExport = (type: string) => {
    toast.success(`${type} export started. File will download shortly.`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-header">Data Export</h1>
        <p className="page-subtitle">Export filtered data as CSV</p>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Loans Report', desc: 'All loans with status, amounts, and member details', type: 'loans' },
          { title: 'Repayments Report', desc: 'Complete repayment history with FX data', type: 'repayments' },
          { title: 'Members Report', desc: 'All member records across VSLAs', type: 'members' },
          { title: 'VSLA Summary', desc: 'Health scores and aggregated metrics per VSLA', type: 'vsla' },
          { title: 'Audit Trail', desc: 'Full audit log for compliance', type: 'audit' },
        ].map(item => (
          <div key={item.type} className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleExport(item.title)}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
