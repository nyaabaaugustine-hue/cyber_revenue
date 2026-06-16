import { statusConfig } from '../../utils/designTokens';

export function StatusBadges() {
  const statuses = [
    { key: 'paid', label: 'Paid' },
    { key: 'due', label: 'Due' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'partial', label: 'Partial' },
    { key: 'waived', label: 'Waived' },
    { key: 'flagged', label: 'Flagged' },
    { key: 'active', label: 'Active' },
  ] as const;

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Badges</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-3">
            {statuses.map((status) => {
              const config = statusConfig[status.key];
              return (
                <span
                  key={status.key}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  {status.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Usage Guidelines</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <span><strong className="text-slate-900">Paid:</strong> Business levy is fully paid and up to date</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span><strong className="text-slate-900">Due:</strong> Payment expected within 7 days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span><strong className="text-slate-900">Overdue:</strong> Payment past due date</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span><strong className="text-slate-900">Partial:</strong> Partial payment received</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
              <span><strong className="text-slate-900">Waived:</strong> Levy waived by authority</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
              <span><strong className="text-slate-900">Flagged:</strong> Business under review / dispute</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}