import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type PaginatedResponse } from "../api/client";
import type { ReconciliationEntry } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { IcnBuilding as Building2, IcnCheckCircle2 as CheckCircle2, IcnWarning as AlertTriangle, IcnX as XCircle, IcnHelpCircle as HelpCircle, IcnArrowUpDown as ArrowUpDown, IcnArrowUp as ArrowUp, IcnArrowDown as ArrowDown } from "@/components/ui/Icons";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger,
} from "@/components/ui/sheet";

const statusConfig: Record<string, { badge: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  matched: { badge: "default", icon: CheckCircle2 },
  unmatched: { badge: "outline", icon: HelpCircle },
  partial: { badge: "secondary", icon: AlertTriangle },
  flagged: { badge: "destructive", icon: XCircle },
};

export function BankReconciliation() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["reconciliation", page, statusFilter],
    queryFn: () => api.get<PaginatedResponse<ReconciliationEntry>>("/api/v1/reconciliation", {
      page, limit: 15, status: statusFilter !== "all" ? statusFilter : undefined,
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
  const totalDeposits = entries.reduce((s, e) => s + e.depositAmount, 0);
  const totalCollected = entries.reduce((s, e) => s + e.collectedAmount, 0);
  const totalVariance = entries.reduce((s, e) => s + e.variance, 0);
  const matchedCount = entries.filter(e => e.status === 'matched').length;
  const flaggedCount = entries.filter(e => e.status === 'flagged').length;

  const formatCurrency = (val: number) => `GHS ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bank Reconciliation</h1>
        <p className="text-sm text-muted-foreground">Match daily collections against bank deposits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Total Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalDeposits)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-500">{matchedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Flagged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{flaggedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" /> Net Variance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {formatCurrency(totalVariance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
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
              {entries.map((entry) => {
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
                            <StatusIcon className="w-3 h-3 mr-1 inline" />
                            {entry.status}
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
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Deposit Reference</p>
                            <p className="text-sm font-mono font-medium">{entry.depositRef}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Date</p>
                            <p className="text-sm">{new Date(entry.depositDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="space-y-3 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Deposit Amount</span>
                            <span className="text-sm font-medium">{formatCurrency(entry.depositAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Collected Amount</span>
                            <span className="text-sm font-medium">{formatCurrency(entry.collectedAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm text-muted-foreground">Variance</span>
                            <span className={`text-sm font-semibold flex items-center gap-1 ${entry.variance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {entry.variance >= 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                              {entry.variance >= 0 ? '+' : ''}{formatCurrency(entry.variance)}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Matching Entries</p>
                            <p className="text-sm">{entry.matchingEntries}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Status</p>
                            <Badge variant={statusConfig[entry.status]?.badge || "secondary"} className="mt-1">
                              <StatusIcon className="w-3 h-3 mr-1 inline" />
                              {entry.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Notes</p>
                          <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{entry.notes || 'No notes'}</p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data?.meta && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * 15) + 1}-{Math.min(page * 15, data.meta.total)} of {data.meta.total}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= (data.meta.totalPages || 1)} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
