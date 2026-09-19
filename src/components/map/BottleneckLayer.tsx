import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Bottleneck } from '../../types';
import { Layers, AlertCircle } from 'lucide-react';

interface BottleneckLayerProps {
  bottlenecks: Bottleneck[];
}

const createBottleneckIcon = (severity: Bottleneck['severity']) => {
  const color = severity === 'critical' ? '#E05A5A' : '#E58B42';

  return L.divIcon({
    className: 'custom-bottleneck-marker',
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 18px; height: 18px; transform: rotate(45deg); background-color: #151B23; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">
          <div style="width: 6px; height: 6px; background-color: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export const BottleneckLayer: React.FC<BottleneckLayerProps> = ({ bottlenecks }) => {
  return (
    <>
      {bottlenecks.map(btn => (
        <Marker
          key={btn.id}
          position={btn.location}
          icon={createBottleneckIcon(btn.severity)}
        >
          <Popup>
            <div className="p-2 max-w-xs text-xs font-sans">
              <div className="flex items-center gap-1.5 font-semibold text-[#E58B42] mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Bottleneck Hotspot [{btn.id}]</span>
              </div>
              <div className="text-[#E8EDF2] font-medium mb-1">
                {btn.roadName}
              </div>
              <p className="text-[#8B98A7] text-[11px] mb-2">
                {btn.reason}
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-[#11161D] p-2 rounded border border-[#28313C]">
                <div>
                  <span className="text-[#8B98A7] block text-[10px]">Queue Spillback</span>
                  <span className="text-[#E8EDF2] font-semibold">{btn.queueLengthM}m</span>
                </div>
                <div>
                  <span className="text-[#8B98A7] block text-[10px]">Added Delay</span>
                  <span className="text-[#E05A5A] font-semibold">+{btn.delayMinutes} min</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
