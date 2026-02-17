import { mockRiskFlags } from '@/data/mockData';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RiskFlagsPage() {
  const unresolved = mockRiskFlags.filter(f => !f.resolved);
  const resolved = mockRiskFlags.filter(f => f.resolved);

  const severityIcon = (severity: string) => {
    if (severity === 'high') return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (severity === 'medium') return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Risk & Fraud Monitoring</h1>
        <p className="page-subtitle">Flagged transactions and anomalies</p>
      </div>

      {/* Active Flags */}
      <div className="bg-card rounded-xl border border-destructive/20 shadow-sm">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <h2 className="text-base font-semibold text-foreground">Active Flags ({unresolved.length})</h2>
        </div>
        <div className="p-5 space-y-3">
          {unresolved.map(flag => (
            <div key={flag.id} className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              {severityIcon(flag.severity)}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{flag.description}</p>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="capitalize">{flag.type.replace(/_/g, ' ')}</span>
                  <span>·</span>
                  <span>{flag.severity} severity</span>
                  <span>·</span>
                  <span>{new Date(flag.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <h2 className="text-base font-semibold text-foreground">Resolved ({resolved.length})</h2>
          </div>
          <div className="p-5 space-y-3">
            {resolved.map(flag => (
              <div key={flag.id} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{flag.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(flag.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
