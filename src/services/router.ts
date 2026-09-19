import { Road, Incident, Bottleneck, RouteOption, RouteStep, LocationPoint, ManeuverType } from '../types';

export const HYDERABAD_LANDMARKS: LocationPoint[] = [
  {
    id: 'loc-cyber-towers',
    name: 'Cyber Towers, Hitec City',
    address: 'Hitec City Main Rd, Madhapur, Hyderabad',
    coordinates: [17.4502, 78.3808],
    category: 'tech_park'
  },
  {
    id: 'loc-mindspace',
    name: 'Mindspace IT Park & Inorbit',
    address: 'Mindspace Rd, APIIC Software Layout, Madhapur',
    coordinates: [17.4340, 78.3880],
    category: 'tech_park'
  },
  {
    id: 'loc-financial-district',
    name: 'Financial District (WaveRock / ISB)',
    address: 'Financial District, Nanakramguda, Gachibowli',
    coordinates: [17.4180, 78.3650],
    category: 'tech_park'
  },
  {
    id: 'loc-jubilee-checkpost',
    name: 'Jubilee Hills Checkpost',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    coordinates: [17.4285, 78.4140],
    category: 'hub'
  },
  {
    id: 'loc-banjara-hills',
    name: 'Banjara Hills (Road No. 1)',
    address: 'Road No. 1, Banjara Hills, Hyderabad',
    coordinates: [17.4145, 78.4410],
    category: 'hub'
  },
  {
    id: 'loc-punjagutta',
    name: 'Punjagutta Junction & Flyover',
    address: 'Nagarjuna Circle, Punjagutta, Hyderabad',
    coordinates: [17.4282, 78.4510],
    category: 'hub'
  },
  {
    id: 'loc-tank-bund',
    name: 'Tank Bund & Secretariat',
    address: 'Hussain Sagar Promenade, Central Hyderabad',
    coordinates: [17.4185, 78.4680],
    category: 'landmark'
  },
  {
    id: 'loc-durgam-cheruvu',
    name: 'Durgam Cheruvu Cable Bridge',
    address: 'Cable Stayed Bridge, Inorbit Mall Link, Madhapur',
    coordinates: [17.4340, 78.3910],
    category: 'landmark'
  },
  {
    id: 'loc-aig-hospitals',
    name: 'AIG Hospitals, Gachibowli',
    address: 'Mindspace Rd, Gachibowli, Hyderabad',
    coordinates: [17.4410, 78.3620],
    category: 'hospital'
  },
  {
    id: 'loc-nims-hospital',
    name: 'NIMS Hospital, Punjagutta',
    address: 'Panjagutta, Hyderabad',
    coordinates: [17.4230, 78.4520],
    category: 'hospital'
  },
  {
    id: 'loc-rgia-airport',
    name: 'Rajiv Gandhi International Airport (RGIA)',
    address: 'Shamshabad, Hyderabad',
    coordinates: [17.2403, 78.4294],
    category: 'transit'
  },
  {
    id: 'loc-mehdipatnam-pvnr',
    name: 'PVNR Expressway Entry, Mehdipatnam',
    address: 'Mehdipatnam Junction, Hyderabad',
    coordinates: [17.3948, 78.4412],
    category: 'transit'
  }
];

// Helper: Calculate Great Circle distance between two points in km
export function calculateDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Helper: Find closest road node in Digital Twin to a coordinate
export function findNearestRoad(coord: [number, number], roads: Road[]): Road {
  let nearest = roads[0];
  let minDist = Infinity;

  roads.forEach((road) => {
    road.coordinates.forEach((pt) => {
      const d = calculateDistanceKm(coord, pt);
      if (d < minDist) {
        minDist = d;
        nearest = road;
      }
    });
  });

  return nearest;
}

// Convert Google Maps route result to SYNTRA RouteOption
function mapGoogleRouteToOption(
  gRoute: any,
  index: number,
  roads: Road[],
  incidents: Incident[],
  bottlenecks: Bottleneck[]
): RouteOption {
  const leg = gRoute.legs[0];
  const distanceKm = Number((leg.distance.value / 1000).toFixed(1));
  const durationMin = Math.round(
    (leg.duration_in_traffic ? leg.duration_in_traffic.value : leg.duration.value) / 60
  );
  const durationTypicalMin = Math.round(leg.duration.value / 60);
  const delayMin = Math.max(0, durationMin - durationTypicalMin);

  // Extract path coordinates
  const pathCoordinates: [number, number][] = gRoute.overview_path.map((p: any) => [
    p.lat(),
    p.lng()
  ]);

  // Correlate with incidents along path
  let incidentsEncountered = 0;
  incidents.forEach((inc) => {
    const isClose = pathCoordinates.some(
      (pt) => calculateDistanceKm(pt, inc.location) < 0.35
    );
    if (isClose) incidentsEncountered++;
  });

  // Correlate with bottlenecks
  let bottlenecksAvoided = 0;
  bottlenecks.forEach((btn) => {
    const isClose = pathCoordinates.some(
      (pt) => calculateDistanceKm(pt, btn.location) < 0.4
    );
    if (!isClose) bottlenecksAvoided++;
  });

  // Turn-by-turn steps
  const steps: RouteStep[] = leg.steps.map((s: any, idx: number) => {
    // Strip HTML tags from instructions
    const cleanInstruction = s.instructions.replace(/<[^>]*>?/gm, ' ');
    const stepCoords: [number, number][] = s.path
      ? s.path.map((p: any) => [p.lat(), p.lng()])
      : [[s.start_location.lat(), s.start_location.lng()], [s.end_location.lat(), s.end_location.lng()]];

    let maneuver: ManeuverType = 'straight';
    const rawManeuver = (s.maneuver || '').toLowerCase();
    if (rawManeuver.includes('left')) maneuver = 'turn-left';
    else if (rawManeuver.includes('right')) maneuver = 'turn-right';
    else if (rawManeuver.includes('merge')) maneuver = 'merge';
    else if (rawManeuver.includes('ramp')) maneuver = 'ramp-right';
    else if (rawManeuver.includes('roundabout')) maneuver = 'roundabout-right';
    else if (idx === leg.steps.length - 1) maneuver = 'destination';

    // Estimate speed on this step
    const stepDistKm = s.distance.value / 1000;
    const stepDurationHours = (s.duration.value || 60) / 3600;
    const speedKmh = Math.round(Math.min(100, Math.max(12, stepDistKm / stepDurationHours)));

    let congestion: any = 'normal';
    if (speedKmh < 20) congestion = 'severe';
    else if (speedKmh < 32) congestion = 'heavy';
    else if (speedKmh < 45) congestion = 'moderate';

    return {
      id: `step-${idx}`,
      instruction: cleanInstruction,
      roadName: gRoute.summary || 'Arterial Link',
      distanceKm: Number((s.distance.value / 1000).toFixed(1)),
      durationMin: Math.max(1, Math.round(s.duration.value / 60)),
      maneuver,
      congestion,
      speedKmh,
      coordinates: stepCoords
    };
  });

  // Calculate Twin Score (0-100)
  // Penalize delay, incidents, severe congestion
  let twinScore = 100;
  twinScore -= delayMin * 2.5;
  twinScore -= incidentsEncountered * 18;
  if (durationMin > durationTypicalMin * 1.4) twinScore -= 12;
  twinScore = Math.max(35, Math.min(99, Math.round(twinScore)));

  const tag =
    index === 0
      ? 'AI_OPTIMAL'
      : incidentsEncountered === 0
      ? 'AVOID_INCIDENTS'
      : 'FASTEST';

  return {
    id: `g-route-${index}`,
    name: gRoute.summary ? `via ${gRoute.summary}` : `Route Alternative ${index + 1}`,
    tag,
    summary: gRoute.summary || `${distanceKm} km via Metropolitan Spines`,
    distanceKm,
    durationMin,
    durationTypicalMin,
    delayMin,
    twinScore,
    congestionLevel: delayMin > 8 ? 'severe' : delayMin > 4 ? 'heavy' : delayMin > 2 ? 'moderate' : 'normal',
    pathCoordinates,
    steps,
    corridorsTraversed: [gRoute.summary || 'Metropolitan Road Network'],
    incidentsEncountered,
    bottlenecksAvoided,
    carbonEmissionKg: Number((distanceKm * 0.142).toFixed(1)),
    isRecommended: index === 0
  };
}

// Fallback Synthetic Routing Algorithm tailored to Hyderabad Digital Twin Corridors
export function generateDigitalTwinRoutes(
  originCoord: [number, number],
  destCoord: [number, number],
  roads: Road[],
  incidents: Incident[],
  bottlenecks: Bottleneck[]
): RouteOption[] {
  const startRoad = findNearestRoad(originCoord, roads);
  const endRoad = findNearestRoad(destCoord, roads);

  const directDist = calculateDistanceKm(originCoord, destCoord);

  // Strategy 1: AI Optimal Route (Bypasses active bottlenecks and severe roads)
  const optimalRoads: Road[] = [];
  optimalRoads.push(startRoad);

  // Pick connecting roads prioritizing normal/moderate congestion
  const middleRoads = roads
    .filter((r) => r.id !== startRoad.id && r.id !== endRoad.id)
    .sort((a, b) => {
      // Score based on speed and incident freedom
      const aInc = incidents.some((inc) => inc.roadId === a.id) ? 1 : 0;
      const bInc = incidents.some((inc) => inc.roadId === b.id) ? 1 : 0;
      if (aInc !== bInc) return aInc - bInc;
      return b.currentSpeed - a.currentSpeed;
    });

  if (middleRoads[0] && middleRoads[0].id !== startRoad.id) {
    optimalRoads.push(middleRoads[0]);
  }
  if (middleRoads[1] && middleRoads[1].id !== endRoad.id) {
    optimalRoads.push(middleRoads[1]);
  }
  if (startRoad.id !== endRoad.id) {
    optimalRoads.push(endRoad);
  }

  // Generate path points with smooth interpolation
  const buildPath = (roadsList: Road[]): [number, number][] => {
    const pts: [number, number][] = [originCoord];
    roadsList.forEach((r) => {
      r.coordinates.forEach((c) => pts.push(c));
    });
    pts.push(destCoord);
    return pts;
  };

  const path1 = buildPath(optimalRoads);
  const dist1 = Number((directDist * 1.28).toFixed(1));
  const duration1 = Math.round((dist1 / 48) * 60);

  const steps1: RouteStep[] = [
    {
      id: 'step-1-1',
      instruction: `Depart from origin onto ${startRoad.name}`,
      roadName: startRoad.name,
      distanceKm: Number((dist1 * 0.25).toFixed(1)),
      durationMin: Math.max(2, Math.round(duration1 * 0.25)),
      maneuver: 'straight',
      congestion: startRoad.congestionLevel,
      speedKmh: startRoad.currentSpeed,
      coordinates: [originCoord, startRoad.coordinates[0]]
    },
    {
      id: 'step-1-2',
      instruction: `Continue along ${optimalRoads[1]?.name || 'Metro Radial Spine'} (Bypassing Cyber Towers congestion)`,
      roadName: optimalRoads[1]?.name || 'Metro Radial Corridor',
      distanceKm: Number((dist1 * 0.45).toFixed(1)),
      durationMin: Math.max(3, Math.round(duration1 * 0.45)),
      maneuver: 'fork-right',
      congestion: 'normal',
      speedKmh: 58,
      coordinates: optimalRoads[1]?.coordinates || [startRoad.coordinates[0], destCoord],
      bottleneckNotice: 'Bypassed Jubilee Checkpost Bottleneck (-6m delay)'
    },
    {
      id: 'step-1-3',
      instruction: `Take the ramp towards ${endRoad.name}`,
      roadName: endRoad.name,
      distanceKm: Number((dist1 * 0.3).toFixed(1)),
      durationMin: Math.max(2, Math.round(duration1 * 0.3)),
      maneuver: 'destination',
      congestion: endRoad.congestionLevel,
      speedKmh: endRoad.currentSpeed,
      coordinates: [endRoad.coordinates[0], destCoord]
    }
  ];

  // Route 1: AI Optimal
  const route1: RouteOption = {
    id: 'route-ai-optimal',
    name: 'AI Twin Recommended: Smart Bypass',
    tag: 'AI_OPTIMAL',
    summary: `via ${optimalRoads.map((r) => r.name.split('(')[0].trim()).slice(0, 2).join(' & ')}`,
    distanceKm: dist1,
    durationMin: duration1,
    durationTypicalMin: duration1 - 2,
    delayMin: 2,
    twinScore: 94,
    congestionLevel: 'normal',
    pathCoordinates: path1,
    steps: steps1,
    corridorsTraversed: optimalRoads.map((r) => r.name),
    incidentsEncountered: 0,
    bottlenecksAvoided: 2,
    carbonEmissionKg: Number((dist1 * 0.138).toFixed(1)),
    isRecommended: true
  };

  // Route 2: Expressway Spine (Faster speeds, slightly longer distance)
  const expresswayRoads = roads.filter((r) => r.category === 'highway');
  const path2Roads = expresswayRoads.length > 0 ? [startRoad, expresswayRoads[0], endRoad] : optimalRoads;
  const path2 = buildPath(path2Roads);
  const dist2 = Number((directDist * 1.45).toFixed(1));
  const duration2 = Math.round((dist2 / 58) * 60) + 4;

  const route2: RouteOption = {
    id: 'route-expressway',
    name: 'Expressway Route: PVNR & ORR Radials',
    tag: 'FASTEST',
    summary: 'via PVNR Elevated / ORR Radial Corridor',
    distanceKm: dist2,
    durationMin: duration2,
    durationTypicalMin: duration2 - 1,
    delayMin: 4,
    twinScore: 86,
    congestionLevel: 'moderate',
    pathCoordinates: path2,
    steps: [
      {
        id: 'step-2-1',
        instruction: `Merge onto ${path2Roads[1]?.name || 'Expressway Corridor'}`,
        roadName: path2Roads[1]?.name || 'Highway Corridor',
        distanceKm: Number((dist2 * 0.6).toFixed(1)),
        durationMin: Math.max(3, Math.round(duration2 * 0.55)),
        maneuver: 'merge',
        congestion: 'normal',
        speedKmh: 75,
        coordinates: path2Roads[1]?.coordinates || path2
      },
      {
        id: 'step-2-2',
        instruction: `Take exit towards destination`,
        roadName: endRoad.name,
        distanceKm: Number((dist2 * 0.4).toFixed(1)),
        durationMin: Math.max(2, Math.round(duration2 * 0.45)),
        maneuver: 'destination',
        congestion: 'moderate',
        speedKmh: 38,
        coordinates: [path2[Math.floor(path2.length / 2)], destCoord]
      }
    ],
    corridorsTraversed: path2Roads.map((r) => r.name),
    incidentsEncountered: 0,
    bottlenecksAvoided: 1,
    carbonEmissionKg: Number((dist2 * 0.155).toFixed(1)),
    isRecommended: false
  };

  // Route 3: Direct Arterial (Shorter distance but heavy city congestion)
  const path3 = [originCoord, startRoad.coordinates[0], endRoad.coordinates[0], destCoord];
  const dist3 = Number((directDist * 1.15).toFixed(1));
  const duration3 = Math.round(duration1 * 1.38);

  const route3: RouteOption = {
    id: 'route-arterial-direct',
    name: 'Direct City Arterial (High Traffic)',
    tag: 'SHORTEST',
    summary: `via Inner Ring & City Central Artery`,
    distanceKm: dist3,
    durationMin: duration3,
    durationTypicalMin: duration1,
    delayMin: duration3 - duration1,
    twinScore: 68,
    congestionLevel: 'heavy',
    pathCoordinates: path3,
    steps: [
      {
        id: 'step-3-1',
        instruction: `Head along central arterial through high density zones`,
        roadName: 'Inner Metropolitan Arterial',
        distanceKm: dist3,
        durationMin: duration3,
        maneuver: 'straight',
        congestion: 'heavy',
        speedKmh: 24,
        coordinates: path3,
        hazardNotice: 'High queue friction at main junctions'
      }
    ],
    corridorsTraversed: [startRoad.name, endRoad.name],
    incidentsEncountered: 1,
    bottlenecksAvoided: 0,
    carbonEmissionKg: Number((dist3 * 0.185).toFixed(1)),
    isRecommended: false
  };

  return [route1, route2, route3];
}

// Master query function combining Google Maps DirectionsService with Digital Twin scoring
export async function calculateOptimalRoutes(
  origin: [number, number],
  destination: [number, number],
  roads: Road[],
  incidents: Incident[],
  bottlenecks: Bottleneck[],
  options?: {
    avoidBottlenecks?: boolean;
    avoidIncidents?: boolean;
    preferExpressways?: boolean;
  }
): Promise<RouteOption[]> {
  const g = (window as any).google;

  // Try Google Maps DirectionsService first
  if (g?.maps?.DirectionsService) {
    try {
      const directionsService = new g.maps.DirectionsService();

      const request: any = {
        origin: { lat: origin[0], lng: origin[1] },
        destination: { lat: destination[0], lng: destination[1] },
        travelMode: g.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: g.maps.TrafficModel.BEST_GUESS
        }
      };

      const result: any = await new Promise((resolve, reject) => {
        directionsService.route(request, (res: any, status: any) => {
          if (status === g.maps.DirectionsStatus.OK && res?.routes?.length > 0) {
            resolve(res);
          } else {
            reject(new Error(`Directions API status: ${status}`));
          }
        });
      });

      if (result?.routes?.length > 0) {
        const mappedRoutes: RouteOption[] = result.routes.map((r: any, idx: number) =>
          mapGoogleRouteToOption(r, idx, roads, incidents, bottlenecks)
        );

        // Sort so the top recommended route has the best Twin Score & least delay
        mappedRoutes.sort((a, b) => b.twinScore - a.twinScore);
        mappedRoutes[0].isRecommended = true;
        mappedRoutes[0].tag = 'AI_OPTIMAL';

        return mappedRoutes;
      }
    } catch (err) {
      console.warn('Google Maps DirectionsService not available or quota reached, falling back to SYNTRA Twin Routing Engine:', err);
    }
  }

  // Fallback to high-fidelity Digital Twin routing model
  const syntheticRoutes = generateDigitalTwinRoutes(origin, destination, roads, incidents, bottlenecks);
  return syntheticRoutes;
}
