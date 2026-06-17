import { IcnTrendUp as TrendingUp, IcnDollar as DollarSign, IcnUsers as Users, IcnBuilding as Building2, IcnActivity as Activity, IcnWarning as AlertTriangle } from "@/components/ui/Icons";
import { dashboardStats, agentStats, recentCollections, alerts, businesses, formatCurrency } from "../utils/data";
import { MapView } from "../components/MapView";
import { FieldAgentDashboard } from "../components/FieldAgentDashboard";
import { useAuth } from "../utils/AuthContext";
import { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'field_officer') {
    return <FieldAgentDashboard />;
  }

  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const stats = dashboardStats;
  const collectionRate = (stats.monthRevenue / stats.targetRevenue) * 100;
  const role = user?.role || 'admin';

  const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <svg className="w-full h-8" viewBox="0 0 100 32">
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

  const getRevenue = () => {
    switch (timeRange) {
      case 'today': return stats.todayRevenue;
      case 'week': return stats.weekRevenue;
      case 'month': return stats.monthRevenue;
    }
  };

  const getCollections = () => {
    switch (timeRange) {
      case 'today': return stats.todayCollections;
      case 'week': return stats.weekCollections;
      case 'month': return Math.floor(stats.monthRevenue / 500);
    }
  };

  const isSupervisor = role === 'supervisor';
  const isAccountant = role === 'accountant';
  const isManager = role === 'manager';
  const isAdmin = role === 'admin';

  const roleTitle = isSupervisor ? 'Revenue Supervisor' : isAccountant ? 'Accountant' : isManager ? 'Operations Manager' : 'Administrator';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.fullName?.split(' ')[1] || roleTitle}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.districtName || 'Kumasi Metropolitan Assembly'} &bull; {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Revenue - all roles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAccountant ? 'Total Collected' : 'Total Revenue'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getRevenue())}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-500">+12.5%</span>
              <span className="text-xs text-muted-foreground ml-1">vs last period</span>
            </div>
            <div className="mt-2">
              <MiniChart data={[45, 52, 38, 65, 48, 72, 58]} color="hsl(var(--primary))" />
            </div>
          </CardContent>
        </Card>

        {/* Collections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isSupervisor ? 'Agent Collections' : 'Collections'}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCollections().toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-500">+8.2%</span>
              <span className="text-xs text-muted-foreground ml-1">vs last period</span>
            </div>
            <div className="mt-2">
              <MiniChart data={[28, 35, 22, 42, 38, 45, 32]} color="hsl(var(--primary))" />
            </div>
          </CardContent>
        </Card>

        {/* Active Agents - admin/supervisor/manager only */}
        {!isAccountant && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isSupervisor ? 'My Team' : 'Active Agents'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeAgents}<span className="text-lg text-muted-foreground">/{stats.totalAgents}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">{Math.round((stats.activeAgents / stats.totalAgents) * 100)}% active</span>
              </div>
              <div className="mt-2">
                <Progress value={(stats.activeAgents / stats.totalAgents) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accountant gets Compliance instead */}
        {isAccountant && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reconciled</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(562000)} of {formatCurrency(645000)}
              </p>
              <div className="mt-2">
                <Progress value={87.3} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Target Progress - admin/manager/accountant */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Progress</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.monthRevenue)} / {formatCurrency(stats.targetRevenue)}
            </p>
            <div className="mt-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${collectionRate >= 80 ? 'bg-emerald-500' : collectionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(collectionRate, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Map Section - admin/supervisor/manager */}
        {!isAccountant && (
          <div className="col-span-2 bg-card border rounded-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-card-foreground">
                {isSupervisor ? 'Team Locations' : 'Live Map Overview'}
              </h2>
              <span className="text-xs text-muted-foreground">Kumasi Metropolitan</span>
            </div>
            <MapView
              businesses={businesses}
              agents={agentStats}
              height="h-80"
              showControls={false}
            />
          </div>
        )}

        {/* Accountant gets Collection Summary instead of map */}
        {isAccountant && (
          <div className="col-span-2 bg-card border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-card-foreground">Collection Summary</h2>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Cash Collections', amount: 284000, percent: 44, color: 'bg-emerald-500' },
                { label: 'Mobile Money', amount: 245000, percent: 38, color: 'bg-blue-500' },
                { label: 'POS/Card', amount: 89000, percent: 14, color: 'bg-purple-500' },
                { label: 'Bank Transfer', amount: 27000, percent: 4, color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{formatCurrency(item.amount)} ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts - all roles */}
        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">
              {isAccountant ? 'Payment Alerts' : 'Alerts'}
            </h2>
            <Badge variant="destructive" className="text-xs">
              {alerts.filter(a => !a.isRead).length} new
            </Badge>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {alerts.slice(0, 5).map((alert) => {
              const colors = {
                fraud: 'bg-red-500/20 text-red-400 border-red-500/30',
                inactive: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                sync: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                anomaly: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                info: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
              };

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${colors[alert.type]} ${!alert.isRead ? 'ring-1 ring-white/10' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.description}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Agents - admin/supervisor */}
        {(isAdmin || isSupervisor) && (
          <div className="bg-card border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-card-foreground">
                {isSupervisor ? 'Team Performance' : 'Top Performing Agents'}
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {agentStats
                .sort((a, b) => b.todayAmount - a.todayAmount)
                .slice(0, isSupervisor ? 3 : 5)
                .map((agent, index) => (
                  <div key={agent.officerId} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-amber-500 text-amber-950' :
                      index === 1 ? 'bg-slate-400 text-slate-900' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <img
                      src={agent.avatarUrl || "https://via.placeholder.com/40"}
                      alt={agent.officerName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{agent.officerName}</p>
                      <p className="text-xs text-muted-foreground">{agent.zone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-500">{formatCurrency(agent.todayAmount)}</p>
                      <p className="text-xs text-muted-foreground">{agent.todayCollections} collections</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Accountant gets Reconciliation Summary */}
        {isAccountant && (
          <div className="bg-card border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-card-foreground">Reconciliation Summary</h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: 'Total Deposits', value: formatCurrency(562000), status: 'Matched', color: 'text-emerald-500' },
                { label: 'Pending Verification', value: formatCurrency(43000), status: 'Pending', color: 'text-amber-500' },
                { label: 'Disputed Amount', value: formatCurrency(12000), status: 'Flagged', color: 'text-red-500' },
                { label: 'Commission Payouts', value: formatCurrency(28400), status: 'Processed', color: 'text-blue-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.status}</p>
                  </div>
                  <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manager gets Compliance Overview */}
        {isManager && (
          <div className="bg-card border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-card-foreground">Compliance Overview</h2>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'GPS Compliance', value: 94, color: 'bg-emerald-500' },
                { label: 'Receipt Accuracy', value: 98, color: 'bg-blue-500' },
                { label: 'Daily Reports', value: 87, color: 'bg-amber-500' },
                { label: 'Target Achievement', value: 81, color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Collections - all roles */}
        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Collections</h2>
            <span className="text-xs text-muted-foreground">Live feed</span>
          </div>
          <div className="divide-y divide-border">
            {recentCollections.slice(0, isSupervisor ? 3 : 5).map((collection) => (
              <div key={collection.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{collection.businessName}</p>
                  <p className="text-xs text-muted-foreground">by {collection.officerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">{formatCurrency(collection.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(collection.collectionDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
