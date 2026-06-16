import { Card, CardContent, CardHeader } from '../ui/card';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-slate-200 rounded w-64 animate-pulse" />
        <div className="h-10 bg-slate-200 rounded w-32 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-8 bg-slate-200 rounded w-32 mb-2 animate-pulse" />
              <div className="h-3 bg-slate-200 rounded w-40 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="h-6 bg-slate-200 rounded w-48 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-slate-200 rounded w-40 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2 animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const BusinessListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-40 mb-2 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
              </div>
              <div className="h-6 bg-slate-200 rounded w-16 animate-pulse" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-32 animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const AgentListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-700 rounded-xl animate-pulse" />
            <div className="flex-1">
              <div className="h-5 bg-slate-700 rounded w-32 mb-2 animate-pulse" />
              <div className="h-3 bg-slate-700 rounded w-24 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="bg-slate-700/30 rounded-xl p-3">
                <div className="h-3 bg-slate-600 rounded w-16 mb-2 animate-pulse" />
                <div className="h-6 bg-slate-600 rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 bg-slate-700 rounded w-24 animate-pulse" />
              <div className="h-3 bg-slate-700 rounded w-12 animate-pulse" />
            </div>
            <div className="h-2 bg-slate-700 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel,
  className = ""
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  className?: string;
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};