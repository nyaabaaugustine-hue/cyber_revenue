import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type PaginatedResponse } from "../api/client";
import type { ActivityEntry } from "../types";
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

export function ActivityLog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["activity", page, search, actionFilter],
    queryFn: () => api.get<PaginatedResponse<ActivityEntry>>("/api/v1/activity", {
      page, limit: 25, actor: search || undefined, action: actionFilter !== "all" ? actionFilter : undefined,
    }).then(r => r.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const entries = data?.data || [];
  const total = data?.meta?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Log</h1>
          <p className="text-sm text-muted-foreground">Real-time audit trail of all system actions</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{entries.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-500">{entries.filter(e => e.severity === 'warning').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{entries.filter(e => e.severity === 'error').length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by actor name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={actionFilter} onValueChange={v => { setActionFilter(v); setPage(1); }}>
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
            {entries.map((entry) => {
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
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant={severityBadge[entry.severity]} className="shrink-0">
                        {entry.severity}
                      </Badge>
                    </div>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-lg">
                    <SheetHeader>
                      <SheetTitle>Activity Detail</SheetTitle>
                      <SheetDescription>Full information about this event</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Actor</p>
                          <p className="text-sm font-medium">{entry.actorName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Role</p>
                          <p className="text-sm">{entry.actorRole}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Action</p>
                          <Badge variant="outline" className="mt-1">{entry.action}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Severity</p>
                          <Badge variant={severityBadge[entry.severity]} className="mt-1">{entry.severity}</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Resource Type</p>
                        <p className="text-sm">{entry.resourceType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Resource ID</p>
                        <p className="text-sm font-mono">{entry.resourceId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Resource Name</p>
                        <p className="text-sm">{entry.resourceName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Timestamp</p>
                        <p className="text-sm">{new Date(entry.timestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Details</p>
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{entry.details}</p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {data?.meta && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * 25) + 1}-{Math.min(page * 25, total)} of {total}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= (data.meta.totalPages || 1)} onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
