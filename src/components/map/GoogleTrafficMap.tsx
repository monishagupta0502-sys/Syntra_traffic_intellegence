/// <reference types="google.maps" />
import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Road, Incident, Bottleneck, EmergencyScenario, InfrastructureScenario, RouteOption, LocationPoint, NavigationState } from '../../types';

interface GoogleTrafficMapProps {
  roads: Road[];
  incidents: Incident[];
  bottlenecks: Bottleneck[];
  emergencyScenario?: EmergencyScenario | null;
  infrastructureScenario?: InfrastructureScenario | null;
  selectedRoad: Road | null;
  onSelectRoad: (road: Road | null) => void;
  center: [number, number];
  zoom: number;
  layers: {
    traffic: boolean;
    incidents: boolean;
    bottlenecks: boolean;
    emergency: boolean;
    infrastructure: boolean;
  };
  googleTrafficEnabled: boolean;
  mapStyleType: 'dark' | 'roadmap' | 'satellite' | 'hybrid';
  resetTrigger: number;
  activeRoute?: RouteOption | null;
  alternativeRoutes?: RouteOption[];
  onSelectRoute?: (route: RouteOption) => void;
  navigationState?: NavigationState | null;
  originPoint?: LocationPoint | null;
  destinationPoint?: LocationPoint | null;
}

// Sophisticated Dark Command Center Style for Google Maps
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#151B23' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B0F14' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8B98A7' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4AA3DF' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#5E6A78' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#111E18' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#35C98B' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#28313C' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1A212B' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#7E8B9B' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2F3C4B' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#151B23' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#E8EDF2' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1A232E' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4AA3DF' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0B131C' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3A5775' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0B131C' }]
  }
];

export const GoogleTrafficMap: React.FC<GoogleTrafficMapProps> = ({
  roads,
  incidents,
  bottlenecks,
  emergencyScenario,
  infrastructureScenario: _infrastructureScenario,
  selectedRoad,
  onSelectRoad,
  center,
  zoom,
  layers,
  googleTrafficEnabled,
  mapStyleType,
  resetTrigger,
  activeRoute,
  alternativeRoutes = [],
  onSelectRoute,
  navigationState,
  originPoint,
  destinationPoint
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const polylinesRef = useRef<any[]>([]);
  const markersRef = useRef<any[]>([]);
  const routePolylinesRef = useRef<any[]>([]);
  const routeMarkersRef = useRef<any[]>([]);
  const navMarkerRef = useRef<any>(null);
  const activeInfoWindowRef = useRef<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const apiKey = 
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || 
    'AIzaSyCCHhapHudjFjYh_0hDiVr2rjCKk9aHWfU';

  // Initialize Google Maps instance using setOptions and importLibrary
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;
    try {
      setOptions({
        key: apiKey,
        v: 'weekly'
      });
    } catch {
      // Options already set in previous call, safe to ignore
    }

    Promise.all([
      importLibrary('maps'),
      importLibrary('marker')
    ])
      .then(([mapsLib]) => {
        if (!isMounted || !mapContainerRef.current) return;

        const { Map, TrafficLayer } = mapsLib as any;

        const mapOptions = {
          center: { lat: center[0], lng: center[1] },
          zoom: zoom,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: mapStyleType === 'dark' ? DARK_MAP_STYLES : undefined,
          mapTypeId: mapStyleType === 'dark' ? 'roadmap' : mapStyleType
        };

        const map = new Map(mapContainerRef.current, mapOptions);
        mapInstanceRef.current = map;

        // Traffic Layer
        const trafficLayer = new TrafficLayer();
        trafficLayerRef.current = trafficLayer;
        if (googleTrafficEnabled) {
          trafficLayer.setMap(map);
        }

        setIsLoaded(true);
      })
      .catch((err: any) => {
        console.error('Failed to initialize Google Maps:', err);
        if (isMounted) {
          setLoadError(err?.message || 'Error loading Google Maps API');
        }
      });

    return () => {
      isMounted = false;
      polylinesRef.current.forEach(p => p.setMap(null));
      markersRef.current.forEach(m => m.setMap(null));
      polylinesRef.current = [];
      markersRef.current = [];
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [apiKey]);

  // Update map type & styles
  useEffect(() => {
    const map = mapInstanceRef.current;
    const g = (window as any).google;
    if (!map || !g?.maps) return;

    if (mapStyleType === 'dark') {
      map.setMapTypeId('roadmap');
      map.setOptions({ styles: DARK_MAP_STYLES });
    } else {
      map.setOptions({ styles: [] });
      if (mapStyleType === 'roadmap') {
        map.setMapTypeId('roadmap');
      } else if (mapStyleType === 'satellite') {
        map.setMapTypeId('satellite');
      } else if (mapStyleType === 'hybrid') {
        map.setMapTypeId('hybrid');
      }
    }
  }, [mapStyleType, isLoaded]);

  // Toggle Google Live Traffic Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const trafficLayer = trafficLayerRef.current;
    if (!map || !trafficLayer) return;

    if (googleTrafficEnabled && !navigationState?.isNavigating) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }
  }, [googleTrafficEnabled, navigationState?.isNavigating, isLoaded]);

  // Center / Zoom synchronization
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.panTo({ lat: center[0], lng: center[1] });
    map.setZoom(zoom);
  }, [center, zoom, resetTrigger, isLoaded]);

  // Center on selected road
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedRoad || selectedRoad.coordinates.length === 0) return;

    const mid = selectedRoad.coordinates[Math.floor(selectedRoad.coordinates.length / 2)];
    map.panTo({ lat: mid[0], lng: mid[1] });
  }, [selectedRoad, isLoaded]);

  // Render Digital Twin Roads (Polylines)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const g = (window as any).google;
    if (!map || !g?.maps || !isLoaded) return;

    // Clear previous polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    // Hide all generic roads and lanes while actively navigating so only the route is shown
    if (!layers.traffic || navigationState?.isNavigating) return;

    const getRoadColor = (road: Road) => {
      if (road.congestionLevel === 'severe') return '#E05A5A';
      if (road.congestionLevel === 'heavy') return '#E58B42';
      if (road.congestionLevel === 'moderate') return '#E7C65A';
      return '#35C98B';
    };

    roads.forEach((road) => {
      const isSelected = selectedRoad?.id === road.id;
      const path = road.coordinates.map(c => ({ lat: c[0], lng: c[1] }));
      const color = getRoadColor(road);

      // Base corridor polyline
      const polyline = new g.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: isSelected ? '#FFFFFF' : color,
        strokeOpacity: isSelected ? 1.0 : (googleTrafficEnabled ? 0.8 : 0.95),
        strokeWeight: isSelected ? 8 : (road.category === 'highway' ? 6 : 5),
        zIndex: isSelected ? 50 : 10,
        map
      });

      // Interactive click
      polyline.addListener('click', () => {
        onSelectRoad(road);
      });

      // Hover feedback
      polyline.addListener('mouseover', () => {
        if (selectedRoad?.id !== road.id) {
          polyline.setOptions({
            strokeWeight: 8,
            strokeOpacity: 1.0
          });
        }
      });

      polyline.addListener('mouseout', () => {
        if (selectedRoad?.id !== road.id) {
          polyline.setOptions({
            strokeWeight: road.category === 'highway' ? 6 : 5,
            strokeOpacity: googleTrafficEnabled ? 0.8 : 0.95
          });
        }
      });

      polylinesRef.current.push(polyline);
    });
  }, [roads, selectedRoad, layers.traffic, googleTrafficEnabled, isLoaded, onSelectRoad, navigationState?.isNavigating]);

  // Render Emergency Route (Cyan Green-Wave glow)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const g = (window as any).google;
    if (!map || !g?.maps || !isLoaded || !layers.emergency || !emergencyScenario || navigationState?.isNavigating) return;

    const routeRoads = roads.filter(r => emergencyScenario.routeRoadIds.includes(r.id));
    
    routeRoads.forEach((r) => {
      const path = r.coordinates.map(c => ({ lat: c[0], lng: c[1] }));
      
      const glowLine = new g.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#4AA3DF',
        strokeOpacity: 0.95,
        strokeWeight: 10,
        zIndex: 60,
        map
      });

      polylinesRef.current.push(glowLine);
    });
  }, [emergencyScenario, roads, layers.emergency, isLoaded, navigationState?.isNavigating]);

  // Render Bottlenecks and Incidents Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const g = (window as any).google;
    if (!map || !g?.maps || !isLoaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Hide bottlenecks and incidents while actively navigating so only the route is shown
    if (navigationState?.isNavigating) return;

    // Bottlenecks
    if (layers.bottlenecks) {
      bottlenecks.forEach((btn) => {
        const marker = new g.maps.Marker({
          position: { lat: btn.location[0], lng: btn.location[1] },
          map,
          title: `${btn.roadName} Bottleneck`,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: btn.severity === 'critical' ? '#E05A5A' : '#E58B42',
            fillOpacity: 0.95,
            strokeColor: '#151B23',
            strokeWeight: 2
          },
          zIndex: 40
        });

        const infoWindow = new g.maps.InfoWindow({
          content: `
            <div style="background:#151B23; color:#E8EDF2; padding:8px; border-radius:6px; font-family:sans-serif; font-size:12px; max-width:220px;">
              <div style="color:#E58B42; font-weight:bold; margin-bottom:4px;">⚠ Bottleneck: ${btn.id}</div>
              <div style="font-weight:600; margin-bottom:4px;">${btn.roadName}</div>
              <div style="color:#8B98A7; font-size:11px; margin-bottom:6px;">${btn.reason}</div>
              <div style="font-family:monospace; font-size:11px; color:#E05A5A;">Queue: ${btn.queueLengthM}m (+${btn.delayMinutes}m delay)</div>
            </div>
          `
        });

        marker.addListener('click', () => {
          if (activeInfoWindowRef.current) activeInfoWindowRef.current.close();
          infoWindow.open(map, marker);
          activeInfoWindowRef.current = infoWindow;
        });

        markersRef.current.push(marker);
      });
    }

    // Incidents
    if (layers.incidents) {
      incidents.forEach((inc) => {
        const marker = new g.maps.Marker({
          position: { lat: inc.location[0], lng: inc.location[1] },
          map,
          title: `${inc.type} on ${inc.roadName}`,
          icon: {
            path: g.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: inc.severity === 'high' || inc.severity === 'critical' ? '#E05A5A' : '#E7C65A',
            fillOpacity: 1.0,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5
          },
          zIndex: 45
        });

        const infoWindow = new g.maps.InfoWindow({
          content: `
            <div style="background:#151B23; color:#E8EDF2; padding:8px; border-radius:6px; font-family:sans-serif; font-size:12px; max-width:240px;">
              <div style="color:#E05A5A; font-weight:bold; margin-bottom:4px;">🚨 ${inc.type}</div>
              <div style="font-weight:600; margin-bottom:4px;">${inc.roadName}</div>
              <div style="color:#8B98A7; font-size:11px; margin-bottom:6px;">${inc.description}</div>
              <div style="font-family:monospace; font-size:10px; color:#5E6A78;">Status: ${inc.status} • Duration: ${inc.estimatedDuration}</div>
            </div>
          `
        });

        marker.addListener('click', () => {
          if (activeInfoWindowRef.current) activeInfoWindowRef.current.close();
          infoWindow.open(map, marker);
          activeInfoWindowRef.current = infoWindow;
          const road = roads.find(r => r.id === inc.roadId);
          if (road) onSelectRoad(road);
        });

        markersRef.current.push(marker);
      });
    }
  }, [bottlenecks, incidents, roads, layers.bottlenecks, layers.incidents, isLoaded, onSelectRoad]);

  // Render Route Polylines and Waypoint Pins (Optimal Google & Twin Routing)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const g = (window as any).google;
    if (!map || !g?.maps || !isLoaded) return;

    // Clear previous route overlays
    routePolylinesRef.current.forEach((p) => p.setMap(null));
    routePolylinesRef.current = [];

    routeMarkersRef.current.forEach((m) => m.setMap(null));
    routeMarkersRef.current = [];

    if (!activeRoute && (!alternativeRoutes || alternativeRoutes.length === 0)) return;

    const bounds = new g.maps.LatLngBounds();

    // 1. Draw Inactive Alternative Routes (only when not actively navigating)
    if (!navigationState?.isNavigating) {
      alternativeRoutes.forEach((alt) => {
        if (alt.id === activeRoute?.id) return;

        const altPath = alt.pathCoordinates.map((c) => ({ lat: c[0], lng: c[1] }));
        altPath.forEach((pt) => bounds.extend(pt));

        const altPoly = new g.maps.Polyline({
          path: altPath,
          geodesic: true,
          strokeColor: '#607282',
          strokeOpacity: 0.7,
          strokeWeight: 5,
          zIndex: 55,
          map
        });

        altPoly.addListener('click', () => {
          if (onSelectRoute) onSelectRoute(alt);
        });

        altPoly.addListener('mouseover', () => {
          altPoly.setOptions({ strokeColor: '#8B98A7', strokeWeight: 7, strokeOpacity: 1.0 });
        });

        altPoly.addListener('mouseout', () => {
          altPoly.setOptions({ strokeColor: '#607282', strokeWeight: 5, strokeOpacity: 0.7 });
        });

        routePolylinesRef.current.push(altPoly);

        // Midpoint duration badge for alternative route
        if (altPath.length > 2) {
          const midIdx = Math.floor(altPath.length / 2);
          const midPt = altPath[midIdx];
          const altBadge = new g.maps.Marker({
            position: midPt,
            map,
            title: `Select route: ${alt.summary} (${alt.durationMin} min)`,
            icon: {
              path: g.maps.SymbolPath.CIRCLE,
              scale: 15,
              fillColor: '#161D26',
              fillOpacity: 0.95,
              strokeColor: '#8B98A7',
              strokeWeight: 1.5
            },
            label: {
              text: `${alt.durationMin}m`,
              color: '#E8EDF2',
              fontSize: '10px',
              fontWeight: 'bold'
            },
            zIndex: 70
          });
          altBadge.addListener('click', () => {
            if (onSelectRoute) onSelectRoute(alt);
          });
          routeMarkersRef.current.push(altBadge);
        }
      });
    }

    // 2. Draw Active Recommended Route
    if (activeRoute) {
      const activePath = activeRoute.pathCoordinates.map((c) => ({ lat: c[0], lng: c[1] }));
      activePath.forEach((pt) => bounds.extend(pt));

      // Dark casing outline for contrast
      const outlinePoly = new g.maps.Polyline({
        path: activePath,
        geodesic: true,
        strokeColor: '#0A1017',
        strokeOpacity: 0.95,
        strokeWeight: 10,
        zIndex: 65,
        map
      });
      routePolylinesRef.current.push(outlinePoly);

      // Primary Route Polyline (Vivid Google Maps Cyan-Blue)
      const primaryPoly = new g.maps.Polyline({
        path: activePath,
        geodesic: true,
        strokeColor: '#388BFD',
        strokeOpacity: 1.0,
        strokeWeight: 6,
        zIndex: 66,
        map
      });
      routePolylinesRef.current.push(primaryPoly);

      // Midpoint badge for active fastest route (hide during navigation)
      if (!navigationState?.isNavigating && activePath.length > 2) {
        const midIdx = Math.floor(activePath.length / 2);
        const midPt = activePath[midIdx];
        const activeBadge = new g.maps.Marker({
          position: midPt,
          map,
          title: `Fastest: ${activeRoute.summary} (${activeRoute.durationMin} min)`,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: 17,
            fillColor: '#388BFD',
            fillOpacity: 1.0,
            strokeColor: '#FFFFFF',
            strokeWeight: 2.5
          },
          label: {
            text: `${activeRoute.durationMin}m`,
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 'bold'
          },
          zIndex: 75
        });
        routeMarkersRef.current.push(activeBadge);
      }
    }

    // 3. Draw Origin Pin (A)
    if (originPoint) {
      bounds.extend({ lat: originPoint.coordinates[0], lng: originPoint.coordinates[1] });
      const originMarker = new g.maps.Marker({
        position: { lat: originPoint.coordinates[0], lng: originPoint.coordinates[1] },
        map,
        title: `Origin: ${originPoint.name}`,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: '#388BFD',
          fillOpacity: 1.0,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        },
        label: {
          text: 'A',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '11px'
        },
        zIndex: 80
      });
      routeMarkersRef.current.push(originMarker);
    }

    // 4. Draw Destination Pin (B)
    if (destinationPoint) {
      bounds.extend({ lat: destinationPoint.coordinates[0], lng: destinationPoint.coordinates[1] });
      const destMarker = new g.maps.Marker({
        position: { lat: destinationPoint.coordinates[0], lng: destinationPoint.coordinates[1] },
        map,
        title: `Destination: ${destinationPoint.name}`,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: '#E05A5A',
          fillOpacity: 1.0,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        },
        label: {
          text: 'B',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '11px'
        },
        zIndex: 80
      });
      routeMarkersRef.current.push(destMarker);
    }

    // Auto-fit camera bounds with smooth padding (accommodating sidebar)
    if (!navigationState?.isNavigating && !bounds.isEmpty()) {
      map.fitBounds(bounds, { top: 70, right: 70, bottom: 70, left: 440 });
    }
  }, [activeRoute, alternativeRoutes, originPoint, destinationPoint, isLoaded, onSelectRoute, navigationState?.isNavigating]);

  // 5. Live Navigation Vehicle Tracker (Google Maps GPS Follow Mode)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const g = (window as any).google;
    if (!map || !g?.maps || !isLoaded) return;

    if (!navigationState?.isNavigating || !navigationState.currentPosition) {
      if (navMarkerRef.current) {
        navMarkerRef.current.setMap(null);
        navMarkerRef.current = null;
      }
      return;
    }

    const pos = {
      lat: navigationState.currentPosition[0],
      lng: navigationState.currentPosition[1]
    };

    let rotation = 0;
    if (activeRoute && activeRoute.pathCoordinates.length > 1) {
      const idx = Math.min(
        activeRoute.pathCoordinates.length - 2,
        Math.floor(((navigationState.progressPct || 0) / 100) * activeRoute.pathCoordinates.length)
      );
      const p1 = activeRoute.pathCoordinates[idx];
      const p2 = activeRoute.pathCoordinates[idx + 1] || p1;
      if (p1 && p2) {
        const dLat = p2[0] - p1[0];
        const dLng = p2[1] - p1[1];
        rotation = Math.atan2(dLng, dLat) * (180 / Math.PI);
      }
    }

    if (!navMarkerRef.current) {
      navMarkerRef.current = new g.maps.Marker({
        position: pos,
        map,
        title: 'Navigating Vehicle',
        icon: {
          path: g.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#00A3FF',
          fillOpacity: 1.0,
          strokeColor: '#FFFFFF',
          strokeWeight: 2.5,
          rotation: rotation
        },
        zIndex: 100
      });
    } else {
      navMarkerRef.current.setPosition(pos);
      navMarkerRef.current.setIcon({
        path: g.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 7,
        fillColor: '#00A3FF',
        fillOpacity: 1.0,
        strokeColor: '#FFFFFF',
        strokeWeight: 2.5,
        rotation: rotation
      });
    }

    // Smoothly follow vehicle position in navigation mode and zoom into route
    map.panTo(pos);
    if (map.getZoom() < 16) {
      map.setZoom(16);
    }
  }, [navigationState?.isNavigating, navigationState?.currentPosition, navigationState?.progressPct, activeRoute, isLoaded]);

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B0F14] text-[#8B98A7] p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#E05A5A]/20 text-[#E05A5A] flex items-center justify-center mb-3 text-lg font-bold">
          !
        </div>
        <p className="text-sm font-semibold text-[#E8EDF2] mb-1">Google Maps Platform Notice</p>
        <p className="text-xs max-w-md mb-3 text-[#8B98A7]">{loadError}</p>
        <p className="text-[11px] font-mono text-[#5E6A78]">
          Switch to Carto Dark map engine via the Map Platform selector.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#0B0F14]">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
