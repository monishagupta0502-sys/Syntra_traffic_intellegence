import React from 'react';
import { 
  Road, 
  Incident, 
  Bottleneck, 
  ControlRoomAlert, 
  ControlRoomStatus 
} from '../types';
import { 
  DEMO_CONTROL_ROOM_ALERTS 
} from '../data/demo';
import { 
  MonitorCheck, 
  Activity, 
  AlertTriangle, 
  AlertCircle, 
  Cpu, 
  FlaskConical, 
  Siren, 
  Radio, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Play,
  Share2,
  Wrench,
  TrendingDown
} from 'lucide-react';

interface ControlRoomProps {
  status: ControlRoomStatus;
  roads: Road[];
  incidents: Incident[];
  bottlenecks: Bottleneck[];
  onNavigate: (tab: string) => void;
  onSimulateScenario: (scenarioType: string, targetRoadId: string) => void;
}

export const ControlRoom: React.FC<ControlRoomProps> = ({
  status,
  roads,
  incidents,
  bottlenecks,
  onNavigate,
  onSimulateScenario
}) => {
  const alerts: ControlRoomAlert[] = DEMO_CONTROL_ROOM_ALERTS;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Operations Command Header */}
      <div className="border-b border-[#28313C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#35C98B] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35C98B] animate-pulse"></span>
              <span>OPERATIONS DESK 01 · ACTIVE</span>
            </span>
            <span className="text-[11px] font-mono text-[#8B98A7]">
              CLOCK: {status.simTime}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
            Virtual Traffic Control Room
          </h1>
        </div>

        {/* Quick Simulation Trigger Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSimulateScenario('ROAD_CLOSURE', 'R-101')}
            className="flex items-center gap-1.5 bg-[#E05A5A]/15 hover:bg-[#E05A5A]/25 border border-[#E05A5A]/40 text-[#E05A5A] text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Simulate Closure</span>
          </button>
          <button
            onClick={() => onNavigate('simulations')}
            className="flex items-center gap-1.5 bg-[#4AA3DF]/15 hover:bg-[#4AA3DF]/25 border border-[#4AA3DF]/40 text-[#4AA3DF] text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Test Diversion</span>
          </button>
          <button
            onClick={() => onNavigate('emergency')}
            className="flex items-center gap-1.5 bg-[#1A212B] hover:bg-[#28313C] border border-[#28313C] text-[#E8EDF2] text-xs font-medium px-3 py-1.5 rounded transition-colors"
          >
            <Siren className="w-3.5 h-3.5 text-[#35C98B]" />
            <span>Green Wave</span>
          </button>
        </div>
      </div>

      {/* Control Room Telemetry Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
          <div className="text-xs text-[#8B98A7] flex items-center justify-between mb-1">
            <span>NETWORK HEALTH</span>
            <Activity className="w-4 h-4 text-[#35C98B]" />
          </div>
          <div className="text-2xl font-bold text-[#E8EDF2]">
            {status.networkHealthScore} <span className="text-xs font-normal text-[#8B98A7]">/ 100</span>
          </div>
          <div className="text-[11px] text-[#35C98B] mt-1">Normal Operating Baseline</div>
        </div>

        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
          <div className="text-xs text-[#8B98A7] flex items-center justify-between mb-1">
            <span>NETWORK DELAY</span>
            <Clock className="w-4 h-4 text-[#E58B42]" />
          </div>
          <div className="text-2xl font-bold text-[#E8EDF2]">
            +{status.networkDelayMin} <span className="text-xs font-normal text-[#8B98A7]">min</span>
          </div>
          <div className="text-[11px] text-[#E58B42] mt-1">+1.8 min spillover surge</div>
        </div>

        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
          <div className="text-xs text-[#8B98A7] flex items-center justify-between mb-1">
            <span>ACTIVE INCIDENTS</span>
            <AlertTriangle className="w-4 h-4 text-[#E05A5A]" />
          </div>
          <div className="text-2xl font-bold text-[#E05A5A]">
            {incidents.length}
          </div>
          <div className="text-[11px] text-[#8B98A7] mt-1">1 Critical · 2 Monitored</div>
        </div>

        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
          <div className="text-xs text-[#8B98A7] flex items-center justify-between mb-1">
            <span>SUMO ENGINE</span>
            <Cpu className="w-4 h-4 text-[#4AA3DF]" />
          </div>
          <div className="text-2xl font-bold text-[#4AA3DF]">
            STANDBY
          </div>
          <div className="text-[11px] text-[#8B98A7] mt-1">Calibrated Microscopic Twin</div>
        </div>
      </div>

      {/* Main Split: Control Room Alerts Feed & Network Bottleneck Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tactical Alerts Console */}
        <div className="lg:col-span-2 bg-[#151B23] border border-[#28313C] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#4AA3DF]" />
                <h2 className="text-sm font-semibold text-[#E8EDF2]">
                  Tactical Traffic Alerts & Ripple Log
                </h2>
              </div>
              <span className="text-xs font-mono text-[#8B98A7]">
                LIVE LOG
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map(alt => (
                <div 
                  key={alt.id}
                  className={`p-3.5 rounded border transition-colors ${
                    alt.level === 'CRITICAL'
                      ? 'bg-[#E05A5A]/10 border-[#E05A5A]/40'
                      : alt.level === 'WARNING'
                      ? 'bg-[#E7C65A]/10 border-[#E7C65A]/40'
                      : 'bg-[#11161D] border-[#28313C]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        alt.level === 'CRITICAL' ? 'bg-[#E05A5A] text-[#fff]' :
                        alt.level === 'WARNING' ? 'bg-[#E7C65A] text-[#0B0F14]' :
                        'bg-[#4AA3DF] text-[#0B0F14]'
                      }`}>
                        {alt.level}
                      </span>
                      <span className="font-semibold text-[#E8EDF2] font-sans">
                        {alt.title}
                      </span>
                    </div>
                    <span className="text-[#8B98A7] text-[11px]">{alt.timestamp}</span>
                  </div>

                  <p className="text-xs text-[#8B98A7] leading-relaxed mb-2">
                    {alt.message}
                  </p>

                  {alt.actionSuggested && (
                    <div className="text-[11px] font-mono text-[#4AA3DF] bg-[#11161D]/80 p-2 rounded border border-[#28313C] flex items-center justify-between">
                      <span>Action: {alt.actionSuggested}</span>
                      <button
                        onClick={() => onNavigate('simulations')}
                        className="text-xs hover:underline flex items-center gap-1 font-sans font-semibold text-[#E8EDF2]"
                      >
                        Execute <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Status & Bottleneck Radar */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
              <h2 className="text-sm font-semibold text-[#E8EDF2]">
                Critical Bottlenecks Radar
              </h2>
              <span className="text-xs font-mono text-[#E05A5A]">
                {bottlenecks.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {bottlenecks.map(btn => (
                <div key={btn.id} className="bg-[#11161D] border border-[#28313C] rounded p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#E8EDF2]">{btn.roadName}</span>
                    <span className="font-mono text-[#E05A5A] font-bold">+{btn.delayMinutes}m</span>
                  </div>
                  <div className="text-[11px] text-[#8B98A7] mb-2">{btn.reason}</div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#5E6A78] border-t border-[#28313C] pt-1.5">
                    <span>Queue: {btn.queueLengthM}m</span>
                    <span>Speed Ratio: {btn.speedRatio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('digital-twin')}
            className="w-full mt-4 py-2.5 bg-[#1A212B] hover:bg-[#28313C] text-xs font-mono text-[#4AA3DF] rounded border border-[#28313C] transition-colors text-center"
          >
            Launch Full-Screen Digital Twin →
          </button>
        </div>
      </div>
    </div>
  );
};
