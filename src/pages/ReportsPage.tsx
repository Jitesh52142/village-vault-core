import { StatCard } from '@/components/StatCard';
import { mockLoans, mockVSLAs } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export default function ReportsPage() {
  const totalLoans = mockLoans.length;
  const active = mockLoans.filter(l => l.status === 'ACTIVE').length;
  const overdue = mockLoans.filter(l => l.status === 'OVERDUE').length;
  const completed = mockLoans.filter(l => l.status === 'COMPLETED').length;
  const delinquencyRate = Math.round((overdue / totalLoans) * 100);
  const repaymentRate = Math.round((completed / totalLoans) * 100);

  const statusData = [
    { name: 'Active', value: active, color: 'hsl(200, 80%, 45%)' },
    { name: 'Overdue', value: overdue, color: 'hsl(0, 72%, 51%)' },
    { name: 'Completed', value: completed, color: 'hsl(152, 60%, 42%)' },
    { name: 'New', value: mockLoans.filter(l => l.status === 'NEW').length, color: 'hsl(220, 70%, 25%)' },
  ];

  const vslaData = mockVSLAs.map(v => ({
    name: v.name.split(' ').slice(0, 2).join(' '),
    health: v.healthScore,
    loans: v.totalLoans,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Reports & Analytics</h1>
        <p className="page-subtitle">Comprehensive loan performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Allocated" value={totalLoans} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Delinquency Rate" value={`${delinquencyRate}%`} icon={<AlertTriangle className="h-5 w-5 text-destructive" />} />
        <StatCard title="Repayment Rate" value={`${repaymentRate}%`} icon={<CheckCircle className="h-5 w-5 text-success" />} />
        <StatCard title="Avg Health" value={Math.round(mockVSLAs.reduce((s, v) => s + v.healthScore, 0) / mockVSLAs.length)} icon={<Activity className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Status Distribution */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4">Loan Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* VSLA Health Scores */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4">VSLA Health Scores</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vslaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="health" fill="hsl(200, 80%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
