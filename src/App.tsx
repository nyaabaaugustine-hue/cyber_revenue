import { useState, useEffect, Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  IcnDashboard as LayoutDashboard, IcnMap as Map, IcnBuilding as Building2, IcnUsers as UsersIcon, IcnDollar as DollarSign,
  IcnFile as FileText, IcnSettings as SettingsIcon, IcnShield as Shield, IcnChevronLeft as ChevronLeft, IcnBell as Bell, IcnSearch as Search,
  IcnChevronDown as ChevronDown, IcnMenu as Menu, IcnUser as User, IcnWarning as AlertTriangle, IcnBarChart as BarChart3, IcnActivity as Activity, IcnTrendUp as TrendingUp,
  IcnCheckCircle as ShieldCheck, IcnScale as Scale, IcnBank as Bank, IcnSmartphone as Smartphone, IcnChevronRight as ChevronRight,
} from '@/components/ui/Icons';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Login } from './pages/Login';
import { GpsPermissionDialog } from './components/common/GpsPermissionDialog';
import ToastProvider from './components/common/Toast';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { hasPermission, roleLabels } from './utils/permissions';
import { LocationTracker } from './components/common/LocationTracker';
import { NotificationProvider, useNotifications } from './utils/NotificationProvider';
import { CommandPalette } from './components/common/CommandPalette';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Button } from './components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { cn } from './lib/utils';
import { formatRelativeTime } from './utils/designTokens';
import { toast } from 'sonner';
import type { PageType } from './types';

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const LiveMap = lazy(() => import('./pages/LiveMap').then(m => ({ default: m.LiveMap })));
const Businesses = lazy(() => import('./pages/Businesses').then(m => ({ default: m.Businesses })));
const Agents = lazy(() => import('./pages/Agents').then(m => ({ default: m.Agents })));
const Collections = lazy(() => import('./pages/Collections').then(m => ({ default: m.Collections })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Users = lazy(() => import('./pages/Users').then(m => ({ default: m.Users })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Ledger = lazy(() => import('./pages/Ledger').then(m => ({ default: m.Ledger })));
const Anomalies = lazy(() => import('./pages/Anomalies').then(m => ({ default: m.Anomalies })));
const ActivityLog = lazy(() => import('./pages/ActivityLog').then(m => ({ default: m.ActivityLog })));
const Commissions = lazy(() => import('./pages/Commissions').then(m => ({ default: m.Commissions })));
const Compliance = lazy(() => import('./pages/Compliance').then(m => ({ default: m.Compliance })));
const Disputes = lazy(() => import('./pages/Disputes').then(m => ({ default: m.Disputes })));
const BankReconciliation = lazy(() => import('./pages/BankReconciliation').then(m => ({ default: m.BankReconciliation })));
const Assets = lazy(() => import('./pages/Assets').then(m => ({ default: m.Assets })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ElementType;
  path: string;
  resource: string;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', resource: 'dashboard' },
      { id: 'map', label: 'Live Map', icon: Map, path: '/map', resource: 'map' },
      { id: 'activity', label: 'Activity Log', icon: Activity, path: '/activity', resource: 'activity' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'businesses', label: 'Businesses', icon: Building2, path: '/businesses', resource: 'businesses' },
      { id: 'agents', label: 'Agents', icon: UsersIcon, path: '/agents', resource: 'agents' },
      { id: 'collections', label: 'Collections', icon: DollarSign, path: '/collections', resource: 'collections' },
    ],
  },
  {
    title: 'Oversight',
    items: [
      { id: 'reports', label: 'Reports', icon: FileText, path: '/reports', resource: 'reports' },
      { id: 'ledger', label: 'Ledger', icon: BarChart3, path: '/ledger', resource: 'ledger' },
      { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle, path: '/anomalies', resource: 'anomalies' },
      { id: 'commissions', label: 'Commissions', icon: TrendingUp, path: '/commissions', resource: 'commissions' },
      { id: 'compliance', label: 'Compliance', icon: ShieldCheck, path: '/compliance', resource: 'compliance' },
      { id: 'disputes', label: 'Disputes', icon: Scale, path: '/disputes', resource: 'disputes' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { id: 'reconciliation', label: 'Reconciliation', icon: Bank, path: '/reconciliation', resource: 'reconciliation' },
      { id: 'assets', label: 'Assets', icon: Smartphone, path: '/assets', resource: 'assets' },
      { id: 'users', label: 'Users', icon: Shield, path: '/users', resource: 'users' },
      { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings', resource: 'settings' },
    ],
  },
];

const flatNavItems = navGroups.flatMap(g => g.items);

function SidebarNav({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'admin';

  const isFieldRole = userRole === 'field_officer';

  const filteredGroups = navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (!hasPermission(userRole, item.resource, 'view')) return false;
        if (isFieldRole && item.id === 'agents') return false;
        return true;
      }),
    }))
    .filter(group => group.items.length > 0);

  return (
    <aside className={cn(
      "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-muted",
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-muted">
        <img
          src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1781607288/cyberreve_lhia3y.png"
          alt="CyberRevenue"
          className="h-10 w-auto shrink-0"
        />

      </div>

      <nav className="flex-1 p-2 overflow-y-auto space-y-4">
        {filteredGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative group",
                      isActive
                        ? 'bg-sidebar-accent text-white'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-muted hover:text-sidebar-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="text-sm font-medium truncate flex-1 text-left">{item.label}</span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                      </>
                    )}
                    {collapsed && isActive && (
                      <div className="absolute right-1 w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-sidebar-muted space-y-1">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-muted hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
        {!collapsed && (
          <a
            href="https://cybergh.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[10px] text-sidebar-foreground/30 hover:text-sidebar-foreground/60 transition-colors py-1"
          >
            BUILT BY CYBER
          </a>
        )}
      </div>
    </aside>
  );
}

function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const typeStyles: Record<string, string> = {
    info: 'bg-primary',
    warning: 'bg-amber-500',
    error: 'bg-destructive',
    success: 'bg-emerald-500',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full ring-2 ring-background px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                Mark all read
              </button>
            )}
            <Badge variant={unreadCount > 0 ? 'destructive' : 'secondary'} className="text-[10px]">
              {unreadCount} new
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <DropdownMenuItem key={n.id} className={`flex flex-col items-start py-3 cursor-pointer ${n.isRead ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-2 w-full">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeStyles[n.type] || 'bg-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatRelativeTime(n.timestamp)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm text-muted-foreground cursor-pointer" onSelect={(e) => e.preventDefault()}>
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isImpersonating, originalUser, stopImpersonation } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [gpsDialogOpen, setGpsDialogOpen] = useState(false);

  const isFieldAgent = user?.role === 'field_officer' || user?.role === 'supervisor';

  useEffect(() => {
    if (isFieldAgent) {
      const hasSeenGpsPrompt = sessionStorage.getItem('gps_prompted');
      if (!hasSeenGpsPrompt) {
        setGpsDialogOpen(true);
        sessionStorage.setItem('gps_prompted', '1');
      }
    }
  }, [isFieldAgent]);

  useKeyboardShortcuts({
    onToggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),
    onSearch: () => {
      const input = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (input) input.focus();
    },
    onRefresh: () => window.location.reload(),
  });

  useEffect(() => {
    const togglePalette = () => setCommandPaletteOpen(prev => !prev);
    window.addEventListener('toggle-command-palette', togglePalette);
    return () => window.removeEventListener('toggle-command-palette', togglePalette);
  }, []);

  const currentItem = flatNavItems.find(i => i.path === location.pathname);
  const pageTitle = currentItem?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-background flex">
      <GpsPermissionDialog
        open={gpsDialogOpen}
        onGranted={() => setGpsDialogOpen(false)}
        onDenied={() => setGpsDialogOpen(false)}
      />
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarNav collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <SidebarNav collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-background border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-lg font-bold text-foreground">{pageTitle}</h2>
              <p className="text-xs text-muted-foreground">Kumasi Metropolitan Assembly</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-56 lg:w-72 h-9 pl-10 pr-4 rounded-md border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl || "https://images.unsplash.com/photo-1472099625465-8c8e0b8e8e0b?w=32&h=32&fit=crop&crop=face"} />
                    <AvatarFallback>{user?.fullName?.split(' ').map(n => n[0]).join('') || 'AD'}</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium leading-none">{user?.fullName || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">{roleLabels[user?.role || 'admin']}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden lg:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => { logout(); navigate('/login', { replace: true }); toast.success('Logged out successfully'); }}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {isImpersonating && (
          <div className="flex items-center justify-between px-4 py-2 bg-indigo-600 text-white text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                Logged in as <strong>{user?.fullName}</strong> ({user?.role}) — <span className="text-indigo-200">switched from {originalUser?.fullName}</span>
              </span>
            </div>
            <Button size="sm" variant="ghost" className="text-white hover:bg-indigo-700 h-7 text-xs" onClick={() => { stopImpersonation(); toast.success(`Back to ${originalUser?.fullName}`); }}>
              Exit
            </Button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="p-4 lg:p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<LiveMap />} />
                <Route path="/activity" element={<ActivityLog />} />
                <Route path="/businesses" element={<Businesses />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/ledger" element={<Ledger />} />
                <Route path="/anomalies" element={<Anomalies />} />
                <Route path="/commissions" element={<Commissions />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/disputes" element={<Disputes />} />
                <Route path="/reconciliation" element={<BankReconciliation />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <NotificationProvider>
                <LocationTracker />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
                </Routes>
              </NotificationProvider>
            </ToastProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppContent />;
}
