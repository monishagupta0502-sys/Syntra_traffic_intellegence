import React, { useState } from 'react';
import { Road, Bottleneck } from '../types';
import { 
  Activity, 
  Gauge, 
  Clock, 
  Layers, 
  AlertCircle, 
  ArrowUpDown, 
  Search,
  ExternalLink,
  Percent,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

interface TrafficProps {
  roads: Road[];
  bottlenecks: Bottleneck[];
  onSelectRoad: (road: Road) => void;
  onNavigateToTwin: () => void;
}

export const Traffic: React.FC<TrafficProps> = ({
  roads,
  bottlenecks,
  onSelectRoad,
  onNavigateToTwin
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Road>('currentSpeed');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: keyof Road) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedRoads = [...roads].filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const valA = a[sortField] ?? 0;
    const valB = b[sortField] ?? 0;
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#28313C] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-widest text-[#4AA3DF] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C]">
            CORRIDOR INTELLIGENCE
          </span>
          <span className="text-[11px] font-mono text-[#8B98A7]">
            SPEED RATIO = V / V_FREE_FLOW
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
          Traffic Intelligence & Bottleneck Analysis
        </h1>
        <p className="text-xs text-[#8B98A7] mt-1 max-w-2xl leading-relaxed">
          Transparent metrics derived from microscopic car-following models. Congestion classified via empirical speed ratios and volume-to-capacity indices without arbitrary black-box scores.
        </p>
      </div>

      {/* Formulas & Telemetry Guide Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-3 text-xs">
          <div className="font-mono text-[10px] text-[#4AA3DF] uppercase tracking-wider mb-1">
            01. Speed Performance Ratio
          </div>
          <div className="font-mono text-sm font-semibold text-[#E8EDF2] mb-1">
            R = Current Velocity / Free-Flow Velocity
          </div>
          <div className="text-[11px] text-[#8B98A7]">
            R &gt; 0.8: Free Flow · 0.6–0.8: Moderate · 0.4–0.6: Heavy · &lt;0.4: Severe Gridlock
          </div>
        </div>

        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-3 text-xs">
          <div className="font-mono text-[10px] text-[#35C98B] uppercase tracking-wider mb-1">
            02. Volume-to-Capacity (V/C)
          </div>
          <div className="font-mono text-sm font-semibold text-[#E8EDF2] mb-1">
            V/C = Hourly Flow / Lane Capacity
          </div>
          <div className="text-[11px] text-[#8B98A7]">
            V/C &gt; 0.85 indicates imminent queue breakdown and shockwave formation.
          </div>
        </div>

        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-3 text-xs">
          <div className="font-mono text-[10px] text-[#E58B42] uppercase tracking-wider mb-1">
            03. Network Delay Penalty
          </div>
          <div className="font-mono text-sm font-semibold text-[#E8EDF2] mb-1">
            Δt = Actual Traverse - Free Flow Time
          </div>
          <div className="text-[11px] text-[#8B98A7]">
            Directly quantifies passenger-hours lost to intersection queuing.
          </div>
        </div>
      </div>

      {/* Critical Bottlenecks Section */}
      <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#E58B42]" />
            <h2 className="text-sm font-semibold text-[#E8EDF2]">
              Identified Network Bottlenecks
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8B98A7]">
            {bottlenecks.length} Active Hotspots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {bottlenecks.map(btn => (
            <div key={btn.id} className="bg-[#11161D] border border-[#28313C] rounded p-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] bg-[#1A212B] px-1.5 py-0.5 rounded text-[#8B98A7] border border-[#28313C]">
                  {btn.id}
                </span>
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                  btn.severity === 'critical' ? 'bg-[#E05A5A]/20 text-[#E05A5A]' : 'bg-[#E58B42]/20 text-[#E58B42]'
                }`}>
                  {btn.severity.toUpperCase()}
                </span>
              </div>
              <div className="font-semibold text-[#E8EDF2] mb-1">{btn.roadName}</div>
              <p className="text-[#8B98A7] text-[11px] mb-2">{btn.reason}</p>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-[#5E6A78] border-t border-[#28313C] pt-2">
                <div>Queue: <strong className="text-[#E05A5A]">{btn.queueLengthM}m</strong></div>
                <div>Delay: <strong className="text-[#E58B42]">+{btn.delayMinutes}m</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Corridors Table */}
      <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#28313C]">
          <div>
            <h2 className="text-sm font-semibold text-[#E8EDF2]">
              All Corridors Telemetry Matrix
            </h2>
            <p className="text-xs text-[#8B98A7] mt-0.5">
              Select any corridor to inspect on Digital Twin or model what-if interventions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8B98A7] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter roads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#11161D] border border-[#28313C] rounded text-xs text-[#E8EDF2] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#4AA3DF]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#28313C] text-[11px] font-mono text-[#8B98A7]">
                <th className="py-2.5 px-3">Road Corridor</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-[#E8EDF2]" onClick={() => handleSort('currentSpeed')}>
                  <div className="flex items-center gap-1">
                    <span>Speed (km/h)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Ratio (V/V_ff)</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-[#E8EDF2]" onClick={() => handleSort('flow')}>
                  <div className="flex items-center gap-1">
                    <span>Flow (v/h)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Density (v/km)</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-[#E8EDF2]" onClick={() => handleSort('queueLength')}>
                  <div className="flex items-center gap-1">
                    <span>Queue</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#28313C]/50 font-mono">
              {sortedRoads.map(r => {
                const ratio = (r.currentSpeed / r.freeFlowSpeed).toFixed(2);
                return (
                  <tr key={r.id} className="hover:bg-[#1A212B]/60 transition-colors">
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-semibold text-[#E8EDF2]">{r.name}</div>
                      <div className="text-[10px] font-mono text-[#5E6A78]">{r.id} · {r.lanes} lanes · {r.lengthMeters}m</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-[#E8EDF2]">{r.currentSpeed}</span>
                      <span className="text-[#5E6A78] text-[10px]"> / {r.freeFlowSpeed}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`font-semibold ${Number(ratio) < 0.5 ? 'text-[#E05A5A]' : Number(ratio) < 0.75 ? 'text-[#E58B42]' : 'text-[#35C98B]'}`}>
                        {ratio}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#E8EDF2]">{r.flow}</td>
                    <td className="py-2.5 px-3 text-[#8B98A7]">{r.density}</td>
                    <td className="py-2.5 px-3">
                      <span className={r.queueLength > 150 ? 'text-[#E05A5A] font-semibold' : 'text-[#8B98A7]'}>
                        {r.queueLength}m
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        r.congestionLevel === 'normal' ? 'bg-[#35C98B]/10 text-[#35C98B] border border-[#35C98B]/30' :
                        r.congestionLevel === 'moderate' ? 'bg-[#E7C65A]/10 text-[#E7C65A] border border-[#E7C65A]/30' :
                        r.congestionLevel === 'heavy' ? 'bg-[#E58B42]/10 text-[#E58B42] border border-[#E58B42]/30' :
                        'bg-[#E05A5A]/10 text-[#E05A5A] border border-[#E05A5A]/30'
                      }`}>
                        {r.congestionLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          onSelectRoad(r);
                          onNavigateToTwin();
                        }}
                        className="p-1 hover:bg-[#28313C] rounded text-[#4AA3DF] hover:text-[#fff] transition-colors"
                        title="Inspect on Map"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
