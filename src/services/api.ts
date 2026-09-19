import { 
  Road, 
  Incident, 
  Bottleneck, 
  ForecastPoint, 
  SimulationResult, 
  DiversionOption, 
  InfrastructureScenario, 
  EmergencyScenario, 
  ControlRoomStatus, 
  SimulationScenario 
} from '../types';
import { 
  INITIAL_ROADS, 
  DEMO_INCIDENTS, 
  DEMO_BOTTLENECKS, 
  DEMO_FORECAST, 
  DEMO_DIVERSION_OPTIONS, 
  DEMO_INFRASTRUCTURE_SCENARIOS, 
  DEMO_EMERGENCY_SCENARIOS, 
  INITIAL_CONTROL_ROOM_STATUS, 
  calculateSimulationResult 
} from '../data/demo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private isDemoMode = true;
  private backendChecked = false;
  private isBackendOnline = false;

  async checkBackendHealth(): Promise<{ online: boolean; sumoStatus: 'CONNECTED' | 'SUMO_ENGINE_OFFLINE' | 'STANDBY' }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        this.isBackendOnline = true;
        this.backendChecked = true;
        return {
          online: true,
          sumoStatus: data.sumo_available ? 'CONNECTED' : 'SUMO_ENGINE_OFFLINE'
        };
      }
    } catch {
      // Backend unreachable or offline
    }
    this.isBackendOnline = false;
    this.backendChecked = true;
    return {
      online: false,
      sumoStatus: 'SUMO_ENGINE_OFFLINE'
    };
  }

  getDemoMode(): boolean {
    return this.isDemoMode;
  }

  setDemoMode(val: boolean) {
    this.isDemoMode = val;
  }

  async getNetwork(): Promise<Road[]> {
    if (!this.isDemoMode && this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/network`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable, falling back to deterministic model', e);
      }
    }
    return Promise.resolve(INITIAL_ROADS);
  }

  async getCurrentTraffic(): Promise<{ roads: Road[]; timestamp: string }> {
    if (!this.isDemoMode && this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/traffic/current`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable, falling back to deterministic model', e);
      }
    }
    return Promise.resolve({
      roads: INITIAL_ROADS,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  async getForecast(): Promise<ForecastPoint[]> {
    if (!this.isDemoMode && this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/traffic/forecast`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable, falling back to deterministic forecast', e);
      }
    }
    return Promise.resolve(DEMO_FORECAST);
  }

  async getIncidents(): Promise<Incident[]> {
    if (!this.isDemoMode && this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/incidents`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable, falling back to deterministic incident list', e);
      }
    }
    return Promise.resolve(DEMO_INCIDENTS);
  }

  async getBottlenecks(): Promise<Bottleneck[]> {
    if (!this.isDemoMode && this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bottlenecks`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable, falling back to deterministic bottlenecks', e);
      }
    }
    return Promise.resolve(DEMO_BOTTLENECKS);
  }

  async getScenarios(): Promise<SimulationScenario[]> {
    return Promise.resolve([
      {
        id: 'SCN-01',
        name: 'Market Street Arterial Emergency Closure',
        type: 'ROAD_CLOSURE',
        description: 'Complete closure of Market Street Arterial due to burst water main simulation.',
        targetRoadId: 'R-101',
        durationMinutes: 45,
        status: 'COMPLETED'
      },
      {
        id: 'SCN-02',
        name: 'Mission Corridor Lane Addition (+1 Lane)',
        type: 'EXTRA_LANE',
        description: 'Testing downstream capacity injection on Mission Corridor Expressway.',
        targetRoadId: 'R-102',
        durationMinutes: 60,
        laneDelta: 1,
        status: 'COMPLETED'
      },
      {
        id: 'SCN-03',
        name: 'Folsom Transitway Collision Incident',
        type: 'ACCIDENT',
        description: 'Two-lane collision scenario modeling severe secondary gridlock.',
        targetRoadId: 'R-104',
        durationMinutes: 30,
        status: 'DRAFT'
      }
    ]);
  }

  async runSimulation(scenario: { type: string; targetRoadId: string; durationMinutes?: number }): Promise<SimulationResult> {
    if (!this.isDemoMode && this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/simulation/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scenario)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend simulation request failed, running calibrated simulation model', e);
      }
    }
    // Deterministic simulation engine execution
    return Promise.resolve(calculateSimulationResult(scenario.type, scenario.targetRoadId, INITIAL_ROADS));
  }

  async runDiversionSimulation(params: { originRoadId: string; destRoadId: string; blockedRoadId: string }): Promise<DiversionOption[]> {
    if (!this.isDemoMode && this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/diversions/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend diversions request failed, using calibrated diversion options', e);
      }
    }
    return Promise.resolve(DEMO_DIVERSION_OPTIONS);
  }

  async runInfrastructureSimulation(scenarioId: string): Promise<InfrastructureScenario | undefined> {
    return Promise.resolve(DEMO_INFRASTRUCTURE_SCENARIOS.find(s => s.id === scenarioId));
  }

  async runEmergencySimulation(scenarioId: string): Promise<EmergencyScenario | undefined> {
    return Promise.resolve(DEMO_EMERGENCY_SCENARIOS.find(s => s.id === scenarioId));
  }

  async getControlRoomStatus(): Promise<ControlRoomStatus> {
    return Promise.resolve(INITIAL_CONTROL_ROOM_STATUS);
  }
}

export const api = new ApiService();
