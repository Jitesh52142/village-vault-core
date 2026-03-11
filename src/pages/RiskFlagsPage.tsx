import { mockRiskFlags } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RiskFlagsPage() {
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const flags = mockRiskFlags.filter(f => {
    const matchType = typeFilter === 'all' || f.type === typeFilter;
    const matchSeverity = severityFilter === 'all' || f.severity === severityFilter;
    return matchType && matchSeverity;
  });

  const unresolved = flags.filter(f => !f.resolved);
  const resolved = flags.filter(f => f.resolved);

  const severityIcon = (severity: string) => {
    if (severity === 'high') return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (severity === 'medium') return <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />;
    return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  };

  const canResolve = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Risk & Fraud Monitoring</h1>
        <p className="page-subtitle">Flagged transactions and anomalies detected by the risk engine</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Flag Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="fx_variance">FX Variance</SelectItem>
            <SelectItem value="quick_repay">Quick Repay</SelectItem>
            <SelectItem value="multiple_loans">Multiple Loans</SelectItem>
            <SelectItem value="backdated_payment">Backdated Payment</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Risk engine explanation */}
      <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
        <strong>Risk Engine flags:</strong> FX variance &gt;5%, same user creates & repays quickly, multiple active loan attempts, backdated unusual payments.
      </div>

      {/* Active Flags */}
      <div className="bg-card rounded-xl border border-destructive/20 shadow-sm">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <h2 className="text-base font-semibold text-foreground">Active Flags ({unresolved.length})</h2>
        </div>
        <div className="p-5 space-y-3">
          {unresolved.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No active risk flags</p>
          )}
          {unresolved.map(flag => (
            <div key={flag.id} className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              {severityIcon(flag.severity)}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{flag.description}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="capitalize">{flag.type.replace(/_/g, ' ')}</span>
                  <span>·</span>
                  <span className="capitalize">{flag.severity} severity</span>
                  {flag.riskScore !== undefined && (
                    <>
                      <span>·</span>
                      <span>Score: {flag.riskScore}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{flag.entityType} #{flag.entityId}</span>
                  <span>·</span>
                  <span>{new Date(flag.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              {canResolve && (
                <Button variant="outline" size="sm" onClick={() => toast.success('Flag resolved')}>
                  Resolve
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[hsl(var(--success))]" />
            <h2 className="text-base font-semibold text-foreground">Resolved ({resolved.length})</h2>
          </div>
          <div className="p-5 space-y-3">
            {resolved.map(flag => (
              <div key={flag.id} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{flag.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {flag.type.replace(/_/g, ' ')} · {new Date(flag.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
