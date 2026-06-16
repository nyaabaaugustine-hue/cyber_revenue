import { useState } from "react";
import { Download, TrendingUp, Users, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { dashboardStats, revenueTrend, categoryBreakdown, agentStats, formatCurrency } from "../utils/data";
import { AgentStats } from "../types";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(221.2 83.2% 53.3%)",
  "hsl(142.1 76.2% 36.3%)",
  "hsl(262.1 83.3% 57.8%)",
  "hsl(330.4 81.2% 60.4%)",
  "hsl(24.6 95% 53.1%)",
  "hsl(215.4 16.3% 46.9%)",
];

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
};

export function Reports() {
  const [selectedAgent, setSelectedAgent] = useState<AgentStats | null>(null);
  const [period, setPeriod] = useState("weekly");

  const revenue =
    period === "daily"
      ? dashboardStats.todayRevenue
      : period === "weekly"
        ? dashboardStats.weekRevenue
        : dashboardStats.monthRevenue;

  const collections =
    period === "daily"
      ? dashboardStats.todayCollections
      : period === "weekly"
        ? dashboardStats.weekCollections
        : dashboardStats.weekCollections * 4;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Revenue performance and agent analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="grid w-[240px] grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 font-medium">+12.5%</span> from last{" "}
              {period === "daily" ? "day" : period === "weekly" ? "week" : "month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Agents
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
              <Users className="h-4 w-4 text-sky-600 dark:text-sky-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of {dashboardStats.totalAgents} total agents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collections
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <FileText className="h-4 w-4 text-orange-600 dark:text-orange-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collections.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardStats.collectionRate}% collection rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Growth
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              vs target of {formatCurrency(dashboardStats.targetRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs text-muted-foreground"
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: any) => [formatCurrency(value ?? 0), "Revenue"]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="revenue"
                    nameKey="category"
                  >
                    {categoryBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: any) => [formatCurrency(value ?? 0), "Revenue"]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm text-muted-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agent Performance Ranking</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Agent
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Zone
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Today
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    This Week
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Collections
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...agentStats]
                  .sort((a, b) => b.performanceScore - a.performanceScore)
                  .map((agent, index) => (
                    <Sheet key={agent.officerId}>
                      <tr
                        className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              index === 0
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                                : index === 1
                                  ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                  : index === 2
                                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{agent.officerName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{agent.zone}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(agent.todayAmount)}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {formatCurrency(agent.weekAmount)}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {agent.todayCollections}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${agent.performanceScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8 text-right">
                              {agent.performanceScore}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <SheetContent side="right" className="w-full sm:max-w-lg">
                        <SheetHeader>
                          <SheetTitle>{agent.officerName}</SheetTitle>
                          <SheetDescription>Agent Performance Details</SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 mt-6">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Performance Score</span>
                            <span className="font-medium">{agent.performanceScore}/100</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Collections (Month)</span>
                            <span className="font-medium">{agent.monthCollections}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Revenue (Month)</span>
                            <span className="font-medium">{formatCurrency(agent.monthAmount)}</span>
                          </div>
                          <div className="py-2 border-b">
                            <div className="flex justify-between mb-2">
                              <span className="text-muted-foreground">Target Progress</span>
                              <span className="font-medium">{agent.performanceScore}%</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${agent.performanceScore}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Zone</span>
                            <span className="font-medium">{agent.zone}</span>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
