import React from 'react';
import { Road } from '../types';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { BarChart3, TrendingUp, Activity, Gauge, Clock, Layers } from 'lucide-react';

interface AnalyticsProps {
  roads: Road[];
}

const HISTORICAL_VELOCITY = [
  { hour: '06:00', speed: 48, delay: 1.1, capacityPct: 32 },
  { hour: '07:00', speed: 42, delay: 2.3, capacityPct: 58 },
  { hour: '08:00', speed: 28, delay: 5.6, capacityPct: 89 },
  { hour: '09:00', speed: 25, delay: 6.8, capacityPct: 94 },
  { hour: '10:00', speed: 33, delay: 4.2, capacityPct: 68 },
  { hour: '11:00', speed: 35, delay: 3.9, capacityPct: 71 },
  { hour: '12:00', speed: 31, delay: 5.1, capacityPct: 82 },
  { hour: '13:00', speed: 36, delay: 3.7, capacityPct: 69 },
  { hour: '14:00', speed: 38, delay: 3.2, capacityPct: 64 },
  { hour: '15:00', speed: 34, delay: 4.4, capacityPct: 76 },
  { hour: '16:00', speed: 29, delay: 5.8, capacityPct: 88 },
  { hour: '17:00', speed: 24, delay: 7.2, capacityPct: 96 }
];

const CONGESTION_DISTRIBUTION = [
  { name: 'Normal Flow (>45 km/h)', value: 8, color: '#35C98B' },
  { name: 'Moderate (30-45 km/h)', value: 3, color: '#E7C65A' },
  { name: 'Heavy Slowdown (15-30 km/h)', value: 2, color: '#E58B42' },
  { name: 'Severe Gridlock (<15 km/h)', value: 1, color: '#E05A5A' }
];

export const Analytics: React.FC<AnalyticsProps> = ({ roads }) => {
  const roadUtilizationData = roads.slice(0, 8).map(r => ({
    name: r.name.split(' ')[0] + ' ' + (r.name.split(' ')[1] || ''),
    flow: r.flow,
    capacity: r.capacity,
    utilization: Math.round((r.flow / r.capacity) * 100)
  }));

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#28313C] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-widest text-[#4AA3DF] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C]">
            LONGITUDINAL TELEMETRY
          </span>
          <span className="text-[11px] font-mono text-[#8B98A7]">
            RECHARTS DATA ENGINE
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
          Network Analytics & Utilization Metrics
        </h1>
        <p className="text-xs text-[#8B98A7] mt-1 max-w-2xl leading-relaxed">
          Aggregated quantitative distributions of corridor velocity profiles, capacity saturation, and diurnal performance variations.
        </p>
      </div>

      {/* Top 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Historical Velocity vs Delay */}
        <div className="lg:col-span-2 bg-[#151B23] border border-[#28313C] rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#E8EDF2]">
                Diurnal Velocity & Network Delay Progression
              </h2>
              <p className="text-xs text-[#8B98A7] mt-0.5">
                Correlation between peak travel demand and corridor delay spikes
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#35C98B]">
                <span className="w-2.5 h-0.5 bg-[#35C98B]"></span> Speed (km/h)
              </span>
              <span className="flex items-center gap-1.5 text-[#E05A5A]">
                <span className="w-2.5 h-0.5 bg-[#E05A5A]"></span> Delay (min)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_VELOCITY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#28313C" vertical={false} />
                <XAxis dataKey="hour" stroke="#5E6A78" fontSize={11} tickLine={false} />
                <YAxis stroke="#5E6A78" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#11161D', borderColor: '#28313C', borderRadius: '6px', fontSize: '11px', color: '#E8EDF2' }}
                />
                <Line type="monotone" dataKey="speed" stroke="#35C98B" strokeWidth={2.5} />
                <Line type="monotone" dataKey="delay" stroke="#E05A5A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Congestion Category Pie */}
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#28313C] mb-3">
              <h2 className="text-sm font-semibold text-[#E8EDF2]">
                Network Congestion Distribution
              </h2>
              <p className="text-xs text-[#8B98A7] mt-0.5">
                Sector classification by free-flow ratio
              </p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CONGESTION_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CONGESTION_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#11161D', borderColor: '#28313C', borderRadius: '6px', fontSize: '11px', color: '#E8EDF2' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs mt-2">
              {CONGESTION_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[#8B98A7] text-[11px]">{item.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-[#E8EDF2] text-[11px]">{item.value} corridors</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Capacity Utilization Chart */}
      <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#E8EDF2]">
              Corridor Capacity Utilization Index (V/C Ratio)
            </h2>
            <p className="text-xs text-[#8B98A7] mt-0.5">
              Comparison between current hourly throughput and maximum theoretical link capacity
            </p>
          </div>
          <span className="text-xs font-mono text-[#8B98A7]">
            THRESHOLD: &gt;85% BREAKDOWN
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roadUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28313C" vertical={false} />
              <XAxis dataKey="name" stroke="#5E6A78" fontSize={11} tickLine={false} />
              <YAxis stroke="#5E6A78" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#11161D', borderColor: '#28313C', borderRadius: '6px', fontSize: '11px', color: '#E8EDF2' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="capacity" fill="#28313C" name="Max Capacity (v/h)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="flow" fill="#4AA3DF" name="Active Flow (v/h)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
