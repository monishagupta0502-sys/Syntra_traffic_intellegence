import React, { useState, useEffect } from 'react';
import { TabType, Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { Overview } from './pages/Overview';
import { DigitalTwin } from './pages/DigitalTwin';
import { OptimalRouter } from './pages/OptimalRouter';
import { Traffic } from './pages/Traffic';
import { Forecast } from './pages/Forecast';
import { Incidents } from './pages/Incidents';
import { Simulations } from './pages/Simulations';
import { Infrastructure } from './pages/Infrastructure';
import { Emergency } from './pages/Emergency';
import { ControlRoom } from './pages/ControlRoom';
import { Analytics } from './pages/Analytics';

import { 
  Road, 
  Incident, 
  Bottleneck, 
  ForecastPoint, 
  EmergencyScenario, 
  InfrastructureScenario, 
  ControlRoomStatus 
} from './types';
import { api } from './services/api';
import { 
  INITIAL_ROADS, 
  DEMO_INCIDENTS, 
  DEMO_BOTTLENECKS, 
  DEMO_FORECAST, 
  INITIAL_CONTROL_ROOM_STATUS 
} from './data/demo';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [roads, setRoads] = useState<Road[]>(INITIAL_ROADS);
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>(DEMO_BOTTLENECKS);
  const [forecast, setForecast] = useState<ForecastPoint[]>(DEMO_FORECAST);
  const [status, setStatus] = useState<ControlRoomStatus>(INITIAL_CONTROL_ROOM_STATUS);

  // Selected entities across screens
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null);
  const [selectedEmergencyScenario, setSelectedEmergencyScenario] = useState<EmergencyScenario | null>(null);
  const [selectedInfraScenario, setSelectedInfraScenario] = useState<InfrastructureScenario | null>(null);
  const [simulationTargetRoadId, setSimulationTargetRoadId] = useState<string>('R-101');
  const [simulationScenarioType, setSimulationScenarioType] = useState<string>('ROAD_CLOSURE');

  // Interactive controls
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);

  // Initial backend health check (honest verification of SUMO / FastAPI backend)
  useEffect(() => {
    let isMounted = true;
    api.checkBackendHealth().then(health => {
      if (isMounted) {
        setStatus(prev => ({
          ...prev,
          sumoStatus: health.sumoStatus
        }));
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Clock progression simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStatus(prev => {
        const parts = prev.simTime.split(':');
        let sec = parseInt(parts[2] || '0') + 1 * simSpeed;
        let min = parseInt(parts[1] || '24');
        let hr = parseInt(parts[0] || '11');
        if (sec >= 60) {
          min += Math.floor(sec / 60);
          sec = sec % 60;
        }
        if (min >= 60) {
          hr += Math.floor(min / 60);
          min = min % 60;
        }
        const timeStr = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')} AM`;
        return { ...prev, simTime: timeStr };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const handleSelectScenario = (scen: string) => {
    setStatus(prev => ({ ...prev, currentScenario: scen }));
    if (scen === 'ROAD_CLOSURE') {
      setSimulationScenarioType('ROAD_CLOSURE');
      setSimulationTargetRoadId('R-101');
      setActiveTab('simulations');
    } else if (scen === 'EXTRA_LANE') {
      setActiveTab('infrastructure');
    } else if (scen === 'EMERGENCY_RESPONSE') {
      setActiveTab('emergency');
    } else if (scen === 'DIVERSION') {
      setSimulationScenarioType('DIVERSION');
      setActiveTab('simulations');
    } else {
      setActiveTab('overview');
    }
  };

  const handleSimulateClosureFromRoad = (road: Road) => {
    setSelectedRoad(road);
    setSimulationTargetRoadId(road.id);
    setSimulationScenarioType('ROAD_CLOSURE');
    setActiveTab('simulations');
  };

  const handleSimulateScenario = (scenarioType: string, targetRoadId: string) => {
    setSimulationScenarioType(scenarioType);
    setSimulationTargetRoadId(targetRoadId);
    setActiveTab('simulations');
  };

  const handleCycleSpeed = () => {
    if (simSpeed === 1) setSimSpeed(2);
    else if (simSpeed === 2) setSimSpeed(5);
    else setSimSpeed(1);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B0F14] text-[#E8EDF2] font-sans">
      {/* Top Bar */}
      <TopBar
        status={status}
        currentScenario={status.currentScenario}
        onSelectScenario={handleSelectScenario}
        onToggleDemoMode={() => {
          const next = !status.demoMode;
          api.setDemoMode(next);
          setStatus(prev => ({ ...prev, demoMode: next }));
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        simSpeed={simSpeed}
        onChangeSimSpeed={handleCycleSpeed}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
          }}
        />

        {/* Content Area */}
        <main className="flex-1 relative overflow-hidden bg-[#0B0F14]">
          {activeTab === 'overview' && (
            <Overview
              roads={roads}
              incidents={incidents}
              status={status}
              onNavigate={(tab) => setActiveTab(tab as TabType)}
              onSelectRoad={(r) => setSelectedRoad(r)}
            />
          )}

          {activeTab === 'digital-twin' && (
            <DigitalTwin
              roads={roads}
              incidents={incidents}
              bottlenecks={bottlenecks}
              emergencyScenario={selectedEmergencyScenario}
              infrastructureScenario={selectedInfraScenario}
              selectedRoad={selectedRoad}
              onSelectRoad={setSelectedRoad}
              onSimulateClosure={handleSimulateClosureFromRoad}
            />
          )}

          {activeTab === 'optimal-route' && (
            <OptimalRouter
              roads={roads}
              incidents={incidents}
              bottlenecks={bottlenecks}
              selectedRoad={selectedRoad}
              onSelectRoad={setSelectedRoad}
              onReportIncident={(inc) => setIncidents(prev => [inc, ...prev])}
            />
          )}

          {activeTab === 'traffic' && (
            <Traffic
              roads={roads}
              bottlenecks={bottlenecks}
              onSelectRoad={(r) => setSelectedRoad(r)}
              onNavigateToTwin={() => setActiveTab('digital-twin')}
            />
          )}

          {activeTab === 'forecast' && (
            <Forecast forecastData={forecast} />
          )}

          {activeTab === 'incidents' && (
            <Incidents
              incidents={incidents}
              roads={roads}
              onSelectRoad={(r) => setSelectedRoad(r)}
              onNavigateToTwin={() => setActiveTab('digital-twin')}
              onSimulateScenario={handleSimulateScenario}
            />
          )}

          {activeTab === 'simulations' && (
            <Simulations
              roads={roads}
              initialScenarioType={simulationScenarioType}
              initialRoadId={simulationTargetRoadId}
            />
          )}

          {activeTab === 'infrastructure' && (
            <Infrastructure
              roads={roads}
              onSelectScenario={(scen) => setSelectedInfraScenario(scen)}
              onNavigateToTwin={() => setActiveTab('digital-twin')}
            />
          )}

          {activeTab === 'emergency' && (
            <Emergency
              roads={roads}
              onSelectEmergencyScenario={(scen) => setSelectedEmergencyScenario(scen)}
              onNavigateToTwin={() => setActiveTab('digital-twin')}
            />
          )}

          {activeTab === 'control-room' && (
            <ControlRoom
              status={status}
              roads={roads}
              incidents={incidents}
              bottlenecks={bottlenecks}
              onNavigate={(tab) => setActiveTab(tab as TabType)}
              onSimulateScenario={handleSimulateScenario}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics roads={roads} />
          )}
        </main>
      </div>

      {/* Quick Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onSelectScenario={handleSelectScenario}
        onToggleDemoMode={() => {
          const next = !status.demoMode;
          api.setDemoMode(next);
          setStatus(prev => ({ ...prev, demoMode: next }));
        }}
      />
    </div>
  );
}
