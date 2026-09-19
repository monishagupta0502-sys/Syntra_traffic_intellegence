import React, { useState } from 'react';
import { EmergencyScenario, Road } from '../types';
import { DEMO_EMERGENCY_SCENARIOS } from '../data/demo';
import { 
  Siren, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Radio, 
  Zap,
  TrendingDown,
  Navigation
} from 'lucide-react';

interface EmergencyProps {
  roads: Road[];
  onSelectEmergencyScenario: (scenario: EmergencyScenario) => void;
  onNavigateToTwin: () => void;
}

export const Emergency: React.FC<EmergencyProps> = ({
  roads,
  onSelectEmergencyScenario,
  onNavigateToTwin
}) => {
  const [selectedScenario, setSelectedScenario] = useState<EmergencyScenario>(DEMO_EMERGENCY_SCENARIOS[0]);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Mandatory Prominent Simulation-Only Banner (Section 19) */}
      <div className="bg-[#E05A5A]/10 border border-[#E05A5A]/40 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#E05A5A] shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-bold text-[#E05A5A] uppercase tracking-wide">
            SIMULATION ONLY — DECISION SUPPORT ADVISORY
          </div>
          <div className="text-[#8B98A7] mt-0.5 leading-relaxed">
            This module simulates mathematical route clearance and green-wave signal prioritization. It does NOT dispatch real vehicles, send emergency SMS, interface with 911/CAD systems, or control physical street hardware.
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-[#28313C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#4AA3DF] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C]">
              TACTICAL ROUTING TWIN
            </span>
            <span className="text-[11px] font-mono text-[#8B98A7]">
              DYNAMIC GREEN-WAVE SIGNAL PREEMPTION MODEL
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
            Emergency Vehicle Priority Corridor Simulation
          </h1>
          <p className="text-xs text-[#8B98A7] mt-1 max-w-2xl leading-relaxed">
            Evaluate time savings along critical trauma transit corridors when simulated traffic signal coordination and vehicle clearing algorithms are engaged.
          </p>
        </div>
      </div>

      {/* Emergency Scenarios Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_EMERGENCY_SCENARIOS.map(scen => {
          const isSelected = selectedScenario.id === scen.id;
          return (
            <div
              key={scen.id}
              onClick={() => setSelectedScenario(scen)}
              className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1A212B] border-[#4AA3DF] shadow-lg'
                  : 'bg-[#151B23] border-[#28313C] hover:border-[#3B4756]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[#4AA3DF] font-bold">
                    {scen.id}
                  </span>
                  <span className="text-[10px] font-mono bg-[#35C98B]/20 text-[#35C98B] px-2 py-0.5 rounded border border-[#35C98B]/30 font-semibold">
                    -{scen.timeSavedMin} MIN SAVED (-{Math.round((scen.timeSavedMin / scen.normalTravelTimeMin) * 100)}%)
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#E8EDF2] mb-3">
                  {scen.name}
                </h3>

                <div className="space-y-1.5 text-xs text-[#8B98A7]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4AA3DF]"></span>
                    <span>Origin: <strong className="text-[#E8EDF2]">{scen.originName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#35C98B]"></span>
                    <span>Destination: <strong className="text-[#E8EDF2]">{scen.destName}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#28313C] grid grid-cols-2 gap-2 text-xs font-mono">
                <div>Normal Flow: <strong className="text-[#8B98A7]">{scen.normalTravelTimeMin} min</strong></div>
                <div>Preemption: <strong className="text-[#35C98B]">{scen.emergencyTravelTimeMin} min</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Scenario Detailed Simulation Matrix */}
      {selectedScenario && (
        <div className="bg-[#151B23] border border-[#28313C] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#28313C] gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#4AA3DF] bg-[#11161D] px-2 py-0.5 rounded border border-[#28313C]">
                  {selectedScenario.id}
                </span>
                <span className="text-xs font-mono text-[#35C98B]">
                  Preempted Signals: <strong>{selectedScenario.prioritySignalsCount} Junctions</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#E8EDF2]">
                {selectedScenario.name}
              </h2>
            </div>

            <button
              onClick={() => {
                onSelectEmergencyScenario(selectedScenario);
                onNavigateToTwin();
              }}
              className="flex items-center gap-2 bg-[#4AA3DF]/20 hover:bg-[#4AA3DF]/30 border border-[#4AA3DF]/50 text-[#4AA3DF] hover:text-[#fff] px-3.5 py-1.5 rounded text-xs font-medium transition-colors"
            >
              <span>View Route on Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Time Savings Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="bg-[#11161D] p-4 rounded border border-[#28313C]">
              <span className="text-xs text-[#8B98A7] block mb-1">Baseline Transit (Standard)</span>
              <span className="text-2xl font-bold text-[#8B98A7]">{selectedScenario.normalTravelTimeMin} min</span>
              <span className="text-[10px] text-[#5E6A78] block mt-1">Normal intersection delay</span>
            </div>

            <div className="bg-[#11161D] p-4 rounded border border-[#28313C]">
              <span className="text-xs text-[#35C98B] block mb-1">Simulated Green Wave Corridor</span>
              <span className="text-2xl font-bold text-[#35C98B]">{selectedScenario.emergencyTravelTimeMin} min</span>
              <span className="text-[10px] text-[#35C98B] block mt-1">Priority signal clearance</span>
            </div>

            <div className="bg-[#11161D] p-4 rounded border border-[#28313C]">
              <span className="text-xs text-[#4AA3DF] block mb-1">Total Simulated Time Saved</span>
              <span className="text-2xl font-bold text-[#4AA3DF]">-{selectedScenario.timeSavedMin} min</span>
              <span className="text-[10px] text-[#4AA3DF] block mt-1">58% traverse reduction</span>
            </div>
          </div>

          {/* Coordinated Corridors */}
          <div>
            <h3 className="text-xs font-semibold text-[#8B98A7] uppercase tracking-wider mb-2">
              Coordinated Priority Corridors
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {selectedScenario.affectedCorridors.map((c, i) => (
                <span key={i} className="bg-[#11161D] border border-[#28313C] px-3 py-1.5 rounded text-[#E8EDF2] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#35C98B]" />
                  <span>{c}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
