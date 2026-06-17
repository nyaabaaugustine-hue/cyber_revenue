import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IcnCheckCircle as ShieldCheck, IcnShieldAlert as ShieldAlert, IcnShieldX as ShieldX, IcnClipboardCheck as ClipboardCheck, IcnWarning as AlertTriangle } from "@/components/ui/Icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { useComplianceChecks } from "@/hooks/useApiData";

const statusBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pass: "default",
  pending: "secondary",
  fail: "destructive",
};

export function Compliance() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: complianceData, isLoading } = useComplianceChecks();

  const entries = (complianceData || []).filter((e: any) => statusFilter === "all" || e.status === statusFilter);
  const passCount = entries.filter((e: any) => e.status === 'pass').length;
  const failCount = entries.filter((e: any) => e.status === 'fail').length;
  const pendingCount = entries.filter((e: any) => e.status === 'pending').length;
  const avgScore = entries.length > 0 ? Math.round(entries.reduce((s: number, e: any) => s + Number(e.score || 0), 0) / entries.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Compliance Center</h1>
        <p className="text-sm text-muted-foreground">Monitor agent adherence to operational procedures</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Passed</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold text-emerald-500">{passCount}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ShieldX className="w-4 h-4 text-red-500" /> Failed</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold text-red-500">{failCount}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-amber-500" /> Pending</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold text-amber-500">{pendingCount}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Avg Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold">{avgScore}%</p>
                <Progress value={avgScore} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Check Type</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions Required</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry: any) => (
                    <Sheet key={entry.id}>
                      <SheetTrigger asChild>
                        <TableRow className="cursor-pointer">
                          <TableCell className="font-medium">{entry.officerName}</TableCell>
                          <TableCell>{entry.checkType}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={Number(entry.score || 0)} className="w-20 h-2" />
                              <span className="text-sm">{entry.score}%</span>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant={statusBadge[entry.status]}>{entry.status}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(entry.checkedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {entry.requiredActions && entry.requiredActions.length > 0 ? (
                              <div className="flex items-center gap-1 text-amber-500">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="text-xs">{entry.requiredActions.length} action(s)</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </TableCell>
                        </TableRow>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-lg">
                        <SheetHeader>
                          <SheetTitle>Compliance Detail</SheetTitle>
                          <SheetDescription>Check results for {entry.officerName}</SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 mt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-muted-foreground font-medium">Agent</p><p className="text-sm font-medium">{entry.officerName}</p></div>
                            <div><p className="text-xs text-muted-foreground font-medium">Check Type</p><p className="text-sm">{entry.checkType}</p></div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium mb-2">Score</p>
                            <div className="flex items-center gap-3"><Progress value={Number(entry.score || 0)} className="flex-1 h-2.5" /><span className="text-lg font-bold">{entry.score}%</span></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-muted-foreground font-medium">Status</p><Badge variant={statusBadge[entry.status]} className="mt-1">{entry.status}</Badge></div>
                            <div><p className="text-xs text-muted-foreground font-medium">Checked By</p><p className="text-sm">{entry.checkedBy}</p></div>
                          </div>
                          <div><p className="text-xs text-muted-foreground font-medium">Date Checked</p><p className="text-sm">{new Date(entry.checkedAt).toLocaleString()}</p></div>
                          <div><p className="text-xs text-muted-foreground font-medium">Details</p><p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{entry.details}</p></div>
                          {entry.requiredActions && entry.requiredActions.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground font-medium mb-2">Required Actions</p>
                              <div className="space-y-2">
                                {entry.requiredActions.map((action: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /><span>{action}</span></div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
