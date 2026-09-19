import React, { useState } from 'react';
import { Road, InfrastructureScenario } from '../types';
import { DEMO_INFRASTRUCTURE_SCENARIOS } from '../data/demo';
import { 
  Wrench, 
  Plus, 
  Minus, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface InfrastructureProps {
  roads: Road[];
  onSelectScenario: (scenario: InfrastructureScenario) => void;
  onNavigateToTwin: () => void;
}

export const Infrastructure: React.FC<InfrastructureProps> = ({
  roads,
  onSelectScenario,
  onNavigateToTwin
}) => {
  const [selectedScenario, setSelectedScenario] = useState<InfrastructureScenario>(DEMO_INFRASTRUCTURE_SCENARIOS[0]);
  const [customLanes, setCustomLanes] = useState<number>(1);
  const [customAction, setCustomAction] = useState<string>('ADD_LANE');
  const [customRoadId, setCustomRoadId] = useState<string>('R-102');

  const targetRoad = roads.find(r => r.id === selectedScenario.roadId);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#28313C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#35C98B] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C]">
              VIRTUAL INFRASTRUCTURE LAB
            </span>
            <span className="text-[11px] font-mono text-[#8B98A7]">
              SIMULATED EFFECT & CAPITAL PROJECT TESTING
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
            Infrastructure Scenario Designer
          </h1>
          <p className="text-xs text-[#8B98A7] mt-1 max-w-2xl leading-relaxed">
            Virtually modify lane geometries, channelization, and capacity thresholds. Assess projected network outcomes prior to public capital expenditures.
          </p>
        </div>

        <div className="bg-[#151B23] border border-[#28313C] rounded p-2.5 text-xs font-mono text-[#8B98A7]">
          <span>Decision Disclaimer: </span>
          <strong className="text-[#E8EDF2]">PROJECTED NETWORK CHANGE (SIMULATION ONLY)</strong>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_INFRASTRUCTURE_SCENARIOS.map(scen => {
          const isSelected = selectedScenario.id === scen.id;
          return (
            <div
              key={scen.id}
              onClick={() => setSelectedScenario(scen)}
              className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1A212B] border-[#35C98B] shadow-lg'
                  : 'bg-[#151B23] border-[#28313C] hover:border-[#3B4756]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11161D] text-[#4AA3DF] border border-[#28313C]">
                    {scen.id}
                  </span>
                  <span className="text-[10px] font-mono text-[#35C98B] font-semibold">
                    +{scen.throughputGainPct}% THROUGHPUT
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#E8EDF2] mb-1 leading-snug">
                  {scen.name}
                </h3>
                <div className="text-[11px] font-mono text-[#8B98A7] mb-2">
                  Target: {scen.roadName}
                </div>
                <p className="text-[11px] text-[#8B98A7] leading-relaxed">
                  {scen.simulatedEffect}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#28313C] flex items-center justify-between text-xs font-mono">
                <span className="text-[#8B98A7]">Delay Savings:</span>
                <span className="text-[#35C98B] font-semibold">-{scen.delayReductionMin} min</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dive into Selected Scenario */}
      {selectedScenario && (
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#28313C] gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#4AA3DF] bg-[#11161D] px-2 py-0.5 rounded border border-[#28313C]">
                  {selectedScenario.id}
                </span>
                <span className="text-xs font-mono text-[#8B98A7]">
                  Action: <strong className="text-[#E8EDF2]">{selectedScenario.action}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#E8EDF2]">
                {selectedScenario.name}
              </h2>
            </div>

            <button
              onClick={() => {
                onSelectScenario(selectedScenario);
                onNavigateToTwin();
              }}
              className="flex items-center gap-2 bg-[#35C98B]/20 hover:bg-[#35C98B]/30 border border-[#35C98B]/50 text-[#35C98B] hover:text-[#fff] px-3.5 py-1.5 rounded text-xs font-medium transition-colors"
            >
              <span>Overlay on Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quantitative Impact Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#11161D] p-3.5 rounded border border-[#28313C]">
              <span className="text-[#8B98A7] text-[10px] block">Projected Capacity Delta</span>
              <span className="text-xl font-bold text-[#35C98B]">+{selectedScenario.capacityDeltaPct}%</span>
            </div>
            <div className="bg-[#11161D] p-3.5 rounded border border-[#28313C]">
              <span className="text-[#8B98A7] text-[10px] block">Corridor Throughput Gain</span>
              <span className="text-xl font-bold text-[#35C98B]">+{selectedScenario.throughputGainPct}%</span>
            </div>
            <div className="bg-[#11161D] p-3.5 rounded border border-[#28313C]">
              <span className="text-[#8B98A7] text-[10px] block">Average Delay Reduction</span>
              <span className="text-xl font-bold text-[#35C98B]">-{selectedScenario.delayReductionMin} min</span>
            </div>
            <div className="bg-[#11161D] p-3.5 rounded border border-[#28313C]">
              <span className="text-[#8B98A7] text-[10px] block">Estimated CapEx Budget</span>
              <span className="text-xl font-bold text-[#E8EDF2]">${(selectedScenario.costEstimateUsd / 1000).toFixed(0)}k</span>
            </div>
          </div>

          {/* Qualitative Impact Statements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#11161D] p-4 rounded border border-[#28313C]">
              <h3 className="font-semibold text-[#4AA3DF] mb-1.5 uppercase tracking-wider text-[11px] font-mono">
                SIMULATED EFFECT
              </h3>
              <p className="text-[#E8EDF2] leading-relaxed">
                {selectedScenario.simulatedEffect}
              </p>
            </div>
            <div className="bg-[#11161D] p-4 rounded border border-[#28313C]">
              <h3 className="font-semibold text-[#35C98B] mb-1.5 uppercase tracking-wider text-[11px] font-mono">
                PROJECTED NETWORK CHANGE
              </h3>
              <p className="text-[#E8EDF2] leading-relaxed">
                {selectedScenario.projectedNetworkChange}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
