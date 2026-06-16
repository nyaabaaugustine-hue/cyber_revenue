import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PaginatedResponse } from "../api/client";
import type { Dispute } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IcnScale as Scale, IcnAlertCircle as AlertCircle, IcnCheckCircle2 as CheckCircle2, IcnClock as Clock, IcnX as XCircle } from "@/components/ui/Icons";

const statusConfig: Record<string, { badge: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  open: { badge: "destructive", icon: AlertCircle },
  investigating: { badge: "outline", icon: Clock },
  resolved: { badge: "default", icon: CheckCircle2 },
  dismissed: { badge: "secondary", icon: XCircle },
};

const typeLabels: Record<string, string> = {
  overpayment: "Overpayment",
  underpayment: "Underpayment",
  missing_receipt: "Missing Receipt",
  wrong_amount: "Wrong Amount",
  duplicate: "Duplicate",
  other: "Other",
};

export function Disputes() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [resolveDialog, setResolveDialog] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["disputes", page, statusFilter],
    queryFn: () => api.get<PaginatedResponse<Dispute>>("/api/v1/disputes", {
      page, limit: 15, status: statusFilter !== "all" ? statusFilter : undefined,
    }).then(r => r.data),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      api.post(`/api/v1/disputes/${id}/resolve`, { resolution }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      setResolveDialog(null);
      setResolution("");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const entries = data?.data || [];
  const openCount = entries.filter(d => d.status === 'open').length;
  const investigatingCount = entries.filter(d => d.status === 'investigating').length;
  const resolvedCount = entries.filter(d => d.status === 'resolved').length;
  const totalAmount = entries.reduce((s, d) => s + d.amount, 0);

  const formatCurrency = (val: number) => `GHS ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dispute Resolution</h1>
        <p className="text-sm text-muted-foreground">Manage and resolve payment disputes and collection issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Scale className="w-4 h-4" /> Total Disputes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{entries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" /> Open
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{openCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Investigating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-500">{investigatingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-500">{resolvedCount}</p>
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Collector</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((dispute) => {
                const StatusIcon = statusConfig[dispute.status]?.icon || AlertCircle;
                return (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-medium">{dispute.businessName}</TableCell>
                    <TableCell>{dispute.collectorName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[dispute.type] || dispute.type}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(dispute.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[dispute.status]?.badge || "secondary"}>
                        <StatusIcon className="w-3 h-3 mr-1 inline" />
                        {dispute.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {dispute.status === 'open' || dispute.status === 'investigating' ? (
                        <Dialog open={resolveDialog === dispute.id} onOpenChange={(o) => { setResolveDialog(o ? dispute.id : null); setResolution(''); }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Resolve</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Resolve Dispute</DialogTitle>
                              <DialogDescription>
                                {dispute.businessName} — {typeLabels[dispute.type]} of {formatCurrency(dispute.amount)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Resolution Details</Label>
                                <Textarea
                                  placeholder="Describe how this dispute was resolved..."
                                  value={resolution}
                                  onChange={e => setResolution(e.target.value)}
                                  className="mt-1"
                                  rows={4}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setResolveDialog(null)}>Cancel</Button>
                              <Button onClick={() => resolveMutation.mutate({ id: dispute.id, resolution })} disabled={!resolution.trim()}>
                                Confirm Resolution
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {dispute.resolvedBy || '-'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
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
