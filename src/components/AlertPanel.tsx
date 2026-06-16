import { Alert as AlertType } from "../types";
import { IcnWarning as AlertTriangle, IcnClock as Clock, IcnWifi as Wifi, IcnMapPin as MapPin, IcnInfo as Info, IcnX as X } from "@/components/ui/Icons";

interface AlertPanelProps {
  alerts: AlertType[];
}

const alertIcons: Record<string, React.ReactNode> = {
  fraud: <AlertTriangle className="w-4 h-4" />,
  inactive: <Clock className="w-4 h-4" />,
  sync: <Wifi className="w-4 h-4" />,
  anomaly: <MapPin className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />
};

const alertColors: Record<string, { bg: string; text: string; icon: string }> = {
  high: { bg: 'bg-red-500/10', text: 'text-red-400', icon: 'text-red-400' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: 'text-amber-400' },
  low: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'text-blue-400' }
};

export function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">System Alerts</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
            {alerts.filter(a => !a.isRead).length} New
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-slate-700/50 max-h-80 overflow-auto">
        {alerts.map((alert) => {
          const colors = alertColors[alert.priority];
          
          return (
            <div 
              key={alert.id} 
              className={`
                p-4 hover:bg-slate-700/30 transition-colors cursor-pointer
                ${!alert.isRead ? 'bg-slate-700/20' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                  {alertIcons[alert.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white">{alert.title}</p>
                        {!alert.isRead && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                  <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}