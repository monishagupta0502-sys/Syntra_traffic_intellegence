import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import { Road } from '../../types';

interface RoadLayerProps {
  roads: Road[];
  selectedRoad: Road | null;
  onSelectRoad: (road: Road) => void;
  showCongestionColors?: boolean;
}

export const RoadLayer: React.FC<RoadLayerProps> = ({
  roads,
  selectedRoad,
  onSelectRoad,
  showCongestionColors = true
}) => {
  const getColor = (road: Road) => {
    if (!showCongestionColors) return '#4AA3DF';
    switch (road.congestionLevel) {
      case 'normal':
        return '#35C98B'; // Traffic green
      case 'moderate':
        return '#E7C65A'; // Traffic yellow
      case 'heavy':
        return '#E58B42'; // Traffic orange
      case 'severe':
        return '#E05A5A'; // Traffic red
      default:
        return '#4AA3DF';
    }
  };

  return (
    <>
      {roads.map(road => {
        const isSelected = selectedRoad?.id === road.id;
        const color = getColor(road);

        return (
          <React.Fragment key={road.id}>
            {/* Wider transparent polyline for easier click target */}
            <Polyline
              positions={road.coordinates}
              pathOptions={{
                color: 'transparent',
                weight: 18,
                lineCap: 'round',
                lineJoin: 'round'
              }}
              eventHandlers={{
                click: () => onSelectRoad(road)
              }}
            />

            {/* Selection halo */}
            {isSelected && (
              <Polyline
                positions={road.coordinates}
                pathOptions={{
                  color: '#4AA3DF',
                  weight: 10,
                  opacity: 0.6,
                  lineCap: 'round'
                }}
              />
            )}

            {/* Core road line */}
            <Polyline
              positions={road.coordinates}
              pathOptions={{
                color: color,
                weight: isSelected ? 6 : Math.max(3, road.lanes + 1.5),
                opacity: isSelected ? 1.0 : 0.85,
                lineCap: 'round',
                lineJoin: 'round'
              }}
              eventHandlers={{
                click: () => onSelectRoad(road)
              }}
            >
              <Tooltip sticky direction="top" className="custom-leaflet-tooltip">
                <div className="text-xs font-sans p-1">
                  <div className="font-semibold text-[#E8EDF2] flex items-center justify-between gap-2">
                    <span>{road.name}</span>
                    <span className="font-mono text-[10px] text-[#4AA3DF]">{road.id}</span>
                  </div>
                  <div className="text-[#8B98A7] flex items-center gap-2 mt-1">
                    <span>Speed: <strong className="text-[#E8EDF2] font-mono">{road.currentSpeed} km/h</strong></span>
                    <span>•</span>
                    <span>Flow: <strong className="text-[#E8EDF2] font-mono">{road.flow} v/h</strong></span>
                  </div>
                  <div className="text-[10px] text-[#5E6A78] mt-0.5">
                    Click to inspect telemetry & what-if options
                  </div>
                </div>
              </Tooltip>
            </Polyline>
          </React.Fragment>
        );
      })}
    </>
  );
};
