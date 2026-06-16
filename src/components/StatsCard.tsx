import { ReactNode } from "react";
import { IcnTrendUp as TrendingUp, IcnTrendDown as TrendingDown } from "@/components/ui/Icons";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  accent?: boolean;
}

export function StatsCard({ title, value, subtitle, icon, trend, trendLabel, accent }: StatsCardProps) {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]
      ${accent 
        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' 
        : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
      }
    `}>
      {/* Background Pattern */}
      {accent && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full blur-2xl" />
        </div>
      )}
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${accent ? 'bg-white/20' : 'bg-slate-700/50'}
          `}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`
              flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
              ${accent 
                ? 'bg-white/20 text-white' 
                : trend >= 0 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }
            `}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div>
          <p className={`text-sm font-medium mb-1 ${accent ? 'text-white/80' : 'text-slate-400'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${accent ? 'text-white' : 'text-white'}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${accent ? 'text-white/70' : 'text-slate-500'}`}>
              {subtitle}
            </p>
          )}
          {trendLabel && (
            <p className={`text-xs mt-1 ${accent ? 'text-white/70' : 'text-slate-500'}`}>
              {trendLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}