import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IcnBuilding as Building2, IcnCheckCircle2 as CheckCircle2, IcnWarning as AlertTriangle, IcnX as XCircle, IcnHelpCircle as HelpCircle, IcnArrowUpDown as ArrowUpDown, IcnArrowUp as ArrowUp, IcnArrowDown as ArrowDown } from "@/components/ui/Icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { useReconciliation } from "@/hooks/useApiData";
import { formatCurrency } from "@/utils/data";

const statusConfig: Record<string, { badge: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  matched: { badge: "default", icon: CheckCircle2 },
  unmatched: { badge: "outline", icon: HelpCircle },
  partial: { badge: "secondary", icon: AlertTriangle },
  flagged: { badge: "destructive", icon: XCircle },
};

export function BankReconciliation() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: reconData, isLoading } = useReconciliation();

  const entries = (reconData || []).filter((e: any) => statusFilter === "all" || e.status === statusFilter);
  const totalDeposits = entries.reduce((s: number, e: any) => s + Number(e.depositAmount || 0), 0);
  const totalVariance = entries.reduce((s: number, e: any) => s + Number(e.variance || 0), 0);
  const matchedCount = entries.filter((e: any) => e.status === 'matched').length;
  const flaggedCount = entries.filter((e: any) => e.status === 'flagged').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bank Reconciliation</h1>
        <p className="text-sm text-muted-foreground">Match daily collections against bank deposits</p>
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
                  {entries.map((entry: any) => {
                    const StatusIcon = statusConfig[entry.status]?.icon || HelpCircle;
                    return (
                      <Sheet key={entry.id}>
                        <SheetTrigger asChild>
                          <TableRow className="cursor-pointer">
                            <TableCell className="font-medium">{new Date(entry.depositDate).toLocaleDateString()}</TableCell>
                            <TableCell className="font-mono text-sm">{entry.depositRef}</TableCell>
                            <TableCell>{formatCurrency(Number(entry.depositAmount || 0))}</TableCell>
                            <TableCell>{formatCurrency(Number(entry.collectedAmount || 0))}</TableCell>
                            <TableCell>
                              <span className={Number(entry.variance || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                {Number(entry.variance || 0) >= 0 ? '+' : ''}{formatCurrency(Number(entry.variance || 0))}
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
                              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Deposit Amount</span><span className="text-sm font-medium">{formatCurrency(Number(entry.depositAmount || 0))}</span></div>
                              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Collected Amount</span><span className="text-sm font-medium">{formatCurrency(Number(entry.collectedAmount || 0))}</span></div>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-sm text-muted-foreground">Variance</span>
                                <span className={`text-sm font-semibold flex items-center gap-1 ${Number(entry.variance || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                  {Number(entry.variance || 0) >= 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                                  {Number(entry.variance || 0) >= 0 ? '+' : ''}{formatCurrency(Number(entry.variance || 0))}
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
        </>
      )}
    </div>
  );
}
