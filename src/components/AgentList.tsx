import { IcnUser as User, IcnMapPin as MapPin, IcnTrendUp as TrendingUp } from '@/components/ui/Icons';
import { AgentStats } from '../types';
import { formatCurrency } from '../utils/designTokens';

interface AgentListProps {
  agents: AgentStats[];
}

export function AgentList({ agents }: AgentListProps) {
  const activeAgents = agents.filter(a => a.isActive).sort((a, b) => b.todayAmount - a.todayAmount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Top Agents Today</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {activeAgents.slice(0, 5).map((agent, idx) => (
          <div key={agent.officerId} className="px-5 py-3 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                  {agent.officerName.split(' ').map(n => n[0]).join('')}
                </div>
                {agent.status === 'in-field' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">{agent.officerName}</p>
                  <span className="text-sm font-bold text-emerald-600">{formatCurrency(agent.todayAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {agent.zone}
                  </span>
                  <span>{agent.todayCollections} collections</span>
                </div>
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(agent.targetPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}