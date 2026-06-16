import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { IcnSearch as Search, IcnLayers as Layers, IcnMapPin as MapPin, IcnUsers as Users, IcnActivity as Activity, IcnX as X, IcnBuilding as Building2, IcnPhone as Phone, IcnClock as Clock, IcnList as List, IcnGrid as Grid3X3, IcnNav as Navigation } from "@/components/ui/Icons";
import { MapView } from "../components/MapView";
import { businesses, agentStats, zones, formatCurrency } from "../utils/data";
import { Business, AgentStats } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const levyColors: Record<string, string> = {
  paid: "bg-emerald-500",
  due: "bg-amber-500",
  overdue: "bg-red-500",
  partial: "bg-blue-500",
  waived: "bg-slate-400",
};

const levyBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  due: "outline",
  overdue: "destructive",
  partial: "secondary",
  waived: "secondary",
};

export function LiveMap() {
  const [selectedLayers, setSelectedLayers] = useState({
    businesses: true,
    agents: true,
    heatmap: false,
    zones: true,
  });
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentStats | null>(null);
  const [flyToLocation, setFlyToLocation] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [hoveredBusinessId, setHoveredBusinessId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Handle navigation from Businesses page with ?business=XXX&lat=...&lng=...
  useEffect(() => {
    const bizId = searchParams.get('business');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    if (bizId && lat && lng) {
      const biz = businesses.find(b => b.businessId === bizId);
      if (biz) {
        setSelectedBusiness(biz);
        setFlyToLocation({ lat: parseFloat(lat), lng: parseFloat(lng), zoom: 18 });
      }
    }
  }, [searchParams]);

  const filteredBusinesses = businesses.filter((b) => {
    const matchesZone = selectedZone === "all" || b.zoneId === selectedZone;
    const matchesSearch =
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.businessId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const filteredAgents = agentStats.filter((a) => {
    if (selectedZone === "all") return true;
    const zoneName = zones.find((z) => z.id === selectedZone)?.name;
    return a.zone === zoneName;
  });

  const toggleLayer = (key: keyof typeof selectedLayers) => {
    setSelectedLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearSelection = () => {
    setSelectedBusiness(null);
    setSelectedAgent(null);
  };

  const handleBusinessClick = (b: Business) => {
    setSelectedBusiness(b);
    setSelectedAgent(null);
    setFlyToLocation({ lat: b.location.lat, lng: b.location.lng, zoom: 17 });
  };

  const handleAgentClick = (a: AgentStats) => {
    setSelectedAgent(a);
    setSelectedBusiness(null);
    if (a.lastLocation) {
      setFlyToLocation({ lat: a.lastLocation.lat, lng: a.lastLocation.lng, zoom: 16 });
    }
  };

  const handleMapBusinessClick = (b: Business) => {
    setSelectedBusiness(b);
    setSelectedAgent(null);
  };

  const handleMapAgentClick = (a: AgentStats) => {
    setSelectedAgent(a);
    setSelectedBusiness(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* Left Sidebar */}
      <div className="w-96 shrink-0 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-semibold text-foreground">Live Map</h1>
            <Badge variant="secondary" className="gap-1.5">
              <Activity className="h-3 w-3" />
              Live
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Click a business or agent to see details</p>
        </div>

        <Separator />

        <Tabs defaultValue="businesses" className="flex-1 flex flex-col">
          <div className="px-4 pt-3 pb-0">
            <TabsList className="w-full">
              <TabsTrigger value="businesses" className="flex-1 gap-2">
                <Building2 className="w-4 h-4" />
                Businesses
              </TabsTrigger>
              <TabsTrigger value="controls" className="flex-1 gap-2">
                <Layers className="w-4 h-4" />
                Controls
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="businesses" className="flex-1 flex flex-col mt-0 p-0">
            {/* Search */}
            <div className="p-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Zone filter inline */}
            <div className="px-4 pb-2">
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="h-8 text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones ({filteredBusinesses.length})</SelectItem>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name} ({zone.businessCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Business list */}
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-2">
                {filteredBusinesses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No businesses found</p>
                  </div>
                ) : (
                  filteredBusinesses.map((b) => {
                    const isSelected = selectedBusiness?.id === b.id;
                    const isHovered = hoveredBusinessId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => handleBusinessClick(b)}
                        onMouseEnter={() => setHoveredBusinessId(b.id)}
                        onMouseLeave={() => setHoveredBusinessId(null)}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : isHovered
                              ? "border-border bg-accent"
                              : "border-border/50 bg-card hover:bg-accent/50"
                        )}
                      >
                        {/* Levy status dot */}
                        <div className={cn(
                          "w-3 h-3 rounded-full mt-1.5 shrink-0",
                          levyColors[b.levyStatus] || "bg-slate-400"
                        )} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">{b.name}</span>
                            <Badge variant={b.status === 'active' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1.5 capitalize">
                              {b.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground font-mono">{b.businessId}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{b.zoneName}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {b.ownerPhone}
                            </div>
                            <Badge variant={levyBadge[b.levyStatus]} className="text-[10px] h-4 px-1.5 capitalize">
                              {b.levyStatus}
                            </Badge>
                          </div>
                          {b.totalOutstanding > 0 && (
                            <p className="text-xs font-medium text-destructive mt-1">
                              Outstanding: {formatCurrency(b.totalOutstanding)}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 mt-0.5"
                          onClick={(e) => { e.stopPropagation(); handleBusinessClick(b); }}
                        >
                          <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="controls" className="flex-1 flex flex-col mt-0 p-0">
            <ScrollArea className="flex-1 p-4 pt-3">
              <div className="space-y-4">
                {/* Layer Toggles */}
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      Layers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 pt-0">
                    <div className="space-y-3">
                      {[
                        { key: "businesses" as const, label: "Businesses", icon: Building2, color: "text-emerald-500" },
                        { key: "agents" as const, label: "Field Agents", icon: Users, color: "text-blue-500" },
                        { key: "zones" as const, label: "Zone Boundaries", icon: MapPin, color: "text-purple-500" },
                        { key: "heatmap" as const, label: "Revenue Heatmap", icon: Activity, color: "text-orange-500" },
                      ].map((layer) => {
                        const Icon = layer.icon;
                        return (
                          <div key={layer.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <Icon className={`h-4 w-4 ${layer.color}`} />
                              <span className="text-sm text-foreground">{layer.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground tabular-nums">
                                {layer.key === "businesses" && filteredBusinesses.length}
                                {layer.key === "agents" && filteredAgents.length}
                              </span>
                              <Switch
                                checked={selectedLayers[layer.key]}
                                onCheckedChange={() => toggleLayer(layer.key)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Zone Filter */}
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Filter by Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 pt-0">
                    <Select value={selectedZone} onValueChange={setSelectedZone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        {zones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            <span className="flex items-center justify-between w-full gap-4">
                              <span>{zone.name}</span>
                              <span className="text-muted-foreground tabular-nums">{zone.businessCount}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Map Statistics */}
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      Map Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Businesses shown</span>
                        <span className="font-medium text-foreground tabular-nums">{filteredBusinesses.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active agents</span>
                        <span className="font-medium text-emerald-500 tabular-nums">
                          {filteredAgents.filter((a) => a.isActive).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zones visible</span>
                        <span className="font-medium text-foreground tabular-nums">
                          {selectedZone === "all" ? zones.length : 1}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Selected business detail bar */}
        {selectedBusiness && (
          <div className="border-t border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground truncate">{selectedBusiness.name}</h4>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={clearSelection}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Badge variant={selectedBusiness.status === 'active' ? 'default' : 'secondary'} className="text-[10px] h-4 capitalize">{selectedBusiness.status}</Badge>
              <Badge variant={levyBadge[selectedBusiness.levyStatus]} className="text-[10px] h-4 capitalize">{selectedBusiness.levyStatus}</Badge>
              <span>{selectedBusiness.zoneName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Owner:</span>
                <p className="font-medium text-foreground">{selectedBusiness.ownerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Outstanding:</span>
                <p className="font-medium text-destructive">{formatCurrency(selectedBusiness.totalOutstanding)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Selected agent detail bar */}
        {selectedAgent && !selectedBusiness && (
          <div className="border-t border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {selectedAgent.officerName.charAt(0)}
                </div>
                <h4 className="text-sm font-semibold text-foreground">{selectedAgent.officerName}</h4>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={clearSelection}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Badge variant="secondary" className="text-[10px] h-4">{selectedAgent.zone}</Badge>
              <span className={cn(
                "font-medium",
                selectedAgent.isActive ? "text-emerald-500" : "text-muted-foreground"
              )}>
                {selectedAgent.isActive ? "Active" : "Offline"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Today</span>
                <p className="font-medium text-emerald-500">{formatCurrency(selectedAgent.todayAmount)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Collections</span>
                <p className="font-medium text-foreground">{selectedAgent.todayCollections}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Visits</span>
                <p className="font-medium text-foreground">{selectedAgent.todayVisits || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapView
          businesses={selectedLayers.businesses ? filteredBusinesses : []}
          agents={selectedLayers.agents ? filteredAgents : []}
          height="h-full"
          showControls={true}
          onBusinessClick={handleMapBusinessClick}
          onAgentClick={handleMapAgentClick}
          selectedBusinessId={selectedBusiness?.id || null}
          selectedAgentId={selectedAgent?.officerId || null}
          flyToLocation={flyToLocation}
        />
      </div>
    </div>
  );
}
