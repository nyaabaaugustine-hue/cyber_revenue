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
    { label: "Today's Collections", value: agentData.todayCollections, icon: ReceiptIcon, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Today's Revenue", value: formatCurrency(agentData.todayAmount), icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Businesses Visited", value: agentData.todayVisits, icon: Building, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Performance Score", value: `${agentData.performanceScore}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Field Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {agentData.zone} &middot;{" "}
            <span className="text-emerald-500 font-medium">Active</span>
          </p>
        </div>
        <div className="flex gap-2">
          {offlineCount > 0 && (
            <Button variant="outline" size="sm" className="text-amber-500 border-amber-500/30">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {offlineCount} pending
            </Button>
          )}
          <Button size="sm" onClick={() => setShowCollectionForm(true)}>
            <ReceiptIcon className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Target Progress */}
      {agentData.targetAmount > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Daily Target</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(Number(agentData.todayAmount))} / {formatCurrency(agentData.targetAmount)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-indigo-500 h-2.5 rounded-full transition-all" style={{ width: `${Math.min(targetProgress, 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{targetProgress.toFixed(0)}% of daily target</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="businesses">Businesses ({filteredBusinesses.length})</TabsTrigger>
          <TabsTrigger value="history">Collection History ({agentCollections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search businesses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
          </div>

          <Card>
            <CardContent className="p-0 divide-y">
              {filteredBusinesses.map((biz) => (
                <div key={biz.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {biz.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{biz.name}</p>
                    <p className="text-xs text-muted-foreground">{biz.ownerName} &middot; {biz.ownerPhone}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={
                      biz.levyStatus === "paid" ? "text-emerald-500 border-emerald-500/30" :
                      biz.levyStatus === "overdue" ? "text-red-500 border-red-500/30" :
                      "text-amber-500 border-amber-500/30"
                    }>
                      {biz.levyStatus}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`tel:${biz.ownerPhone}`)}>
                      <Phone className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("Opening maps...")}>
                      <Navigation className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" className="h-8 text-xs" onClick={() => handleCollect(biz)}>
                      Collect
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-0 divide-y">
              {agentCollections.map((col) => (
                <div key={col.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <ReceiptIcon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{col.businessName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{col.receiptNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(col.amount)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{col.paymentMethod?.replace("_", " ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(col.collectionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {col.gpsVerified && (
                      <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30 mt-0.5">
                        GPS
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
