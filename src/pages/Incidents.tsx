import React, { useState } from 'react';
import { Incident, Road } from '../types';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  FlaskConical, 
  ShieldAlert,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';

interface IncidentsProps {
  incidents: Incident[];
  roads: Road[];
  onSelectRoad: (road: Road) => void;
  onNavigateToTwin: () => void;
  onSimulateScenario: (scenarioType: string, targetRoadId: string) => void;
}

export const Incidents: React.FC<IncidentsProps> = ({
  incidents,
  roads,
  onSelectRoad,
  onNavigateToTwin,
  onSimulateScenario
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident>(incidents[0]);

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity === 'all') return true;
    return inc.severity === filterSeverity;
  });

  const getSeverityBadge = (sev: Incident['severity']) => {
    switch (sev) {
      case 'critical':
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#E05A5A]/20 text-[#E05A5A] border border-[#E05A5A]/40">HIGH PRIORITY</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#E7C65A]/20 text-[#E7C65A] border border-[#E7C65A]/40">MODERATE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#35C98B]/20 text-[#35C98B] border border-[#35C98B]/40">LOW IMPACT</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#28313C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#E05A5A] uppercase bg-[#151B23] px-2 py-0.5 rounded border border-[#28313C]">
              SIMULATED INCIDENT INTELLIGENCE
            </span>
            <span className="text-[11px] font-mono text-[#8B98A7]">
              DECISION-SUPPORT ADVISORY ONLY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF2]">
            Abnormal Traffic Events & Road Disruptions
          </h1>
          <p className="text-xs text-[#8B98A7] mt-1 max-w-2xl leading-relaxed">
            All incident records are synthetic / simulated anomaly events for tactical network stress-testing and what-if diversion modeling.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-[#151B23] p-1 rounded border border-[#28313C]">
          {['all', 'high', 'moderate', 'low'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                filterSeverity === sev
                  ? 'bg-[#1A212B] text-[#4AA3DF] border border-[#4AA3DF]/40'
                  : 'text-[#8B98A7] hover:text-[#E8EDF2]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List & Selected Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: List of Incidents */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8B98A7] px-1">
            <span>DISRUPTIONS ({filteredIncidents.length})</span>
            <span>STATUS</span>
          </div>

          {filteredIncidents.map(inc => {
            const isSelected = selectedIncident?.id === inc.id;
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1A212B] border-[#4AA3DF] shadow-lg'
                    : 'bg-[#151B23] border-[#28313C] hover:border-[#3B4756]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-[#4AA3DF]">{inc.id}</span>
                  {getSeverityBadge(inc.severity)}
                </div>
                <div className="font-semibold text-xs text-[#E8EDF2] mb-1">
                  {inc.type}
                </div>
                <div className="text-[11px] text-[#8B98A7] truncate">
                  {inc.roadName}
                </div>
                <div className="mt-2 pt-2 border-t border-[#28313C] flex items-center justify-between text-[10px] font-mono text-[#5E6A78]">
                  <span>{inc.detectedTime}</span>
                  <span className="text-[#E7C65A]">{inc.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Cols: Detailed Inspector & Simulation Trigger */}
        {selectedIncident && (
          <div className="lg:col-span-2 bg-[#151B23] border border-[#28313C] rounded-lg p-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#28313C] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs text-[#4AA3DF] bg-[#11161D] px-2 py-0.5 rounded border border-[#28313C]">
                      {selectedIncident.id}
                    </span>
                    {getSeverityBadge(selectedIncident.severity)}
                    <span className="text-xs font-mono text-[#8B98A7]">
                      Status: <strong className="text-[#35C98B]">{selectedIncident.status}</strong>
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#E8EDF2]">
                    {selectedIncident.type} — {selectedIncident.roadName}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    const r = roads.find(x => x.id === selectedIncident.roadId);
                    if (r) {
                      onSelectRoad(r);
                      onNavigateToTwin();
                    }
                  }}
                  className="flex items-center gap-1.5 bg-[#1A212B] hover:bg-[#28313C] border border-[#28313C] text-xs text-[#4AA3DF] px-3 py-1.5 rounded transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Highlight on Twin</span>
                </button>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-[#8B98A7] uppercase tracking-wider mb-1">
                  Incident Narrative & Telemetry Signal
                </h3>
                <p className="text-xs text-[#E8EDF2] leading-relaxed bg-[#11161D] p-3.5 rounded border border-[#28313C]">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Telemetry Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-[#11161D] p-3 rounded border border-[#28313C]">
                  <span className="text-[#8B98A7] text-[10px] block">Detection Trigger</span>
                  <span className="text-[#E8EDF2] font-semibold">{selectedIncident.detectedTime}</span>
                </div>
                <div className="bg-[#11161D] p-3 rounded border border-[#28313C]">
                  <span className="text-[#8B98A7] text-[10px] block">Projected Clearance</span>
                  <span className="text-[#E8EDF2] font-semibold">{selectedIncident.estimatedDuration}</span>
                </div>
                <div className="bg-[#11161D] p-3 rounded border border-[#28313C]">
                  <span className="text-[#8B98A7] text-[10px] block">Reporting System</span>
                  <span className="text-[#4AA3DF] font-semibold">{selectedIncident.reportedBy}</span>
                </div>
              </div>

              {/* Affected Downstream Corridors */}
              <div>
                <h3 className="text-xs font-semibold text-[#8B98A7] uppercase tracking-wider mb-2">
                  Corridors Affected by Secondary Spillback
                </h3>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {selectedIncident.affectedRoads.map(id => {
                    const r = roads.find(x => x.id === id);
                    return (
                      <span key={id} className="bg-[#1A212B] border border-[#28313C] px-2.5 py-1 rounded text-[#E8EDF2] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E58B42]"></span>
                        <span>{r ? r.name : id}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tactical What-If Actions */}
            <div className="mt-6 pt-4 border-t border-[#28313C] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-[#8B98A7]">
                Model the network-level impact if this corridor is shut down or diverted:
              </div>
              <button
                onClick={() => onSimulateScenario('ROAD_CLOSURE', selectedIncident.roadId)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E05A5A]/20 hover:bg-[#E05A5A]/30 border border-[#E05A5A]/50 text-[#E05A5A] hover:text-[#fff] px-4 py-2 rounded text-xs font-semibold transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Simulate Incident Impact & Road Closure</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
