import { useState, useMemo } from "react";
import { IcnSearch as Search, IcnWarning as AlertTriangle, IcnAlertCircle as AlertCircle, IcnInfo as Info, IcnCheckCircle2 as CheckCircle2 } from "@/components/ui/Icons";
import { anomalies, formatDate } from "../utils/data";
import { Anomaly } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const typeLabel: Record<string, string> = {
  duplicate_collection: "Duplicate Collection",
  gps_mismatch: "GPS Mismatch",
  inactive_agent: "Inactive Agent",
  cash_shortage: "Cash Shortage",
  sync_conflict: "Sync Conflict",
};

const severityVariant: Record<string, "info" | "warning" | "destructive"> = {
  info: "info",
  warning: "warning",
  error: "destructive",
};

export function Anomalies() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const [anomalyList, setAnomalyList] = useState(anomalies);

  const stats = useMemo(() => {
    const total = anomalyList.length;
    const critical = anomalyList.filter((a) => a.severity === "error").length;
    const warning = anomalyList.filter((a) => a.severity === "warning").length;
    const resolved = anomalyList.filter((a) => a.isResolved).length;
    return { total, critical, warning, resolved };
  }, [anomalyList]);

  const filtered = useMemo(() => {
    return anomalyList.filter((a) => {
      const tabMatch = activeTab === "active" ? !a.isResolved : a.isResolved;
      const severityMatch = severityFilter === "all" || a.severity === severityFilter;
      const searchMatch =
        a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeLabel[a.type] || a.type).toLowerCase().includes(searchTerm.toLowerCase());
      return tabMatch && severityMatch && searchMatch;
    });
  }, [anomalyList, activeTab, severityFilter, searchTerm]);

  const handleResolve = (id: string) => {
    setAnomalyList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: true } : a))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Anomaly Detection</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and resolve system anomalies, GPS mismatches, and suspicious activity
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All recorded anomalies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <Info className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.warning}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Anomalies closed</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anomalies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active
            {stats.total - stats.resolved > 0 && (
              <span className="ml-2 rounded-full bg-destructive text-destructive-foreground px-2 py-0.5 text-xs font-medium">
                {stats.total - stats.resolved}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <Separator className="my-4" />

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Detected Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No anomalies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((anomaly) => (
                      <Sheet key={anomaly.id}>
                        <SheetTrigger asChild>
                          <TableRow className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {typeLabel[anomaly.type] || anomaly.type}
                            </TableCell>
                            <TableCell>
                              <Badge variant={severityVariant[anomaly.severity]}>
                                {anomaly.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {anomaly.description}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(anomaly.detectedAt)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={anomaly.isResolved ? "success" : "destructive"}
                              >
                                {anomaly.isResolved ? "Resolved" : "Active"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {!anomaly.isResolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); handleResolve(anomaly.id); }}
                                >
                                  Resolve
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-lg">
                          <SheetHeader>
                            <SheetTitle>{anomaly.title}</SheetTitle>
                            <SheetDescription>
                              <Badge variant={severityVariant[anomaly.severity]} className="mt-1">
                                {anomaly.severity}
                              </Badge>
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4 mt-6">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Type</span>
                              <span className="font-medium text-right">{typeLabel[anomaly.type] || anomaly.type}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Description</span>
                              <span className="font-medium text-right max-w-[60%] text-right">{anomaly.description}</span>
                            </div>
                            {anomaly.officerName && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Officer</span>
                                <span className="font-medium text-right">{anomaly.officerName}</span>
                              </div>
                            )}
                            {anomaly.businessName && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Business</span>
                                <span className="font-medium text-right">{anomaly.businessName}</span>
                              </div>
                            )}
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Detected At</span>
                              <span className="font-medium text-right">{formatDate(anomaly.detectedAt)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Status</span>
                              <span className="font-medium text-right">
                                <Badge variant={anomaly.isResolved ? "success" : "destructive"}>
                                  {anomaly.isResolved ? "Resolved" : "Active"}
                                </Badge>
                              </span>
                            </div>
                            {anomaly.metadata && Object.keys(anomaly.metadata).length > 0 && (
                              <div className="py-2 border-b">
                                <span className="text-muted-foreground block mb-2">Metadata</span>
                                <div className="space-y-1">
                                  {Object.entries(anomaly.metadata).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">{key}</span>
                                      <span className="font-medium">{String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {anomaly.isResolved && (
                              <>
                                <div className="flex justify-between py-2 border-b">
                                  <span className="text-muted-foreground">Resolved By</span>
                                  <span className="font-medium text-right">{anomaly.resolvedBy}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                  <span className="text-muted-foreground">Resolved At</span>
                                  <span className="font-medium text-right">{formatDate(anomaly.resolvedAt!)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </SheetContent>
                      </Sheet>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
