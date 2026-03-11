import { StatCard } from '@/components/StatCard';
import { mockLoans, mockVSLAs, mockVslaHealthScores, mockRepayments } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Activity, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ReportsPage() {
  const { user } = useAuth();
  const totalLoans = mockLoans.length;
  const active = mockLoans.filter(l => l.status === 'ACTIVE').length;
  const overdue = mockLoans.filter(l => l.status === 'OVERDUE').length;
  const completed = mockLoans.filter(l => l.status === 'COMPLETED').length;
  const delinquencyRate = Math.round((overdue / totalLoans) * 100);
  const repaymentRate = Math.round((completed / totalLoans) * 100);

  const totalOutstanding = mockLoans.reduce((s, l) => s + l.remainingBalance, 0);
  const totalDisbursed = mockLoans.reduce((s, l) => s + l.principal, 0);
  const avgHealth = Math.round(mockVSLAs.reduce((s, v) => s + v.healthScore, 0) / mockVSLAs.length);

  // Calculate average delay (mock)
  const avgDelayDays = Math.round(
    mockVslaHealthScores.reduce((s, h) => s + h.avgDelayDays, 0) / mockVslaHealthScores.length * 10
  ) / 10;

  const statusData = [
    { name: 'Active', value: active, color: 'hsl(200, 80%, 45%)' },
    { name: 'Overdue', value: overdue, color: 'hsl(0, 72%, 51%)' },
    { name: 'Completed', value: completed, color: 'hsl(152, 60%, 42%)' },
    { name: 'New', value: mockLoans.filter(l => l.status === 'NEW').length, color: 'hsl(220, 70%, 25%)' },
  ];

  const healthData = mockVslaHealthScores.map(h => {
    const vsla = mockVSLAs.find(v => v.id === h.vslaId);
    return {
      name: vsla?.name.split(' ').slice(0, 2).join(' ') || h.vslaId,
      score: h.finalScore,
      repayment: h.repaymentSuccessRate,
      delinquency: h.delinquencyRate,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Reports & Analytics</h1>
        <p className="page-subtitle">Comprehensive loan performance and VSLA health overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Allocated" value={totalLoans} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Outstanding" value={`${(totalOutstanding / 1000000).toFixed(1)}M`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Delinquency" value={`${delinquencyRate}%`} icon={<AlertTriangle className="h-5 w-5 text-destructive" />} />
        <StatCard title="Repayment Rate" value={`${repaymentRate}%`} icon={<CheckCircle className="h-5 w-5 text-[hsl(var(--success))]" />} />
        <StatCard title="Avg Delay" value={`${avgDelayDays}d`} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Avg Health" value={avgHealth} icon={<Activity className="h-5 w-5" />} />
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
          <h2 className="text-base font-semibold text-foreground mb-4">VSLA Health Scores (0-100)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="score" fill="hsl(200, 80%, 45%)" radius={[4, 4, 0, 0]} name="Health Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health Score Breakdown */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Health Score Breakdown</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Composite score based on: Repayment performance, Delinquency rate, Loan volume, Repayment speed, Average delay
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>VSLA</th>
                <th>Repayment Rate</th>
                <th>Delinquency</th>
                <th>Avg Delay</th>
                <th>Loan Volume</th>
                <th>Speed</th>
                <th>Final Score</th>
              </tr>
            </thead>
            <tbody>
              {mockVslaHealthScores.map(h => {
                const vsla = mockVSLAs.find(v => v.id === h.vslaId);
                const scoreColor = h.finalScore >= 80 ? 'text-[hsl(var(--success))]' : h.finalScore >= 60 ? 'text-[hsl(var(--warning))]' : 'text-destructive';
                return (
                  <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                    <td className="font-medium text-foreground">{vsla?.name || h.vslaId}</td>
                    <td>{h.repaymentSuccessRate}%</td>
                    <td className={h.delinquencyRate > 10 ? 'text-destructive font-medium' : ''}>{h.delinquencyRate}%</td>
                    <td>{h.avgDelayDays} days</td>
                    <td>{h.loanVolume}</td>
                    <td>{h.repaymentSpeed}%</td>
                    <td className={`font-bold ${scoreColor}`}>{h.finalScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
