export type CongestionLevel = 'normal' | 'moderate' | 'heavy' | 'severe';

export type IncidentType = 
  | 'Possible Accident' 
  | 'Road Closure' 
  | 'Vehicle Breakdown' 
  | 'Construction' 
  | 'Obstruction' 
  | 'Weather Disruption';

export type IncidentSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface Road {
  id: string;
  name: string;
  category: 'highway' | 'arterial' | 'connector' | 'avenue';
  coordinates: [number, number][]; // [lat, lng] array
  speedLimit: number; // km/h
  freeFlowSpeed: number; // km/h
  currentSpeed: number; // km/h
  vehicleCount: number;
  flow: number; // vehicles per hour
  density: number; // veh/km
  queueLength: number; // meters
  waitingTime: number; // seconds
  travelTime: number; // minutes
  congestionLevel: CongestionLevel;
  lanes: number;
  capacity: number; // max veh/hr
  lengthMeters: number;
  connectedRoadIds: string[];
  incidentStatus?: string;
}

export interface NetworkMetrics {
  averageSpeed: number; // km/h
  vehiclesInNetwork: number;
  networkDelay: number; // minutes
  averageTravelTime: number; // minutes
  totalThroughput: number; // veh/hr
  congestedRoadsCount: number;
  activeIncidentsCount: number;
  averageQueueLength: number; // meters
  averageWaitingTime: number; // seconds
}

export interface MetricDeltas {
  speedDeltaPct: number;
  travelTimeDeltaPct: number;
  delayDeltaPct: number;
  queueDeltaPct: number;
  waitingTimeDeltaPct: number;
}

export interface RippleImpact {
  tier: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  roadId: string;
  roadName: string;
  changeLabel: string;
  changePct: number;
  metric: string;
  description: string;
}

export interface AffectedRoadDetail {
  roadId: string;
  roadName: string;
  baselineSpeed: number;
  interventionSpeed: number;
  trafficChangePct: number;
  queueChangeM: number;
  delayChangeMin: number;
  impactTier: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
}

export interface SimulationScenario {
  id: string;
  name: string;
  type: 
    | 'ROAD_CLOSURE' 
    | 'ACCIDENT' 
    | 'DIVERSION' 
    | 'EXTRA_LANE' 
    | 'REDUCED_CAPACITY' 
    | 'JUNCTION_CHANGE' 
    | 'EMERGENCY_VEHICLE' 
    | 'CUSTOM_SCENARIO';
  description: string;
  targetRoadId: string;
  durationMinutes: number;
  capacityDeltaPct?: number;
  laneDelta?: number;
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED';
}

export interface SimulationResult {
  scenarioId: string;
  scenarioName: string;
  scenarioType: string;
  targetRoadName: string;
  timestamp: string;
  baselineMetrics: NetworkMetrics;
  interventionMetrics: NetworkMetrics;
  deltaMetrics: MetricDeltas;
  rippleImpacts: RippleImpact[];
  affectedRoads: AffectedRoadDetail[];
  summaryInsight: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  roadId: string;
  roadName: string;
  location: [number, number];
  detectedTime: string;
  estimatedDuration: string;
  affectedRoads: string[];
  status: 'Active' | 'Investigating' | 'Cleared';
  description: string;
  reportedBy: string; // e.g. "Sensor Anomaly Detector (Simulated)"
}

export interface Bottleneck {
  id: string;
  roadId: string;
  roadName: string;
  location: [number, number];
  severity: 'moderate' | 'critical';
  queueLengthM: number;
  delayMinutes: number;
  speedRatio: number;
  reason: string;
}

export interface ForecastPoint {
  timeHorizon: '15m' | '30m' | '45m' | '60m';
  minutesFromNow: number;
  predictedVolume: number;
  predictedSpeed: number;
  predictedCongestionPct: number;
  confidenceLower: number;
  confidenceUpper: number;
  bottleneckRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  contributingFactors: string[];
}

export interface DiversionOption {
  id: string;
  name: string;
  pathRoadIds: string[];
  travelTimeMin: number;
  distanceKm: number;
  congestionLevel: CongestionLevel;
  expectedDelayMin: number;
  affectedRoadsCount: number;
  capacityScore: number; // 0-100
  notes: string;
}

export interface InfrastructureScenario {
  id: string;
  name: string;
  roadId: string;
  roadName: string;
  action: 'ADD_LANE' | 'REMOVE_LANE' | 'EXPAND_CAPACITY' | 'REDUCE_CAPACITY' | 'MODIFY_JUNCTION';
  lanesDelta: number;
  capacityDeltaPct: number;
  costEstimateUsd: number;
  throughputGainPct: number;
  delayReductionMin: number;
  simulatedEffect: string;
  projectedNetworkChange: string;
}

export interface EmergencyScenario {
  id: string;
  name: string;
  origin: [number, number];
  destination: [number, number];
  originName: string;
  destName: string;
  normalTravelTimeMin: number;
  emergencyTravelTimeMin: number;
  timeSavedMin: number;
  routeRoadIds: string[];
  affectedCorridors: string[];
  greenWaveEnabled: boolean;
  prioritySignalsCount: number;
}

export interface ControlRoomAlert {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  roadId?: string;
  actionSuggested?: string;
}

export interface ControlRoomStatus {
  networkHealthScore: number;
  averageSpeedKmh: number;
  totalVehicles: number;
  networkDelayMin: number;
  activeIncidents: number;
  criticalBottlenecks: number;
  sumoStatus: 'CONNECTED' | 'SUMO_ENGINE_OFFLINE' | 'STANDBY';
  demoMode: boolean;
  currentScenario: string;
  simTime: string;
}

export type ManeuverType = 
  | 'straight'
  | 'turn-left'
  | 'turn-right'
  | 'turn-slight-left'
  | 'turn-slight-right'
  | 'turn-sharp-left'
  | 'turn-sharp-right'
  | 'uturn-left'
  | 'uturn-right'
  | 'merge'
  | 'ramp-right'
  | 'ramp-left'
  | 'roundabout-right'
  | 'roundabout-left'
  | 'fork-right'
  | 'fork-left'
  | 'destination';

export interface RouteStep {
  id: string;
  instruction: string;
  roadName: string;
  distanceKm: number;
  durationMin: number;
  maneuver: ManeuverType;
  congestion: CongestionLevel;
  speedKmh: number;
  coordinates: [number, number][];
  hazardNotice?: string;
  bottleneckNotice?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  tag: 'AI_OPTIMAL' | 'FASTEST' | 'AVOID_INCIDENTS' | 'SHORTEST';
  summary: string;
  distanceKm: number;
  durationMin: number;
  durationTypicalMin: number;
  delayMin: number;
  twinScore: number; // 0-100 optimal rating based on all features
  congestionLevel: CongestionLevel;
  pathCoordinates: [number, number][];
  steps: RouteStep[];
  corridorsTraversed: string[];
  incidentsEncountered: number;
  bottlenecksAvoided: number;
  carbonEmissionKg: number;
  isRecommended: boolean;
}

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: 'landmark' | 'hub' | 'hospital' | 'transit' | 'tech_park';
}

export interface NavigationState {
  isNavigating: boolean;
  activeRouteId: string | null;
  currentStepIndex: number;
  progressPct: number;
  currentSpeedKmh: number;
  remainingDistanceKm: number;
  remainingDurationMin: number;
  currentPosition: [number, number];
  isPaused: boolean;
  speedMultiplier: number;
}
