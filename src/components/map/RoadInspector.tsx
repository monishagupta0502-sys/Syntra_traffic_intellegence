import React from 'react';
import { Road } from '../../types';
import { 
  X, 
  Activity, 
  Gauge, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ArrowRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface RoadInspectorProps {
  road: Road | null;
  onClose: () => void;
  onSimulateClosure?: (road: Road) => void;
}

export const RoadInspector: React.FC<RoadInspectorProps> = ({ 
  road, 
  onClose,
  onSimulateClosure 
}) => {
  if (!road) return null;

  const speedRatio = Number((road.currentSpeed / road.freeFlowSpeed).toFixed(2));
  const capacityPct = Math.min(100, Math.round((road.flow / road.capacity) * 100));

  const getStatusBadge = (level: Road['congestionLevel']) => {
    switch (level) {
      case 'normal':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#35C98B]/10 text-[#35C98B] border border-[#35C98B]/30">NORMAL FLOW</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#E7C65A]/10 text-[#E7C65A] border border-[#E7C65A]/30">MODERATE</span>;
      case 'heavy':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#E58B42]/10 text-[#E58B42] border border-[#E58B42]/30">HEAVY SLOWDOWN</span>;
      case 'severe':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#E05A5A]/10 text-[#E05A5A] border border-[#E05A5A]/30">SEVERE GRIDLOCK</span>;
    }
  };

  return (
    <div 
      id="road-inspector-panel"
      className="absolute top-4 right-4 z-[1000] w-96 max-w-[calc(100vw-2rem)] bg-[#151B23]/95 backdrop-blur-md border border-[#28313C] rounded-lg shadow-2xl p-4 text-[#E8EDF2] animate-in fade-in slide-in-from-right-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#28313C] pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-[#8B98A7] bg-[#11161D] px-1.5 py-0.5 rounded border border-[#28313C]">
              {road.id}
            </span>
            <span className="text-xs uppercase tracking-wider text-[#5E6A78] font-mono">
              {road.category}
            </span>
          </div>
          <h3 className="font-medium text-base text-[#E8EDF2] leading-tight">
            {road.name}
          </h3>
        </div>
        <button
          id="close-road-inspector-btn"
          onClick={onClose}
          aria-label="Close Inspector"
          className="text-[#8B98A7] hover:text-[#E8EDF2] p-1 rounded hover:bg-[#1A212B] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Status Banner */}
      <div className="flex items-center justify-between bg-[#11161D] p-2.5 rounded border border-[#28313C] mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#4AA3DF]" />
          <span className="text-xs text-[#8B98A7]">Traffic Condition</span>
        </div>
        {getStatusBadge(road.congestionLevel)}
      </div>

      {/* Speed & Flow Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-[#1A212B] p-2.5 rounded border border-[#28313C]/80">
          <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-1">
            <span>Current Velocity</span>
            <Gauge className="w-3.5 h-3.5 text-[#4AA3DF]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-semibold text-[#E8EDF2]">
              {road.currentSpeed}
            </span>
            <span className="text-xs text-[#8B98A7]">km/h</span>
          </div>
          <div className="text-[11px] text-[#5E6A78] mt-1 flex items-center gap-1">
            <span>Free Flow: {road.freeFlowSpeed} km/h</span>
            {speedRatio < 0.7 ? (
              <TrendingDown className="w-3 h-3 text-[#E05A5A]" />
            ) : (
              <TrendingUp className="w-3 h-3 text-[#35C98B]" />
            )}
          </div>
        </div>

        <div className="bg-[#1A212B] p-2.5 rounded border border-[#28313C]/80">
          <div className="flex items-center justify-between text-xs text-[#8B98A7] mb-1">
            <span>Hourly Flow</span>
            <Layers className="w-3.5 h-3.5 text-[#4AA3DF]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-semibold text-[#E8EDF2]">
              {road.flow}
            </span>
            <span className="text-xs text-[#8B98A7]">veh/h</span>
          </div>
          <div className="text-[11px] text-[#5E6A78] mt-1">
            Cap: {road.capacity} ({capacityPct}%)
          </div>
        </div>
      </div>

      {/* Secondary Metrics Breakdown */}
      <div className="space-y-2 text-xs border-t border-[#28313C] pt-3 mb-4 font-mono">
        <div className="flex justify-between items-center py-0.5">
          <span className="text-[#8B98A7]">Active Vehicles:</span>
          <span className="font-semibold text-[#E8EDF2]">{road.vehicleCount} vehicles</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-[#8B98A7]">Corridor Density:</span>
          <span className="font-semibold text-[#E8EDF2]">{road.density} veh/km</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-[#8B98A7]">Queue Backlog:</span>
          <span className={`font-semibold ${road.queueLength > 200 ? 'text-[#E05A5A]' : 'text-[#E8EDF2]'}`}>
            {road.queueLength} meters
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-[#8B98A7]">Avg Waiting Delay:</span>
          <span className={`font-semibold ${road.waitingTime > 60 ? 'text-[#E58B42]' : 'text-[#E8EDF2]'}`}>
            {road.waitingTime} seconds
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-[#8B98A7]">Estimated Traverse:</span>
          <span className="font-semibold text-[#E8EDF2]">{road.travelTime} minutes</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-[#8B98A7]">Lanes / Geometry:</span>
          <span className="text-[#8B98A7]">{road.lanes} lanes · {road.lengthMeters}m</span>
        </div>
      </div>

      {/* Active Incident Warning if Present */}
      {road.incidentStatus && (
        <div className="bg-[#E05A5A]/10 border border-[#E05A5A]/40 rounded p-2.5 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#E05A5A] shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-[#E05A5A]">Corridor Anomaly Active</div>
            <div className="text-[#8B98A7] text-[11px] mt-0.5">{road.incidentStatus}</div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-[#28313C] flex items-center gap-2">
        <button
          id="simulate-closure-action-btn"
          onClick={() => onSimulateClosure && onSimulateClosure(road)}
          className="w-full flex items-center justify-center gap-2 bg-[#E05A5A]/20 hover:bg-[#E05A5A]/30 border border-[#E05A5A]/50 text-[#E05A5A] hover:text-[#fff] text-xs font-medium py-2 px-3 rounded transition-colors"
        >
          <span>Simulate Road Closure</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
