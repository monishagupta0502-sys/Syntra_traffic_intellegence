from typing import List, Optional
from pydantic import BaseModel, Field

class RoadSchema(BaseModel):
    id: str
    name: str
    category: str
    coordinates: List[List[float]]
    speedLimit: float
    freeFlowSpeed: float
    currentSpeed: float
    vehicleCount: int
    flow: float
    density: float
    queueLength: float
    waitingTime: float
    travelTime: float
    congestionLevel: str
    lanes: int
    capacity: float
    lengthMeters: float
    connectedRoadIds: List[str]
    incidentStatus: Optional[str] = None

class IncidentSchema(BaseModel):
    id: str
    type: str
    severity: str
    roadId: str
    roadName: str
    location: List[float]
    detectedTime: str
    estimatedDuration: str
    affectedRoads: List[str]
    status: str
    description: str
    reportedBy: str

class BottleneckSchema(BaseModel):
    id: str
    roadId: str
    roadName: str
    location: List[float]
    severity: str
    queueLengthM: float
    delayMinutes: float
    speedRatio: float
    reason: str

class ForecastPointSchema(BaseModel):
    timeHorizon: str
    minutesFromNow: int
    predictedVolume: float
    predictedSpeed: float
    predictedCongestionPct: float
    confidenceLower: float
    confidenceUpper: float
    bottleneckRisk: str
    contributingFactors: List[str]

class SimulationRequestSchema(BaseModel):
    type: str
    targetRoadId: str
    durationMinutes: Optional[int] = 45
    capacityDeltaPct: Optional[float] = None
    laneDelta: Optional[int] = None

class NetworkMetricsSchema(BaseModel):
    averageSpeed: float
    vehiclesInNetwork: int
    networkDelay: float
    averageTravelTime: float
    totalThroughput: float
    congestedRoadsCount: int
    activeIncidentsCount: int
    averageQueueLength: float
    averageWaitingTime: float

class RippleImpactSchema(BaseModel):
    tier: str
    roadId: str
    roadName: str
    changeLabel: str
    changePct: float
    metric: str
    description: str

class AffectedRoadDetailSchema(BaseModel):
    roadId: str
    roadName: str
    baselineSpeed: float
    interventionSpeed: float
    trafficChangePct: float
    queueChangeM: float
    delayChangeMin: float
    impactTier: str

class SimulationResultSchema(BaseModel):
    scenarioId: str
    scenarioName: str
    scenarioType: str
    targetRoadName: str
    timestamp: str
    baselineMetrics: NetworkMetricsSchema
    interventionMetrics: NetworkMetricsSchema
    deltaMetrics: dict
    rippleImpacts: List[RippleImpactSchema]
    affectedRoads: List[AffectedRoadDetailSchema]
    summaryInsight: str
