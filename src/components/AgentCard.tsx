import { AgentStats } from "../types";
import { MapPin, DollarSign, TrendingUp } from "lucide-react";

interface AgentCardProps {
  agent: AgentStats;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50">
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <img 
            src={agent.avatarUrl || "https://via.placeholder.com/40"}
            alt={agent.officerName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700"
          />
          {agent.isActive && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-800" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{agent.officerName}</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{agent.zone}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-700/30 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-slate-400">Today</span>
          </div>
          <p className="text-lg font-bold text-white">GHS {agent.todayAmount.toLocaleString()}</p>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-slate-400">Score</span>
          </div>
          <p className="text-lg font-bold text-white">{agent.performanceScore}%</p>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Performance</span>
          <span className="text-white font-medium">{agent.performanceScore}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${agent.performanceScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}