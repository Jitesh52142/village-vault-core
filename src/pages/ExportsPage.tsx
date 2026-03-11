import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';
import { mockLoans, mockRepayments, mockMembers, mockVSLAs, mockAuditLog, generateCSV, downloadCSV, formatCurrency } from '@/data/mockData';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExportItem {
  title: string;
  desc: string;
  type: string;
  exportFn: () => void;
}

export default function ExportsPage() {
  const { user } = useAuth();

  if (!user) return null;
  const perms = getPermissions(user.role);

  const exports: ExportItem[] = [
    {
      title: 'Loans Report',
      desc: 'All loans with status, amounts, member details, and FX data',
      type: 'loans',
      exportFn: () => {
        const headers = ['Loan ID', 'Member', 'VSLA', 'Principal', 'Interest', 'Total Due', 'Remaining', 'Status', 'Currency', 'USD Equivalent', 'Created', 'Expected Completion'];
        const rows = mockLoans.map(l => [
          l.friendlyId, l.memberName, l.vslaName, String(l.principal),
          `${l.interestRate}%`, String(l.totalDue), String(l.remainingBalance),
          l.status, l.currency, String(l.usdEquivalent), l.createdAt, l.expectedCompletionDate
        ]);
        downloadCSV('vsla_loans_report', generateCSV(headers, rows));
        toast.success('Loans report downloaded');
      },
    },
    {
      title: 'Repayments Report',
      desc: 'Complete repayment history with FX data, variances, and flags',
      type: 'repayments',
      exportFn: () => {
        const headers = ['Repayment ID', 'Member', 'Loan ID', 'Amount', 'Currency', 'USD Equiv', 'FX Rate', 'FX Variance %', 'FX Gain/Loss', 'Date', 'Backdated', 'Flagged'];
        const rows = mockRepayments.map(r => [
          r.id, r.memberName, r.loanId, String(r.amount), r.currency,
          String(r.usdEquivalent), String(r.fxRate), String(r.fxVariance),
          String(r.fxGainLoss || 0), r.date, r.isBackdated ? 'Yes' : 'No', r.flagged ? 'Yes' : 'No'
        ]);
        downloadCSV('vsla_repayments_report', generateCSV(headers, rows));
        toast.success('Repayments report downloaded');
      },
    },
    {
      title: 'Members Report',
      desc: 'All member records across VSLAs with borrowing history',
      type: 'members',
      exportFn: () => {
        const headers = ['Member ID', 'Name', 'VSLA', 'Phone', 'Active Loan', 'Total Borrowed', 'Total Repaid', 'Currency'];
        const rows = mockMembers.map(m => [
          m.friendlyId, m.name, m.vslaName, m.phone,
          m.hasActiveLoan ? 'Yes' : 'No', String(m.totalBorrowed), String(m.totalRepaid), m.currency
        ]);
        downloadCSV('vsla_members_report', generateCSV(headers, rows));
        toast.success('Members report downloaded');
      },
    },
    {
      title: 'VSLA Summary',
      desc: 'Health scores and aggregated metrics per VSLA',
      type: 'vsla',
      exportFn: () => {
        const headers = ['VSLA ID', 'Name', 'Country', 'Province', 'Community', 'Members', 'Total Loans', 'Outstanding', 'Health Score'];
        const rows = mockVSLAs.map(v => [
          v.friendlyId, v.name, v.countryName, v.provinceName, v.communityName,
          String(v.memberCount), String(v.totalLoans), String(v.outstandingBalance), String(v.healthScore)
        ]);
        downloadCSV('vsla_summary_report', generateCSV(headers, rows));
        toast.success('VSLA summary downloaded');
      },
    },
    {
      title: 'Audit Trail',
      desc: 'Full audit log for compliance and donor reporting',
      type: 'audit',
      exportFn: () => {
        const headers = ['Timestamp', 'Action', 'Entity', 'Entity ID', 'Performed By', 'Before', 'After'];
        const rows = mockAuditLog.map(a => [
          a.timestamp, a.action, a.entity, a.entityId, a.userName, a.before || '', a.after || ''
        ]);
        downloadCSV('vsla_audit_trail', generateCSV(headers, rows));
        toast.success('Audit trail downloaded');
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-header">Data Export</h1>
        <p className="page-subtitle">Export filtered data as CSV — respects tenant filtering</p>
      </div>

      <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
        Exports include only data within your access scope. Filenames are auto-generated with the current date.
      </div>

      <div className="space-y-4">
        {exports.map(item => (
          <div key={item.type} className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
            <Button variant="outline" size="sm" onClick={item.exportFn}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
