import React from 'react';
import { Polyline, CircleMarker, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { RouteOption, LocationPoint, NavigationState } from '../../types';

interface RouteLayerProps {
  activeRoute: RouteOption | null;
  alternativeRoutes?: RouteOption[];
  onSelectRoute?: (route: RouteOption) => void;
  navigationState?: NavigationState | null;
  originPoint?: LocationPoint | null;
  destinationPoint?: LocationPoint | null;
}

// Custom DivIcons for Origin (A) and Destination (B)
const createOriginIcon = () =>
  L.divIcon({
    className: 'custom-route-marker',
    html: `
      <div style="background:#388BFD; color:#FFFFFF; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; font-family:sans-serif; border:3px solid #FFFFFF; box-shadow:0 2px 10px rgba(56,139,253,0.6);">
        A
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

const createDestIcon = () =>
  L.divIcon({
    className: 'custom-route-marker',
    html: `
      <div style="background:#E05A5A; color:#FFFFFF; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; font-family:sans-serif; border:3px solid #FFFFFF; box-shadow:0 2px 10px rgba(224,90,90,0.6);">
        B
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

const createNavVehicleIcon = () =>
  L.divIcon({
    className: 'custom-nav-vehicle',
    html: `
      <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:rgba(56,139,253,0.3); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="width:22px; height:22px; border-radius:50%; background:#388BFD; border:3px solid #FFFFFF; box-shadow:0 0 12px #388BFD; display:flex; align-items:center; justify-content:center; color:#FFFFFF; font-size:11px;">
          ▲
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

export const RouteLayer: React.FC<RouteLayerProps> = ({
  activeRoute,
  alternativeRoutes = [],
  onSelectRoute,
  navigationState,
  originPoint,
  destinationPoint
}) => {
  if (!activeRoute && (!alternativeRoutes || alternativeRoutes.length === 0)) {
    return null;
  }

  // Hide alternative routes during active navigation so ONLY the navigated route is displayed
  const inactiveRoutes = navigationState?.isNavigating
    ? []
    : alternativeRoutes.filter((r) => r.id !== activeRoute?.id);

  return (
    <>
      {/* Inactive Alternative Routes */}
      {inactiveRoutes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.pathCoordinates}
          pathOptions={{
            color: '#607282',
            weight: 5,
            opacity: 0.65,
            dashArray: '6, 6'
          }}
          eventHandlers={{
            click: () => onSelectRoute && onSelectRoute(route)
          }}
        >
          <Tooltip sticky>
            <div className="text-xs font-sans">
              <strong>{route.name}</strong>
              <div className="text-[#8B98A7]">
                {route.durationMin} min • {route.distanceKm} km
              </div>
              <div className="text-[10px] text-[#4AA3DF]">Click to select alternative</div>
            </div>
          </Tooltip>
        </Polyline>
      ))}

      {/* Active Selected Route - Base Border Polyline */}
      {activeRoute && (
        <>
          <Polyline
            positions={activeRoute.pathCoordinates}
            pathOptions={{
              color: '#0B131C',
              weight: 10,
              opacity: 0.95
            }}
          />

          {/* Active Route Core Luminous Polyline */}
          <Polyline
            positions={activeRoute.pathCoordinates}
            pathOptions={{
              color: '#388BFD',
              weight: 6,
              opacity: 1.0
            }}
          >
            <Tooltip sticky>
              <div className="text-xs font-sans">
                <div className="font-bold text-[#388BFD]">Optimal Route (Google & Twin)</div>
                <div>{activeRoute.summary}</div>
                <div className="font-mono text-[11px] text-[#35C98B]">
                  {activeRoute.durationMin} mins • {activeRoute.distanceKm} km (Score: {activeRoute.twinScore}/100)
                </div>
              </div>
            </Tooltip>
          </Polyline>
        </>
      )}

      {/* Origin Marker */}
      {originPoint && (
        <Marker position={originPoint.coordinates} icon={createOriginIcon()}>
          <Tooltip direction="top" offset={[0, -14]} permanent>
            <span className="font-semibold text-xs text-[#11161D]">Origin: {originPoint.name}</span>
          </Tooltip>
        </Marker>
      )}

      {/* Destination Marker */}
      {destinationPoint && (
        <Marker position={destinationPoint.coordinates} icon={createDestIcon()}>
          <Tooltip direction="top" offset={[0, -14]} permanent>
            <span className="font-semibold text-xs text-[#11161D]">Destination: {destinationPoint.name}</span>
          </Tooltip>
        </Marker>
      )}

      {/* Navigation Vehicle Marker */}
      {navigationState?.isNavigating && navigationState.currentPosition && (
        <Marker position={navigationState.currentPosition} icon={createNavVehicleIcon()}>
          <Tooltip direction="top" offset={[0, -16]} permanent>
            <div className="text-[11px] font-mono text-[#0B0F14] bg-[#00A3FF] px-1.5 py-0.5 rounded font-bold shadow">
              {navigationState.currentSpeedKmh} km/h • ETA {navigationState.remainingDurationMin}m
            </div>
          </Tooltip>
        </Marker>
      )}
    </>
  );
};
