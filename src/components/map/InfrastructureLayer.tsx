import React from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { InfrastructureScenario, Road } from '../../types';

interface InfrastructureLayerProps {
  scenario: InfrastructureScenario | null;
  roads: Road[];
}

export const InfrastructureLayer: React.FC<InfrastructureLayerProps> = ({
  scenario,
  roads
}) => {
  if (!scenario) return null;

  const targetRoad = roads.find(r => r.id === scenario.roadId);
  if (!targetRoad) return null;

  return (
    <>
      <Polyline
        positions={targetRoad.coordinates}
        pathOptions={{
          color: '#4AA3DF',
          weight: 12,
          opacity: 0.8,
          dashArray: '4, 8'
        }}
      >
        <Popup>
          <div className="p-2 max-w-xs text-xs font-sans">
            <div className="font-semibold text-[#4AA3DF] mb-1">
              Virtual Infrastructure Project
            </div>
            <div className="font-bold text-[#E8EDF2] mb-1">
              {scenario.name}
            </div>
            <p className="text-[#8B98A7] text-[11px] mb-2">
              {scenario.simulatedEffect}
            </p>
            <div className="font-mono text-[11px] bg-[#11161D] p-1.5 rounded border border-[#28313C] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8B98A7]">Throughput Gain:</span>
                <span className="text-[#35C98B]">+{scenario.throughputGainPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B98A7]">Delay Savings:</span>
                <span className="text-[#35C98B]">-{scenario.delayReductionMin} min</span>
              </div>
            </div>
          </div>
        </Popup>
      </Polyline>
    </>
  );
};
