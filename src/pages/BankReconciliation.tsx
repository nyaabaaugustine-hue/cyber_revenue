import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IcnBuilding as Building2, IcnCheckCircle2 as CheckCircle2, IcnWarning as AlertTriangle, IcnX as XCircle, IcnHelpCircle as HelpCircle, IcnArrowUpDown as ArrowUpDown, IcnArrowUp as ArrowUp, IcnArrowDown as ArrowDown } from "@/components/ui/Icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const formatCurrency = (val: number) => `GHS ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const statusConfig: Record<string, { badge: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  matched: { badge: "default", icon: CheckCircle2 },
  unmatched: { badge: "outline", icon: HelpCircle },
  partial: { badge: "secondary", icon: AlertTriangle },
  flagged: { badge: "destructive", icon: XCircle },
};

const reconData = [
  { id: "r1", depositDate: "2024-06-14T08:00:00Z", depositRef: "KMA-BNK-20240614-001", depositAmount: 24580, collectedAmount: 24580, variance: 0, matchingEntries: 18, status: "matched", notes: "All collections accounted for" },
  { id: "r2", depositDate: "2024-06-13T08:00:00Z", depositRef: "KMA-BNK-20240613-001", depositAmount: 22350, collectedAmount: 22800, variance: 450, matchingEntries: 15, status: "matched", notes: "Slight over-deposit — interest adjustment" },
  { id: "r3", depositDate: "2024-06-12T08:00:00Z", depositRef: "KMA-BNK-20240612-001", depositAmount: 19200, collectedAmount: 21500, variance: -2300, matchingEntries: 14, status: "flagged", notes: "Shortfall of GHS 2,300 — pending investigation" },
  { id: "r4", depositDate: "2024-06-11T08:00:00Z", depositRef: "KMA-BNK-20240611-001", depositAmount: 25100, collectedAmount: 25100, variance: 0, matchingEntries: 20, status: "matched", notes: "Perfect match" },
  { id: "r5", depositDate: "2024-06-10T08:00:00Z", depositRef: "KMA-BNK-20240610-001", depositAmount: 18700, collectedAmount: 18700, variance: 0, matchingEntries: 12, status: "matched", notes: "All cleared" },
  { id: "r6", depositDate: "2024-06-09T08:00:00Z", depositRef: "KMA-BNK-20240609-001", depositAmount: 20000, collectedAmount: 20000, variance: 0, matchingEntries: 16, status: "matched", notes: "" },
  { id: "r7", depositDate: "2024-06-08T08:00:00Z", depositRef: "KMA-BNK-20240608-001", depositAmount: 15800, collectedAmount: 17200, variance: -1400, matchingEntries: 10, status: "flagged", notes: "Bank deposit less than collected — possible cash handling issue" },
  { id: "r8", depositDate: "2024-06-07T08:00:00Z", depositRef: "KMA-BNK-20240607-001", depositAmount: 23400, collectedAmount: 23400, variance: 0, matchingEntries: 19, status: "matched", notes: "" },
  { id: "r9", depositDate: "2024-06-06T08:00:00Z", depositRef: "KMA-BNK-20240606-001", depositAmount: 12000, collectedAmount: 15600, variance: -3600, matchingEntries: 8, status: "flagged", notes: "Significant shortfall — escalated to supervisor" },
  { id: "r10", depositDate: "2024-06-05T08:00:00Z", depositRef: "KMA-BNK-20240605-001", depositAmount: 21000, collectedAmount: 21000, variance: 0, matchingEntries: 17, status: "matched", notes: "" },
];

export function BankReconciliation() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = reconData.filter(e => statusFilter === "all" || e.status === statusFilter);
  const totalDeposits = filtered.reduce((s, e) => s + e.depositAmount, 0);
  const totalVariance = filtered.reduce((s, e) => s + e.variance, 0);
  const matchedCount = filtered.filter(e => e.status === 'matched').length;
  const flaggedCount = filtered.filter(e => e.status === 'flagged').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bank Reconciliation</h1>
        <p className="text-sm text-muted-foreground">Match daily collections against bank deposits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Building2 className="w-4 h-4" /> Total Deposits</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(totalDeposits)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-emerald-500">{matchedCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Flagged</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-500">{flaggedCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ArrowUpDown className="w-4 h-4" /> Net Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(totalVariance)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="matched">Matched</SelectItem>
            <SelectItem value="unmatched">Unmatched</SelectItem>
            <SelectItem value="partial">Partial Match</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deposit Date</TableHead>
                <TableHead>Deposit Ref</TableHead>
                <TableHead>Deposit Amount</TableHead>
                <TableHead>Collected Amount</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Entries</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => {
                const StatusIcon = statusConfig[entry.status]?.icon || HelpCircle;
                return (
                  <Sheet key={entry.id}>
                    <SheetTrigger asChild>
                      <TableRow className="cursor-pointer">
                        <TableCell className="font-medium">{new Date(entry.depositDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-mono text-sm">{entry.depositRef}</TableCell>
                        <TableCell>{formatCurrency(entry.depositAmount)}</TableCell>
                        <TableCell>{formatCurrency(entry.collectedAmount)}</TableCell>
                        <TableCell>
                          <span className={entry.variance >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                            {entry.variance >= 0 ? '+' : ''}{formatCurrency(entry.variance)}
                          </span>
                        </TableCell>
                        <TableCell>{entry.matchingEntries}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[entry.status]?.badge || "secondary"}>
                            <StatusIcon className="w-3 h-3 mr-1 inline" />{entry.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>Reconciliation Detail</SheetTitle>
                        <SheetDescription>Deposit {entry.depositRef}</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-xs text-muted-foreground font-medium">Deposit Reference</p><p className="text-sm font-mono font-medium">{entry.depositRef}</p></div>
                          <div><p className="text-xs text-muted-foreground font-medium">Date</p><p className="text-sm">{new Date(entry.depositDate).toLocaleDateString()}</p></div>
                        </div>
                        <div className="space-y-3 rounded-lg border p-4">
                          <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Deposit Amount</span><span className="text-sm font-medium">{formatCurrency(entry.depositAmount)}</span></div>
                          <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Collected Amount</span><span className="text-sm font-medium">{formatCurrency(entry.collectedAmount)}</span></div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm text-muted-foreground">Variance</span>
                            <span className={`text-sm font-semibold flex items-center gap-1 ${entry.variance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {entry.variance >= 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                              {entry.variance >= 0 ? '+' : ''}{formatCurrency(entry.variance)}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-xs text-muted-foreground font-medium">Matching Entries</p><p className="text-sm">{entry.matchingEntries}</p></div>
                          <div><p className="text-xs text-muted-foreground font-medium">Status</p><Badge variant={statusConfig[entry.status]?.badge || "secondary"} className="mt-1"><StatusIcon className="w-3 h-3 mr-1 inline" />{entry.status}</Badge></div>
                        </div>
                        <div><p className="text-xs text-muted-foreground font-medium">Notes</p><p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{entry.notes || 'No notes'}</p></div>
                      </div>
                    </SheetContent>
                  </Sheet>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
