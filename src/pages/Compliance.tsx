import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IcnCheckCircle as ShieldCheck, IcnShieldAlert as ShieldAlert, IcnShieldX as ShieldX, IcnClipboardCheck as ClipboardCheck, IcnWarning as AlertTriangle } from "@/components/ui/Icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const statusBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pass: "default",
  pending: "secondary",
  fail: "destructive",
};

const complianceData = [
  { id: "c1", officerName: "Emmanuel Owusu", officerId: "off-1", checkType: "GPS Verification", score: 98, status: "pass" as const, checkedAt: "2024-06-14T10:00:00Z", checkedBy: "Mrs. Abena Yiadom", details: "Agent verified GPS at all collection points. Excellent compliance.", requiredActions: [] },
  { id: "c2", officerName: "Emmanuel Owusu", officerId: "off-1", checkType: "Receipt Documentation", score: 95, status: "pass" as const, checkedAt: "2024-06-14T09:00:00Z", checkedBy: "Mrs. Abena Yiadom", details: "All receipts properly issued and documented.", requiredActions: [] },
  { id: "c3", officerName: "Akua Mensah", officerId: "off-2", checkType: "GPS Verification", score: 85, status: "pass" as const, checkedAt: "2024-06-14T10:30:00Z", checkedBy: "Mr. John Mensah", details: "Most GPS points verified. 2 collections missing GPS.", requiredActions: ["Add GPS verification to remaining collections"] },
  { id: "c4", officerName: "Kofi Asante", officerId: "off-3", checkType: "Daily Report", score: 60, status: "fail" as const, checkedAt: "2024-06-13T17:00:00Z", checkedBy: "Mrs. Abena Yiadom", details: "Daily report submitted 3 hours late. Missing 4 business visit logs.", requiredActions: ["Submit daily reports by 5 PM", "Log all business visits"] },
  { id: "c5", officerName: "Ama Boateng", officerId: "off-4", checkType: "Cash Handling", score: 92, status: "pass" as const, checkedAt: "2024-06-14T08:00:00Z", checkedBy: "Ms. Esi Gyan", details: "Cash reconciliation accurate. Minor rounding differences.", requiredActions: [] },
  { id: "c6", officerName: "Yaw Darko", officerId: "off-5", checkType: "GPS Verification", score: 45, status: "fail" as const, checkedAt: "2024-06-13T16:00:00Z", checkedBy: "Mr. John Mensah", details: "Multiple collections without GPS verification. Critical compliance failure.", requiredActions: ["GPS verify all remaining collections", "Retrain on GPS usage", "Submit explanation memo"] },
  { id: "c7", officerName: "Grace Ansah", officerId: "off-6", checkType: "Receipt Documentation", score: 88, status: "pass" as const, checkedAt: "2024-06-14T09:30:00Z", checkedBy: "Mrs. Abena Yiadom", details: "Good documentation. 1 receipt has missing business code.", requiredActions: ["Update receipt with business code"] },
  { id: "c8", officerName: "Samuel Adjei", officerId: "off-7", checkType: "Daily Report", score: 72, status: "pending" as const, checkedAt: "2024-06-14T11:00:00Z", checkedBy: "Mrs. Abena Yiadom", details: "Report under review. Partial data submitted.", requiredActions: ["Complete daily report submission"] },
  { id: "c9", officerName: "Mariam Idrissu", officerId: "off-8", checkType: "Cash Handling", score: 96, status: "pass" as const, checkedAt: "2024-06-14T08:30:00Z", checkedBy: "Ms. Esi Gyan", details: "Excellent cash handling. All amounts match.", requiredActions: [] },
  { id: "c10", officerName: "Emmanuel Owusu", officerId: "off-1", checkType: "Target Achievement", score: 100, status: "pass" as const, checkedAt: "2024-06-14T12:00:00Z", checkedBy: "Dr. Kwame Asante", details: "Agent exceeded monthly target by 15%. Outstanding performance.", requiredActions: [] },
  { id: "c11", officerName: "Akua Mensah", officerId: "off-2", checkType: "Target Achievement", score: 88, status: "pass" as const, checkedAt: "2024-06-14T12:30:00Z", checkedBy: "Dr. Kwame Asante", details: "On track to meet monthly target.", requiredActions: [] },
  { id: "c12", officerName: "Kofi Asante", officerId: "off-3", checkType: "GPS Verification", score: 70, status: "pending" as const, checkedAt: "2024-06-14T14:00:00Z", checkedBy: "Mr. John Mensah", details: "Partial GPS data submitted. Review in progress.", requiredActions: ["Awaiting additional GPS data from device"] },
  { id: "c13", officerName: "Yaw Darko", officerId: "off-5", checkType: "Cash Handling", score: 55, status: "fail" as const, checkedAt: "2024-06-13T18:00:00Z", checkedBy: "Ms. Esi Gyan", details: "Cash reconciliation shows GHS 350 discrepancy.", requiredActions: ["Reconcile cash drawer", "Submit explanation for variance", "Supervisor review required"] },
  { id: "c14", officerName: "Grace Ansah", officerId: "off-6", checkType: "Daily Report", score: 90, status: "pass" as const, checkedAt: "2024-06-14T17:00:00Z", checkedBy: "Mrs. Abena Yiadom", details: "Timely submission with complete data.", requiredActions: [] },
];

export function Compliance() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = complianceData.filter(e => statusFilter === "all" || e.status === statusFilter);
  const passCount = filtered.filter(e => e.status === 'pass').length;
  const failCount = filtered.filter(e => e.status === 'fail').length;
  const pendingCount = filtered.filter(e => e.status === 'pending').length;
  const avgScore = filtered.length > 0 ? Math.round(filtered.reduce((s, e) => s + e.score, 0) / filtered.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Compliance Center</h1>
        <p className="text-sm text-muted-foreground">Monitor agent adherence to operational procedures</p>
      </div>

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
              {filtered.map((entry) => (
                <Sheet key={entry.id}>
                  <SheetTrigger asChild>
                    <TableRow className="cursor-pointer">
                      <TableCell className="font-medium">{entry.officerName}</TableCell>
                      <TableCell>{entry.checkType}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={entry.score} className="w-20 h-2" />
                          <span className="text-sm">{entry.score}%</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={statusBadge[entry.status]}>{entry.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(entry.checkedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {entry.requiredActions.length > 0 ? (
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
                        <div className="flex items-center gap-3"><Progress value={entry.score} className="flex-1 h-2.5" /><span className="text-lg font-bold">{entry.score}%</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-xs text-muted-foreground font-medium">Status</p><Badge variant={statusBadge[entry.status]} className="mt-1">{entry.status}</Badge></div>
                        <div><p className="text-xs text-muted-foreground font-medium">Checked By</p><p className="text-sm">{entry.checkedBy}</p></div>
                      </div>
                      <div><p className="text-xs text-muted-foreground font-medium">Date Checked</p><p className="text-sm">{new Date(entry.checkedAt).toLocaleString()}</p></div>
                      <div><p className="text-xs text-muted-foreground font-medium">Details</p><p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{entry.details}</p></div>
                      {entry.requiredActions.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-2">Required Actions</p>
                          <div className="space-y-2">
                            {entry.requiredActions.map((action, i) => (
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
    </div>
  );
}
