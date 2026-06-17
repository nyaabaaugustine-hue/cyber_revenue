import { useState } from "react";
import { IcnSearch as Search, IcnDownload as Download, IcnDollar as DollarSign, IcnCalendar as Calendar, IcnReceipt as Receipt, IcnUser as User, IcnSmartphone as Smartphone, IcnMapPin as MapPin, IcnFile as FileText, IcnWarning as AlertTriangle, IcnCheckCircle2 as CheckCircle2, IcnClock as Clock } from "@/components/ui/Icons";
import { recentCollections, dueCollections, formatCurrency, formatDate } from "../utils/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";

export function Collections() {
  const [activeTab, setActiveTab] = useState("log");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState<typeof recentCollections[number] | null>(null);

  const filteredCollections = recentCollections.filter(c => {
    const matchesSearch = c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === "all" || c.paymentMethod === paymentFilter;
    let matchesDate = true;
    const today = new Date();
    const collectionDate = new Date(c.collectionDate);
    if (dateFilter === "today") {
      matchesDate = collectionDate.toDateString() === today.toDateString();
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = collectionDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = collectionDate >= monthAgo;
    }
    return matchesSearch && matchesPayment && matchesDate;
  });

  const totalAmount = filteredCollections.reduce((sum, c) => sum + c.amount, 0);

  const paymentMethodLabels: Record<string, string> = {
    cash: "Cash",
    mobile_money: "Mobile Money",
    pos: "POS",
    other: "Other",
  };

  const totalDue = dueCollections.reduce((s, d) => s + d.amountDue, 0);
  const overdueCount = dueCollections.filter(d => d.status === 'overdue').length;
  const dueSoonCount = dueCollections.filter(d => d.daysOverdue <= 0 && d.daysOverdue >= -3).length;

  const handleExportCSV = () => {
    const rows = filteredCollections.map(c => `${c.receiptNumber},${c.businessName},${c.officerName},${c.amount},${c.paymentMethod},${c.collectionDate}`);
    const csv = "Receipt,Business,Officer,Amount,Method,Date\n" + rows.join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'collections.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Collections exported as CSV');
  };

  const handleDateRange = () => {
    toast.info('Date range picker opened — select a range to filter');
  };

  const handleCollectNow = (businessName: string) => {
    toast.success(`Collection initiated for ${businessName}`);
  };

  const handlePrintReceipt = (c: typeof recentCollections[number]) => {
    const r = c;
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(JSON.stringify({ receipt: r.receiptNumber, amount: r.amount, business: r.businessName, date: r.collectionDate, agent: r.officerName }))}&bgcolor=ffffff&color=1e1b4b&margin=6`;
    const html = `<!DOCTYPE html><html><head><title>Receipt ${r.receiptNumber}</title><style>
      @page{size:80mm auto;margin:5mm}*{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Courier New',monospace;font-size:11px;padding:8mm;width:64mm;color:#000;background:#fff}
      .c{text-align:center}.b{border:1.5px dashed #000;padding:4mm;margin-bottom:3mm}
      .h{border-bottom:1.5px dashed #000;padding-bottom:3mm;margin-bottom:3mm}
      .r{display:flex;justify-content:space-between;padding:1.5mm 0;border-bottom:.5px dotted #ccc}
      .l{color:#555}.v{font-weight:700;text-align:right;max-width:55%}
      .t{font-size:16px;font-weight:700;border-top:1.5px solid #000;margin-top:3mm;padding-top:3mm}
      .s{font-size:8px;color:#888;margin-top:3mm;border-top:1px dashed #ccc;padding-top:2mm;text-align:center}
      .stamp{border:2px solid #1e3a5f;padding:2mm 4mm;display:inline-block;margin-top:3mm;border-radius:2mm}
      .stamp p{font-size:8px;color:#1e3a5f;font-weight:700;text-transform:uppercase;letter-spacing:1px}
      .qr{text-align:center;margin:3mm 0}.qr img{width:20mm;height:20mm;border:1px solid #eee;border-radius:2mm}
    </style></head><body>
      <div class="b"><div class="c h">
        <img src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1781607288/cyberreve_lhia3y.png" style="width:10mm;height:10mm;object-fit:contain;margin:0 auto 2mm" onerror="this.style.display='none'" />
        <p style="font-size:8px;letter-spacing:2px;color:#666">KUMASI METROPOLITAN ASSEMBLY</p>
        <p style="font-size:10px;font-weight:700;margin-top:1mm">REVENUE COLLECTION RECEIPT</p>
        <div class="stamp" style="margin-top:2mm"><p>&#10003; Server Verified</p></div>
      </div>
      <div style="text-align:center;padding:2mm 0;background:#f5f5f5;border-radius:1mm;margin-bottom:3mm">
        <p style="font-size:7px;color:#888;letter-spacing:1px">RECEIPT NUMBER</p>
        <p style="font-size:13px;font-weight:700;letter-spacing:1px">${r.receiptNumber}</p>
      </div>
      <div class="r"><span class="l">Date</span><span class="v">${new Date(r.collectionDate).toLocaleString()}</span></div>
      <div class="r"><span class="l">Business</span><span class="v">${r.businessName}</span></div>
      <div class="r"><span class="l">Officer</span><span class="v">${r.officerName}</span></div>
      <div class="r t"><span class="l">AMOUNT PAID</span><span class="v" style="font-size:16px">GHS ${r.amount.toFixed(2)}</span></div>
      <div class="r"><span class="l">Method</span><span class="v">${r.paymentMethod?.replace("_"," ")}</span></div>
      ${r.mobileMoneyRef ? `<div class="r"><span class="l">MoMo Ref</span><span class="v" style="font-size:9px">${r.mobileMoneyRef}</span></div>` : ''}
      <div class="r"><span class="l">GPS</span><span class="v">${r.gpsVerified ? 'Verified' : 'Not Verified'}</span></div>
      <div class="qr"><img src="${qr}" /><p style="font-size:7px;color:#aaa;margin-top:1mm">Scan to verify</p></div>
      <div class="s">
        <div class="stamp"><p>&#10003; CyberRevenue Verified</p></div>
        <p style="margin-top:2mm">This is a computer-generated receipt.</p>
        <p>Retain for your records. Thank you.</p>
      </div>
    </div></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
    toast.success(`Receipt ${r.receiptNumber} sent to printer`);
  };

  const handleWhatsAppReceipt = (c: typeof recentCollections[number]) => {
    const msg = encodeURIComponent(
      `*KMA Revenue Receipt*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `Receipt: ${c.receiptNumber}\n` +
      `Business: ${c.businessName}\n` +
      `Officer: ${c.officerName}\n` +
      `Amount: GHS ${c.amount.toFixed(2)}\n` +
      `Method: ${c.paymentMethod?.replace("_", " ")}\n` +
      `Date: ${new Date(c.collectionDate).toLocaleDateString()}\n` +
      `GPS: ${c.gpsVerified ? "Verified" : "Not Verified"}\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `Verified by CyberRevenue`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    toast.success(`Receipt shared via WhatsApp`);
  };

  const handleEmailReceipt = (c: typeof recentCollections[number]) => {
    const subject = encodeURIComponent(`KMA Revenue Receipt - ${c.receiptNumber}`);
    const body = encodeURIComponent(
      `KUMASI METROPOLITAN ASSEMBLY\n` +
      `Revenue Collection Receipt\n\n` +
      `Receipt Number: ${c.receiptNumber}\n` +
      `Business: ${c.businessName}\n` +
      `Collected By: ${c.officerName}\n` +
      `Amount: GHS ${c.amount.toFixed(2)}\n` +
      `Payment Method: ${c.paymentMethod?.replace("_", " ")}\n` +
      `Date: ${new Date(c.collectionDate).toLocaleDateString()}\n` +
      `GPS Verified: ${c.gpsVerified ? "Yes" : "No"}\n\n` +
      `This is a computer-generated receipt.\n` +
      `Verified by CyberRevenue`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    toast.success(`Receipt email opened`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Collections</h2>
          <p className="text-sm text-muted-foreground">Track and manage all revenue collections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDateRange}>
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="log">Collection Log</TabsTrigger>
          <TabsTrigger value="due">Due Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="space-y-6 mt-6">
          <Separator />
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by business or receipt number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
              </SelectContent>
            </Select>
            <Separator orientation="vertical" className="h-8 hidden md:block" />
            <div className="flex items-center gap-1">
              {[
                { value: "all", label: "All" },
                { value: "today", label: "Today" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={dateFilter === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{formatCurrency(totalAmount)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {filteredCollections.length} collection{filteredCollections.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>GPS Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No collections found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCollections.map((collection) => (
                      <TableRow
                        key={collection.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedCollection(collection)}
                      >
                        <TableCell>
                          <span className="font-mono text-sm">{collection.receiptNumber}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{collection.businessName}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{collection.officerName}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{formatCurrency(collection.amount)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {paymentMethodLabels[collection.paymentMethod] || collection.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(collection.collectionDate)}
                        </TableCell>
                        <TableCell>
                          {collection.gpsVerified ? (
                            <Badge variant="success">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Not Verified</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Print Receipt" onClick={() => handlePrintReceipt(collection)}>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Share via WhatsApp" onClick={() => handleWhatsAppReceipt(collection)}>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Email Receipt" onClick={() => handleEmailReceipt(collection)}>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Sheet open={!!selectedCollection} onOpenChange={(open) => { if (!open) setSelectedCollection(null); }}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Collection Receipt</SheetTitle>
                <SheetDescription>{selectedCollection?.receiptNumber}</SheetDescription>
              </SheetHeader>
              {selectedCollection && (
                <div className="mt-6 space-y-5">
                  <div className="flex items-center gap-3 text-sm">
                    <Receipt className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Receipt Number</p>
                      <p className="font-mono font-medium">{selectedCollection.receiptNumber}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">Business</p>
                        <p className="font-medium">{selectedCollection.businessName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">Officer</p>
                        <p className="font-medium">{selectedCollection.officerName}</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(selectedCollection.amount)}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {paymentMethodLabels[selectedCollection.paymentMethod] || selectedCollection.paymentMethod}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">Date</p>
                        <p className="font-medium">{formatDate(selectedCollection.collectionDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs">GPS Verification</p>
                        {selectedCollection.gpsVerified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="outline">Not Verified</Badge>
                        )}
                      </div>
                    </div>
                    {selectedCollection.paymentMethod === "mobile_money" && selectedCollection.mobileMoneyRef && (
                      <div className="flex items-center gap-3 text-sm">
                        <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-muted-foreground text-xs">Mobile Money Ref</p>
                          <p className="font-mono font-medium">{selectedCollection.mobileMoneyRef}</p>
                        </div>
                      </div>
                    )}
                    {selectedCollection.notes && (
                      <div className="flex items-start gap-3 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Notes</p>
                          <p>{selectedCollection.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => handlePrintReceipt(selectedCollection)}>
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Print
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => handleWhatsAppReceipt(selectedCollection)}>
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => handleEmailReceipt(selectedCollection)}>
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Email
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        <TabsContent value="due" className="space-y-6 mt-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalDue)}</div>
                <p className="text-xs text-muted-foreground mt-1">{dueCollections.length} pending payments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{overdueCount}</div>
                <p className="text-xs text-muted-foreground mt-1">past due date</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Due Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{dueSoonCount}</div>
                <p className="text-xs text-muted-foreground mt-1">within 3 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-3">
            {dueCollections
              .sort((a, b) => b.daysOverdue - a.daysOverdue)
              .map(d => (
                <Card key={d.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          d.status === 'overdue' ? 'bg-red-500/20' : d.status === 'partial' ? 'bg-blue-500/20' : 'bg-amber-500/20'
                        }`}>
                          {d.status === 'overdue' ? (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          ) : d.status === 'partial' ? (
                            <Clock className="w-5 h-5 text-blue-500" />
                          ) : (
                            <Calendar className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-foreground">{d.businessName}</p>
                            <Badge variant="outline" className="text-[10px] font-mono">{d.businessId}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{d.zone}</span>
                            <span>•</span>
                            <span>{d.ownerName}</span>
                            <span>•</span>
                            <span>{d.ownerPhone}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-lg font-bold text-foreground">{formatCurrency(d.amountDue)}</span>
                            {d.daysOverdue > 0 ? (
                              <Badge variant="destructive">{d.daysOverdue}d overdue</Badge>
                            ) : d.daysOverdue === 0 ? (
                              <Badge variant="default" className="bg-amber-500">Due today</Badge>
                            ) : (
                              <Badge variant="secondary">Due in {Math.abs(d.daysOverdue)}d</Badge>
                            )}
                            {d.status === 'partial' && (
                              <Badge variant="outline" className="border-blue-500 text-blue-500">Partial</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleCollectNow(d.businessName)}>
                        <DollarSign className="w-4 h-4 mr-1" />
                        Collect Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
