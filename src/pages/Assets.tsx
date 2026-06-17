import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IcnSmartphone as Smartphone, IcnMonitor as Monitor, IcnPrinter as Printer, IcnShirt as Shirt, IcnCreditCard as CreditCard, IcnPackage as Package, IcnCheckCircle2 as CheckCircle2, IcnWarning as AlertTriangle } from "@/components/ui/Icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { useAssets } from "@/hooks/useApiData";

const typeConfig: Record<string, { icon: React.ElementType; label: string }> = {
  phone: { icon: Smartphone, label: 'Phone' },
  tablet: { icon: Monitor, label: 'Tablet' },
  printer: { icon: Printer, label: 'Printer' },
  uniform: { icon: Shirt, label: 'Uniform' },
  id_card: { icon: CreditCard, label: 'ID Card' },
  other: { icon: Package, label: 'Other' },
};

const conditionBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  good: "secondary",
  fair: "outline",
  damaged: "destructive",
  lost: "destructive",
};

export function Assets() {
  const [typeFilter, setTypeFilter] = useState("all");
  const { data: assets, isLoading } = useAssets();

  const allAssets = assets || [];
  const filtered = allAssets.filter((a: any) => typeFilter === "all" || a.type === typeFilter);
  const assignedCount = filtered.filter((a: any) => a.assignedTo).length;
  const unassignedCount = filtered.filter((a: any) => !a.assignedTo).length;
  const damagedCount = filtered.filter((a: any) => a.condition === 'damaged' || a.condition === 'lost').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <p className="text-sm text-muted-foreground">Track equipment and devices issued to field agents</p>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Assigned</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold text-emerald-500">{assignedCount}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unassigned</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold text-muted-foreground">{unassignedCount}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Damaged/Lost</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-bold text-red-500">{damagedCount}</p></CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Asset Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="printer">Printer</SelectItem>
                <SelectItem value="uniform">Uniform</SelectItem>
                <SelectItem value="id_card">ID Card</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Assigned At</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((asset: any) => {
                    const TypeIcon = typeConfig[asset.type]?.icon || Package;
                    return (
                      <Sheet key={asset.id}>
                        <SheetTrigger asChild>
                          <TableRow className="cursor-pointer">
                            <TableCell>
                              <div className="flex items-center gap-2"><TypeIcon className="w-4 h-4 text-muted-foreground" /><span>{typeConfig[asset.type]?.label || asset.type}</span></div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{asset.serialNumber}</TableCell>
                            <TableCell>{asset.assignedToName || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{asset.assignedAt ? new Date(asset.assignedAt).toLocaleDateString() : '-'}</TableCell>
                            <TableCell><Badge variant={conditionBadge[asset.condition] || "secondary"}>{asset.condition}</Badge></TableCell>
                            <TableCell className="text-sm text-muted-foreground">{asset.returnedAt ? new Date(asset.returnedAt).toLocaleDateString() : '-'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{asset.notes || '-'}</TableCell>
                          </TableRow>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-lg">
                          <SheetHeader>
                            <SheetTitle>Asset Detail</SheetTitle>
                            <SheetDescription>{typeConfig[asset.type]?.label || asset.type} - {asset.serialNumber}</SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4 mt-6">
                            <div className="flex items-center gap-3 pb-3 border-b">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><TypeIcon className="w-5 h-5 text-muted-foreground" /></div>
                              <div><p className="font-medium">{typeConfig[asset.type]?.label || asset.type}</p><p className="text-sm text-muted-foreground font-mono">{asset.serialNumber}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div><p className="text-xs text-muted-foreground font-medium">Condition</p><Badge variant={conditionBadge[asset.condition] || "secondary"} className="mt-1">{asset.condition}</Badge></div>
                              <div><p className="text-xs text-muted-foreground font-medium">Serial Number</p><p className="text-sm font-mono">{asset.serialNumber}</p></div>
                            </div>
                            <div><p className="text-xs text-muted-foreground font-medium">Assigned To</p><p className="text-sm">{asset.assignedToName || <span className="text-muted-foreground italic">Unassigned</span>}</p></div>
                            <div className="grid grid-cols-2 gap-4">
                              <div><p className="text-xs text-muted-foreground font-medium">Assigned Date</p><p className="text-sm">{asset.assignedAt ? new Date(asset.assignedAt).toLocaleDateString() : '-'}</p></div>
                              <div><p className="text-xs text-muted-foreground font-medium">Returned Date</p><p className="text-sm">{asset.returnedAt ? new Date(asset.returnedAt).toLocaleDateString() : '-'}</p></div>
                            </div>
                            <div><p className="text-xs text-muted-foreground font-medium">Notes</p><p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{asset.notes || 'No notes'}</p></div>
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
