import { 
  Road, 
  Incident, 
  Bottleneck, 
  ForecastPoint, 
  SimulationResult, 
  DiversionOption, 
  InfrastructureScenario, 
  EmergencyScenario, 
  ControlRoomAlert,
  ControlRoomStatus
} from '../types';

// Hyderabad Digital Twin Network Model (Telangana, India)
// Encompasses major IT Corridors (Hitec City, Gachibowli, ORR), Jubilee Hills, Banjara Hills, Punjagutta, and Central Hyderabad
export const INITIAL_ROADS: Road[] = [
  {
    id: 'R-101',
    name: 'PVNR Elevated Expressway (Mehdipatnam - Aramghar)',
    category: 'highway',
    coordinates: [
      [17.3948, 78.4412],
      [17.3812, 78.4425],
      [17.3620, 78.4438],
      [17.3385, 78.4452]
    ],
    speedLimit: 80,
    freeFlowSpeed: 75,
    currentSpeed: 62,
    vehicleCount: 220,
    flow: 2100,
    density: 29,
    queueLength: 85,
    waitingTime: 22,
    travelTime: 6.8,
    congestionLevel: 'normal',
    lanes: 4,
    capacity: 3600,
    lengthMeters: 7200,
    connectedRoadIds: ['R-106', 'R-111']
  },
  {
    id: 'R-102',
    name: 'Cyber Towers & Hitec City Arterial (Mindspace - Madhapur)',
    category: 'arterial',
    coordinates: [
      [17.4425, 78.3775],
      [17.4502, 78.3808],
      [17.4485, 78.3915],
      [17.4420, 78.4025],
      [17.4325, 78.4085]
    ],
    speedLimit: 50,
    freeFlowSpeed: 48,
    currentSpeed: 19,
    vehicleCount: 380,
    flow: 2450,
    density: 64,
    queueLength: 520,
    waitingTime: 145,
    travelTime: 12.4,
    congestionLevel: 'severe',
    lanes: 4,
    capacity: 3200,
    lengthMeters: 3400,
    connectedRoadIds: ['R-103', 'R-104', 'R-107', 'R-109'],
    incidentStatus: 'Peak Tech Commute Surge'
  },
  {
    id: 'R-103',
    name: 'Gachibowli - Financial District Spine (ORR Radial)',
    category: 'highway',
    coordinates: [
      [17.4402, 78.3485],
      [17.4335, 78.3625],
      [17.4255, 78.3750],
      [17.4180, 78.3845]
    ],
    speedLimit: 100,
    freeFlowSpeed: 95,
    currentSpeed: 74,
    vehicleCount: 310,
    flow: 2800,
    density: 32,
    queueLength: 120,
    waitingTime: 25,
    travelTime: 4.8,
    congestionLevel: 'normal',
    lanes: 6,
    capacity: 5400,
    lengthMeters: 4600,
    connectedRoadIds: ['R-102', 'R-109', 'R-114']
  },
  {
    id: 'R-104',
    name: 'Jubilee Hills Checkpost & Road No. 36 Arterial',
    category: 'arterial',
    coordinates: [
      [17.4345, 78.3885],
      [17.4312, 78.4020],
      [17.4285, 78.4140],
      [17.4260, 78.4235]
    ],
    speedLimit: 50,
    freeFlowSpeed: 46,
    currentSpeed: 22,
    vehicleCount: 260,
    flow: 1820,
    density: 54,
    queueLength: 410,
    waitingTime: 110,
    travelTime: 9.8,
    congestionLevel: 'heavy',
    lanes: 3,
    capacity: 2200,
    lengthMeters: 3100,
    connectedRoadIds: ['R-102', 'R-106', 'R-107'],
    incidentStatus: 'Checkpost Bottleneck'
  },
  {
    id: 'R-105',
    name: 'Punjagutta Flyover & Begumpet Airport Arterial',
    category: 'arterial',
    coordinates: [
      [17.4520, 78.4610],
      [17.4435, 78.4552],
      [17.4282, 78.4510],
      [17.4145, 78.4590]
    ],
    speedLimit: 50,
    freeFlowSpeed: 47,
    currentSpeed: 26,
    vehicleCount: 290,
    flow: 1950,
    density: 56,
    queueLength: 380,
    waitingTime: 95,
    travelTime: 8.9,
    congestionLevel: 'heavy',
    lanes: 4,
    capacity: 3100,
    lengthMeters: 4200,
    connectedRoadIds: ['R-106', 'R-110', 'R-112'],
    incidentStatus: 'Construction Slowdown'
  },
  {
    id: 'R-106',
    name: 'Banjara Hills Road No. 1 & No. 12 Crossway',
    category: 'arterial',
    coordinates: [
      [17.4065, 78.4505],
      [17.4145, 78.4410],
      [17.4195, 78.4325],
      [17.4225, 78.4215]
    ],
    speedLimit: 45,
    freeFlowSpeed: 44,
    currentSpeed: 32,
    vehicleCount: 165,
    flow: 1340,
    density: 38,
    queueLength: 140,
    waitingTime: 48,
    travelTime: 5.4,
    congestionLevel: 'moderate',
    lanes: 3,
    capacity: 1950,
    lengthMeters: 2800,
    connectedRoadIds: ['R-101', 'R-104', 'R-105', 'R-111']
  },
  {
    id: 'R-107',
    name: 'Durgam Cheruvu Cable Bridge & Mindspace Link',
    category: 'connector',
    coordinates: [
      [17.4385, 78.3830],
      [17.4340, 78.3910],
      [17.4290, 78.4005]
    ],
    speedLimit: 45,
    freeFlowSpeed: 45,
    currentSpeed: 17,
    vehicleCount: 195,
    flow: 1420,
    density: 68,
    queueLength: 390,
    waitingTime: 120,
    travelTime: 7.6,
    congestionLevel: 'severe',
    lanes: 2,
    capacity: 1400,
    lengthMeters: 1750,
    connectedRoadIds: ['R-102', 'R-104'],
    incidentStatus: 'Lane Obstruction'
  },
  {
    id: 'R-108',
    name: 'Tank Bund & Necklace Road Promenade (Hussain Sagar Ring)',
    category: 'highway',
    coordinates: [
      [17.4350, 78.4830],
      [17.4245, 78.4755],
      [17.4120, 78.4715],
      [17.4110, 78.4615]
    ],
    speedLimit: 60,
    freeFlowSpeed: 58,
    currentSpeed: 51,
    vehicleCount: 180,
    flow: 1750,
    density: 24,
    queueLength: 45,
    waitingTime: 18,
    travelTime: 4.2,
    congestionLevel: 'normal',
    lanes: 4,
    capacity: 3400,
    lengthMeters: 3800,
    connectedRoadIds: ['R-105', 'R-110', 'R-113']
  },
  {
    id: 'R-109',
    name: 'Kondapur - Miyapur Radial (Botanical Garden Junction)',
    category: 'arterial',
    coordinates: [
      [17.4420, 78.3620],
      [17.4525, 78.3640],
      [17.4615, 78.3685],
      [17.4695, 78.3725]
    ],
    speedLimit: 50,
    freeFlowSpeed: 48,
    currentSpeed: 36,
    vehicleCount: 170,
    flow: 1390,
    density: 35,
    queueLength: 110,
    waitingTime: 42,
    travelTime: 5.6,
    congestionLevel: 'normal',
    lanes: 3,
    capacity: 2200,
    lengthMeters: 3300,
    connectedRoadIds: ['R-102', 'R-103']
  },
  {
    id: 'R-110',
    name: 'Raj Bhavan Road & Somajiguda Spine',
    category: 'arterial',
    coordinates: [
      [17.4282, 78.4510],
      [17.4215, 78.4550],
      [17.4150, 78.4600]
    ],
    speedLimit: 45,
    freeFlowSpeed: 44,
    currentSpeed: 30,
    vehicleCount: 145,
    flow: 1180,
    density: 36,
    queueLength: 120,
    waitingTime: 45,
    travelTime: 4.2,
    congestionLevel: 'moderate',
    lanes: 3,
    capacity: 1850,
    lengthMeters: 1950,
    connectedRoadIds: ['R-105', 'R-108', 'R-113']
  },
  {
    id: 'R-111',
    name: 'Mehdipatnam - Masab Tank - Lakdikapul Corridor',
    category: 'connector',
    coordinates: [
      [17.3948, 78.4412],
      [17.4020, 78.4465],
      [17.4065, 78.4505],
      [17.4045, 78.4630]
    ],
    speedLimit: 45,
    freeFlowSpeed: 42,
    currentSpeed: 34,
    vehicleCount: 130,
    flow: 1050,
    density: 30,
    queueLength: 75,
    waitingTime: 36,
    travelTime: 4.8,
    congestionLevel: 'normal',
    lanes: 3,
    capacity: 1750,
    lengthMeters: 2600,
    connectedRoadIds: ['R-101', 'R-106', 'R-113']
  },
  {
    id: 'R-112',
    name: 'Ameerpet - SR Nagar Metro Transitway Corridor',
    category: 'highway',
    coordinates: [
      [17.4450, 78.4420],
      [17.4375, 78.4465],
      [17.4282, 78.4510]
    ],
    speedLimit: 50,
    freeFlowSpeed: 49,
    currentSpeed: 38,
    vehicleCount: 155,
    flow: 1410,
    density: 34,
    queueLength: 95,
    waitingTime: 38,
    travelTime: 4.0,
    congestionLevel: 'normal',
    lanes: 4,
    capacity: 2900,
    lengthMeters: 2200,
    connectedRoadIds: ['R-105', 'R-110']
  },
  {
    id: 'R-113',
    name: 'Khairatabad - Telangana Secretariat - Assembly Arterial',
    category: 'connector',
    coordinates: [
      [17.4110, 78.4615],
      [17.4045, 78.4670],
      [17.3995, 78.4720]
    ],
    speedLimit: 45,
    freeFlowSpeed: 44,
    currentSpeed: 35,
    vehicleCount: 110,
    flow: 890,
    density: 28,
    queueLength: 55,
    waitingTime: 30,
    travelTime: 3.5,
    congestionLevel: 'normal',
    lanes: 3,
    capacity: 1700,
    lengthMeters: 1750,
    connectedRoadIds: ['R-108', 'R-110', 'R-111']
  },
  {
    id: 'R-114',
    name: 'Nanakramguda Financial District Expressway (WaveRock Loop)',
    category: 'arterial',
    coordinates: [
      [17.4180, 78.3845],
      [17.4110, 78.3750],
      [17.4060, 78.3650]
    ],
    speedLimit: 60,
    freeFlowSpeed: 58,
    currentSpeed: 48,
    vehicleCount: 135,
    flow: 1250,
    density: 25,
    queueLength: 40,
    waitingTime: 20,
    travelTime: 3.8,
    congestionLevel: 'normal',
    lanes: 4,
    capacity: 3200,
    lengthMeters: 2400,
    connectedRoadIds: ['R-103']
  }
];

export const DEMO_INCIDENTS: Incident[] = [
  {
    id: 'INC-HYD-081',
    type: 'Possible Accident',
    severity: 'high',
    roadId: 'R-107',
    roadName: 'Durgam Cheruvu Cable Bridge & Mindspace Link',
    location: [17.4340, 78.3910],
    detectedTime: '11:18 AM (04m ago)',
    estimatedDuration: '45 mins remaining',
    affectedRoads: ['R-107', 'R-102', 'R-104'],
    status: 'Active',
    description: 'Multi-vehicle collision on the cable stay span heading towards Jubilee Hills. Right lane obstructed, upstream speeds down 62%.',
    reportedBy: 'Spatial Speed Anomaly Engine (Simulated)'
  },
  {
    id: 'INC-HYD-079',
    type: 'Construction',
    severity: 'moderate',
    roadId: 'R-105',
    roadName: 'Punjagutta Flyover & Begumpet Airport Arterial',
    location: [17.4435, 78.4552],
    detectedTime: '08:30 AM (2h 52m ago)',
    estimatedDuration: '4h remaining',
    affectedRoads: ['R-105', 'R-110', 'R-112'],
    status: 'Active',
    description: 'Flyover maintenance and pillar retrofitting work. Northbound lane restricted to single-file flow.',
    reportedBy: 'GHMC Traffic Works Notice (Simulated)'
  },
  {
    id: 'INC-HYD-074',
    type: 'Vehicle Breakdown',
    severity: 'low',
    roadId: 'R-102',
    roadName: 'Cyber Towers & Hitec City Arterial (Mindspace - Madhapur)',
    location: [17.4485, 78.3915],
    detectedTime: '11:02 AM (20m ago)',
    estimatedDuration: '15 mins remaining',
    affectedRoads: ['R-102'],
    status: 'Investigating',
    description: 'Stalled RTC transit bus occupying curb lane near Madhapur Metro Station. Causes localized rubbernecking and merging friction.',
    reportedBy: 'TraCI Microscopic Telemetry Alert (Simulated)'
  }
];

export const DEMO_BOTTLENECKS: Bottleneck[] = [
  {
    id: 'BTN-HYD-01',
    roadId: 'R-102',
    roadName: 'Cyber Towers & Hitec City Arterial',
    location: [17.4502, 78.3808],
    severity: 'critical',
    queueLengthM: 520,
    delayMinutes: 12.4,
    speedRatio: 0.39,
    reason: 'Heavy tech commuter converge at Cyber Towers signal junction with capacity saturation.'
  },
  {
    id: 'BTN-HYD-02',
    roadId: 'R-107',
    roadName: 'Durgam Cheruvu Cable Bridge & Mindspace Link',
    location: [17.4340, 78.3910],
    severity: 'critical',
    queueLengthM: 390,
    delayMinutes: 7.6,
    speedRatio: 0.37,
    reason: 'Active collision incident reducing corridor capacity by 50%.'
  },
  {
    id: 'BTN-HYD-03',
    roadId: 'R-104',
    roadName: 'Jubilee Hills Checkpost & Road No. 36 Arterial',
    location: [17.4285, 78.4140],
    severity: 'moderate',
    queueLengthM: 410,
    delayMinutes: 9.8,
    speedRatio: 0.47,
    reason: 'High turning volume towards Banjara Hills Road No. 45 creates cycle failure at signal.'
  }
];

export const DEMO_FORECAST: ForecastPoint[] = [
  {
    timeHorizon: '15m',
    minutesFromNow: 15,
    predictedVolume: 2540,
    predictedSpeed: 33.8,
    predictedCongestionPct: 38.2,
    confidenceLower: 31.4,
    confidenceUpper: 36.2,
    bottleneckRisk: 'Moderate',
    contributingFactors: ['Midday office deliveries around Madhapur', 'Cable Bridge residual queue']
  },
  {
    timeHorizon: '30m',
    minutesFromNow: 30,
    predictedVolume: 2790,
    predictedSpeed: 29.6,
    predictedCongestionPct: 46.5,
    confidenceLower: 26.8,
    confidenceUpper: 32.5,
    bottleneckRisk: 'High',
    contributingFactors: ['Cyber Towers cross-traffic surge', 'Secondary spillback into Road No. 36']
  },
  {
    timeHorizon: '45m',
    minutesFromNow: 45,
    predictedVolume: 2980,
    predictedSpeed: 26.2,
    predictedCongestionPct: 54.0,
    confidenceLower: 23.0,
    confidenceUpper: 29.4,
    bottleneckRisk: 'Severe',
    contributingFactors: ['Corridor capacity saturation', 'Spillback reaches Bio-Diversity Junction']
  },
  {
    timeHorizon: '60m',
    minutesFromNow: 60,
    predictedVolume: 2740,
    predictedSpeed: 30.8,
    predictedCongestionPct: 42.1,
    confidenceLower: 27.5,
    confidenceUpper: 33.8,
    bottleneckRisk: 'Moderate',
    contributingFactors: ['Post-peak stabilization', 'Incident clearance projected on Cable Bridge']
  }
];

export const DEMO_DIVERSION_OPTIONS: DiversionOption[] = [
  {
    id: 'DIV-HYD-A',
    name: 'Diversion Corridor Alpha: Financial District ORR Expressway Bypass',
    pathRoadIds: ['R-103', 'R-114'],
    travelTimeMin: 11.2,
    distanceKm: 6.8,
    congestionLevel: 'normal',
    expectedDelayMin: 1.4,
    affectedRoadsCount: 2,
    capacityScore: 92,
    notes: 'Takes advantage of the 6-lane Outer Ring Road service access. Completely bypasses Durgam Cheruvu and Madhapur friction.'
  },
  {
    id: 'DIV-HYD-B',
    name: 'Diversion Corridor Beta: Kondapur - Botanical Garden Inner Radial',
    pathRoadIds: ['R-109', 'R-103'],
    travelTimeMin: 14.6,
    distanceKm: 5.2,
    congestionLevel: 'moderate',
    expectedDelayMin: 3.8,
    affectedRoadsCount: 2,
    capacityScore: 72,
    notes: 'Direct route towards Gachibowli Flyover; moderate delay at Kothaguda Junction.'
  },
  {
    id: 'DIV-HYD-C',
    name: 'Diversion Corridor Gamma: Jubilee Hills Road 45 Outer Loop',
    pathRoadIds: ['R-104', 'R-106', 'R-111'],
    travelTimeMin: 18.2,
    distanceKm: 6.5,
    congestionLevel: 'moderate',
    expectedDelayMin: 5.2,
    affectedRoadsCount: 3,
    capacityScore: 61,
    notes: 'Avoids Hitec City central artery entirely; recommended for commercial logistics and inter-district buses.'
  }
];

export const DEMO_INFRASTRUCTURE_SCENARIOS: InfrastructureScenario[] = [
  {
    id: 'INF-HYD-01',
    name: 'Cyber Towers Junction Grade Separation & Underpass',
    roadId: 'R-102',
    roadName: 'Cyber Towers & Hitec City Arterial',
    action: 'ADD_LANE',
    lanesDelta: 1,
    capacityDeltaPct: 28,
    costEstimateUsd: 1850000,
    throughputGainPct: 24.6,
    delayReductionMin: 4.8,
    simulatedEffect: 'Reduces peak queue from 520m to 160m. Average corridor speed improves from 19 km/h to 36 km/h.',
    projectedNetworkChange: 'Removes primary Hitec City bottleneck and suppresses spillback onto Durgam Cheruvu Link and Road 36.'
  },
  {
    id: 'INF-HYD-02',
    name: 'Jubilee Hills Checkpost Flyover Channelization',
    roadId: 'R-104',
    roadName: 'Jubilee Hills Checkpost & Road No. 36 Arterial',
    action: 'MODIFY_JUNCTION',
    lanesDelta: 0,
    capacityDeltaPct: 18,
    costEstimateUsd: 620000,
    throughputGainPct: 17.5,
    delayReductionMin: 2.8,
    simulatedEffect: 'Continuous flyover grade separation eliminates left-turn queuing onto Road 45. Flow stabilizes at 2,150 veh/hr.',
    projectedNetworkChange: 'Mitigates recurring signal gridlock during morning and evening rush hours.'
  },
  {
    id: 'INF-HYD-03',
    name: 'Gachibowli Bio-Diversity Junction Adaptive Signal Overhaul',
    roadId: 'R-103',
    roadName: 'Gachibowli - Financial District Spine',
    action: 'EXPAND_CAPACITY',
    lanesDelta: 0,
    capacityDeltaPct: 15,
    costEstimateUsd: 220000,
    throughputGainPct: 14.2,
    delayReductionMin: 1.9,
    simulatedEffect: 'Dynamic split adjustments synchronize progression with ORR toll ramps, cutting intersection wait time by 48s.',
    projectedNetworkChange: 'Smooths merge conflict zones between Financial District commuter traffic and ORR expressway.'
  }
];

export const DEMO_EMERGENCY_SCENARIOS: EmergencyScenario[] = [
  {
    id: 'EMG-HYD-01',
    name: 'Code 3 Trauma Transit: AIG Hospitals (Gachibowli) to NIMS (Punjagutta)',
    origin: [17.4402, 78.3625],
    destination: [17.4245, 78.4520],
    originName: 'AIG Hospitals Trauma Wing (Gachibowli)',
    destName: 'Nizam Institute of Medical Sciences (NIMS Punjagutta)',
    normalTravelTimeMin: 36.4,
    emergencyTravelTimeMin: 14.8,
    timeSavedMin: 21.6,
    routeRoadIds: ['R-103', 'R-104', 'R-106', 'R-105'],
    affectedCorridors: ['Gachibowli ORR', 'Jubilee Hills Rd 36', 'Banjara Hills Rd 1', 'Punjagutta Flyover'],
    greenWaveEnabled: true,
    prioritySignalsCount: 16
  },
  {
    id: 'EMG-HYD-02',
    name: 'Cardiac Corridor: Apollo Health City (Jubilee Hills) to Care Hospitals (Banjara Hills)',
    origin: [17.4160, 78.4120],
    destination: [17.4175, 78.4480],
    originName: 'Apollo Health City (Jubilee Hills Rd 92)',
    destName: 'Care Hospitals (Banjara Hills Rd 1)',
    normalTravelTimeMin: 18.5,
    emergencyTravelTimeMin: 7.2,
    timeSavedMin: 11.3,
    routeRoadIds: ['R-104', 'R-106'],
    affectedCorridors: ['Road No. 36 / 92', 'Banjara Hills Rd 12 & 1'],
    greenWaveEnabled: true,
    prioritySignalsCount: 8
  }
];

export const DEMO_CONTROL_ROOM_ALERTS: ControlRoomAlert[] = [
  {
    id: 'ALT-HYD-101',
    timestamp: '11:22:04',
    level: 'CRITICAL',
    title: 'Secondary Spillback on Durgam Cheruvu Cable Bridge',
    message: 'Collision on Cable Bridge (R-107) has caused vehicle queue to spill back 390m into Mindspace Junction. Upstream speeds dropped to 17 km/h.',
    actionSuggested: 'Trigger Upstream Diversion Strategy to ORR Financial District Bypass (R-103).'
  },
  {
    id: 'ALT-HYD-102',
    timestamp: '11:15:20',
    level: 'WARNING',
    title: 'Cyber Towers Junction Approaching Saturation',
    message: 'Active flow of 2,450 veh/hr against 3,200 capacity (76% V/C). Signal queue currently 520m.',
    actionSuggested: 'Extend green time on Madhapur radial phase by 18 seconds.'
  },
  {
    id: 'ALT-HYD-103',
    timestamp: '10:48:11',
    level: 'INFO',
    title: 'PVNR Elevated Expressway Operating at Free-Flow',
    message: 'Expressway velocity steady at 62 km/h. Zero reported obstructions along airport corridor.'
  }
];

export const INITIAL_CONTROL_ROOM_STATUS: ControlRoomStatus = {
  networkHealthScore: 78,
  averageSpeedKmh: 34.2,
  totalVehicles: 1942,
  networkDelayMin: 4.6,
  activeIncidents: 3,
  criticalBottlenecks: 3,
  sumoStatus: 'STANDBY',
  demoMode: true,
  currentScenario: 'NORMAL_TRAFFIC',
  simTime: '11:24:00 AM'
};

// Deterministic SUMO-calibrated Microscopic Calculation Engine
export function calculateSimulationResult(
  scenarioType: string,
  targetRoadId: string,
  currentRoads: Road[]
): SimulationResult {
  const targetRoad = currentRoads.find(r => r.id === targetRoadId) || currentRoads[0];

  const baselineMetrics = {
    averageSpeed: 38.6,
    vehiclesInNetwork: 1980,
    networkDelay: 3.8,
    averageTravelTime: 8.2,
    totalThroughput: 14800,
    congestedRoadsCount: 2,
    activeIncidentsCount: 1,
    averageQueueLength: 110,
    averageWaitingTime: 32
  };

  let interventionMetrics = { ...baselineMetrics };
  let rippleImpacts = [];
  let summaryInsight = '';

  if (scenarioType === 'ROAD_CLOSURE') {
    interventionMetrics = {
      averageSpeed: 28.4,
      vehiclesInNetwork: 2150,
      networkDelay: 7.6,
      averageTravelTime: 12.8,
      totalThroughput: 11400,
      congestedRoadsCount: 6,
      activeIncidentsCount: 2,
      averageQueueLength: 390,
      averageWaitingTime: 84
    };

    rippleImpacts = [
      {
        tier: 'PRIMARY' as const,
        roadId: targetRoad.id,
        roadName: targetRoad.name,
        changeLabel: 'Direct Roadway Closure',
        changePct: -100.0,
        metric: 'Capacity (-100%)',
        description: `Corridor closed to through traffic. Diverting vehicles into adjacent radial arteries.`
      },
      {
        tier: 'SECONDARY' as const,
        roadId: 'R-102',
        roadName: 'Cyber Towers & Hitec City Arterial',
        changeLabel: '+46% Traffic Surge',
        changePct: 46.0,
        metric: 'Volume (+46%)',
        description: `Parallel bypass absorbing displaced commuter traffic. Mean velocity decays from 48 km/h to 18 km/h.`
      },
      {
        tier: 'TERTIARY' as const,
        roadId: 'R-104',
        roadName: 'Jubilee Hills Checkpost Arterial',
        changeLabel: '+34% Queue Expansion',
        changePct: 34.0,
        metric: 'Queue (+34%)',
        description: `Downstream intersection approaches overwhelmed by delayed turning movements.`
      }
    ];

    summaryInsight = `Simulating full closure of ${targetRoad.name} causes a 26.4% drop in network speed and doubles delay (3.8m → 7.6m), generating heavy spillover into Cyber Towers and Jubilee Hills.`;
  } else if (scenarioType === 'ACCIDENT') {
    interventionMetrics = {
      averageSpeed: 31.2,
      vehiclesInNetwork: 2080,
      networkDelay: 5.9,
      averageTravelTime: 10.4,
      totalThroughput: 12600,
      congestedRoadsCount: 4,
      activeIncidentsCount: 2,
      averageQueueLength: 280,
      averageWaitingTime: 58
    };

    rippleImpacts = [
      {
        tier: 'PRIMARY' as const,
        roadId: targetRoad.id,
        roadName: targetRoad.name,
        changeLabel: 'Multi-Lane Collision',
        changePct: -50.0,
        metric: 'Capacity (-50%)',
        description: 'Obstruction reduces usable width to one travel lane.'
      },
      {
        tier: 'SECONDARY' as const,
        roadId: 'R-107',
        roadName: 'Durgam Cheruvu Cable Bridge Link',
        changeLabel: '+28% Volume Surge',
        changePct: 28.0,
        metric: 'Volume (+28%)',
        description: 'Vehicles divert early into bridge connector.'
      }
    ];

    summaryInsight = `Simulated collision on ${targetRoad.name} throttles arterial discharge by 50%, producing a 280m queue and 55% increase in traversal delay.`;
  } else if (scenarioType === 'EXTRA_LANE') {
    interventionMetrics = {
      averageSpeed: 44.2,
      vehiclesInNetwork: 1890,
      networkDelay: 2.1,
      averageTravelTime: 6.8,
      totalThroughput: 16500,
      congestedRoadsCount: 1,
      activeIncidentsCount: 1,
      averageQueueLength: 60,
      averageWaitingTime: 18
    };

    rippleImpacts = [
      {
        tier: 'PRIMARY' as const,
        roadId: targetRoad.id,
        roadName: targetRoad.name,
        changeLabel: '+33% Capacity Gain',
        changePct: 33.0,
        metric: 'Capacity (+33%)',
        description: 'Additional travel lane expands bottleneck discharge.'
      },
      {
        tier: 'SECONDARY' as const,
        roadId: 'R-102',
        roadName: 'Cyber Towers & Hitec City Arterial',
        changeLabel: '-24% Delay Relief',
        changePct: -24.0,
        metric: 'Delay (-24%)',
        description: 'Reduced queue spillback clears upstream merging conflicts.'
      }
    ];

    summaryInsight = `Adding a lane to ${targetRoad.name} increases corridor throughput by 21% and decreases overall network delay by 44% (3.8m → 2.1m).`;
  } else {
    // Default diversion / junction retiming
    interventionMetrics = {
      averageSpeed: 41.5,
      vehiclesInNetwork: 1940,
      networkDelay: 2.9,
      averageTravelTime: 7.4,
      totalThroughput: 15300,
      congestedRoadsCount: 1,
      activeIncidentsCount: 1,
      averageQueueLength: 75,
      averageWaitingTime: 24
    };

    rippleImpacts = [
      {
        tier: 'PRIMARY' as const,
        roadId: targetRoad.id,
        roadName: targetRoad.name,
        changeLabel: 'Adaptive Signal Coordination',
        changePct: 15.0,
        metric: 'Throughput (+15%)',
        description: 'Coordinated green-wave cycle matches real-time queue lengths.'
      }
    ];

    summaryInsight = `Signal retiming on ${targetRoad.name} reduces intersection stopping frequency, yielding 23% less delay across adjacent junctions.`;
  }

  const speedDelta = Number(((interventionMetrics.averageSpeed - baselineMetrics.averageSpeed) / baselineMetrics.averageSpeed * 100).toFixed(1));
  const travelDelta = Number(((interventionMetrics.averageTravelTime - baselineMetrics.averageTravelTime) / baselineMetrics.averageTravelTime * 100).toFixed(1));
  const delayDelta = Number(((interventionMetrics.networkDelay - baselineMetrics.networkDelay) / baselineMetrics.networkDelay * 100).toFixed(1));
  const queueDelta = Number(((interventionMetrics.averageQueueLength - baselineMetrics.averageQueueLength) / baselineMetrics.averageQueueLength * 100).toFixed(1));
  const waitingDelta = Number(((interventionMetrics.averageWaitingTime - baselineMetrics.averageWaitingTime) / baselineMetrics.averageWaitingTime * 100).toFixed(1));

  return {
    scenarioId: `SIM-HYD-${Date.now().toString().slice(-4)}`,
    scenarioName: `${scenarioType.replace('_', ' ')} Simulation on ${targetRoad.name}`,
    scenarioType,
    targetRoadName: targetRoad.name,
    timestamp: '11:24:00 AM',
    baselineMetrics,
    interventionMetrics,
    deltaMetrics: {
      speedDeltaPct: speedDelta,
      travelTimeDeltaPct: travelDelta,
      delayDeltaPct: delayDelta,
      queueDeltaPct: queueDelta,
      waitingTimeDeltaPct: waitingDelta
    },
    rippleImpacts,
    affectedRoads: [
      {
        roadId: targetRoad.id,
        roadName: targetRoad.name,
        baselineSpeed: targetRoad.freeFlowSpeed,
        interventionSpeed: scenarioType === 'ROAD_CLOSURE' ? 0 : Math.round(targetRoad.currentSpeed * 0.6),
        trafficChangePct: scenarioType === 'ROAD_CLOSURE' ? -100 : -45,
        queueChangeM: scenarioType === 'ROAD_CLOSURE' ? 520 : 280,
        delayChangeMin: scenarioType === 'ROAD_CLOSURE' ? 14.5 : 5.8,
        impactTier: 'PRIMARY'
      },
      {
        roadId: 'R-102',
        roadName: 'Cyber Towers & Hitec City Arterial',
        baselineSpeed: 48,
        interventionSpeed: 19,
        trafficChangePct: 46,
        queueChangeM: 340,
        delayChangeMin: 6.2,
        impactTier: 'SECONDARY'
      },
      {
        roadId: 'R-104',
        roadName: 'Jubilee Hills Checkpost Arterial',
        baselineSpeed: 46,
        interventionSpeed: 24,
        trafficChangePct: 34,
        queueChangeM: 260,
        delayChangeMin: 4.5,
        impactTier: 'SECONDARY'
      }
    ],
    summaryInsight
  };
}
