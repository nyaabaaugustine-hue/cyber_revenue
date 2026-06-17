import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IcnDollar as DollarSign, IcnTrendUp as TrendingUp, IcnTrendDown as TrendingDown, IcnUsers2 as Users2 } from "@/components/ui/Icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const formatCurrency = (val: number) => `GHS ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const agentNames = ["Emmanuel Owusu", "Akua Mensah", "Kofi Asante", "Ama Boateng", "Yaw Darko", "Grace Ansah", "Samuel Adjei", "Mariam Idrissu"];
const periods = ["Jun 2024", "May 2024", "Apr 2024", "Mar 2024"];
const statuses: Array<"paid" | "pending" | "cancelled"> = ["paid", "pending", "cancelled"];

const commissionData = agentNames.flatMap((name, i) =>
  periods.map((period, j) => {
    const base = Math.floor(Math.random() * 30000 + 10000);
    const rate = 0.05 + Math.random() * 0.04;
    const bonus = j === 0 ? Math.floor(Math.random() * 3000 + 500) : Math.floor(Math.random() * 1000);
    const penalty = j === 0 ? Math.floor(Math.random() * 800) : 0;
    const total = Math.floor(base * rate) + bonus - penalty;
    const status = j === 0 ? (Math.random() > 0.3 ? "paid" : "pending") : (Math.random() > 0.5 ? "paid" : "pending");
    return {
      id: `comm-${i}-${j}`,
      officerName: name,
      officerId: `off-${i + 1}`,
      period,
      baseCollection: base,
      commissionRate: rate,
      bonusAmount: bonus,
      penaltyAmount: penalty,
      totalCommission: total,
      status,
      paidAt: status === "paid" ? `2024-${String(6 - j).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}T10:00:00Z` : null,
      breakdown: [
        { label: "Base Commission (7%)", amount: Math.floor(base * 0.07) },
        { label: "Target Achievement Bonus", amount: bonus > 0 ? Math.floor(bonus * 0.6) : 0 },
        { label: "Perfect Attendance Bonus", amount: bonus > 0 ? Math.floor(bonus * 0.4) : 0 },
        { label: "Late Submission Penalty", amount: penalty > 0 ? Math.floor(penalty * 0.5) : 0 },
        { label: "Missed Visit Penalty", amount: penalty > 0 ? Math.floor(penalty * 0.5) : 0 },
      ],
    };
  })
);

const statusBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  cancelled: "destructive",
};

export function Commissions() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = commissionData.filter(e => statusFilter === "all" || e.status === statusFilter);
  const totalCommission = filtered.reduce((s, e) => s + e.totalCommission, 0);
  const totalBonus = filtered.reduce((s, e) => s + e.bonusAmount, 0);
  const totalPenalties = filtered.reduce((s, e) => s + e.penaltyAmount, 0);
  const uniqueAgents = new Set(filtered.map(e => e.officerName)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Commission Center</h1>
        <p className="text-sm text-muted-foreground">Agent incentive management and payout tracking</p>
      </div>

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
              {filtered.map((entry) => (
                <Sheet key={entry.id}>
                  <SheetTrigger asChild>
                    <TableRow className="cursor-pointer">
                      <TableCell className="font-medium">{entry.officerName}</TableCell>
                      <TableCell>{entry.period}</TableCell>
                      <TableCell>{formatCurrency(entry.baseCollection)}</TableCell>
                      <TableCell className="text-emerald-500">{formatCurrency(entry.bonusAmount)}</TableCell>
                      <TableCell className="text-red-500">{formatCurrency(entry.penaltyAmount)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(entry.totalCommission)}</TableCell>
                      <TableCell><Badge variant={statusBadge[entry.status]}>{entry.status}</Badge></TableCell>
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
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Commission Breakdown</p>
                        <div className="border rounded-md divide-y">
                          <div className="flex items-center justify-between px-3 py-2 bg-muted/50"><span className="text-xs font-medium">Item</span><span className="text-xs font-medium">Amount</span></div>
                          {entry.breakdown.map((item, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2"><span className="text-sm">{item.label}</span><span className="text-sm font-medium">{formatCurrency(item.amount)}</span></div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                        <div><p className="text-xs text-muted-foreground font-medium">Base</p><p className="text-sm">{formatCurrency(entry.baseCollection)}</p></div>
                        <div><p className="text-xs text-muted-foreground font-medium">Bonus</p><p className="text-sm text-emerald-500">{formatCurrency(entry.bonusAmount)}</p></div>
                        <div><p className="text-xs text-muted-foreground font-medium">Penalty</p><p className="text-sm text-red-500">{formatCurrency(entry.penaltyAmount)}</p></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div><p className="text-xs text-muted-foreground font-medium">Total</p><p className="text-lg font-bold">{formatCurrency(entry.totalCommission)}</p></div>
                        <div><p className="text-xs text-muted-foreground font-medium">Status</p><Badge variant={statusBadge[entry.status]} className="mt-1">{entry.status}</Badge></div>
                      </div>
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
