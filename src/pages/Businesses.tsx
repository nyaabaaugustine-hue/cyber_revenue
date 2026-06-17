import { useState } from "react";
import { IcnSearch as Search, IcnPlus as Plus, IcnPhone as Phone, IcnMapPin as MapPin, IcnClock as Clock, IcnBuilding as Building2, IcnUser as User, IcnDollar as DollarSign, IcnFile as FileText, IcnNav as Navigation } from "@/components/ui/Icons";
import { useNavigate } from "react-router-dom";
import { useBusinesses } from "../hooks/useApiData";
import { formatDate } from "../utils/data";
import { useAuth } from "../utils/AuthContext";
import { hasPermission } from "../utils/permissions";
import type { Business } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";

const statusVariant: Record<string, "success" | "secondary" | "warning" | "destructive"> = {
  active: "success",
  inactive: "secondary",
  flagged: "warning",
  closed: "destructive",
};

const levyVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  paid: "success",
  due: "warning",
  overdue: "destructive",
  partial: "warning",
  waived: "secondary",
};

export function Businesses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [formPhoto, setFormPhoto] = useState("");

  const { data: businessesData, isLoading } = useBusinesses({ limit: 100 });
  const allBusinesses = businessesData?.data || [];

  const filteredBusinesses = allBusinesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.businessId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRegister = () => {
    toast.success('Business registered successfully');
    setDialogOpen(false);
    setFormPhoto("");
  };

  const handleViewOnMap = (b: Business) => {
    navigate(`/map?business=${b.businessId}&lat=${b.location.lat}&lng=${b.location.lng}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-10 flex-1 min-w-[280px]" />
          <Skeleton className="h-10 w-[160px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Business Registry</h2>
          <p className="text-sm text-muted-foreground">
            {filteredBusinesses.length} businesses found
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Register Business
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Register New Business</DialogTitle>
              <DialogDescription>
                Fill in the details to register a new business in the district.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" placeholder="e.g. Makola Trading Ventures" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input id="ownerName" placeholder="Full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ownerPhone">Phone Number</Label>
                  <Input id="ownerPhone" placeholder="+233 XX XXX XXXX" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location Description</Label>
                <Input id="location" placeholder="e.g. Near Kejetia Market, Block C" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="fashion">Fashion & Textiles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Select>
                    <SelectTrigger id="zone">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zone-a">Zone A - Central</SelectItem>
                      <SelectItem value="zone-b">Zone B - Adum</SelectItem>
                      <SelectItem value="zone-c">Zone C - Bantama</SelectItem>
                      <SelectItem value="zone-d">Zone D - Suame</SelectItem>
                      <SelectItem value="zone-e">Zone E - Tafo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo">Business Photo URL</Label>
                <Input id="photo" placeholder="https://example.com/photo.jpg" value={formPhoto} onChange={(e) => setFormPhoto(e.target.value)} />
                {formPhoto && (
                  <div className="mt-2 rounded-lg overflow-hidden h-32 border">
                    <img src={formPhoto} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); setFormPhoto(""); }}>Cancel</Button>
              <Button type="submit" onClick={handleRegister}>Register Business</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="text-sm text-muted-foreground sr-only">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter" className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.map((business) => (
          <Card
            key={business.id}
            className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            onClick={() => setSelectedBusiness(business)}
          >
            {business.photos && business.photos.length > 0 && (
              <div className="h-40 overflow-hidden">
                <img
                  src={business.photos[0]}
                  alt={business.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{business.name}</CardTitle>
                  <p className="text-xs font-mono text-muted-foreground">{business.businessId}</p>
                </div>
                <Badge variant={statusVariant[business.status]}>{business.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="font-medium text-foreground">{business.ownerName}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{business.ownerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{business.locationDescription}</span>
                </div>
                {business.lastVisitedAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>Last visited: {formatDate(business.lastVisitedAt)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                <span className="font-mono">{business.zoneName}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewOnMap(business); }}>
                    <Navigation className="w-3 h-3 mr-1" />Map
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedBusiness(business); }}>
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!selectedBusiness} onOpenChange={(open) => { if (!open) setSelectedBusiness(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedBusiness?.name}</SheetTitle>
            <SheetDescription>{selectedBusiness?.businessId}</SheetDescription>
          </SheetHeader>
          {selectedBusiness && (
            <div className="mt-6 space-y-5">
              {selectedBusiness.photos && selectedBusiness.photos.length > 0 && (
                <div className="rounded-lg overflow-hidden h-48">
                  <img
                    src={selectedBusiness.photos[0]}
                    alt={selectedBusiness.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={statusVariant[selectedBusiness.status]}>{selectedBusiness.status}</Badge>
                <Badge variant={levyVariant[selectedBusiness.levyStatus]}>Levy: {selectedBusiness.levyStatus}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Owner</p>
                    <p className="font-medium">{selectedBusiness.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="font-medium">{selectedBusiness.ownerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Location</p>
                    <p className="font-medium">{selectedBusiness.location.lat.toFixed(4)}, {selectedBusiness.location.lng.toFixed(4)}</p>
                    {selectedBusiness.locationDescription && (
                      <p className="text-xs text-muted-foreground">{selectedBusiness.locationDescription}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleViewOnMap(selectedBusiness)}>
                  <Navigation className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Total Outstanding</p>
                    <p className="font-medium">GHS {Number(selectedBusiness.totalOutstanding).toLocaleString()}</p>
                  </div>
                </div>
                {selectedBusiness.lastPaymentDate && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Last Payment</p>
                      <p className="font-medium">{formatDate(selectedBusiness.lastPaymentDate)}</p>
                      {selectedBusiness.lastAmountPaid != null && (
                        <p className="text-xs text-muted-foreground">GHS {Number(selectedBusiness.lastAmountPaid).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Registered by</p>
                    <p className="font-medium">{selectedBusiness.registeredByName || selectedBusiness.registeredBy}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(selectedBusiness.registeredAt)}</p>
                  </div>
                </div>
                {selectedBusiness.notes && (
                  <div className="flex items-start gap-3 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-xs">Notes</p>
                      <p className="text-sm">{selectedBusiness.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {filteredBusinesses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Building2 className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">No businesses found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
