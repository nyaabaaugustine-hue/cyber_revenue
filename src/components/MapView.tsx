import { useEffect, useRef, useState } from 'react';
import { IcnLayers as Layers, IcnX as X, IcnUser as User, IcnPhone as Phone, IcnClock as Clock, IcnDollar as DollarSign, IcnWarning as AlertTriangle, IcnCheckCircle2 as CheckCircle2 } from '@/components/ui/Icons';
import { Business, AgentStats } from '../types';
import { formatCurrency, formatRelativeTime } from '../utils/designTokens';

interface MapViewProps {
  businesses?: Business[];
  agents?: AgentStats[];
  height?: string;
  showControls?: boolean;
  onBusinessClick?: (business: Business) => void;
  onAgentClick?: (agent: AgentStats) => void;
  selectedBusinessId?: string | null;
  selectedAgentId?: string | null;
  hoveredBusinessId?: string | null;
  flyToLocation?: { lat: number; lng: number; zoom?: number } | null;
}

const KUMASI_CENTER = { lat: 6.6885, lng: -1.5273 };
const DEFAULT_ZOOM = 13;

const levyStatusColors: Record<string, { fill: string; border: string; label: string }> = {
  paid: { fill: '#10B981', border: '#059669', label: 'Paid' },
  due: { fill: '#F59E0B', border: '#D97706', label: 'Due' },
  overdue: { fill: '#EF4444', border: '#DC2626', label: 'Overdue' },
  partial: { fill: '#3B82F6', border: '#2563EB', label: 'Partial' },
  waived: { fill: '#94A3B8', border: '#64748B', label: 'Waived' },
};

export function MapView({
  businesses = [],
  agents = [],
  height = 'h-96',
  showControls = true,
  onBusinessClick,
  onAgentClick,
  selectedBusinessId,
  selectedAgentId,
  hoveredBusinessId,
  flyToLocation
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const agentsLayerRef = useRef<any>(null);
  const markerRefs = useRef<Map<string, any>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [layers, setLayers] = useState({ businesses: true, agents: true, zones: false, heatmap: false });
  const [popupData, setPopupData] = useState<{ type: 'business' | 'agent'; data: any; position: { x: number; y: number } } | null>(null);

  // Load Leaflet once
  useEffect(() => {
    let destroyed = false;
    const load = async () => {
      if (typeof window === 'undefined' || destroyed) return;
      if ((window as any).L) { initMap(); return; }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => { if (!destroyed) initMap(); };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapContainerRef.current || !(window as any).L) return;
      const L = (window as any).L;
      const map = L.map(mapContainerRef.current, {
        center: [KUMASI_CENTER.lat, KUMASI_CENTER.lng],
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      agentsLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setIsLoaded(true);
    };

    load();
    return () => { destroyed = true; if (mapInstanceRef.current) { mapInstanceRef.current.remove(); } };
  }, []);

  // Fly to location
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !flyToLocation) return;
    mapInstanceRef.current.flyTo([flyToLocation.lat, flyToLocation.lng], flyToLocation.zoom || 17, { duration: 0.8 });
  }, [flyToLocation, isLoaded]);

  // Business markers — always renders immediately without cluster CDN dependency
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !markersLayerRef.current || !(window as any).L) return;
    const L = (window as any).L;
    const layer = markersLayerRef.current;
    layer.clearLayers();
    markerRefs.current.clear();
    if (!layers.businesses) return;

    businesses.forEach(business => {
      if (!business.location) return;
      const colors = levyStatusColors[business.levyStatus] || levyStatusColors.paid;
      const isSelected = business.id === selectedBusinessId;
      const isHovered = business.id === hoveredBusinessId;
      const size = isSelected ? 38 : isHovered ? 34 : 30;
      const borderWidth = isSelected ? 4 : 3;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${size}px; height: ${size}px;
            background: ${colors.fill};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: ${borderWidth}px solid white;
            box-shadow: 0 ${isSelected ? 6 : 2}px ${isSelected ? 20 : 8}px rgba(0,0,0,${isSelected ? 0.45 : 0.25});
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s ease;
            ${isSelected ? 'animation: marker-pulse 1.2s ease-in-out infinite;' : ''}
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 11px;
              font-weight: 700;
              font-family: Inter, sans-serif;
            ">${business.businessId.split('-')[1]}</div>
          </div>
          ${isSelected ? `<div style="
            position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
            white-space: nowrap; background: rgba(0,0,0,0.85); color: white;
            padding: 3px 10px; border-radius: 6px; font-size: 11px;
            font-family: Inter, sans-serif; font-weight: 600;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">${business.name}</div>` : ''}
          ${isHovered && !isSelected ? `<div style="
            position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
            white-space: nowrap; background: rgba(0,0,0,0.7); color: white;
            padding: 2px 8px; border-radius: 4px; font-size: 10px;
            font-family: Inter, sans-serif;
          ">${business.businessId}</div>` : ''}
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      const marker = L.marker([business.location.lat, business.location.lng], { icon });
      markerRefs.current.set(business.id, marker);
      layer.addLayer(marker);

      marker.on('click', (e: any) => {
        const containerPoint = mapInstanceRef.current.latLngToContainerPoint(e.target.getLatLng());
        setPopupData({ type: 'business', data: business, position: { x: containerPoint.x, y: containerPoint.y } });
        onBusinessClick?.(business);
      });
    });
  }, [businesses, isLoaded, layers.businesses, selectedBusinessId, hoveredBusinessId, onBusinessClick]);

  // Agent markers
  useEffect(() => {
    if (!isLoaded || !agentsLayerRef.current || !(window as any).L) return;
    const L = (window as any).L;
    agentsLayerRef.current.clearLayers();
    if (!layers.agents) return;
    agents.forEach(agent => {
      if (!agent.lastLocation || !agent.isActive) return;
      const isSelected = agent.officerId === selectedAgentId;
      const icon = L.divIcon({
        className: 'agent-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: ${isSelected ? 44 : 36}px; height: ${isSelected ? 44 : 36}px;
              background: ${isSelected ? '#2563EB' : '#3B82F6'};
              border-radius: 50%;
              border: ${isSelected ? 4 : 3}px solid white;
              box-shadow: 0 2px 12px rgba(59, 130, 246, 0.5);
              display: flex; align-items: center; justify-content: center;
              animation: agent-pulse 2s infinite;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style="
              position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%);
              background: ${isSelected ? '#2563EB' : '#1E293B'};
              color: white; padding: 2px 8px; border-radius: 4px;
              font-size: 10px; white-space: nowrap;
              font-family: Inter, sans-serif; font-weight: 500;
            ">${agent.officerName.split(' ')[0]}</div>
          </div>
        `,
        iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
        iconAnchor: [isSelected ? 22 : 18, isSelected ? 22 : 18],
      });
      const marker = L.marker([agent.lastLocation.lat, agent.lastLocation.lng], { icon }).addTo(agentsLayerRef.current);
      marker.on('click', (e: any) => {
        const containerPoint = mapInstanceRef.current.latLngToContainerPoint(e.target.getLatLng());
        setPopupData({ type: 'agent', data: agent, position: { x: containerPoint.x, y: containerPoint.y } });
        onAgentClick?.(agent);
      });
    });
  }, [agents, isLoaded, layers.agents, selectedAgentId, onAgentClick]);

  useEffect(() => {
    const handler = () => setPopupData(null);
    if (popupData) { document.addEventListener('click', handler); return () => document.removeEventListener('click', handler); }
  }, [popupData]);

  return (
    <div className={`${height} relative overflow-hidden bg-slate-100 dark:bg-slate-900`}>
      <div ref={mapContainerRef} className="absolute inset-0" style={{ zIndex: 1 }} />
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center" style={{ zIndex: 2 }}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">Loading map...</p>
          </div>
        </div>
      )}
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="w-10 h-10 bg-background rounded-lg shadow-lg flex items-center justify-center hover:bg-accent transition-colors border">
            <Layers className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}
      {showLayerPanel && (
        <div className="absolute top-16 right-4 z-10 bg-background rounded-xl shadow-xl border p-4 w-56">
          <h4 className="text-sm font-semibold text-foreground mb-3">Map Layers</h4>
          <div className="space-y-2">
            {[
              { key: 'businesses' as const, label: 'Businesses', color: '#10B981' },
              { key: 'agents' as const, label: 'Field Agents', color: '#3B82F6' },
              { key: 'zones' as const, label: 'Zone Boundaries', color: '#8B5CF6' },
              { key: 'heatmap' as const, label: 'Revenue Heatmap', color: '#F59E0B' },
            ].map(layer => (
              <label key={layer.key} className="flex items-center gap-3 cursor-pointer hover:bg-accent p-2 rounded-lg transition-colors">
                <input type="checkbox" checked={layers[layer.key]}
                  onChange={(e) => setLayers(prev => ({ ...prev, [layer.key]: e.target.checked }))}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-primary" />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className="text-sm text-foreground">{layer.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border p-3">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Levy Status</h4>
        <div className="space-y-1">
          {Object.entries(levyStatusColors).map(([key, c]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.fill }} />
              <span className="text-xs text-muted-foreground">{c.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1.5 mt-1.5 border-t">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">Field Agent</span>
          </div>
        </div>
      </div>
      {/* Business count */}
      {isLoaded && businesses.length > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg shadow border px-3 py-1.5">
          <span className="text-xs font-medium text-foreground">{businesses.length} business{businesses.length !== 1 ? 'es' : ''} on map</span>
        </div>
      )}
      {/* Floating popup on marker click */}
      {popupData && (
        <div className="absolute z-20 bg-background rounded-xl shadow-2xl border w-80 overflow-hidden"
          style={{ left: `${Math.min(popupData.position.x, (mapContainerRef.current?.clientWidth || 400) - 320)}px`,
            top: `${Math.min(popupData.position.y, (mapContainerRef.current?.clientHeight || 400) - 220)}px`,
            transform: 'translate(-50%, -100%) translateY(-16px)' }}
          onClick={(e) => e.stopPropagation()}>
          {popupData.type === 'business' ? (() => {
            const b = popupData.data;
            const colors = levyStatusColors[b.levyStatus] || levyStatusColors.paid;
            return (
              <>
                <div className="px-4 py-3 text-white" style={{ backgroundColor: colors.fill }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] opacity-80 font-mono">{b.businessId}</p>
                      <h3 className="font-semibold text-sm">{b.name}</h3>
                    </div>
                    <button onClick={() => setPopupData(null)} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/50 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Category</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{b.categoryName}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Zone</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{b.zoneName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-foreground">{b.ownerName}</span>
                    <span className="text-muted-foreground">•</span>
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-foreground">{b.ownerPhone}</span>
                  </div>
                  {b.lastVisitedAt && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Last visit: {formatRelativeTime(b.lastVisitedAt)}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Outstanding</p>
                      <p className="font-bold text-lg text-foreground">{formatCurrency(b.totalOutstanding)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Levy</p>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-0.5"
                        style={{ backgroundColor: colors.fill + '20', color: colors.fill }}>
                        {b.levyStatus === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        {b.levyStatus === 'overdue' && <AlertTriangle className="w-3 h-3" />}
                        {colors.label}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
          })() : (
            (() => {
              const a = popupData.data;
              return (
                <>
                  <div className="bg-blue-600 text-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{a.officerName}</h3>
                          <p className="text-[10px] text-blue-200">{a.zone}</p>
                        </div>
                      </div>
                      <button onClick={() => setPopupData(null)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Today</p>
                        <p className="font-bold text-sm text-emerald-500">{formatCurrency(a.todayAmount)}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Collections</p>
                        <p className="font-bold text-sm text-foreground">{a.todayCollections}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Visits</p>
                        <p className="font-bold text-sm text-foreground">{a.todayVisits || 0}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">Monthly Target</span>
                        <span className="text-xs font-semibold text-foreground">{a.targetPercent}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(a.targetPercent, 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Last active: {formatRelativeTime(a.lastActiveAt)}
                    </div>
                  </div>
                </>
              );
            })()
          )}
        </div>
      )}
      <style>{`
        @keyframes agent-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.85; } }
        @keyframes marker-pulse { 0%,100% { box-shadow: 0 6px 20px rgba(0,0,0,0.45); transform: rotate(-45deg) scale(1); } 50% { box-shadow: 0 6px 30px rgba(0,0,0,0.6); transform: rotate(-45deg) scale(1.1); } }
        .leaflet-container { font-family: Inter, system-ui, sans-serif; }
        .custom-marker, .agent-marker { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  );
}
