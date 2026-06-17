import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IcnScale as Scale, IcnAlertCircle as AlertCircle, IcnCheckCircle2 as CheckCircle2, IcnClock as Clock, IcnX as XCircle } from "@/components/ui/Icons";
import { toast } from "sonner";

const formatCurrency = (val: number) => `GHS ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

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

const disputeData = [
  { id: "d1", businessName: "Kwame's Electronics Shop", businessId: "KSI-0003-SHP", collectorName: "Emmanuel Owusu", type: "duplicate", amount: 500, status: "open" as const, createdAt: "2024-06-08T16:00:00Z", description: "Same business collected twice within 2 hours", resolution: null, resolvedBy: null },
  { id: "d2", businessName: "Ofori's Tailoring Shop", businessId: "KSI-0005-TLR", collectorName: "Akua Mensah", type: "overpayment", amount: 150, status: "investigating" as const, createdAt: "2024-06-05T11:00:00Z", description: "Customer claims overpayment of GHS 150 on levy", resolution: null, resolvedBy: null },
  { id: "d3", businessName: "Adwoa's Chop Bar", businessId: "KSI-0002-RST", collectorName: "Kofi Asante", type: "missing_receipt", amount: 200, status: "resolved" as const, createdAt: "2024-06-03T10:00:00Z", description: "Payment made but no receipt issued", resolution: "Receipt re-issued and delivered to business owner", resolvedBy: "Mrs. Abena Yiadom" },
  { id: "d4", businessName: "Nana's Car Wash", businessId: "KSI-0006-GRG", collectorName: "Yaw Darko", type: "wrong_amount", amount: 80, status: "open" as const, createdAt: "2024-06-10T14:30:00Z", description: "Agent collected GHS 200 instead of GHS 120", resolution: null, resolvedBy: null },
  { id: "d5", businessName: "Peace Pharmacy", businessId: "KSI-0004-DRG", collectorName: "Kofi Asante", type: "underpayment", amount: 100, status: "resolved" as const, createdAt: "2024-05-28T09:00:00Z", description: "Paid GHS 250 instead of GHS 350", resolution: "Business paid remaining GHS 100 plus late fee", resolvedBy: "Mr. John Mensah" },
  { id: "d6", businessName: "Makola Trading Ventures", businessId: "KSI-0001-MKT", collectorName: "Emmanuel Owusu", type: "other", amount: 300, status: "dismissed" as const, createdAt: "2024-05-20T08:00:00Z", description: "Business claimed levy was waived — investigation found no waiver on record", resolution: "Dispute dismissed — levy stands", resolvedBy: "Dr. Kwame Asante" },
  { id: "d7", businessName: "Adwoa's Chop Bar", businessId: "KSI-0002-RST", collectorName: "Akua Mensah", type: "duplicate", amount: 350, status: "investigating" as const, createdAt: "2024-06-12T11:00:00Z", description: "Two collections on same day — possible duplicate entry", resolution: null, resolvedBy: null },
  { id: "d8", businessName: "Peace Pharmacy", businessId: "KSI-0004-DRG", collectorName: "Grace Ansah", type: "wrong_amount", amount: 50, status: "open" as const, createdAt: "2024-06-13T15:00:00Z", description: "GHS 50 overage recorded on mobile money transaction", resolution: null, resolvedBy: null },
];

export function Disputes() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [resolveDialog, setResolveDialog] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");
  const [disputes, setDisputes] = useState(disputeData);

  const filtered = disputes.filter(d => statusFilter === "all" || d.status === statusFilter);
  const openCount = disputes.filter(d => d.status === 'open').length;
  const investigatingCount = disputes.filter(d => d.status === 'investigating').length;
  const resolvedCount = disputes.filter(d => d.status === 'resolved').length;

  const handleResolve = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "resolved" as const, resolution, resolvedBy: "Dr. Kwame Asante" } : d));
    setResolveDialog(null);
    setResolution("");
    toast.success("Dispute resolved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dispute Resolution</h1>
        <p className="text-sm text-muted-foreground">Manage and resolve payment disputes and collection issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Scale className="w-4 h-4" /> Total Disputes</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{disputes.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" /> Open</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-500">{openCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Investigating</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-amber-500">{investigatingCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resolved</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-emerald-500">{resolvedCount}</p></CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
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
              {filtered.map((dispute) => {
                const StatusIcon = statusConfig[dispute.status]?.icon || AlertCircle;
                return (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-medium">{dispute.businessName}</TableCell>
                    <TableCell>{dispute.collectorName}</TableCell>
                    <TableCell><Badge variant="outline">{typeLabels[dispute.type] || dispute.type}</Badge></TableCell>
                    <TableCell>{formatCurrency(dispute.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[dispute.status]?.badge || "secondary"}>
                        <StatusIcon className="w-3 h-3 mr-1 inline" />{dispute.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(dispute.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {dispute.status === 'open' || dispute.status === 'investigating' ? (
                        <Dialog open={resolveDialog === dispute.id} onOpenChange={(o) => { setResolveDialog(o ? dispute.id : null); setResolution(''); }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Resolve</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Resolve Dispute</DialogTitle>
                              <DialogDescription>{dispute.businessName} — {typeLabels[dispute.type]} of {formatCurrency(dispute.amount)}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">{dispute.description}</p>
                              <div><Label>Resolution Details</Label><Textarea placeholder="Describe how this dispute was resolved..." value={resolution} onChange={e => setResolution(e.target.value)} className="mt-1" rows={4} /></div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setResolveDialog(null)}>Cancel</Button>
                              <Button onClick={() => handleResolve(dispute.id)} disabled={!resolution.trim()}>Confirm Resolution</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-xs text-muted-foreground">{dispute.resolvedBy || '-'}</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
