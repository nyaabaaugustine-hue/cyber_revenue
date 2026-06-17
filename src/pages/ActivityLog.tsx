import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  IcnActivity as Activity, IcnFilter as Filter, IcnRefresh as RefreshCw, IcnClock as Clock, IcnUserCheck as UserCheck, IcnAlertCircle as AlertCircle, IcnCheckCircle2 as CheckCircle2,
} from "@/components/ui/Icons";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger,
} from "@/components/ui/sheet";

const severityIcon: Record<string, React.ElementType> = {
  info: Activity,
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
};

const severityColor: Record<string, string> = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
};

const severityBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  info: "secondary",
  success: "default",
  warning: "outline",
  error: "destructive",
};

interface ActivityEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  details: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

const actors = [
  { name: "Dr. Kwame Asante", role: "admin", id: "user-1" },
  { name: "Mrs. Abena Yiadom", role: "supervisor", id: "user-2" },
  { name: "Mr. John Mensah", role: "supervisor", id: "user-3" },
  { name: "Ms. Esi Gyan", role: "accountant", id: "user-4" },
  { name: "Mr. Kwabena Danso", role: "manager", id: "user-5" },
  { name: "Mr. Kofi Appiah", role: "field_officer", id: "user-6" },
];

const actionTemplates = [
  { action: "created", resource: "business", severity: "success" as const, details: (r: string) => `Registered new business "${r}" in Zone B - Adum` },
  { action: "created", resource: "collection", severity: "success" as const, details: (r: string) => `Recorded collection of GHS ${(Math.random()*2000+50).toFixed(0)} for ${r}` },
  { action: "updated", resource: "business", severity: "info" as const, details: (r: string) => `Updated business details for ${r}` },
  { action: "verified", resource: "collection", severity: "success" as const, details: (r: string) => `GPS-verified collection receipt for ${r}` },
  { action: "created", resource: "visit", severity: "info" as const, details: (r: string) => `Completed field visit to ${r}` },
  { action: "approved", resource: "remittance", severity: "success" as const, details: (r: string) => `Approved cash remittance of GHS ${(Math.random()*5000+500).toFixed(0)} from ${r}` },
  { action: "updated", resource: "agent", severity: "info" as const, details: (r: string) => `Updated agent profile for ${r}` },
  { action: "rejected", resource: "dispute", severity: "warning" as const, details: (r: string) => `Dispute from ${r} rejected — insufficient evidence` },
  { action: "resolved", resource: "anomaly", severity: "success" as const, details: (r: string) => `Resolved GPS mismatch anomaly for ${r}` },
  { action: "created", resource: "invoice", severity: "info" as const, details: (r: string) => `Generated levy invoice for ${r}` },
  { action: "updated", resource: "settings", severity: "info" as const, details: (_r: string) => `Updated commission rate from 5% to 7%` },
  { action: "created", resource: "user", severity: "success" as const, details: (r: string) => `Created new user account for ${r}` },
  { action: "verified", resource: "remittance", severity: "success" as const, details: (r: string) => `Verified bank remittance from ${r}` },
  { action: "updated", resource: "zone", severity: "info" as const, details: (_r: string) => `Reassigned Zone C boundaries` },
  { action: "created", resource: "collection", severity: "success" as const, details: (r: string) => `Recorded mobile money collection for ${r}` },
];

const resourceNames = [
  "Adom Supermarket", "Amakom Pharmacy", "Kejetia Traders", "Asafo Hardware",
  "Bantama Mart", "Suame Auto Parts", "Tafo Textiles", "Dichemso Grocers",
  "Emmanuel Owusu", "Akua Mensah", "Kofi Asante", "Ama Boateng", "Yaw Darko",
  "Makola Trading Ventures", "Ahodwo Hair Salon", "Nhyiaeso Restaurant",
];

let eventCounter = 0;

function generateEvents(count: number, earlier = false): ActivityEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const actor = actors[Math.floor(Math.random() * actors.length)];
    const tpl = actionTemplates[Math.floor(Math.random() * actionTemplates.length)];
    const resource = resourceNames[Math.floor(Math.random() * resourceNames.length)];
    const now = new Date();
    const offset = earlier
      ? Math.floor(Math.random() * 86400000 * 3) + 3600000
      : Math.floor(Math.random() * 3600000);
    const ts = new Date(now.getTime() - offset);
    eventCounter++;
    return {
      id: `evt-${eventCounter}`,
      timestamp: ts.toISOString(),
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: tpl.action,
      resourceType: tpl.resource,
      resourceId: `${tpl.resource}-${Math.floor(Math.random() * 200 + 1)}`,
      resourceName: resource,
      details: tpl.details(resource),
      severity: tpl.severity,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function ActivityLog() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entries, setEntries] = useState<ActivityEntry[]>(() => generateEvents(40, true));

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateEvents(1);
      setEntries(prev => [...newEvent, ...prev].slice(0, 200));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filtered = entries.filter(e => {
    const matchSearch = !search || e.actorName.toLowerCase().includes(search.toLowerCase()) || e.resourceName.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || e.action === actionFilter;
    return matchSearch && matchAction;
  });

  const todayCount = entries.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length;
  const warningCount = entries.filter(e => e.severity === "warning").length;
  const errorCount = entries.filter(e => e.severity === "error").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Log</h1>
          <p className="text-sm text-muted-foreground">Real-time audit trail of all system actions</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEntries(prev => [...generateEvents(5), ...prev])}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{entries.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{todayCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-amber-500">{warningCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Errors</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-500">{errorCount}</p></CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Filter by actor name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((entry) => {
              const SevIcon = severityIcon[entry.severity] || Activity;
              return (
                <Sheet key={entry.id}>
                  <SheetTrigger asChild>
                    <div className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${severityColor[entry.severity]}`} />
                      <SevIcon className="w-4 h-4 mt-1.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{entry.actorName}</span>
                          <Badge variant="outline" className="text-xs">{entry.actorRole}</Badge>
                          <span className="text-sm text-muted-foreground">{entry.action}</span>
                          <Badge variant="secondary" className="text-xs">{entry.resourceType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{entry.details}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{entry.resourceName}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <Badge variant={severityBadge[entry.severity]} className="shrink-0">{entry.severity}</Badge>
                    </div>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-lg">
                    <SheetHeader>
                      <SheetTitle>Activity Detail</SheetTitle>
                      <SheetDescription>Full information about this event</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-xs text-muted-foreground font-medium">Actor</p><p className="text-sm font-medium">{entry.actorName}</p></div>
                        <div><p className="text-xs text-muted-foreground font-medium">Role</p><p className="text-sm">{entry.actorRole}</p></div>
                        <div><p className="text-xs text-muted-foreground font-medium">Action</p><Badge variant="outline" className="mt-1">{entry.action}</Badge></div>
                        <div><p className="text-xs text-muted-foreground font-medium">Severity</p><Badge variant={severityBadge[entry.severity]} className="mt-1">{entry.severity}</Badge></div>
                      </div>
                      <div><p className="text-xs text-muted-foreground font-medium">Resource Type</p><p className="text-sm">{entry.resourceType}</p></div>
                      <div><p className="text-xs text-muted-foreground font-medium">Resource ID</p><p className="text-sm font-mono">{entry.resourceId}</p></div>
                      <div><p className="text-xs text-muted-foreground font-medium">Resource Name</p><p className="text-sm">{entry.resourceName}</p></div>
                      <div><p className="text-xs text-muted-foreground font-medium">Timestamp</p><p className="text-sm">{new Date(entry.timestamp).toLocaleString()}</p></div>
                      <div><p className="text-xs text-muted-foreground font-medium">Details</p><p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{entry.details}</p></div>
                    </div>
                  </SheetContent>
                </Sheet>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
