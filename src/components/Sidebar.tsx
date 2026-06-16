import { 
  IcnDashboard as LayoutDashboard, 
  IcnMap as Map, 
  IcnBuilding as Building2, 
  IcnUsers as Users, 
  IcnDollar as DollarSign, 
  IcnFile as FileText,
  IcnSettings as Settings,
  IcnShield as Shield,
  IcnChevronLeft as ChevronLeft,
  IcnUsers as UsersIcon
} from "@/components/ui/Icons";
import type { PageType } from "../types";
import { useAuth } from "../utils/AuthContext";
import { hasPermission } from "../utils/permissions";

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const allMenuItems = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard, resource: 'dashboard' },
  { id: 'map' as PageType, label: 'Live Map', icon: Map, resource: 'dashboard' },
  { id: 'businesses' as PageType, label: 'Businesses', icon: Building2, resource: 'businesses' },
  { id: 'agents' as PageType, label: 'Agents', icon: Users, resource: 'agents' },
  { id: 'collections' as PageType, label: 'Collections', icon: DollarSign, resource: 'collections' },
  { id: 'reports' as PageType, label: 'Reports', icon: FileText, resource: 'reports' },
  { id: 'users' as PageType, label: 'Users', icon: UsersIcon, resource: 'users' },
  { id: 'settings' as PageType, label: 'Settings', icon: Settings, resource: 'settings' },
];

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }: SidebarProps) {
  const { user } = useAuth();
  
  const menuItems = allMenuItems.filter(item => 
    hasPermission(user?.role || 'auditor', item.resource, 'view')
  );

  return (
    <aside 
      className={`
        ${isOpen ? 'w-64' : 'w-20'} 
        bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 
        flex flex-col transition-all duration-300 ease-in-out
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm">CyberRevenue</span>
              <span className="text-xs text-slate-400">Command System</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 text-slate-400 transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 text-indigo-400 border border-indigo-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
                  {isOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-800">
        <div className={`
          flex items-center gap-3 p-3 rounded-xl bg-slate-800/50
          ${!isOpen && 'justify-center'}
        `}>
          <img 
            src={user?.avatarUrl || "https://via.placeholder.com/40"}
            alt={user?.fullName || "User"}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          {isOpen && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">{user?.fullName}</span>
              <span className="text-xs text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}