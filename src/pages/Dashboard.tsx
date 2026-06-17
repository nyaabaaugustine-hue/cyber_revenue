import {
  IcnTrendUp as TrendingUp,
  IcnDollar as DollarSign,
  IcnUsers as Users,
  IcnBuilding as Building2,
  IcnActivity as Activity,
  IcnWarning as AlertTriangle,
  IcnReceipt as Receipt,
  IcnClock as Clock,
  IcnMapPin as MapPin,
  IcnCheckCircle as CheckCircle,
} from "@/components/ui/Icons";
import { useDashboardMetrics, useAgents, useCollections, useAlerts, useBusinesses } from "../hooks/useApiData";
import { MapView } from "../components/MapView";
import { FieldAgentDashboard } from "../components/FieldAgentDashboard";
import { useAuth } from "../utils/AuthContext";
import { formatCurrency } from "../utils/data";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'field_officer') {
    return <FieldAgentDashboard />;
  }

  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const { data: metrics, isLoading: loadingMetrics } = useDashboardMetrics();
  const { data: agents = [], isLoading: loadingAgents } = useAgents();
  const { data: collectionsData, isLoading: loadingCollections } = useCollections({ limit: 5 });
  const { data: alerts = [], isLoading: loadingAlerts } = useAlerts();
  const { data: businessesData, isLoading: loadingBusinesses } = useBusinesses({ limit: 50 });

  const collections = collectionsData?.data || [];
  const businesses = businessesData?.data || [];
  const agentList = Array.isArray(agents) ? agents : [];

  const role = user?.role || 'admin';
  const isSupervisor = role === 'supervisor';
  const isAccountant = role === 'accountant';
  const isManager = role === 'manager';
  const isAdmin = role === 'admin';

  const N = (v: any) => Number(v || 0);

  const todayRevenue = N(metrics?.revenueToday);
  const weekRevenue = N(metrics?.revenueThisWeek);
  const monthRevenue = N(metrics?.revenueThisMonth);
  const revenueTarget = N(metrics?.revenueTarget);
  const todayCollections = metrics?.collectionsToday || 0;
  const weekCollections = metrics?.collectionsThisWeek || 0;
  const agentsTotal = metrics?.agentsTotal || 0;
  const agentsActive = metrics?.agentsActive || 0;
  const collectionRate = revenueTarget > 0 ? (monthRevenue / revenueTarget) * 100 : 0;

  const getRevenue = () => {
    switch (timeRange) {
      case 'today': return todayRevenue;
      case 'week': return weekRevenue;
      case 'month': return monthRevenue;
    }
  };

  const getCollections = () => {
    switch (timeRange) {
      case 'today': return todayCollections;
      case 'week': return weekCollections;
      case 'month': return weekCollections * 4;
    }
  };

  const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    if (data.every(v => v === 0)) return <div className="h-8" />;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    return (
      <svg className="w-full h-8" viewBox="0 0 100 32">
        <defs>
          <linearGradient id={`grad-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#grad-${color.replace(/[^a-z0-9]/gi, '')})`}
          points={`0,32 ${data.map((v, i) => `${(i / (data.length - 1)) * 100},${32 - ((v - min) / range) * 28}`).join(' ')} 100,32`}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data.map((v, i) => `${(i / (data.length - 1)) * 100},${32 - ((v - min) / range) * 28}`).join(' ')}
        />
      </svg>
    );
  };

  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  const alertColors: Record<string, string> = {
    fraud: 'border-l-red-500 bg-red-500/5',
    inactive: 'border-l-amber-500 bg-amber-500/5',
    sync: 'border-l-blue-500 bg-blue-500/5',
    anomaly: 'border-l-purple-500 bg-purple-500/5',
    warning: 'border-l-orange-500 bg-orange-500/5',
    info: 'border-l-slate-400 bg-slate-400/5',
  };

  const alertIcons: Record<string, string> = {
    fraud: 'text-red-500',
    inactive: 'text-amber-500',
    sync: 'text-blue-500',
    anomaly: 'text-purple-500',
    warning: 'text-orange-500',
    info: 'text-slate-400',
  };

  const rankColors = ['bg-amber-500 text-amber-950', 'bg-slate-300 text-slate-800', 'bg-orange-500 text-white'];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.fullName?.split(' ')[1] || 'Admin'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.districtName || 'Kumasi Metropolitan Assembly'} &bull; {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Select value={timeRange} onValueChange={(v: 'today' | 'week' | 'month') => setTimeRange(v)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">{isAccountant ? 'Total Collected' : 'Total Revenue'}</p>
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
              </div>
            </div>
            {loadingMetrics ? <Skeleton className="h-8 w-32" /> : (
              <>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(getRevenue())}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-500">+12.5%</span>
                  <span className="text-xs text-muted-foreground">vs last {timeRange === 'today' ? 'day' : timeRange === 'week' ? 'week' : 'month'}</span>
                </div>
                <div className="mt-3">
                  <MiniChart data={[45, 52, 38, 65, 48, 72, 58]} color="#10b981" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">Collections</p>
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Receipt className="h-4.5 w-4.5 text-blue-500" />
              </div>
            </div>
            {loadingMetrics ? <Skeleton className="h-8 w-20" /> : (
              <>
                <p className="text-2xl font-bold">{getCollections().toLocaleString()}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-500">+8.2%</span>
                  <span className="text-xs text-muted-foreground">vs last period</span>
                </div>
                <div className="mt-3">
                  <MiniChart data={[28, 35, 22, 42, 38, 45, 32]} color="#3b82f6" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {!isAccountant && (
          <Card className="border-l-4 border-l-violet-500 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">{isSupervisor ? 'My Team' : 'Active Agents'}</p>
                <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Users className="h-4.5 w-4.5 text-violet-500" />
                </div>
              </div>
              {loadingMetrics ? <Skeleton className="h-8 w-20" /> : (
                <>
                  <p className="text-2xl font-bold">{agentsActive}<span className="text-lg text-muted-foreground">/{agentsTotal}</span></p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">{agentsTotal > 0 ? Math.round((agentsActive / agentsTotal) * 100) : 0}% active</span>
                  </div>
                  <div className="mt-3">
                    <Progress value={agentsTotal > 0 ? (agentsActive / agentsTotal) * 100 : 0} className="h-1.5" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {isAccountant && (
          <Card className="border-l-4 border-l-violet-500 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">Reconciled</p>
                <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <CheckCircle className="h-4.5 w-4.5 text-violet-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">87.3%</p>
              <p className="text-xs text-muted-foreground mt-2">{formatCurrency(562000)} of {formatCurrency(645000)}</p>
              <div className="mt-3"><Progress value={87.3} className="h-1.5" /></div>
            </CardContent>
          </Card>
        )}

        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">Target Progress</p>
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Activity className="h-4.5 w-4.5 text-amber-500" />
              </div>
            </div>
            {loadingMetrics ? <Skeleton className="h-8 w-20" /> : (
              <>
                <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">{formatCurrency(monthRevenue)} / {formatCurrency(revenueTarget)}</p>
                <div className="mt-3">
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${collectionRate >= 80 ? 'bg-emerald-500' : collectionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(collectionRate, 100)}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        {!isAccountant && (
          <div className="lg:col-span-2 bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h2 className="text-base font-semibold text-card-foreground">
                  {isSupervisor ? 'Team Locations' : 'Live Map Overview'}
                </h2>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Kumasi Metropolitan</span>
            </div>
            <MapView
              businesses={businesses}
              agents={agentList}
              height="h-80"
              showControls={false}
            />
          </div>
        )}

        {/* Accountant gets Collection Summary */}
        {isAccountant && (
          <div className="lg:col-span-2 bg-card border rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-base font-semibold text-card-foreground">Collection Summary</h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: 'Cash Collections', amount: 284000, percent: 44, color: 'bg-emerald-500' },
                { label: 'Mobile Money', amount: 245000, percent: 38, color: 'bg-blue-500' },
                { label: 'POS/Card', amount: 89000, percent: 14, color: 'bg-violet-500' },
                { label: 'Bank Transfer', amount: 27000, percent: 4, color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{formatCurrency(item.amount)} ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        <div className="bg-card border rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-semibold text-card-foreground">Alerts</h2>
            </div>
            {unreadAlerts > 0 && (
              <Badge variant="destructive" className="text-xs h-5 px-2">{unreadAlerts} new</Badge>
            )}
          </div>
          <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
            {loadingAlerts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg"><Skeleton className="h-16 w-full" /></div>
              ))
            ) : alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No alerts</p>
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${alertColors[alert.type] || 'border-l-slate-400 bg-slate-50'} ${!alert.isRead ? 'ring-1 ring-primary/10' : ''} transition-all hover:shadow-sm`}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alertIcons[alert.type] || 'text-slate-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground leading-tight">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{alert.description}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground/60" />
                        <p className="text-[11px] text-muted-foreground/60">
                          {new Date(alert.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Agents */}
        {(isAdmin || isSupervisor) && (
          <div className="bg-card border rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h2 className="text-base font-semibold text-card-foreground">
                  {isSupervisor ? 'Team Performance' : 'Top Performing Agents'}
                </h2>
              </div>
            </div>
            <div className="p-3">
              {loadingAgents ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3"><Skeleton className="h-14 w-full" /></div>
                ))
              ) : (
                agentList
                  .sort((a: any, b: any) => N(b.todayAmount) - N(a.todayAmount))
                  .slice(0, isSupervisor ? 3 : 5)
                  .map((agent: any, index: number) => (
                    <div key={agent.officerId || agent.id} className={`flex items-center gap-3 p-3 rounded-lg ${index < 2 ? 'bg-muted/30' : ''} hover:bg-muted/50 transition-colors`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        index < 3 ? rankColors[index] : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarImage src={agent.avatarUrl} alt={agent.officerName} />
                        <AvatarFallback className="text-xs font-semibold">{agent.officerName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">{agent.officerName}</p>
                        <p className="text-xs text-muted-foreground">{agent.zone}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(N(agent.todayAmount))}</p>
                        <p className="text-[11px] text-muted-foreground">{agent.todayCollections || 0} collections</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Accountant gets Reconciliation Summary */}
        {isAccountant && (
          <div className="bg-card border rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-base font-semibold text-card-foreground">Reconciliation Summary</h2>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Total Deposits', value: formatCurrency(562000), status: 'Matched', color: 'text-emerald-500', icon: CheckCircle },
                { label: 'Pending Verification', value: formatCurrency(43000), status: 'Pending', color: 'text-amber-500', icon: Clock },
                { label: 'Disputed Amount', value: formatCurrency(12000), status: 'Flagged', color: 'text-red-500', icon: AlertTriangle },
                { label: 'Commission Payouts', value: formatCurrency(28400), status: 'Processed', color: 'text-blue-500', icon: DollarSign },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${item.color} bg-current/10`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.status}</p>
                  </div>
                  <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manager gets Compliance Overview */}
        {isManager && (
          <div className="bg-card border rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-base font-semibold text-card-foreground">Compliance Overview</h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: 'GPS Compliance', value: 94, color: 'bg-emerald-500' },
                { label: 'Receipt Accuracy', value: 98, color: 'bg-blue-500' },
                { label: 'Daily Reports', value: 87, color: 'bg-amber-500' },
                { label: 'Target Achievement', value: 81, color: 'bg-violet-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Collections */}
        <div className="bg-card border rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-card-foreground">Recent Collections</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Live feed</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {loadingCollections ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4"><Skeleton className="h-12 w-full" /></div>
              ))
            ) : collections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No collections yet</p>
              </div>
            ) : (
              collections.slice(0, 5).map((collection) => (
                <div key={collection.id} className="p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{collection.businessName}</p>
                    <p className="text-xs text-muted-foreground">by {collection.officerName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(N(collection.amount))}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(collection.collectionDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
