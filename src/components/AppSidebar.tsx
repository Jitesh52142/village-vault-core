import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPermissions } from '@/lib/permissions';
import { ROLE_LABELS } from '@/types';
import {
  LayoutDashboard, Users, CreditCard, Receipt, MapPin, FileText, ShieldAlert,
  ClipboardList, Download, Database, LogOut, ChevronLeft, ChevronRight, Settings, Upload, Building2
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from '@/components/NavLink';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  permissionKey?: keyof ReturnType<typeof getPermissions>;
}

const allNavItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'VSLAs', url: '/vslas', icon: Building2, permissionKey: 'canManageVslas' },
  { title: 'Members', url: '/members', icon: Users },
  { title: 'Loans', url: '/loans', icon: CreditCard },
  { title: 'Repayments', url: '/repayments', icon: Receipt, permissionKey: 'canRecordRepayment' },
  { title: 'Map View', url: '/map', icon: MapPin, permissionKey: 'canViewMap' },
  { title: 'Reports', url: '/reports', icon: FileText, permissionKey: 'canViewReports' },
  { title: 'Risk Flags', url: '/risk-flags', icon: ShieldAlert, permissionKey: 'canViewRiskFlags' },
  { title: 'Audit Log', url: '/audit', icon: ClipboardList, permissionKey: 'canViewAudit' },
  { title: 'Exports', url: '/exports', icon: Download, permissionKey: 'canExport' },
  { title: 'Bulk Import', url: '/bulk-import', icon: Upload, permissionKey: 'canBulkImport' },
  { title: 'Backup', url: '/backup', icon: Database, permissionKey: 'canTriggerBackup' },
  { title: 'Settings', url: '/settings', icon: Settings, permissionKey: 'canManageRoles' },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const permissions = getPermissions(user.role);

  const visibleItems = allNavItems.filter(item => {
    if (!item.permissionKey) return true;
    return permissions[item.permissionKey];
  });

  // Treasurer sees ultra-simplified nav
  const treasurerItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Collect Payment', url: '/repayments', icon: Receipt },
    { title: 'Members', url: '/members', icon: Users },
  ];

  const navItems = user.role === 'treasurer' ? treasurerItems : visibleItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } min-h-screen`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-base font-bold text-sidebar-primary">VSLA</h1>
            <p className="text-xs text-sidebar-foreground/60">Loan Management</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border animate-fade-in">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sidebar-primary/20 text-sidebar-primary mt-1">
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
              activeClassName=""
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
