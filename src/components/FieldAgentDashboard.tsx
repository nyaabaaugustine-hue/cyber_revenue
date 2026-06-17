import { useState, useEffect } from "react";
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
import { useAgentDashboard, useAgentZoneBusinesses, useAgentCollections, AgentZoneBusiness } from "../hooks/useAgentDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../utils/data";
import { toast } from "sonner";
import { CollectionForm } from "./CollectionForm";

const OFFLINE_KEY = "cyberrevenue_offline_collections";

function getOfflineCount(): number {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_KEY) || "[]").length;
  } catch { return 0; }
}

export function FieldAgentDashboard() {
  const { user } = useAuth();
  const { data: dashboard, isLoading, refetch } = useAgentDashboard();
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<AgentZoneBusiness | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("businesses");
  const [offlineCount, setOfflineCount] = useState(getOfflineCount());

  const zoneId = dashboard?.agent?.zone;
  const { data: businesses = [], isLoading: loadingBusinesses } = useAgentZoneBusinesses(zoneId);
  const { data: collectionsData, isLoading: loadingCollections } = useAgentCollections(false);
  const collections = collectionsData?.data || [];

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Refresh offline count periodically
  useEffect(() => {
    const interval = setInterval(() => setOfflineCount(getOfflineCount()), 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = dashboard
    ? [
        { label: "Today's Collections", value: dashboard.todayCollections, icon: ReceiptIcon, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { label: "Today's Revenue", value: formatCurrency(Number(dashboard.todayRevenue)), icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Visits Today", value: dashboard.todayVisits, icon: CheckCircle, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
        { label: "Assigned Businesses", value: dashboard.assignedBusinesses, icon: Building, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
      ]
    : [];

  const targetProgress = dashboard?.agent?.targetAmount
    ? Math.min((Number(dashboard.todayRevenue) / Number(dashboard.agent.targetAmount)) * 100, 100)
    : 0;

  const handleCollect = (business: AgentZoneBusiness) => {
    setSelectedBusiness(business);
    setShowCollectionForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.fullName?.split(" ").slice(0, 2).join(" ")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {dashboard?.agent?.zone || "Field Operations"} &middot;{" "}
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
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <Refresh className="w-4 h-4 mr-2" />
            Refresh
          </Button>
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
      {dashboard?.agent?.targetAmount && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Daily Target</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(Number(dashboard.todayRevenue))} / {formatCurrency(Number(dashboard.agent.targetAmount))}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-indigo-500 h-2.5 rounded-full transition-all" style={{ width: `${targetProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{targetProgress.toFixed(0)}% of daily target</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs: Businesses / History */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="businesses">Businesses ({filteredBusinesses.length})</TabsTrigger>
          <TabsTrigger value="history">Collection History ({collections.length})</TabsTrigger>
        </TabsList>

        {/* Businesses Tab */}
        <TabsContent value="businesses" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search businesses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
          </div>

          {loadingBusinesses ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading businesses...</div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="p-6 text-center">
              <Building className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No businesses found</p>
            </div>
          ) : (
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
                      {Number(biz.totalOutstanding) > 0 && (
                        <p className="text-xs text-red-500 mt-0.5">{formatCurrency(Number(biz.totalOutstanding))} due</p>
                      )}
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
          )}
        </TabsContent>

        {/* Collection History Tab */}
        <TabsContent value="history" className="space-y-4">
          {loadingCollections ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className="p-6 text-center">
              <ReceiptIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No collections yet today</p>
              <Button size="sm" className="mt-3" onClick={() => { setActiveTab("businesses"); setShowCollectionForm(true); }}>
                Record Your First Collection
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0 divide-y">
                {collections.map((col) => (
                  <div key={col.id} className="flex items-center gap-4 px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <ReceiptIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{col.businessName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{col.receiptNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(Number(col.amount))}</p>
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
          )}
        </TabsContent>
      </Tabs>

      {/* Collection Form */}
      {showCollectionForm && (
        <CollectionForm
          business={selectedBusiness}
          onClose={() => {
            setShowCollectionForm(false);
            setSelectedBusiness(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
