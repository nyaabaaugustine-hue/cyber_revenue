import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IcnDollar as DollarSign, IcnTrendUp as TrendingUp, IcnTrendDown as TrendingDown, IcnUsers2 as Users2 } from "@/components/ui/Icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { useCommissions } from "@/hooks/useApiData";
import { formatCurrency } from "@/utils/data";

const statusBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  cancelled: "destructive",
};

export function Commissions() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: commissions, isLoading } = useCommissions();

  const entries = (commissions || []).filter((e: any) => statusFilter === "all" || e.status === statusFilter);
  const totalCommission = entries.reduce((s: number, e: any) => s + Number(e.totalCommission || 0), 0);
  const totalBonus = entries.reduce((s: number, e: any) => s + Number(e.bonusAmount || 0), 0);
  const totalPenalties = entries.reduce((s: number, e: any) => s + Number(e.penaltyAmount || 0), 0);
  const uniqueAgents = new Set(entries.map((e: any) => e.officerName)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Commission Center</h1>
        <p className="text-sm text-muted-foreground">Agent incentive management and payout tracking</p>
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
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Total Commission</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold">{formatCurrency(totalCommission)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Total Bonuses</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold text-emerald-500">{formatCurrency(totalBonus)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingDown className="w-4 h-4" /> Total Penalties</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold text-red-500">{formatCurrency(totalPenalties)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Users2 className="w-4 h-4" /> Agents</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold">{uniqueAgents}</p></CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
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
                  {entries.map((entry: any) => (
                    <Sheet key={entry.id || entry.officerId}>
                      <SheetTrigger asChild>
                        <TableRow className="cursor-pointer">
                          <TableCell className="font-medium">{entry.officerName}</TableCell>
                          <TableCell>{entry.period}</TableCell>
                          <TableCell>{formatCurrency(Number(entry.baseCollection || 0))}</TableCell>
                          <TableCell className="text-emerald-500">{formatCurrency(Number(entry.bonusAmount || 0))}</TableCell>
                          <TableCell className="text-red-500">{formatCurrency(Number(entry.penaltyAmount || 0))}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(Number(entry.totalCommission || 0))}</TableCell>
                          <TableCell><Badge variant={statusBadge[entry.status] || "secondary"}>{entry.status}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{entry.paidAt ? new Date(entry.paidAt).toLocaleDateString() : '-'}</TableCell>
                        </TableRow>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-lg">
                        <SheetHeader>
                          <SheetTitle>Commission Detail</SheetTitle>
                          <SheetDescription>Full breakdown for {entry.officerName}</SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 mt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-muted-foreground font-medium">Agent</p><p className="text-sm font-medium">{entry.officerName}</p></div>
                            <div><p className="text-xs text-muted-foreground font-medium">Period</p><p className="text-sm">{entry.period}</p></div>
                          </div>
                          {entry.breakdown && entry.breakdown.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground font-medium">Commission Breakdown</p>
                              <div className="border rounded-md divide-y">
                                <div className="flex items-center justify-between px-3 py-2 bg-muted/50"><span className="text-xs font-medium">Item</span><span className="text-xs font-medium">Amount</span></div>
                                {entry.breakdown.map((item: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between px-3 py-2"><span className="text-sm">{item.label}</span><span className="text-sm font-medium">{formatCurrency(Number(item.amount || 0))}</span></div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                            <div><p className="text-xs text-muted-foreground font-medium">Base</p><p className="text-sm">{formatCurrency(Number(entry.baseCollection || 0))}</p></div>
                            <div><p className="text-xs text-muted-foreground font-medium">Bonus</p><p className="text-sm text-emerald-500">{formatCurrency(Number(entry.bonusAmount || 0))}</p></div>
                            <div><p className="text-xs text-muted-foreground font-medium">Penalty</p><p className="text-sm text-red-500">{formatCurrency(Number(entry.penaltyAmount || 0))}</p></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div><p className="text-xs text-muted-foreground font-medium">Total</p><p className="text-lg font-bold">{formatCurrency(Number(entry.totalCommission || 0))}</p></div>
                            <div><p className="text-xs text-muted-foreground font-medium">Status</p><Badge variant={statusBadge[entry.status] || "secondary"} className="mt-1">{entry.status}</Badge></div>
                          </div>
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
