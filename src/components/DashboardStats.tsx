import { IcnTrendUp as TrendingUp, IcnTrendDown as TrendingDown, IcnMinus as Minus } from '@/components/ui/Icons';
import { DashboardMetrics } from '../types';
import { formatCurrency, formatNumber, formatPercent } from '../utils/designTokens';

interface DashboardStatsProps {
  metrics: DashboardMetrics;
}

export function DashboardStats({ metrics }: DashboardStatsProps) {
  const stats = [
    {
      label: "Today's Revenue",
      value: formatCurrency(metrics.revenue.today),
      change: metrics.revenue.today - metrics.revenue.yesterday,
      changeLabel: 'vs yesterday',
      icon: '💰',
      color: 'emerald',
    },
    {
      label: 'Monthly Progress',
      value: formatPercent(metrics.revenue.targetPercent),
      change: metrics.revenue.targetPercent - 65,
      changeLabel: 'target achieved',
      icon: '📊',
      color: 'blue',
    },
    {
      label: 'Active Agents',
      value: `${metrics.agents.inField}/${metrics.agents.total}`,
      change: metrics.agents.inField - metrics.agents.offline,
      changeLabel: 'in field now',
      icon: '👥',
      color: 'violet',
    },
    {
      label: 'Collections Today',
      value: formatNumber(metrics.collections.today),
      change: metrics.collections.today - 15,
      changeLabel: 'vs avg',
      icon: '🧾',
      color: 'amber',
    },
  ];

  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const isPositive = stat.change > 0;
        const isNeutral = stat.change === 0;
        
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  isPositive
                    ? 'bg-emerald-100 text-emerald-700'
                    : isNeutral
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : isNeutral ? (
                  <Minus className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(stat.change)}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}