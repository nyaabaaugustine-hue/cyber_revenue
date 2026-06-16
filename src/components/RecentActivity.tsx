import { IcnClock as Clock, IcnUser as User, IcnBuilding as Building2, IcnCheckCircle as CheckCircle, IcnWarning as AlertTriangle } from '@/components/ui/Icons';
import { Collection, Anomaly } from '../types';
import { formatCurrency, formatRelativeTime } from '../utils/designTokens';

interface RecentActivityProps {
  collections: Collection[];
  anomalies: Anomaly[];
}

export function RecentActivity({ collections, anomalies }: RecentActivityProps) {
  // Combine and sort by time
  const activities = [
    ...collections.slice(0, 5).map(c => ({
      type: 'collection' as const,
      time: new Date(c.collectionDate),
      data: c,
    })),
    ...anomalies.slice(0, 3).map(a => ({
      type: 'anomaly' as const,
      time: new Date(a.createdAt),
      data: a,
    })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Recent Activity</h3>
        <span className="text-xs text-slate-500">Live feed</span>
      </div>
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {activities.map((activity, idx) => (
          <div key={idx} className="px-5 py-3 hover:bg-slate-50 transition-colors">
            {activity.type === 'collection' ? (
              <CollectionItem collection={activity.data} />
            ) : (
              <AnomalyItem anomaly={activity.data} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionItem({ collection }: { collection: Collection }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-4 h-4 text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900">
          <span className="font-medium">{collection.officerName}</span> collected{' '}
          <span className="font-bold text-emerald-600">{formatCurrency(collection.amount)}</span>
        </p>
        <p className="text-xs text-slate-500 truncate">{collection.businessName}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatRelativeTime(collection.collectionDate)}
        </p>
      </div>
    </div>
  );
}

function AnomalyItem({ anomaly }: { anomaly: Anomaly }) {
  const severityColors = {
    info: 'bg-blue-100 text-blue-600',
    warning: 'bg-amber-100 text-amber-600',
    error: 'bg-red-100 text-red-600',
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${severityColors[anomaly.severity]}`}>
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{anomaly.title}</p>
        <p className="text-xs text-slate-500">{anomaly.description}</p>
      </div>
    </div>
  );
}