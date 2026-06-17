import { useState } from "react";
import {
  IcnDollar as DollarSign,
  IcnBuilding as Building,
  IcnCheckCircle as CheckCircle,
  IcnClock as Clock,
  IcnMapPin as MapPin,
  IcnReceipt as ReceiptIcon,
  IcnTrendUp as TrendingUp,
  IcnRefresh as Refresh,
  IcnSearch as Search,
  IcnPhone as Phone,
  IcnMap as Navigation,
  IcnWarning as AlertTriangle,
} from "@/components/ui/Icons";
import { useAuth } from "../utils/AuthContext";
import { businesses, recentCollections, agentStats, formatCurrency } from "../utils/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CollectionForm } from "./CollectionForm";
import type { Business } from "@/types";

const OFFLINE_KEY = "cyberrevenue_offline_collections";

function getOfflineCount(): number {
  try {
    const raw = localStorage.getItem(OFFLINE_KEY);
    return raw ? JSON.parse(raw).length : 0;
  } catch { return 0; }
}

export function FieldAgentDashboard() {
  const { user } = useAuth();
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState("businesses");
  const [searchQuery, setSearchQuery] = useState("");

  const agentData = agentStats.find(a => a.officerId === "off-1") || agentStats[0];
  const offlineCount = getOfflineCount();

  const stats = [
    { label: "Collections", value: agentData.todayCollections, icon: ReceiptIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Revenue", value: formatCurrency(agentData.todayAmount), icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Visited", value: agentData.todayVisits, icon: Building, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Score", value: `${agentData.performanceScore}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const targetProgress = agentData.targetAmount > 0
    ? (Number(agentData.todayAmount) / agentData.targetAmount) * 100
    : 0;

  const zoneBusinesses = businesses.filter(b => b.zoneId === "zone-1" || b.zoneId === "zone-2");

  const filteredBusinesses = zoneBusinesses.filter(b =>
    !searchQuery ||
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const agentCollections = recentCollections.filter(c => c.officerId === "off-1");

  const handleCollect = (biz: Business) => {
    setSelectedBusiness(biz);
    setShowCollectionForm(true);
  };

  return (
    <div className="space-y-3 sm:space-y-4 pb-20 sm:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">Field Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {agentData.zone} &middot;{" "}
            <span className="text-emerald-500 font-medium">Active</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {offlineCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-500">{offlineCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid — 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold truncate">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Target Progress */}
      {agentData.targetAmount > 0 && (
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm font-medium">Daily Target</span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                {formatCurrency(Number(agentData.todayAmount))} / {formatCurrency(agentData.targetAmount)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 sm:h-2.5">
              <div
                className={`h-2 sm:h-2.5 rounded-full transition-all ${targetProgress >= 80 ? 'bg-emerald-500' : targetProgress >= 50 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                style={{ width: `${Math.min(targetProgress, 100)}%` }}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{targetProgress.toFixed(0)}% completed</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-auto">
          <TabsTrigger value="businesses" className="flex-1 text-xs sm:text-sm">
            Businesses ({filteredBusinesses.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 text-xs sm:text-sm">
            History ({agentCollections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="space-y-3 mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search businesses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-10 sm:h-9 text-sm" />
          </div>

          <div className="space-y-2">
            {filteredBusinesses.map((biz) => (
              <Card key={biz.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Business Info */}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      {biz.photos && biz.photos[0] ? (
                        <img
                          src={biz.photos[0]}
                          alt={biz.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground shrink-0">
                          {biz.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{biz.name}</p>
                          <Badge variant="outline" className={`text-[10px] shrink-0 ${
                            biz.levyStatus === "paid" ? "text-emerald-500 border-emerald-500/30" :
                            biz.levyStatus === "overdue" ? "text-red-500 border-red-500/30" :
                            "text-amber-500 border-amber-500/30"
                          }`}>
                            {biz.levyStatus}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{biz.ownerName}</p>
                        <p className="text-[11px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {biz.locationDescription || 'No location'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons — full width on mobile */}
                  <div className="flex border-t divide-x">
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-500/5 active:bg-blue-500/10 transition-colors"
                      onClick={() => window.open(`tel:${biz.ownerPhone}`)}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 active:bg-muted transition-colors"
                      onClick={() => toast.info("Opening maps...")}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Navigate
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10 active:bg-emerald-500/15 transition-colors"
                      onClick={() => handleCollect(biz)}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Collect
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-10">
                <Building className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No businesses found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-2 mt-3">
          {agentCollections.length === 0 ? (
            <div className="text-center py-10">
              <ReceiptIcon className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No collections yet today</p>
            </div>
          ) : (
            agentCollections.map((col) => (
              <Card key={col.id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <ReceiptIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{col.businessName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-muted-foreground font-mono">{col.receiptNumber}</p>
                        {col.gpsVerified && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 text-emerald-500 border-emerald-500/30">
                            GPS
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-emerald-600">{formatCurrency(col.amount)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(col.collectionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Floating Collect Button — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:hidden z-40 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <Button
          size="lg"
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 pointer-events-auto"
          onClick={() => setShowCollectionForm(true)}
        >
          <ReceiptIcon className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Desktop New Collection button */}
      <div className="hidden sm:block">
        <Button
          className="w-full"
          onClick={() => setShowCollectionForm(true)}
        >
          <ReceiptIcon className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Collection Form */}
      {showCollectionForm && (
        <CollectionForm
          business={selectedBusiness as any}
          onClose={() => {
            setShowCollectionForm(false);
            setSelectedBusiness(null);
          }}
        />
      )}
    </div>
  );
}
