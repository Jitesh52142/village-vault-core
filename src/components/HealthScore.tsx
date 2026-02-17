import { getHealthColor } from '@/data/mockData';

interface HealthScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthScore({ score, size = 'md' }: HealthScoreProps) {
  const colorClass = getHealthColor(score);
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  const bgColor = score >= 80
    ? 'bg-success/10 border-success/30'
    : score >= 60
    ? 'bg-warning/10 border-warning/30'
    : 'bg-destructive/10 border-destructive/30';

  return (
    <div className={`${sizeClasses[size]} ${bgColor} border rounded-full flex items-center justify-center font-bold ${colorClass}`}>
      {score}
    </div>
  );
}
