import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from backend.schemas.traffic import (
    SimulationRequestSchema, 
    SimulationResultSchema, 
    RoadSchema
)
from backend.services.traffic import traffic_service
from backend.services.simulation import simulation_service, SUMO_AVAILABLE

app = FastAPI(
    title="SYNTRA API",
    description="Urban Traffic Network Intelligence & Digital Twin Platform Backend",
    version="2.4.0"
)

# Enable CORS for frontend Vite dev server (port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def get_health() -> Dict[str, Any]:
    return {
        "status": "HEALTHY",
        "service": "SYNTRA Urban Traffic Digital Twin Engine",
        "sumo_available": SUMO_AVAILABLE,
        "mode": "CONNECTED" if SUMO_AVAILABLE else "CALIBRATED_FALLBACK"
    }

@app.get("/api/network")
def get_network() -> List[Dict[str, Any]]:
    return traffic_service.get_network()

@app.get("/api/traffic/current")
def get_current_traffic() -> Dict[str, Any]:
    return traffic_service.get_current_traffic()

@app.get("/api/traffic/forecast")
def get_forecast() -> List[Dict[str, Any]]:
    return [
        {
            "timeHorizon": "15m",
            "minutesFromNow": 15,
            "predictedVolume": 2420,
            "predictedSpeed": 34.2,
            "predictedCongestionPct": 36.5,
            "confidenceLower": 32.1,
            "confidenceUpper": 36.8,
            "bottleneckRisk": "Moderate",
            "contributingFactors": ["Midday commercial deliveries peaking", "Mission St corridor residual queue"]
        },
        {
            "timeHorizon": "30m",
            "minutesFromNow": 30,
            "predictedVolume": 2680,
            "predictedSpeed": 30.5,
            "predictedCongestionPct": 44.2,
            "confidenceLower": 28.0,
            "confidenceUpper": 33.4,
            "bottleneckRisk": "High",
            "contributingFactors": ["Lunchtime cross-district traffic", "Secondary spillback from R-104 incident"]
        }
    ]

@app.get("/api/incidents")
def get_incidents() -> List[Dict[str, Any]]:
    return [
        {
            "id": "INC-2026-081",
            "type": "Possible Accident",
            "severity": "high",
            "roadId": "R-104",
            "roadName": "Folsom Transitway Connector",
            "location": [37.7845, -122.3972],
            "detectedTime": "11:18 AM",
            "estimatedDuration": "45 mins remaining",
            "affectedRoads": ["R-104", "R-101"],
            "status": "Active",
            "description": "Two-vehicle collision blocking right lane.",
            "reportedBy": "Speed Anomaly Engine (Simulated)"
        }
    ]

@app.get("/api/bottlenecks")
def get_bottlenecks() -> List[Dict[str, Any]]:
    return traffic_service.get_bottlenecks()

@app.get("/api/scenarios")
def get_scenarios() -> List[Dict[str, Any]]:
    return [
        {"id": "SCN-01", "name": "Market Street Closure", "type": "ROAD_CLOSURE"},
        {"id": "SCN-02", "name": "Mission Extra Lane", "type": "EXTRA_LANE"}
    ]

@app.get("/api/control-room/status")
def get_control_room_status() -> Dict[str, Any]:
    return {
        "networkHealthScore": 78,
        "averageSpeedKmh": 34.2,
        "totalVehicles": 1942,
        "networkDelayMin": 4.6,
        "activeIncidents": 3,
        "criticalBottlenecks": 3,
        "sumoStatus": "CONNECTED" if SUMO_AVAILABLE else "STANDBY",
        "demoMode": False,
        "currentScenario": "NORMAL_TRAFFIC",
        "simTime": "11:24:00 AM"
    }

@app.post("/api/simulation/run")
def run_simulation(req: SimulationRequestSchema) -> Dict[str, Any]:
    return simulation_service.run_what_if_simulation(
        scenario_type=req.type,
        target_road_id=req.targetRoadId,
        duration_min=req.durationMinutes or 45
    )

@app.post("/api/diversions/simulate")
def simulate_diversions(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    return [
        {
            "id": "DIV-OPT-A",
            "name": "Embarcadero Bypass Corridor",
            "travelTimeMin": 12.5,
            "distanceKm": 4.8,
            "congestionLevel": "normal",
            "expectedDelayMin": 1.8,
            "affectedRoadsCount": 4,
            "capacityScore": 88,
            "notes": "Advisory high-capacity route around simulated blockage."
        }
    ]

@app.post("/api/infrastructure/simulate")
def simulate_infrastructure(params: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": "INF-01",
        "name": "Mission Corridor Expressway Expansion",
        "throughputGainPct": 21.4,
        "delayReductionMin": 3.8,
        "simulatedEffect": "Reduces peak queue from 420m to 145m."
    }

@app.post("/api/emergency/simulate")
def simulate_emergency(params: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": "EMG-01",
        "name": "Trauma Priority Transit",
        "normalTravelTimeMin": 14.8,
        "emergencyTravelTimeMin": 6.2,
        "timeSavedMin": 8.6,
        "prioritySignalsCount": 11
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
