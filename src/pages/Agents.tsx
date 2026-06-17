import { useState } from "react";
import {
  IcnSearch as Search,
  IcnGrid as LayoutGrid,
  IcnList as List,
  IcnPlus as UserPlus,
  IcnTrendUp as TrendingUp,
  IcnStar as Star,
  IcnUsers as Users,
  IcnMapPin as MapPin,
  IcnPhone as Phone,
  IcnCalendar as Calendar,
  IcnRefresh as Refresh,
  IcnEye as Eye,
  IcnWarning as AlertTriangle,
  IcnClock as Clock,
  IcnDollar as DollarSign,
} from "@/components/ui/Icons";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "../utils/data";
import { useAgents, useUpdateAgent } from "../hooks/useAgents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"; dot: string }> = {
  "in-field": { label: "In Field", variant: "success", dot: "bg-emerald-500" },
  "on-break": { label: "On Break", variant: "warning", dot: "bg-amber-500" },
  offline: { label: "Offline", variant: "secondary", dot: "bg-muted-foreground" },
  active: { label: "In Field", variant: "success", dot: "bg-emerald-500" },
  online: { label: "Online", variant: "success", dot: "bg-emerald-500" },
  break: { label: "On Break", variant: "warning", dot: "bg-amber-500" },
};

function statusVariant(s: string) {
  return statusMap[s]?.variant ?? "secondary";
}

function statusLabel(s: string) {
  return statusMap[s]?.label ?? s;
}

function statusDot(s: string) {
  return statusMap[s]?.dot ?? "bg-muted-foreground";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Agents() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const updateAgent = useUpdateAgent();

  const { data: apiAgents, isLoading, refetch } = useAgents();
  const agents = (Array.isArray(apiAgents) ? apiAgents : (apiAgents as any)?.data) || [];

  const filtered = agents.filter(
    (a: any) =>
      (a.officerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.zone || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalToday = filtered.reduce((s: number, a: any) => s + Number(a.todayAmount || 0), 0);
  const totalWeek = filtered.reduce((s: number, a: any) => s + Number(a.weekAmount || 0), 0);
  const totalMonth = filtered.reduce((s: number, a: any) => s + Number(a.monthAmount || 0), 0);
  const avgPerf =
    filtered.length > 0
      ? filtered.reduce((s: number, a: any) => s + (a.performanceScore || 0), 0) / filtered.length
      : 0;
  const activeNow = filtered.filter((a: any) => a.status === "online" || a.status === "active").length;

  const handleStatusChange = async (agent: any, newStatus: string) => {
    try {
      await updateAgent.mutateAsync({ id: agent.id || agent.officerId, updates: { status: newStatus } as any });
      toast.success(`Status updated to ${statusLabel(newStatus)}`);
      setSelectedAgent({ ...agent, status: newStatus });
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading && agents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h2 className="text-2xl font-bold tracking-tight">Agent Management</h2></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1,2,3].map(i => (
            <Card key={i}><CardContent className="p-6"><div className="animate-pulse flex items-center gap-4"><div className="h-10 w-10 rounded-lg bg-muted" /><div className="space-y-2 flex-1"><div className="h-4 bg-muted rounded w-1/3" /><div className="h-6 bg-muted rounded w-1/2" /></div></div></CardContent></Card>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5].map(i => (
            <Card key={i}><CardContent className="p-6"><div className="animate-pulse space-y-3"><div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-muted" /><div className="space-y-2 flex-1"><div className="h-4 bg-muted rounded w-2/3" /><div className="h-3 bg-muted rounded w-1/2" /></div></div><div className="h-2 bg-muted rounded w-full" /></div></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agent Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} agents &bull; {activeNow} active in field
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <Refresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => toast.success("Agent creation form opened")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Today's Revenue</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalToday)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Week Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalWeek)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Avg Performance</p>
                <p className="text-2xl font-bold mt-1">{avgPerf.toFixed(1)}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active Now</p>
                <p className="text-2xl font-bold mt-1">{activeNow}<span className="text-lg text-muted-foreground">/{filtered.length}</span></p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agents by name or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Agent Grid / List */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent: any) => (
            <Card
              key={agent.id || agent.officerId}
              className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
              onClick={() => setSelectedAgent(agent)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-background group-hover:ring-primary/20 transition-all">
                        <AvatarImage src={agent.avatarUrl} alt={agent.officerName} />
                        <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">{initials(agent.officerName)}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${statusDot(agent.status)}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{agent.officerName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {agent.zone}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant(agent.status)} className="text-[10px] h-5">
                    {statusLabel(agent.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{agent.todayCollections || 0}</p>
                    <p className="text-[10px] text-muted-foreground">Collections</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(Number(agent.todayAmount || 0))}</p>
                    <p className="text-[10px] text-muted-foreground">Amount</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{agent.todayVisits ?? 0}</p>
                    <p className="text-[10px] text-muted-foreground">Visits</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium">{agent.performanceScore || 0}%</span>
                  </div>
                  <Progress value={agent.performanceScore || 0} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Collections</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((agent: any) => (
                <TableRow
                  key={agent.id || agent.officerId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={agent.avatarUrl} alt={agent.officerName} />
                          <AvatarFallback className="text-xs">{initials(agent.officerName)}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusDot(agent.status)}`} />
                      </div>
                      <div>
                        <span className="font-medium text-sm">{agent.officerName}</span>
                        <p className="text-xs text-muted-foreground">{agent.officerPhone || "—"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{agent.zone}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(agent.status)} className="text-[10px] h-5">
                      {statusLabel(agent.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm">{agent.todayCollections || 0}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(Number(agent.todayAmount || 0))}
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <Progress value={agent.performanceScore || 0} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium w-8 text-right">{agent.performanceScore || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); navigate("/map"); }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Agent Detail Sheet */}
      <Sheet open={!!selectedAgent} onOpenChange={(open) => { if (!open) setSelectedAgent(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedAgent?.avatarUrl} alt={selectedAgent?.officerName} />
                <AvatarFallback>{selectedAgent ? initials(selectedAgent.officerName) : ""}</AvatarFallback>
              </Avatar>
              {selectedAgent?.officerName}
            </SheetTitle>
            <SheetDescription>{selectedAgent?.zone}</SheetDescription>
          </SheetHeader>
          {selectedAgent && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant(selectedAgent.status)}>
                  {statusLabel(selectedAgent.status)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Last active: {selectedAgent.lastActiveAt ? formatDate(selectedAgent.lastActiveAt) : "Unknown"}
                </span>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Change Status</p>
                <div className="flex gap-2">
                  {[
                    { value: "online", label: "In Field" },
                    { value: "break", label: "On Break" },
                    { value: "offline", label: "Offline" },
                  ].map((opt) => (
                    <Button
                      key={opt.value}
                      size="sm"
                      variant={selectedAgent.status === opt.value ? "default" : "outline"}
                      onClick={() => handleStatusChange(selectedAgent, opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground text-xs">Performance Score</span>
                  <span className="font-medium text-sm">{selectedAgent.performanceScore || 0}%</span>
                </div>
                <Progress value={selectedAgent.performanceScore || 0} className="h-2" />
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3">Today</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-lg font-bold">{selectedAgent.todayCollections || 0}</p>
                    <p className="text-xs text-muted-foreground">Collections</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(Number(selectedAgent.todayAmount || 0))}</p>
                    <p className="text-xs text-muted-foreground">Amount</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-lg font-bold">{selectedAgent.todayVisits ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Visits</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Weekly Collections</p>
                  <p className="font-medium">{selectedAgent.weekCollections || 0}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(Number(selectedAgent.weekAmount || 0))}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Monthly Collections</p>
                  <p className="font-medium">{selectedAgent.monthCollections || 0}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(Number(selectedAgent.monthAmount || 0))}</p>
                </div>
              </div>

              {(selectedAgent.targetAmount || 0) > 0 && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground text-xs">Target Progress</span>
                      <span className="font-medium text-sm">{selectedAgent.targetPercent || 0}%</span>
                    </div>
                    <Progress value={Number(selectedAgent.targetPercent || 0)} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(Number(selectedAgent.todayAmount || 0))} / {formatCurrency(Number(selectedAgent.targetAmount || 0))}
                    </p>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { toast.info("Opening map..."); navigate("/map"); }}>
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => toast.info("Calling agent...")}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Agent
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
