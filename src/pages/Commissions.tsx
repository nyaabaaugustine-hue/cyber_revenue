import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type PaginatedResponse } from "../api/client";
import type { CommissionEntry } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { IcnDollar as DollarSign, IcnTrendUp as TrendingUp, IcnTrendDown as TrendingDown, IcnUsers2 as Users2 } from "@/components/ui/Icons";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger,
} from "@/components/ui/sheet";

const statusBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  cancelled: "destructive",
};

export function Commissions() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["commissions", page, statusFilter],
    queryFn: () => api.get<PaginatedResponse<CommissionEntry>>("/api/v1/commissions", {
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
  const totalCommission = entries.reduce((s, e) => s + e.totalCommission, 0);
  const totalBonus = entries.reduce((s, e) => s + e.bonusAmount, 0);
  const totalPenalties = entries.reduce((s, e) => s + e.penaltyAmount, 0);
  const uniqueAgents = new Set(entries.map(e => e.officerName)).size;

  const formatCurrency = (val: number) => `GHS ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Commission Center</h1>
        <p className="text-sm text-muted-foreground">Agent incentive management and payout tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalCommission)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Total Bonuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-500">{formatCurrency(totalBonus)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4" /> Total Penalties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalPenalties)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users2 className="w-4 h-4" /> Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{uniqueAgents}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Base Collection</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Penalty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <Sheet key={entry.id}>
                  <SheetTrigger asChild>
                    <TableRow className="cursor-pointer">
                      <TableCell className="font-medium">{entry.officerName}</TableCell>
                      <TableCell>{entry.period}</TableCell>
                      <TableCell>{formatCurrency(entry.baseCollection)}</TableCell>
                      <TableCell className="text-emerald-500">{formatCurrency(entry.bonusAmount)}</TableCell>
                      <TableCell className="text-red-500">{formatCurrency(entry.penaltyAmount)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(entry.totalCommission)}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadge[entry.status]}>{entry.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {entry.paidAt ? new Date(entry.paidAt).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-lg">
                    <SheetHeader>
                      <SheetTitle>Commission Detail</SheetTitle>
                      <SheetDescription>Full breakdown for {entry.officerName}</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Agent</p>
                          <p className="text-sm font-medium">{entry.officerName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Period</p>
                          <p className="text-sm">{entry.period}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Commission Breakdown</p>
                        <div className="border rounded-md divide-y">
                          <div className="flex items-center justify-between px-3 py-2 bg-muted/50">
                            <span className="text-xs font-medium">Item</span>
                            <span className="text-xs font-medium">Amount</span>
                          </div>
                          {entry.breakdown.map((item, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2">
                              <span className="text-sm">{item.label}</span>
                              <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Base</p>
                          <p className="text-sm">{formatCurrency(entry.baseCollection)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Bonus</p>
                          <p className="text-sm text-emerald-500">{formatCurrency(entry.bonusAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Penalty</p>
                          <p className="text-sm text-red-500">{formatCurrency(entry.penaltyAmount)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Total</p>
                          <p className="text-lg font-bold">{formatCurrency(entry.totalCommission)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Status</p>
                          <Badge variant={statusBadge[entry.status]} className="mt-1">{entry.status}</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Paid Date</p>
                        <p className="text-sm">{entry.paidAt ? new Date(entry.paidAt).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
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
