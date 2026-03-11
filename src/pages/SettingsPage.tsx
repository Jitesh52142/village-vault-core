import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/types';
import { mockUsers, mockFxDailyRates, mockFxLocks } from '@/data/mockData';
import { getPermissions } from '@/lib/permissions';
import { Settings as SettingsIcon, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { user, switchRole } = useAuth();

  if (!user) return null;
  const perms = getPermissions(user.role);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-header">Settings</h1>
        <p className="page-subtitle">System configuration, FX rates, and role management</p>
      </div>

      {/* Role Switcher (Demo) */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-4">Demo: Switch Role</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Switch between roles to see how permissions, navigation, and dashboards adapt per the access matrix.
        </p>
        <div className="grid grid-cols-1 gap-2">
          {mockUsers.map(u => (
            <button
              key={u.id}
              onClick={() => switchRole(u.role)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-colors text-left ${
                user?.role === u.role
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border hover:bg-muted text-foreground'
              }`}
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                user?.role === u.role ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {ROLE_LABELS[u.role]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FX Rates Display */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Daily FX Rates</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            <span>Pulled once daily</span>
          </div>
        </div>
        <div className="space-y-2">
          {mockFxDailyRates.filter((r, i, arr) => arr.findIndex(a => a.currencyCode === r.currencyCode) === i).map(rate => (
            <div key={rate.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <span className="font-medium text-foreground">{rate.currencyCode}</span>
                <span className="text-xs text-muted-foreground ml-2">to USD</span>
              </div>
              <span className="font-mono font-medium text-foreground">{rate.referenceRate.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Rates are locked for 10 minutes at transaction time. Historical FX is never recalculated.
        </p>
      </div>

      {/* Permission Summary */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-4">Your Permissions ({ROLE_LABELS[user.role]})</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(perms).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${value ? 'bg-[hsl(var(--success))]' : 'bg-destructive'}`} />
              <span className="text-muted-foreground">
                {key.replace(/^can/, '').replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
