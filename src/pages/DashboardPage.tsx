import { useAuth } from '@/contexts/AuthContext';
import SuperAdminDashboard from '@/components/dashboards/SuperAdminDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import ManagerDashboard from '@/components/dashboards/ManagerDashboard';
import TreasurerDashboard from '@/components/dashboards/TreasurerDashboard';
import AuditorDashboard from '@/components/dashboards/AuditorDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'super_admin': return <SuperAdminDashboard />;
    case 'admin': return <AdminDashboard />;
    case 'vsla_manager': return <ManagerDashboard />;
    case 'treasurer': return <TreasurerDashboard />;
    case 'auditor': return <AuditorDashboard />;
  }
}
