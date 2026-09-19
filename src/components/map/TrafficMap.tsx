import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Road, Incident, Bottleneck, EmergencyScenario, InfrastructureScenario, RouteOption, LocationPoint, NavigationState } from '../../types';
import { RoadLayer } from './RoadLayer';
import { IncidentLayer } from './IncidentLayer';
import { BottleneckLayer } from './BottleneckLayer';
import { EmergencyRouteLayer } from './EmergencyRouteLayer';
import { InfrastructureLayer } from './InfrastructureLayer';
import { RouteLayer } from './RouteLayer';
import { MapControls } from './MapControls';
import { RoadInspector } from './RoadInspector';
import { GoogleTrafficMap } from './GoogleTrafficMap';

interface TrafficMapProps {
  roads: Road[];
  incidents: Incident[];
  bottlenecks: Bottleneck[];
  emergencyScenario?: EmergencyScenario | null;
  infrastructureScenario?: InfrastructureScenario | null;
  selectedRoad: Road | null;
  onSelectRoad: (road: Road | null) => void;
  onSimulateClosure?: (road: Road) => void;
  center?: [number, number];
  zoom?: number;
  activeRoute?: RouteOption | null;
  alternativeRoutes?: RouteOption[];
  onSelectRoute?: (route: RouteOption) => void;
  navigationState?: NavigationState | null;
  originPoint?: LocationPoint | null;
  destinationPoint?: LocationPoint | null;
  hideMapControls?: boolean;
  hideWatermark?: boolean;
}

// Sub-component to manipulate map bounds and view in Leaflet
const MapViewController: React.FC<{ 
  center: [number, number]; 
  zoom: number; 
  selectedRoad: Road | null;
  resetTrigger: number;
}> = ({ center, zoom, selectedRoad, resetTrigger }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [resetTrigger]);

  useEffect(() => {
    if (selectedRoad && selectedRoad.coordinates.length > 0) {
      const mid = selectedRoad.coordinates[Math.floor(selectedRoad.coordinates.length / 2)];
      map.panTo(mid, { animate: true });
    }
  }, [selectedRoad]);

  return null;
};

export const TrafficMap: React.FC<TrafficMapProps> = ({
  roads,
  incidents,
  bottlenecks,
  emergencyScenario = null,
  infrastructureScenario = null,
  selectedRoad,
  onSelectRoad,
  onSimulateClosure,
  center = [17.4350, 78.4100],
  zoom = 13,
  activeRoute = null,
  alternativeRoutes = [],
  onSelectRoute,
  navigationState = null,
  originPoint = null,
  destinationPoint = null,
  hideMapControls = false,
  hideWatermark = false
}) => {
  const [layers, setLayers] = useState({
    traffic: true,
    incidents: true,
    bottlenecks: true,
    emergency: true,
    infrastructure: true
  });
  const [mapEngine, setMapEngine] = useState<'google' | 'carto'>('google');
  const [googleTrafficEnabled, setGoogleTrafficEnabled] = useState<boolean>(true);
  const [mapStyleType, setMapStyleType] = useState<'dark' | 'roadmap' | 'satellite' | 'hybrid'>('dark');
  const [viewCenter, setViewCenter] = useState<[number, number]>(center);
  const [viewZoom, setViewZoom] = useState<number>(zoom);
  const [resetCount, setResetCount] = useState(0);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setViewCenter(center);
    setViewZoom(zoom);
    setResetCount(c => c + 1);
    onSelectRoad(null);
  };

  const handleJumpDistrict = (coords: [number, number], zoomLevel: number) => {
    setViewCenter(coords);
    setViewZoom(zoomLevel);
    setResetCount(c => c + 1);
  };

  return (
    <div className="relative w-full h-full bg-[#0B0F14] overflow-hidden select-none">
      {mapEngine === 'google' ? (
        <GoogleTrafficMap
          roads={roads}
          incidents={incidents}
          bottlenecks={bottlenecks}
          emergencyScenario={emergencyScenario}
          infrastructureScenario={infrastructureScenario}
          selectedRoad={selectedRoad}
          onSelectRoad={onSelectRoad}
          center={viewCenter}
          zoom={viewZoom}
          layers={layers}
          googleTrafficEnabled={googleTrafficEnabled}
          mapStyleType={mapStyleType}
          resetTrigger={resetCount}
          activeRoute={activeRoute}
          alternativeRoutes={alternativeRoutes}
          onSelectRoute={onSelectRoute}
          navigationState={navigationState}
          originPoint={originPoint}
          destinationPoint={destinationPoint}
        />
      ) : (
        <MapContainer
          center={viewCenter}
          zoom={viewZoom}
          className="w-full h-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          {/* Operations Center Dark Map Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          <MapViewController
            center={viewCenter}
            zoom={viewZoom}
            selectedRoad={selectedRoad}
            resetTrigger={resetCount}
          />

          {/* Road Layer - Hidden during active navigation to show only the selected route */}
          {layers.traffic && !navigationState?.isNavigating && (
            <RoadLayer
              roads={roads}
              selectedRoad={selectedRoad}
              onSelectRoad={onSelectRoad}
            />
          )}

          {/* Infrastructure Modifications */}
          {layers.infrastructure && !navigationState?.isNavigating && (
            <InfrastructureLayer
              scenario={infrastructureScenario}
              roads={roads}
            />
          )}

          {/* Emergency Priority Route */}
          {layers.emergency && !navigationState?.isNavigating && (
            <EmergencyRouteLayer
              emergencyScenario={emergencyScenario}
              roads={roads}
            />
          )}

          {/* Bottleneck Clusters */}
          {layers.bottlenecks && !navigationState?.isNavigating && (
            <BottleneckLayer bottlenecks={bottlenecks} />
          )}

          {/* Incident Alerts */}
          {layers.incidents && !navigationState?.isNavigating && (
            <IncidentLayer
              incidents={incidents}
              onSelectIncident={(inc) => {
                const r = roads.find(x => x.id === inc.roadId);
                if (r) onSelectRoad(r);
              }}
            />
          )}

          {/* Optimal Routes & Navigation Layer */}
          <RouteLayer
            activeRoute={activeRoute}
            alternativeRoutes={alternativeRoutes}
            onSelectRoute={onSelectRoute}
            navigationState={navigationState}
            originPoint={originPoint}
            destinationPoint={destinationPoint}
          />
        </MapContainer>
      )}

      {/* Floating Controls */}
      {!hideMapControls && (
        <MapControls
          layers={layers}
          onToggleLayer={toggleLayer}
          onResetView={handleReset}
          onJumpDistrict={handleJumpDistrict}
          mapEngine={mapEngine}
          onChangeMapEngine={setMapEngine}
          googleTrafficEnabled={googleTrafficEnabled}
          onToggleGoogleTraffic={() => setGoogleTrafficEnabled(prev => !prev)}
          mapStyleType={mapStyleType}
          onChangeMapStyleType={setMapStyleType}
        />
      )}

      {/* Road Inspector Overlay */}
      <RoadInspector
        road={selectedRoad}
        onClose={() => onSelectRoad(null)}
        onSimulateClosure={onSimulateClosure}
      />

      {/* Technical Map Watermark & Attribution */}
      {!hideWatermark && (
        <div className="absolute bottom-2 left-3 z-[1000] pointer-events-none text-[10px] font-mono text-[#5E6A78] flex items-center gap-2">
          <span>GRID: WGS84 / HYDERABAD_METRO_TWIN</span>
          <span>•</span>
          {mapEngine === 'google' ? (
            <span className="text-[#4AA3DF]">GOOGLE MAPS PLATFORM • LIVE TRAFFIC LAYER</span>
          ) : (
            <span>MAP: &copy; OpenStreetMap &copy; CARTO</span>
          )}
          <span>•</span>
          <span>SIMULATION: MICROSCOPIC CAR-FOLLOWING</span>
        </div>
      )}
    </div>
  );
};
