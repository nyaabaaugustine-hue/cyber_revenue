import { IcnBell as Bell, IcnSearch as Search, IcnChevronDown as ChevronDown, IcnMenu as Menu } from "@/components/ui/Icons";
import type { PageType } from "../types";

interface HeaderProps {
  onToggleSidebar: () => void;
  currentPage: PageType;
}

const pageTitles: Record<string, string> = {
  dashboard: 'Command Center',
  map: 'Live Field Map',
  businesses: 'Business Registry',
  agents: 'Agent Management',
  collections: 'Collections Log',
  reports: 'Reports & Analytics',
  ledger: 'General Ledger',
  users: 'User Management',
  settings: 'System Settings',
  anomalies: 'Anomaly Detection',
};

export function Header({ onToggleSidebar, currentPage }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-slate-400" />
        </button>
        
        <div>
          <h1 className="text-lg font-bold text-white">{pageTitles[currentPage]}</h1>
          <p className="text-xs text-slate-400">Kumasi Metropolitan Assembly</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-slate-900" />
        </button>

        {/* District Selector */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
          <span className="text-sm font-medium text-white">Kumasi Metro</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}