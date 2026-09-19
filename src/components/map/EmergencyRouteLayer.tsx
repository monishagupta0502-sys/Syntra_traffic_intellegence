import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { EmergencyScenario, Road } from '../../types';

interface EmergencyRouteLayerProps {
  emergencyScenario: EmergencyScenario | null;
  roads: Road[];
}

const createEndpointIcon = (label: string, isOrigin: boolean) => {
  const color = isOrigin ? '#4AA3DF' : '#35C98B';
  return L.divIcon({
    className: 'custom-endpoint-marker',
    html: `
      <div style="background-color: #151B23; border: 2px solid ${color}; color: ${color}; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: bold; font-family: monospace; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 4px;">
        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${color};"></span>
        ${label}
      </div>
    `,
    iconSize: [80, 24],
    iconAnchor: [40, 12]
  });
};

export const EmergencyRouteLayer: React.FC<EmergencyRouteLayerProps> = ({
  emergencyScenario,
  roads
}) => {
  if (!emergencyScenario) return null;

  // Find the roads in the route
  const routeRoads = roads.filter(r => emergencyScenario.routeRoadIds.includes(r.id));
  const fullCoordinates = routeRoads.flatMap(r => r.coordinates);

  return (
    <>
      {/* Glow path */}
      <Polyline
        positions={fullCoordinates}
        pathOptions={{
          color: '#4AA3DF',
          weight: 8,
          opacity: 0.5,
          dashArray: '10, 10'
        }}
      />

      {/* Core corridor line */}
      <Polyline
        positions={fullCoordinates}
        pathOptions={{
          color: '#35C98B',
          weight: 4,
          opacity: 1.0,
          dashArray: '8, 8'
        }}
      />

      {/* Origin Marker */}
      <Marker
        position={emergencyScenario.origin}
        icon={createEndpointIcon('DISPATCH', true)}
      >
        <Popup>
          <div className="text-xs font-sans p-1">
            <div className="font-semibold text-[#4AA3DF]">Dispatch Point</div>
            <div className="text-[#E8EDF2] mt-0.5">{emergencyScenario.originName}</div>
          </div>
        </Popup>
      </Marker>

      {/* Destination Marker */}
      <Marker
        position={emergencyScenario.destination}
        icon={createEndpointIcon('TRAUMA CTR', false)}
      >
        <Popup>
          <div className="text-xs font-sans p-1">
            <div className="font-semibold text-[#35C98B]">Destination Facility</div>
            <div className="text-[#E8EDF2] mt-0.5">{emergencyScenario.destName}</div>
            <div className="font-mono text-[10px] text-[#8B98A7] mt-1">
              Priority Transit ETA: <strong className="text-[#35C98B]">{emergencyScenario.emergencyTravelTimeMin} min</strong>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};
