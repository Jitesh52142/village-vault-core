import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/types';
import { mockUsers } from '@/data/mockData';
import { UserRole } from '@/types';

export default function SettingsPage() {
  const { user, switchRole } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-header">Settings</h1>
        <p className="page-subtitle">System configuration and role management</p>
      </div>

      {/* Role Switcher (Demo) */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-4">Demo: Switch Role</h2>
        <p className="text-sm text-muted-foreground mb-4">
          For demo purposes, switch between different user roles to see how the interface adapts.
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
    </div>
  );
}
