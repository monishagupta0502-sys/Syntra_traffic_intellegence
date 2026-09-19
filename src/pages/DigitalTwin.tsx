import React, { useState } from 'react';
import { TrafficMap } from '../components/map/TrafficMap';
import { RoutePlannerDrawer } from '../components/navigation/RoutePlannerDrawer';
import { Road, Incident, Bottleneck, EmergencyScenario, InfrastructureScenario, RouteOption, LocationPoint, NavigationState } from '../types';
import { HYDERABAD_LANDMARKS } from '../services/router';
import { Search, Filter, Compass, Eye, ShieldAlert, Cpu, Navigation } from 'lucide-react';

interface DigitalTwinProps {
  roads: Road[];
  incidents: Incident[];
  bottlenecks: Bottleneck[];
  emergencyScenario?: EmergencyScenario | null;
  infrastructureScenario?: InfrastructureScenario | null;
  selectedRoad: Road | null;
  onSelectRoad: (road: Road | null) => void;
  onSimulateClosure: (road: Road) => void;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({
  roads,
  incidents,
  bottlenecks,
  emergencyScenario,
  infrastructureScenario,
  selectedRoad,
  onSelectRoad,
  onSimulateClosure
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<RouteOption[]>([]);
  const [originPoint, setOriginPoint] = useState<LocationPoint | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<LocationPoint | null>(null);
  const [navigationState, setNavigationState] = useState<NavigationState | null>(null);

  const filteredRoads = roads.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Mini HUD Strip at the top */}
      <div className="h-10 bg-[#11161D]/90 backdrop-blur border-b border-[#28313C] px-4 flex items-center justify-between z-10 text-xs shrink-0 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-[#4AA3DF]">
            <Compass className="w-3.5 h-3.5" />
            <span className="font-semibold">DIGITAL TWIN VIEW</span>
          </div>

          <div className="h-3.5 w-px bg-[#28313C]"></div>

          {/* Quick Road Filter */}
          <div className="flex items-center gap-1.5 bg-[#151B23] border border-[#28313C] rounded px-2 py-0.5">
            <Search className="w-3 h-3 text-[#8B98A7]" />
            <input
              type="text"
              placeholder="Find road by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[11px] text-[#E8EDF2] focus:outline-none placeholder:text-[#5E6A78] w-40"
            />
          </div>

          <div className="flex items-center gap-1">
            {['all', 'highway', 'arterial', 'connector'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#1A212B] text-[#4AA3DF] border border-[#4AA3DF]/40'
                    : 'text-[#8B98A7] hover:text-[#E8EDF2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right HUD info */}
        <div className="flex items-center gap-4 font-mono text-[11px] text-[#8B98A7]">
          <button
            onClick={() => setIsRoutePlannerOpen(!isRoutePlannerOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs transition-colors font-sans font-medium ${
              isRoutePlannerOpen
                ? 'bg-[#388BFD] text-white font-bold shadow-lg shadow-[#388BFD]/25'
                : 'bg-[#151B23] hover:bg-[#1A212B] text-[#E8EDF2] border border-[#28313C]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>{isRoutePlannerOpen ? 'Close Navigator' : 'Route Navigator'}</span>
          </button>

          <span className="hidden sm:inline">
            Active Nodes: <strong className="text-[#E8EDF2]">{roads.length}</strong>
          </span>
          <span>•</span>
          <span className="hidden sm:inline">
            Friction Points: <strong className="text-[#E05A5A]">{bottlenecks.length}</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#35C98B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35C98B] animate-pulse"></span>
            <span>TWIN SYNC 100%</span>
          </span>
        </div>
      </div>

      {/* Main Dominant Map */}
      <div className="relative flex-1 w-full h-full">
        <TrafficMap
          roads={filteredRoads}
          incidents={incidents}
          bottlenecks={bottlenecks}
          emergencyScenario={emergencyScenario}
          infrastructureScenario={infrastructureScenario}
          selectedRoad={selectedRoad}
          onSelectRoad={onSelectRoad}
          onSimulateClosure={onSimulateClosure}
          activeRoute={activeRoute}
          alternativeRoutes={alternativeRoutes}
          onSelectRoute={setActiveRoute}
          navigationState={navigationState}
          originPoint={originPoint}
          destinationPoint={destinationPoint}
        />

        {/* Floating Route Navigator Drawer */}
        {isRoutePlannerOpen && (
          <div className="absolute top-4 left-4 z-[400] max-w-md w-full animate-in slide-in-from-left duration-200">
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
              onClose={() => setIsRoutePlannerOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
