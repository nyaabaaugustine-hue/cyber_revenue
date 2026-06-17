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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<"form" | "receipt" | "history">("form");
  const [receiptData, setReceiptData] = useState<any>(null);
  const [offlineCount, setOfflineCount] = useState(getOfflineCollections().length);
  const [syncing, setSyncing] = useState(false);

  // Auto-request GPS on open
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsVerified(true);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const requestGps = () => {
    if (!navigator.geolocation) {
      toast.error("GPS not available");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsVerified(true);
        toast.success("GPS verified");
      },
      () => toast.error("Could not get GPS position"),
      { enableHighAccuracy: true, timeout: 10000 }
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
    return (
      <Sheet open onOpenChange={() => onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
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

          <div className="border rounded-xl p-5 space-y-3 bg-card">
            <div className="text-center border-b pb-3">
              <p className="text-xs text-muted-foreground">KUMASI METROPOLITAN ASSEMBLY</p>
              <p className="text-xs text-muted-foreground">Revenue Collection Receipt</p>
              <p className="font-mono font-bold text-lg mt-1">{receiptData.receiptNumber}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date(receiptData.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business</span>
                <span className="font-medium text-right">{receiptData.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Code</span>
                <span className="font-mono">{receiptData.businessCode}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-lg">{formatCurrency(receiptData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="capitalize">{receiptData.paymentMethod?.replace("_", " ")}</span>
              </div>
              {receiptData.mobileMoneyRef && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MoMo Ref</span>
                  <span className="font-mono text-xs">{receiptData.mobileMoneyRef}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPS Verified</span>
                <span>{receiptData.gpsVerified ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Collected By</span>
                <span>{receiptData.officerName}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => {
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(`<!DOCTYPE html><html><head><title>Receipt ${receiptData.receiptNumber}</title><style>body{font-family:monospace;padding:20px;max-width:400px;margin:0 auto}.header{text-align:center;border-bottom:2px dashed #333;padding-bottom:10px}.row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dotted #ccc}.label{color:#666}.value{font-weight:bold}.total{font-size:1.3em;border-top:2px solid #333;margin-top:10px;padding-top:10px}.footer{text-align:center;margin-top:15px;font-size:0.8em;color:#666}</style></head><body><div class="header"><p>KUMASI METROPOLITAN ASSEMBLY</p><p>Revenue Collection Receipt</p><h2>${receiptData.receiptNumber}</h2></div><div class="row"><span class="label">Date</span><span class="value">${new Date(receiptData.timestamp).toLocaleString()}</span></div><div class="row"><span class="label">Business</span><span class="value">${receiptData.businessName}</span></div><div class="row"><span class="label">Code</span><span class="value">${receiptData.businessCode}</span></div><div class="row total"><span class="label">Amount</span><span class="value">GHS ${receiptData.amount.toFixed(2)}</span></div><div class="row"><span class="label">Method</span><span class="value">${receiptData.paymentMethod?.replace("_", " ")}</span></div>${receiptData.mobileMoneyRef ? `<div class="row"><span class="label">MoMo Ref</span><span class="value">${receiptData.mobileMoneyRef}</span></div>` : ''}<div class="row"><span class="label">GPS Verified</span><span class="value">${receiptData.gpsVerified ? "Yes" : "No"}</span></div><div class="row"><span class="label">Collected By</span><span class="value">${receiptData.officerName}</span></div><div class="footer"><p>Thank you for your payment</p><p>This is a computer generated receipt</p></div></body></html>`);
                printWindow.document.close();
                printWindow.print();
              }
            }}>
              Print Receipt
            </Button>
            <Button className="flex-1" onClick={() => { setView("form"); setReceiptData(null); setAmount(""); setPaymentMethod(""); setMobileMoneyRef(""); setNotes(""); }}>
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
                className="flex-1"
                onClick={requestGps}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {gpsVerified ? "Verified" : "Verify Location"}
              </Button>
              {gpsVerified && gpsCoords && (
                <span className="text-xs text-muted-foreground self-center">
                  {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}
                </span>
              )}
            </div>
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
