import React, { useState } from 'react';
import { 
  Road, 
  SimulationResult, 
  DiversionOption 
} from '../types';
import { 
  calculateSimulationResult, 
  DEMO_DIVERSION_OPTIONS 
} from '../data/demo';
import { 
  FlaskConical, 
  Play, 
  ArrowRight, 
  GitCompare, 
  TrendingDown, 
  TrendingUp, 
  Layers, 
  Gauge, 
  Clock, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Share2,
  Split
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface SimulationsProps {
  roads: Road[];
  initialScenarioType?: string;
  initialRoadId?: string;
}

export const Simulations: React.FC<SimulationsProps> = ({
  roads,
  initialScenarioType = 'ROAD_CLOSURE',
  initialRoadId
}) => {
  const [scenarioType, setScenarioType] = useState<string>(initialScenarioType);
  const [targetRoadId, setTargetRoadId] = useState<string>(initialRoadId || roads[0]?.id || 'R-101');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'ripple' | 'diversions'>('comparison');
  
  // Current active simulation result
  const [result, setResult] = useState<SimulationResult>(() => 
    calculateSimulationResult(initialScenarioType, initialRoadId || roads[0]?.id || 'R-101', roads)
  );

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = calculateSimulationResult(scenarioType, targetRoadId, roads);
      setResult(res);
      setIsSimulating(false);
    }, 600);
  };

  const comparisonChartData = [
    {
      metric: 'Avg Speed (km/h)',
      Baseline: result.baselineMetrics.averageSpeed,
      Intervention: result.interventionMetrics.averageSpeed
    },
    {
      metric: 'Travel Time (min)',
      Baseline: result.baselineMetrics.averageTravelTime,
      Intervention: result.interventionMetrics.averageTravelTime
    },
    {
      metric: 'Network Delay (min)',
      Baseline: result.baselineMetrics.networkDelay,
      Intervention: result.interventionMetrics.networkDelay
    },
    {
      metric: 'Avg Queue (x10m)',
      Baseline: Math.round(result.baselineMetrics.averageQueueLength / 10),
      Intervention: Math.round(result.interventionMetrics.averageQueueLength / 10)
    }
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#28313C] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-widest text-[#4AA3DF] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C]">
            WHAT-IF DIGITAL TWIN ENGINE
          </span>
          <span className="text-[11px] font-mono text-[#8B98A7]">
            MICROSCOPIC CAR-FOLLOWING RE-SIMULATION
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
          What-If Scenario Simulation & Network Impact
        </h1>
        <p className="text-xs text-[#8B98A7] mt-1 max-w-3xl leading-relaxed">
          Evaluate interventions virtually before physical deployment. Observe how closing a road, adding a lane, or implementing adaptive diversions shifts traffic across adjacent corridors.
        </p>
      </div>

      {/* Scenario Builder Form */}
      <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#4AA3DF]" />
            <h2 className="text-sm font-semibold text-[#E8EDF2]">
              Scenario Definition & Parameters
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#8B98A7]">
            STATUS: <strong className="text-[#35C98B]">READY TO RUN</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Scenario Type */}
          <div>
            <label className="block text-xs font-mono text-[#8B98A7] mb-1.5">
              INTERVENTION ACTION
            </label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full bg-[#11161D] border border-[#28313C] rounded p-2 text-xs text-[#E8EDF2] focus:outline-none focus:border-[#4AA3DF]"
            >
              <option value="ROAD_CLOSURE">Complete Road Closure (Emergency / Construction)</option>
              <option value="ACCIDENT">Multi-Lane Collision Incident (Reduced Flow)</option>
              <option value="EXTRA_LANE">Infrastructure: Add Lane (+Capacity)</option>
              <option value="JUNCTION_CHANGE">Signal Retiming & Junction Channelization</option>
              <option value="DIVERSION">Dynamic Upstream Diversion Strategy</option>
            </select>
          </div>

          {/* Target Corridor */}
          <div>
            <label className="block text-xs font-mono text-[#8B98A7] mb-1.5">
              TARGET CORRIDOR / ROADWAY
            </label>
            <select
              value={targetRoadId}
              onChange={(e) => setTargetRoadId(e.target.value)}
              className="w-full bg-[#11161D] border border-[#28313C] rounded p-2 text-xs text-[#E8EDF2] focus:outline-none focus:border-[#4AA3DF]"
            >
              {roads.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id})
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-mono text-[#8B98A7] mb-1.5">
              DURATION HORIZON (MINUTES)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full accent-[#4AA3DF]"
              />
              <span className="font-mono text-xs text-[#E8EDF2] bg-[#11161D] px-2 py-1 rounded border border-[#28313C] w-16 text-center">
                {durationMinutes}m
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#28313C]">
          <div className="text-xs text-[#8B98A7] flex items-center gap-2">
            <span>Simulation Execution:</span>
            <span className="text-[#35C98B] font-mono">Baseline → TraCI Calibration → Comparison Engine</span>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 bg-[#4AA3DF] hover:bg-[#3B8FCE] text-[#0B0F14] font-semibold text-xs py-2 px-4 rounded transition-colors disabled:opacity-50 shadow-md"
          >
            {isSimulating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Network Rebalancing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Microscopic Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Tabs for Simulation Output */}
      <div className="flex items-center gap-2 border-b border-[#28313C]">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`pb-2.5 px-4 text-xs font-semibold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'comparison'
              ? 'border-[#4AA3DF] text-[#4AA3DF]'
              : 'border-transparent text-[#8B98A7] hover:text-[#E8EDF2]'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Before vs After Comparison</span>
        </button>

        <button
          onClick={() => setActiveTab('ripple')}
          className={`pb-2.5 px-4 text-xs font-semibold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'ripple'
              ? 'border-[#4AA3DF] text-[#4AA3DF]'
              : 'border-transparent text-[#8B98A7] hover:text-[#E8EDF2]'
          }`}
        >
          <Split className="w-4 h-4" />
          <span>Secondary Traffic Ripple</span>
        </button>

        <button
          onClick={() => setActiveTab('diversions')}
          className={`pb-2.5 px-4 text-xs font-semibold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'diversions'
              ? 'border-[#4AA3DF] text-[#4AA3DF]'
              : 'border-transparent text-[#8B98A7] hover:text-[#E8EDF2]'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Diversion Corridor Analysis</span>
        </button>
      </div>

      {/* TAB 1: BEFORE VS AFTER COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Executive Summary Banner */}
          <div className="bg-[#11161D] border border-[#28313C] rounded-lg p-4">
            <div className="text-xs font-mono text-[#8B98A7] uppercase tracking-wider mb-1">
              Simulation Findings · {result.scenarioName}
            </div>
            <p className="text-xs text-[#E8EDF2] leading-relaxed">
              {result.summaryInsight}
            </p>
          </div>

          {/* Key Metrics Comparison Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Speed Delta */}
            <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
              <div className="text-xs text-[#8B98A7] mb-1">Average Velocity</div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-lg font-mono font-bold text-[#E8EDF2]">
                    {result.interventionMetrics.averageSpeed}
                  </span>
                  <span className="text-xs text-[#8B98A7]"> km/h</span>
                </div>
                <div className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
                  result.deltaMetrics.speedDeltaPct < 0 ? 'text-[#E05A5A]' : 'text-[#35C98B]'
                }`}>
                  {result.deltaMetrics.speedDeltaPct < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  <span>{result.deltaMetrics.speedDeltaPct > 0 ? `+${result.deltaMetrics.speedDeltaPct}%` : `${result.deltaMetrics.speedDeltaPct}%`}</span>
                </div>
              </div>
              <div className="text-[11px] text-[#5E6A78] font-mono mt-2">
                Baseline: {result.baselineMetrics.averageSpeed} km/h
              </div>
            </div>

            {/* Travel Time Delta */}
            <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
              <div className="text-xs text-[#8B98A7] mb-1">Mean Travel Time</div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-lg font-mono font-bold text-[#E8EDF2]">
                    {result.interventionMetrics.averageTravelTime}
                  </span>
                  <span className="text-xs text-[#8B98A7]"> min</span>
                </div>
                <div className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
                  result.deltaMetrics.travelTimeDeltaPct > 0 ? 'text-[#E05A5A]' : 'text-[#35C98B]'
                }`}>
                  <span>{result.deltaMetrics.travelTimeDeltaPct > 0 ? `+${result.deltaMetrics.travelTimeDeltaPct}%` : `${result.deltaMetrics.travelTimeDeltaPct}%`}</span>
                </div>
              </div>
              <div className="text-[11px] text-[#5E6A78] font-mono mt-2">
                Baseline: {result.baselineMetrics.averageTravelTime} min
              </div>
            </div>

            {/* Delay Delta */}
            <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
              <div className="text-xs text-[#8B98A7] mb-1">Network Delay</div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-lg font-mono font-bold text-[#E8EDF2]">
                    {result.interventionMetrics.networkDelay}
                  </span>
                  <span className="text-xs text-[#8B98A7]"> min</span>
                </div>
                <div className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
                  result.deltaMetrics.delayDeltaPct > 0 ? 'text-[#E05A5A]' : 'text-[#35C98B]'
                }`}>
                  <span>{result.deltaMetrics.delayDeltaPct > 0 ? `+${result.deltaMetrics.delayDeltaPct}%` : `${result.deltaMetrics.delayDeltaPct}%`}</span>
                </div>
              </div>
              <div className="text-[11px] text-[#5E6A78] font-mono mt-2">
                Baseline: {result.baselineMetrics.networkDelay} min
              </div>
            </div>

            {/* Queue Length */}
            <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-4">
              <div className="text-xs text-[#8B98A7] mb-1">Mean Queue Spillback</div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-lg font-mono font-bold text-[#E8EDF2]">
                    {result.interventionMetrics.averageQueueLength}
                  </span>
                  <span className="text-xs text-[#8B98A7]"> m</span>
                </div>
                <div className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
                  result.deltaMetrics.queueDeltaPct > 0 ? 'text-[#E05A5A]' : 'text-[#35C98B]'
                }`}>
                  <span>{result.deltaMetrics.queueDeltaPct > 0 ? `+${result.deltaMetrics.queueDeltaPct}%` : `${result.deltaMetrics.queueDeltaPct}%`}</span>
                </div>
              </div>
              <div className="text-[11px] text-[#5E6A78] font-mono mt-2">
                Baseline: {result.baselineMetrics.averageQueueLength} m
              </div>
            </div>
          </div>

          {/* Side-by-side Chart & Corridor Delta Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-4">
                <h3 className="text-sm font-semibold text-[#E8EDF2]">
                  Baseline vs Intervention Comparison
                </h3>
                <span className="text-xs font-mono text-[#8B98A7]">
                  METRIC DELTAS
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#28313C" vertical={false} />
                    <XAxis dataKey="metric" stroke="#5E6A78" fontSize={11} tickLine={false} />
                    <YAxis stroke="#5E6A78" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#11161D', borderColor: '#28313C', borderRadius: '6px', fontSize: '11px', color: '#E8EDF2' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Baseline" fill="#8B98A7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Intervention" fill="#4AA3DF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Affected Corridors Table */}
            <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#28313C] mb-3">
                  <h3 className="text-sm font-semibold text-[#E8EDF2]">
                    Corridor Velocity Impact Matrix
                  </h3>
                  <span className="text-xs font-mono text-[#8B98A7]">
                    TIER RANKED
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {result.affectedRoads.map(ar => (
                    <div key={ar.roadId} className="p-2.5 rounded bg-[#11161D] border border-[#28313C] flex items-center justify-between">
                      <div>
                        <div className="font-sans font-semibold text-[#E8EDF2]">
                          {ar.roadName}
                        </div>
                        <div className="text-[10px] text-[#5E6A78]">
                          {ar.roadId} · Impact: <strong className="text-[#4AA3DF]">{ar.impactTier}</strong>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">
                          <span className="text-[#8B98A7]">{ar.baselineSpeed}</span>
                          <span className="text-[#5E6A78]"> → </span>
                          <span className={`font-semibold ${ar.interventionSpeed < ar.baselineSpeed ? 'text-[#E05A5A]' : 'text-[#35C98B]'}`}>
                            {ar.interventionSpeed} km/h
                          </span>
                        </div>
                        <div className="text-[10px] text-[#8B98A7]">
                          Traffic: <strong className={ar.trafficChangePct > 0 ? 'text-[#E05A5A]' : 'text-[#35C98B]'}>
                            {ar.trafficChangePct > 0 ? `+${ar.trafficChangePct}%` : `${ar.trafficChangePct}%`}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECONDARY TRAFFIC RIPPLE */}
      {activeTab === 'ripple' && (
        <div className="space-y-6">
          <div className="bg-[#11161D] border border-[#28313C] rounded-lg p-4">
            <div className="text-xs font-mono text-[#4AA3DF] uppercase tracking-wider mb-1">
              NETWORK SPILLOVER MECHANISM
            </div>
            <p className="text-xs text-[#E8EDF2] leading-relaxed">
              When a major artery is closed or throttled, displaced vehicles divert into the nearest parallel corridors. Those corridors saturate, causing secondary intersection blockages that propagate outward into tertiary ring roads.
            </p>
          </div>

          {/* Visual Ripple Chain */}
          <div className="relative pl-6 space-y-6 border-l-2 border-[#28313C] ml-4">
            {result.rippleImpacts.map((rip, idx) => (
              <div key={idx} className="relative bg-[#151B23] border border-[#28313C] rounded-lg p-5">
                {/* Node dot on line */}
                <div className={`absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full border-2 border-[#11161D] ${
                  rip.tier === 'PRIMARY' ? 'bg-[#E05A5A]' : rip.tier === 'SECONDARY' ? 'bg-[#E58B42]' : 'bg-[#4AA3DF]'
                }`}></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#28313C] mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      rip.tier === 'PRIMARY' ? 'bg-[#E05A5A]/20 text-[#E05A5A]' :
                      rip.tier === 'SECONDARY' ? 'bg-[#E58B42]/20 text-[#E58B42]' :
                      'bg-[#4AA3DF]/20 text-[#4AA3DF]'
                    }`}>
                      {rip.tier} IMPACT
                    </span>
                    <h3 className="font-bold text-sm text-[#E8EDF2]">
                      {rip.roadName} ({rip.roadId})
                    </h3>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#E05A5A] bg-[#11161D] px-2.5 py-1 rounded border border-[#28313C]">
                    {rip.changeLabel}
                  </div>
                </div>

                <p className="text-xs text-[#8B98A7] leading-relaxed">
                  {rip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DIVERSION CORRIDOR SIMULATION */}
      {activeTab === 'diversions' && (
        <div className="space-y-6">
          <div className="bg-[#11161D] border border-[#28313C] rounded-lg p-4">
            <div className="text-xs font-mono text-[#35C98B] uppercase tracking-wider mb-1">
              SIMULATION / ADVISORY ROUTE ANALYSIS
            </div>
            <p className="text-xs text-[#E8EDF2] leading-relaxed">
              Evaluating candidate diversion paths around simulated obstruction. Quantitative comparisons of travel time, distance, and secondary arterial load are provided for operations decision support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_DIVERSION_OPTIONS.map((opt, i) => (
              <div key={opt.id} className="bg-[#151B23] border border-[#28313C] rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-[#4AA3DF] font-bold">
                      {opt.id}
                    </span>
                    <span className="text-[10px] font-mono bg-[#11161D] text-[#8B98A7] px-2 py-0.5 rounded border border-[#28313C]">
                      Cap Score: {opt.capacityScore}/100
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-[#E8EDF2] mb-2 leading-tight">
                    {opt.name}
                  </h3>

                  <p className="text-[11px] text-[#8B98A7] mb-4">
                    {opt.notes}
                  </p>

                  <div className="space-y-2 text-xs font-mono border-t border-[#28313C] pt-3">
                    <div className="flex justify-between">
                      <span className="text-[#8B98A7]">Travel Time:</span>
                      <span className="font-semibold text-[#E8EDF2]">{opt.travelTimeMin} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B98A7]">Path Length:</span>
                      <span className="font-semibold text-[#E8EDF2]">{opt.distanceKm} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B98A7]">Expected Delay:</span>
                      <span className="font-semibold text-[#E58B42]">+{opt.expectedDelayMin} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B98A7]">Corridors Used:</span>
                      <span className="font-semibold text-[#E8EDF2]">{opt.affectedRoadsCount} segments</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#28313C] text-[10px] font-mono text-[#5E6A78]">
                  Advisory candidate path evaluated by network capacity model.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
