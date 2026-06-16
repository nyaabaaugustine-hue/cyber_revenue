import { AlertTriangle, CheckCircle, Info, AlertCircle, RefreshCw } from 'lucide-react';

export function AlertPatterns() {
  const alerts = [
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Ghost visit detected',
      description: 'Officer Kofi checked in 210m from KMA-0087-SHOP — flagged for review',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      descColor: 'text-amber-700',
    },
    {
      type: 'danger',
      icon: AlertCircle,
      title: 'Levy overdue — 45 days',
      description: "Afia's Provisions · GHS 50.00 outstanding · Zone 3",
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      descColor: 'text-red-700',
    },
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Receipt verified',
      description: 'KMA-2024-00012345 · GHS 80.00 · MTN MoMo · 14 June 2024',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-900',
      descColor: 'text-emerald-700',
    },
    {
      type: 'info',
      icon: RefreshCw,
      title: 'Sync complete',
      description: '14 offline records uploaded · 0 conflicts',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      descColor: 'text-blue-700',
    },
    {
      type: 'critical',
      icon: AlertCircle,
      title: 'Cash shortage — critical',
      description: 'Expected GHS 500 · Received GHS 320 · Discrepancy: GHS 180',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      iconColor: 'text-violet-600',
      titleColor: 'text-violet-900',
      descColor: 'text-violet-700',
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Alert Patterns</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.title}
              className={`${alert.bgColor} ${alert.borderColor} border rounded-xl p-4`}
            >
              <div className="flex items-start gap-3">
                <alert.icon className={`w-5 h-5 ${alert.iconColor} flex-shrink-0 mt-0.5`} />
                <div>
                  <h4 className={`font-semibold ${alert.titleColor}`}>{alert.title}</h4>
                  <p className={`text-sm ${alert.descColor} mt-0.5`}>{alert.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}