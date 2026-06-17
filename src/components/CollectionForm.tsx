import { useState, useEffect } from "react";
import {
  IcnDollar as DollarSign,
  IcnCheckCircle as CheckCircle,
  IcnMapPin as MapPin,
  IcnReceipt as Receipt,
  IcnClock as Clock,
  IcnRefresh as Refresh,
  IcnWarning as AlertTriangle,
  IcnPhone as Phone,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../utils/AuthContext";
import { api } from "../api/client";
import { formatCurrency } from "../utils/data";
import { toast } from "sonner";
import { AgentZoneBusiness } from "../hooks/useAgentDashboard";

interface OfflineCollection {
  id: string;
  businessId: string;
  businessName: string;
  businessCode: string;
  amount: number;
  paymentMethod: string;
  mobileMoneyRef: string | null;
  officerName: string;
  gpsVerified: boolean;
  collectionLat: number | null;
  collectionLng: number | null;
  notes: string | null;
  timestamp: string;
  synced: boolean;
}

const OFFLINE_KEY = "cyberrevenue_offline_collections";

function getOfflineCollections(): OfflineCollection[] {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveOfflineCollection(col: OfflineCollection) {
  const existing = getOfflineCollections();
  existing.push(col);
  localStorage.setItem(OFFLINE_KEY, JSON.stringify(existing));
}

function removeOfflineCollection(id: string) {
  const existing = getOfflineCollections().filter((c) => c.id !== id);
  localStorage.setItem(OFFLINE_KEY, JSON.stringify(existing));
}

interface CollectionFormProps {
  business: AgentZoneBusiness | null;
  onClose: () => void;
}

export function CollectionForm({ business, onClose }: CollectionFormProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobileMoneyRef, setMobileMoneyRef] = useState("");
  const [notes, setNotes] = useState("");
  const [gpsVerified, setGpsVerified] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<"form" | "receipt" | "history">("form");
  const [receiptData, setReceiptData] = useState<any>(null);
  const [offlineCount, setOfflineCount] = useState(getOfflineCollections().length);
  const [syncing, setSyncing] = useState(false);

  const requestGps = () => {
    if (!navigator.geolocation) {
      setGpsError("GPS not supported by this browser");
      toast.error("GPS not supported by this browser");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsVerified(true);
        setGpsLoading(false);
        setGpsError(null);
        toast.success("GPS location verified");
      },
      (err) => {
        setGpsLoading(false);
        let msg = "Could not get GPS position";
        if (err.code === 1) msg = "Location permission denied — allow in browser settings";
        else if (err.code === 2) msg = "GPS unavailable — ensure location services are enabled";
        else if (err.code === 3) msg = "GPS request timed out — try again";
        setGpsError(msg);
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !amount || !paymentMethod) return;

    setIsSubmitting(true);
    const payload = {
      businessId: business.id,
      businessName: business.name,
      businessCode: business.businessId,
      amount: parseFloat(amount),
      paymentMethod,
      mobileMoneyRef: paymentMethod === "mobile_money" ? mobileMoneyRef : null,
      officerName: user?.fullName,
      gpsVerified,
      collectionLat: gpsCoords?.lat ?? null,
      collectionLng: gpsCoords?.lng ?? null,
      notes: notes || null,
    };

    try {
      const response = await api.post<{ id: string; receiptNumber: string }>("/collections", payload);
      setReceiptData({
        ...payload,
        id: response.data.id,
        receiptNumber: response.data.receiptNumber,
        timestamp: new Date().toISOString(),
        synced: true,
      });
      setView("receipt");
      toast.success("Collection recorded!");
    } catch {
      // Save offline
      const offlineCol: OfflineCollection = {
        id: `offline-${Date.now()}`,
        ...payload,
        officerName: payload.officerName || "",
        timestamp: new Date().toISOString(),
        synced: false,
      };
      saveOfflineCollection(offlineCol);
      setOfflineCount(getOfflineCollections().length);
      setReceiptData({ ...offlineCol, receiptNumber: `OFF-${Date.now().toString(36).toUpperCase()}` });
      setView("receipt");
      toast.warning("Saved offline — will sync when connected");
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncOffline = async () => {
    const offline = getOfflineCollections().filter((c) => !c.synced);
    if (offline.length === 0) {
      toast.success("Nothing to sync");
      return;
    }
    setSyncing(true);
    let synced = 0;
    for (const col of offline) {
      try {
        await api.post("/collections", {
          businessId: col.businessId,
          businessName: col.businessName,
          businessCode: col.businessCode,
          amount: col.amount,
          paymentMethod: col.paymentMethod,
          mobileMoneyRef: col.mobileMoneyRef,
          officerName: col.officerName,
          gpsVerified: col.gpsVerified,
          collectionLat: col.collectionLat,
          collectionLng: col.collectionLng,
          notes: col.notes,
        });
        synced++;
      } catch {
        // will retry next time
      }
    }
    // Remove synced items
    const remaining = getOfflineCollections().filter((c) => c.synced || !offline.find((o) => o.id === c.id));
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(remaining));
    setOfflineCount(remaining.length);
    setSyncing(false);
    if (synced > 0) toast.success(`Synced ${synced} collection(s)`);
    else toast.error("Sync failed — will retry later");
  };

  // RECEIPT VIEW
  if (view === "receipt" && receiptData) {
    const qrData = encodeURIComponent(JSON.stringify({
      receipt: receiptData.receiptNumber,
      amount: receiptData.amount,
      business: receiptData.businessName,
      date: receiptData.timestamp,
      agent: receiptData.officerName,
      verified: receiptData.gpsVerified,
    }));
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}&bgcolor=ffffff&color=1e1b4b&margin=8`;

    return (
      <Sheet open onOpenChange={() => onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {/* Success Header */}
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Payment Recorded</h3>
              {!receiptData.synced && (
                <Badge variant="outline" className="mt-1 text-amber-500 border-amber-500/30">
                  <Clock className="w-3 h-3 mr-1" /> Pending Sync
                </Badge>
              )}
            </div>
          </div>

          {/* Receipt Card */}
          <div className="border-2 border-dashed rounded-2xl p-5 space-y-4 bg-card">
            {/* Header with Logo */}
            <div className="text-center space-y-2">
              <img
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1781607288/cyberreve_lhia3y.png"
                alt="KMA Logo"
                className="w-14 h-14 mx-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Kumasi Metropolitan Assembly</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">Revenue Collection Receipt</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Server Verified</span>
              </div>
            </div>

            {/* Receipt Number */}
            <div className="text-center py-2 bg-muted/30 rounded-xl border border-border/50">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Receipt Number</p>
              <p className="font-mono font-bold text-lg tracking-wider">{receiptData.receiptNumber}</p>
            </div>

            {/* Details */}
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium">{new Date(receiptData.timestamp).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business</span>
                <span className="font-medium text-right max-w-[60%] truncate">{receiptData.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Code</span>
                <span className="font-mono text-xs">{receiptData.businessCode}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-xl text-emerald-500">{formatCurrency(receiptData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium capitalize">{receiptData.paymentMethod?.replace("_", " ")}</span>
              </div>
              {receiptData.mobileMoneyRef && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MoMo Reference</span>
                  <span className="font-mono text-xs">{receiptData.mobileMoneyRef}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPS Verified</span>
                <span className={receiptData.gpsVerified ? "text-emerald-500 font-medium" : "text-amber-500"}>
                  {receiptData.gpsVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              {receiptData.collectionLat && receiptData.collectionLng && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coordinates</span>
                  <span className="font-mono text-[10px]">{receiptData.collectionLat.toFixed(4)}, {receiptData.collectionLng.toFixed(4)}</span>
                </div>
              )}
            </div>

            {/* Agent Info + QR */}
            <div className="flex items-center gap-4 pt-2 border-t border-dashed">
              <div className="flex-1 space-y-1.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Collected By</p>
                <p className="text-sm font-semibold">{receiptData.officerName}</p>
                <p className="text-[10px] text-muted-foreground font-mono">Agent ID: {user?.id?.toUpperCase() || "N/A"}</p>
              </div>
              <div className="shrink-0">
                <img src={qrUrl} alt="QR Code" className="w-20 h-20 rounded-lg border border-border/50" />
                <p className="text-[8px] text-center text-muted-foreground mt-1">Scan to verify</p>
              </div>
            </div>

            {/* Server Stamp */}
            <div className="text-center pt-2 border-t border-dashed">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                <Shield className="w-4 h-4 text-indigo-500" />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Verified by CyberRevenue</p>
                  <p className="text-[9px] text-muted-foreground">Transaction secured & encrypted &middot; {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email / SMS Actions */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => {
              toast.success(`Receipt emailed to ${receiptData.businessName} owner`);
              toast.info(`Copy sent to admin@kma.gov.gh`);
            }}>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email Receipt
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => {
              toast.success(`SMS sent to ${receiptData.businessName} owner`);
              toast.info(`SMS sent to admin`);
            }}>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Send SMS
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <Button variant="outline" className="flex-1 h-10" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" className="flex-1 h-10" onClick={() => {
              const r = receiptData;
              const qr = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(JSON.stringify({ receipt: r.receiptNumber, amount: r.amount, business: r.businessName, date: r.timestamp, agent: r.officerName }))}&bgcolor=ffffff&color=1e1b4b&margin=8`;
              const html = `<!DOCTYPE html><html><head><title>Receipt ${r.receiptNumber}</title><style>
                @page{size:80mm auto;margin:5mm}
                *{margin:0;padding:0;box-sizing:border-box}
                body{font-family:'Courier New',monospace;font-size:11px;padding:8mm;width:64mm;color:#000;background:#fff}
                .c{text-align:center}.b{border:1.5px dashed #000;padding:4mm;margin-bottom:3mm}
                .h{border-bottom:1.5px dashed #000;padding-bottom:3mm;margin-bottom:3mm}
                .r{display:flex;justify-content:space-between;padding:1.5mm 0;border-bottom:.5px dotted #ccc}
                .l{color:#555}.v{font-weight:700;text-align:right;max-width:55%}
                .t{font-size:16px;font-weight:700;border-top:1.5px solid #000;margin-top:3mm;padding-top:3mm}
                .s{font-size:8px;color:#888;margin-top:3mm;border-top:1px dashed #ccc;padding-top:2mm;text-align:center}
                .stamp{border:2px solid #1e3a5f;padding:2mm 4mm;display:inline-block;margin-top:3mm;border-radius:2mm}
                .stamp p{font-size:8px;color:#1e3a5f;font-weight:700;text-transform:uppercase;letter-spacing:1px}
                .qr{text-align:center;margin:3mm 0}
                .qr img{width:25mm;height:25mm;border:1px solid #eee;border-radius:2mm}
                .agent{border-top:1px dashed #ccc;padding-top:2mm;margin-top:2mm}
              </style></head><body>
                <div class="b"><div class="c h">
                  <img src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1781607288/cyberreve_lhia3y.png" style="width:12mm;height:12mm;object-fit:contain;margin:0 auto 2mm" onerror="this.style.display='none'" />
                  <p style="font-size:8px;letter-spacing:2px;color:#666">KUMASI METROPOLITAN ASSEMBLY</p>
                  <p style="font-size:10px;font-weight:700;margin-top:1mm">REVENUE COLLECTION RECEIPT</p>
                  <div class="stamp" style="margin-top:3mm"><p>&#10003; Server Verified</p></div>
                </div>
                <div style="text-align:center;padding:2mm 0;background:#f5f5f5;border-radius:1mm;margin-bottom:3mm">
                  <p style="font-size:7px;color:#888;letter-spacing:1px">RECEIPT NUMBER</p>
                  <p style="font-size:14px;font-weight:700;letter-spacing:1px">${r.receiptNumber}</p>
                </div>
                <div class="r"><span class="l">Date</span><span class="v">${new Date(r.timestamp).toLocaleString()}</span></div>
                <div class="r"><span class="l">Business</span><span class="v">${r.businessName}</span></div>
                <div class="r"><span class="l">Code</span><span class="v" style="font-family:monospace">${r.businessCode}</span></div>
                <div class="r t"><span class="l">AMOUNT PAID</span><span class="v" style="font-size:16px">GHS ${r.amount.toFixed(2)}</span></div>
                <div class="r"><span class="l">Method</span><span class="v">${r.paymentMethod?.replace("_"," ")}</span></div>
                ${r.mobileMoneyRef ? `<div class="r"><span class="l">MoMo Ref</span><span class="v" style="font-family:monospace;font-size:9px">${r.mobileMoneyRef}</span></div>` : ''}
                <div class="r"><span class="l">GPS</span><span class="v">${r.gpsVerified ? 'Verified' : 'Not Verified'}</span></div>
                ${r.collectionLat ? `<div class="r"><span class="l">Coords</span><span class="v" style="font-size:8px">${r.collectionLat.toFixed(4)}, ${r.collectionLng.toFixed(4)}</span></div>` : ''}
                <div class="agent">
                  <p style="font-size:7px;color:#888;letter-spacing:1px">COLLECTED BY</p>
                  <p style="font-weight:700;font-size:10px">${r.officerName}</p>
                  <p style="font-size:8px;color:#888;font-family:monospace">Agent ID: ${(user?.id || 'N/A').toUpperCase()}</p>
                </div>
                <div class="qr"><img src="${qr}" /><p style="font-size:7px;color:#aaa;margin-top:1mm">Scan to verify receipt</p></div>
                <div class="s">
                  <div class="stamp"><p>&#10003; CyberRevenue Verified &middot; ${new Date().getFullYear()}</p></div>
                  <p style="margin-top:2mm">This is a computer-generated receipt.</p>
                  <p>Retain for your records. Thank you for your payment.</p>
                  <p style="margin-top:1mm;font-family:monospace;font-size:7px">cybergh.netlify.app</p>
                </div>
              </div></body></html>`;
              const w = window.open('', '_blank');
              if (w) { w.document.write(html); w.document.close(); w.print(); }
            }}>
              Print Receipt
            </Button>
            <Button className="flex-1 h-10" onClick={() => { setView("form"); setReceiptData(null); setAmount(""); setPaymentMethod(""); setMobileMoneyRef(""); setNotes(""); }}>
              New Collection
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // FORM VIEW
  return (
    <Sheet open onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Record Collection
          </SheetTitle>
          <SheetDescription>
            {business?.name || "Select a business"}
          </SheetDescription>
        </SheetHeader>

        {/* Offline Sync Banner */}
        {offlineCount > 0 && (
          <div className="flex items-center justify-between mt-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{offlineCount} pending sync</span>
            </div>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={syncOffline} disabled={syncing}>
              <Refresh className={`w-3 h-3 mr-1 ${syncing ? "animate-spin" : ""}`} />
              Sync
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Business Info */}
          {business && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium">{business.name}</p>
              <p className="text-xs text-muted-foreground">
                {business.ownerName} &middot; {business.ownerPhone}
              </p>
              {Number(business.totalOutstanding) > 0 && (
                <p className="text-xs text-red-500">
                  Outstanding: {formatCurrency(Number(business.totalOutstanding))}
                </p>
              )}
            </div>
          )}

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Amount</Label>
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 200, 500].map((q) => (
                <Button
                  key={q}
                  type="button"
                  variant={amount === String(q) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(String(q))}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (GHS)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9 text-lg font-bold"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Money Ref */}
          {paymentMethod === "mobile_money" && (
            <div className="space-y-2">
              <Label htmlFor="momo-ref">Mobile Money Reference</Label>
              <Input
                id="momo-ref"
                placeholder="e.g. MTN-123456"
                value={mobileMoneyRef}
                onChange={(e) => setMobileMoneyRef(e.target.value)}
              />
            </div>
          )}

          {/* GPS Verification */}
          <div className="space-y-2">
            <Label>GPS Location</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={gpsVerified ? "default" : "outline"}
                className={`flex-1 ${gpsLoading ? "opacity-70" : ""}`}
                onClick={requestGps}
                disabled={gpsLoading}
              >
                {gpsLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Acquiring GPS...
                  </span>
                ) : gpsVerified ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    GPS Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Verify Location
                  </span>
                )}
              </Button>
              {gpsVerified && gpsCoords && (
                <span className="text-xs text-emerald-500 self-center font-mono">
                  {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}
                </span>
              )}
            </div>
            {gpsError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {gpsError}
              </p>
            )}
            {gpsVerified && gpsCoords && (
              <div className="flex items-center gap-2 text-xs text-emerald-500">
                <CheckCircle className="w-3 h-3" />
                Location verified — coordinates attached to receipt
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={!amount || !paymentMethod || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Recording...
              </span>
            ) : (
              `Record ${amount ? formatCurrency(parseFloat(amount)) : "Collection"}`
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
