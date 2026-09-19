import React from 'react';
import { 
  Activity, 
  Gauge, 
  Clock, 
  Car, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  FlaskConical, 
  ArrowUpRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { Road, Incident, ControlRoomStatus } from '../types';

interface OverviewProps {
  roads: Road[];
  incidents: Incident[];
  status: ControlRoomStatus;
  onNavigate: (tab: string) => void;
  onSelectRoad: (road: Road) => void;
}

const HOURLY_FLOW_DATA = [
  { time: '06:00', volume: 680, avgSpeed: 46, delay: 1.2 },
  { time: '07:00', volume: 1420, avgSpeed: 38, delay: 2.5 },
  { time: '08:00', volume: 2280, avgSpeed: 28, delay: 5.4 },
  { time: '09:00', volume: 2450, avgSpeed: 25, delay: 6.8 },
  { time: '10:00', volume: 1890, avgSpeed: 34, delay: 4.1 },
  { time: '11:00', volume: 1942, avgSpeed: 34.2, delay: 4.6 },
  { time: '12:00', volume: 2150, avgSpeed: 31, delay: 5.2 },
  { time: '13:00', volume: 1980, avgSpeed: 35, delay: 3.8 }
];

export const Overview: React.FC<OverviewProps> = ({
  roads,
  incidents,
  status,
  onNavigate,
  onSelectRoad
}) => {
  const congestedRoads = roads.filter(r => r.congestionLevel === 'heavy' || r.congestionLevel === 'severe');
  const topCongested = [...roads].sort((a, b) => (b.queueLength / b.capacity) - (a.queueLength / a.capacity)).slice(0, 4);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* SYNTRA Brand Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#28313C] bg-gradient-to-r from-[#0E1520] via-[#111A26] to-[#0A0F16] p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 z-10">
          <img 
            src="/syntra-icon.jpg" 
            alt="SYNTRA Logo" 
            className="w-16 h-16 rounded-2xl object-cover border border-[#28313C] shadow-xl shadow-cyan-500/10 shrink-0" 
          />
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="font-extrabold text-2xl tracking-wider text-white font-mono">
                SYNTRA
              </span>
              <span className="text-[10px] bg-[#1A212B] text-[#4AA3DF] px-2 py-0.5 rounded border border-[#28313C] font-mono font-semibold">
                v2.4-TWIN
              </span>
              <span className="text-[10px] bg-[#1A212B] text-[#35C98B] px-2 py-0.5 rounded border border-[#28313C] font-mono">
                HYDERABAD METRO
              </span>
            </div>
            <p className="text-xs text-[#00E5FF] font-mono font-medium tracking-widest uppercase">
              AI-POWERED TRAFFIC INTELLIGENCE
            </p>
            <p className="text-xs text-[#8B98A7] mt-1 max-w-xl">
              Next-generation macro &amp; micro traffic simulation engine. Simulates Hyderabad's urban corridors, predicts bottlenecks, and activates emergency green-wave corridors before gridlocks occur.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <button
            onClick={() => onNavigate('optimal-route')}
            className="flex items-center gap-2 bg-[#00A3FF] hover:bg-[#0092E6] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-[#00A3FF]/25 transition-all"
          >
            <span>Live Optimal Route</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('simulations')}
            className="flex items-center gap-2 bg-[#1A212B] hover:bg-[#252E3B] border border-[#28313C] text-[#E8EDF2] px-3.5 py-2 rounded-xl text-xs font-medium transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#4AA3DF]" />
            <span>What-If Engine</span>
          </button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#00A3FF]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#28313C] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#4AA3DF] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C]">
              NETWORK HEALTH: 78 / 100
            </span>
            <span className="text-[11px] font-mono text-[#8B98A7]">
              HYDERABAD METRO NETWORK
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
            Urban Network Telemetry Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('simulations')}
            className="flex items-center gap-2 bg-[#4AA3DF]/10 hover:bg-[#4AA3DF]/20 border border-[#4AA3DF]/40 text-[#4AA3DF] px-3 py-1.5 rounded text-xs font-semibold transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Launch What-If Simulation</span>
          </button>
          <button
            onClick={() => onNavigate('digital-twin')}
            className="flex items-center gap-2 bg-[#1A212B] hover:bg-[#28313C] border border-[#28313C] text-[#E8EDF2] px-3 py-1.5 rounded text-xs font-medium transition-colors"
          >
            <span>Inspect Live Twin</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Average Velocity */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-2">
            <span>Average Speed</span>
            <Gauge className="w-4 h-4 text-[#4AA3DF]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#E8EDF2]">
              {status.averageSpeedKmh}
            </span>
            <span className="text-xs text-[#8B98A7]">km/h</span>
          </div>
          <div className="mt-2 text-[11px] text-[#E05A5A] flex items-center gap-1 font-mono">
            <TrendingDown className="w-3 h-3" />
            <span>-8.4% vs free-flow baseline</span>
          </div>
        </div>

        {/* Vehicles Active */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-2">
            <span>Vehicles in Network</span>
            <Car className="w-4 h-4 text-[#4AA3DF]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#E8EDF2]">
              {status.totalVehicles.toLocaleString()}
            </span>
            <span className="text-xs text-[#8B98A7]">active</span>
          </div>
          <div className="mt-2 text-[11px] text-[#35C98B] flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>Flow rate: 14,800 veh/hr</span>
          </div>
        </div>

        {/* Network Delay Index */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-2">
            <span>Network Delay Index</span>
            <Clock className="w-4 h-4 text-[#E58B42]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#E8EDF2]">
              +{status.networkDelayMin}
            </span>
            <span className="text-xs text-[#8B98A7]">min/vehicle</span>
          </div>
          <div className="mt-2 text-[11px] text-[#E58B42] flex items-center gap-1 font-mono">
            <span>Critical bottleneck delay: 9.6 min</span>
          </div>
        </div>

        {/* Active Incidents & Closures */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-2">
            <span>Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-[#E05A5A]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#E05A5A]">
              {incidents.length}
            </span>
            <span className="text-xs text-[#8B98A7]">anomalies</span>
          </div>
          <div className="mt-2 text-[11px] text-[#8B98A7] font-mono">
            <span>1 Collision · 1 Work Zone · 1 Stalled</span>
          </div>
        </div>
      </div>

      {/* Main Trends: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Network Velocity & Volume History */}
        <div className="lg:col-span-2 bg-[#151B23] border border-[#28313C] rounded-lg p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#E8EDF2]">
                Diurnal Flow & Velocity Profile (Simulated Microscopic Physics)
              </h2>
              <p className="text-xs text-[#8B98A7] mt-0.5">
                Vehicles per hour vs mean network traversal velocity
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#4AA3DF]">
                <span className="w-2.5 h-0.5 bg-[#4AA3DF]"></span> Volume
              </span>
              <span className="flex items-center gap-1.5 text-[#35C98B]">
                <span className="w-2.5 h-0.5 bg-[#35C98B]"></span> Speed (km/h)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_FLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4AA3DF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4AA3DF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#28313C" vertical={false} />
                <XAxis dataKey="time" stroke="#5E6A78" fontSize={11} tickLine={false} />
                <YAxis stroke="#5E6A78" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#11161D', borderColor: '#28313C', borderRadius: '6px', fontSize: '11px', color: '#E8EDF2' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#4AA3DF" strokeWidth={2} fillOpacity={1} fill="url(#volGrad)" />
                <Area type="monotone" dataKey="avgSpeed" stroke="#35C98B" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Top Affected & Congested Roads */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-3">
              <h2 className="text-sm font-semibold text-[#E8EDF2]">
                Highest Friction Corridors
              </h2>
              <span className="text-[10px] font-mono text-[#8B98A7]">
                RANKED BY QUEUE
              </span>
            </div>

            <div className="space-y-3">
              {topCongested.map((r, idx) => (
                <div 
                  key={r.id}
                  onClick={() => { onSelectRoad(r); onNavigate('digital-twin'); }}
                  className="p-2.5 rounded bg-[#11161D] border border-[#28313C] hover:border-[#4AA3DF]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#E8EDF2] truncate max-w-[180px]">
                      {idx + 1}. {r.name}
                    </span>
                    <span className="font-mono text-[11px] text-[#E05A5A] font-semibold">
                      {r.queueLength}m queue
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8B98A7]">
                    <span>Speed: {r.currentSpeed} / {r.freeFlowSpeed} km/h</span>
                    <span>Delay: +{((r.travelTime - (r.lengthMeters / (r.freeFlowSpeed * 1000 / 60)))).toFixed(1)}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('traffic')}
            className="w-full mt-4 py-2 bg-[#1A212B] hover:bg-[#28313C] text-xs font-mono text-[#4AA3DF] rounded border border-[#28313C] transition-colors text-center"
          >
            Open Full Road Telemetry Matrix →
          </button>
        </div>
      </div>

      {/* Active Incidents & What-If Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Incident Feed */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#E05A5A]" />
              <h2 className="text-sm font-semibold text-[#E8EDF2]">
                Active Network Incidents (Simulated)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('incidents')}
              className="text-xs text-[#4AA3DF] hover:underline font-mono"
            >
              View All ({incidents.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {incidents.slice(0, 2).map(inc => (
              <div key={inc.id} className="bg-[#11161D] border border-[#28313C] rounded p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#E05A5A] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{inc.type}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#5E6A78]">{inc.detectedTime}</span>
                </div>
                <div className="text-[#E8EDF2] font-medium">{inc.roadName}</div>
                <p className="text-[#8B98A7] text-[11px] mt-1">{inc.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Scenario Quick Launcher */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#4AA3DF]" />
                <h2 className="text-sm font-semibold text-[#E8EDF2]">
                  What-If Simulation Sandbox
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#35C98B] bg-[#35C98B]/10 px-2 py-0.5 rounded border border-[#35C98B]/30">
                READY
              </span>
            </div>

            <p className="text-xs text-[#8B98A7] mb-4 leading-relaxed">
              Test road closures, lane expansions, and diversion routing before real-world implementation. Measure secondary congestion ripple across downstream corridors.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('simulations')}
                className="p-2.5 rounded bg-[#11161D] border border-[#28313C] hover:border-[#E05A5A]/50 text-left transition-colors"
              >
                <div className="font-semibold text-[#E05A5A] mb-1">Road Closure Test</div>
                <div className="text-[11px] text-[#8B98A7]">Model diversion ripple on parallel arterials</div>
              </button>
              <button
                onClick={() => onNavigate('infrastructure')}
                className="p-2.5 rounded bg-[#11161D] border border-[#28313C] hover:border-[#35C98B]/50 text-left transition-colors"
              >
                <div className="font-semibold text-[#35C98B] mb-1">Infrastructure Lab</div>
                <div className="text-[11px] text-[#8B98A7]">Test adding lanes or changing signal splits</div>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#28313C] flex items-center justify-between text-xs font-mono text-[#5E6A78]">
            <span>Simulation Loop: Observe → Simulate → Compare</span>
            <span className="text-[#4AA3DF]">SUMO Calibrated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
