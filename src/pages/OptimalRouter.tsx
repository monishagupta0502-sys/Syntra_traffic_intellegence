import React, { useState, useEffect } from 'react';
import { TrafficMap } from '../components/map/TrafficMap';
import { RoutePlannerDrawer } from '../components/navigation/RoutePlannerDrawer';
import { Road, Incident, Bottleneck, RouteOption, LocationPoint, NavigationState } from '../types';
import { HYDERABAD_LANDMARKS, calculateOptimalRoutes } from '../services/router';
import { 
  Navigation, 
  Compass, 
  Layers, 
  Sparkles, 
  MapPin, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Clock, 
  ShieldCheck, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

interface OptimalRouterProps {
  roads: Road[];
  incidents: Incident[];
  bottlenecks: Bottleneck[];
  onSelectRoad: (road: Road | null) => void;
  selectedRoad: Road | null;
  onReportIncident?: (incident: Incident) => void;
}

export const OptimalRouter: React.FC<OptimalRouterProps> = ({
  roads,
  incidents,
  bottlenecks,
  onSelectRoad,
  selectedRoad,
  onReportIncident
}) => {
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<RouteOption[]>([]);
  const [originPoint, setOriginPoint] = useState<LocationPoint>(HYDERABAD_LANDMARKS[0]);
  const [destinationPoint, setDestinationPoint] = useState<LocationPoint>(HYDERABAD_LANDMARKS[4]);
  const [navigationState, setNavigationState] = useState<NavigationState | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const handleRoutesCalculated = (
    routes: RouteOption[],
    orig: LocationPoint,
    dest: LocationPoint
  ) => {
    setAlternativeRoutes(routes);
    setOriginPoint(orig);
    setDestinationPoint(dest);
    if (routes.length > 0) {
      setActiveRoute(routes[0]);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#0B0F14] select-none font-sans">
      {/* Top Google Maps Telemetry Header */}
      <header className="h-12 bg-[#11161F] border-b border-[#252E3B] px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#388BFD]">
            <div className="w-8 h-8 rounded-lg bg-[#388BFD]/15 flex items-center justify-center">
              <Navigation className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono tracking-wider text-[#E8EDF2] flex items-center gap-2">
                <span>OPTIMAL ROUTE ENGINE</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#35C98B]/15 text-[#35C98B] border border-[#35C98B]/30">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-[#8B98A7]">Google Maps Traffic + Digital Twin Corridor Synthesis</p>
            </div>
          </div>
        </div>

        {/* Quick Route Status & Controls */}
        <div className="flex items-center gap-3">
          {activeRoute && (
            <div className="hidden md:flex items-center gap-3 text-xs bg-[#161D26] border border-[#252E3B] px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-1.5">
                <span className="text-[#8B98A7]">Route:</span>
                <strong className="text-[#E8EDF2] truncate max-w-[140px]">{activeRoute.summary}</strong>
              </div>
              <span className="text-[#252E3B]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-[#35C98B] font-mono">{activeRoute.durationMin} min</span>
                <span className="text-[#8B98A7] font-mono">({activeRoute.distanceKm} km)</span>
              </div>
              <span className="text-[#252E3B]">•</span>
              <div className="flex items-center gap-1 text-[#35C98B] font-mono text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activeRoute.bottlenecksAvoided} Bottlenecks Bypassed</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSidebarOpen 
                ? 'bg-[#161D26] hover:bg-[#1A2330] text-[#E8EDF2] border-[#252E3B]' 
                : 'bg-[#388BFD] text-white border-transparent shadow-lg shadow-[#388BFD]/30'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isSidebarOpen ? 'Hide Directions' : 'Show Directions'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Left Panel + Full Interactive Map */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Left Side Directions Panel (Google Maps Style) */}
        {isSidebarOpen && (
          <aside className="w-[420px] h-full shrink-0 border-r border-[#252E3B] bg-[#11161F] z-10 animate-in slide-in-from-left duration-200 shadow-2xl flex flex-col">
            <RoutePlannerDrawer
              roads={roads}
              incidents={incidents}
              bottlenecks={bottlenecks}
              activeRoute={activeRoute}
              alternativeRoutes={alternativeRoutes}
              onSelectRoute={setActiveRoute}
              onRoutesCalculated={handleRoutesCalculated}
              navigationState={navigationState}
              onUpdateNavigationState={setNavigationState}
              onClose={() => setIsSidebarOpen(false)}
              isSidebarMode={true}
              onReportIncident={onReportIncident}
            />
          </aside>
        )}

        {/* Map Container Area */}
        <div className="relative flex-1 h-full w-full">
          <TrafficMap
            roads={roads}
            incidents={incidents}
            bottlenecks={bottlenecks}
            selectedRoad={selectedRoad}
            onSelectRoad={onSelectRoad}
            activeRoute={activeRoute}
            alternativeRoutes={alternativeRoutes}
            onSelectRoute={setActiveRoute}
            navigationState={navigationState}
            originPoint={originPoint}
            destinationPoint={destinationPoint}
            hideMapControls={true}
            hideWatermark={true}
          />

          {/* Floating Collapsed Pill (when sidebar is hidden) */}
          {!isSidebarOpen && !navigationState?.isNavigating && activeRoute && (
            <div className="absolute top-4 left-4 z-[400] animate-in slide-in-from-top duration-200">
              <div 
                onClick={() => setIsSidebarOpen(true)}
                className="bg-[#11161F]/95 backdrop-blur-md border border-[#252E3B] rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5 cursor-pointer hover:border-[#388BFD]/50 transition-all hover:bg-[#161D26]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#388BFD]/15 text-[#388BFD] flex items-center justify-center">
                  <Navigation className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold font-mono text-[#35C98B]">
                      {activeRoute.durationMin} <span className="text-xs font-sans text-[#8B98A7]">min</span>
                    </span>
                    <span className="text-xs text-[#8B98A7] font-mono">({activeRoute.distanceKm} km)</span>
                  </div>
                  <div className="text-xs text-[#E8EDF2] font-semibold truncate max-w-[220px]">
                    To: {destinationPoint.name.split(',')[0]}
                  </div>
                </div>
                <div className="pl-2 border-l border-[#252E3B] text-xs font-bold text-[#388BFD]">
                  Open
                </div>
              </div>
            </div>
          )}

          {/* Map Top-Right Quick Corridors Filter Pills */}
          <div className="absolute top-4 right-4 z-[300] hidden lg:flex items-center gap-1.5 bg-[#11161F]/90 backdrop-blur-md border border-[#252E3B] p-1.5 rounded-xl shadow-xl">
            <span className="text-[10px] font-mono uppercase text-[#8B98A7] px-2 font-semibold">Corridor:</span>
            {[
              { label: 'Hitec City', orig: HYDERABAD_LANDMARKS[0], dest: HYDERABAD_LANDMARKS[1] },
              { label: 'Jubilee Hills', orig: HYDERABAD_LANDMARKS[0], dest: HYDERABAD_LANDMARKS[3] },
              { label: 'Banjara Hills', orig: HYDERABAD_LANDMARKS[0], dest: HYDERABAD_LANDMARKS[4] },
              { label: 'Airport Express', orig: HYDERABAD_LANDMARKS[0], dest: HYDERABAD_LANDMARKS[10] }
            ].map((c) => (
              <button
                key={c.label}
                onClick={async () => {
                  setOriginPoint(c.orig);
                  setDestinationPoint(c.dest);
                  const routes = await calculateOptimalRoutes(
                    c.orig.coordinates,
                    c.dest.coordinates,
                    roads,
                    incidents,
                    bottlenecks
                  );
                  handleRoutesCalculated(routes, c.orig, c.dest);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#161D26] hover:bg-[#1A2330] text-[#E8EDF2] border border-[#252E3B] hover:border-[#388BFD]/40 transition-colors"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
