import { TrendingUp, Users, Target, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/designTokens';

export function MetricCards() {
  const metrics = [
    {
      title: "Today's Collection",
      value: 'GHS 4,820',
      change: '+12%',
      changeLabel: 'vs yesterday',
      icon: TrendingUp,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Businesses Visited',
      value: '38',
      subtitle: 'of 52 today',
      icon: CheckCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Monthly Target',
      value: '74%',
      subtitle: 'GHS 48,200 / 65,000',
      progress: 74,
      icon: Target,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Active Agents',
      value: '12',
      subtitle: '2 inactive',
      icon: Users,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Metric Cards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${metric.iconBg} flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
                {metric.change && (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {metric.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {metric.value}
              </p>
              <p className="text-sm text-slate-500">{metric.title}</p>
              {metric.subtitle && (
                <p className="text-xs text-slate-400 mt-1">{metric.subtitle}</p>
              )}
              {metric.progress !== undefined && (
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Design Notes</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Values use JetBrains Mono for numeric data</li>
            <li>• Icons use semantic colors matching their context</li>
            <li>• Progress bars use brand orange for targets</li>
            <li>• Changes use green for positive, red for negative</li>
          </ul>
        </div>
      </section>
    </div>
  );
}