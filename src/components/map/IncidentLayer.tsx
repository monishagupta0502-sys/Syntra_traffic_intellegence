import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Incident } from '../../types';
import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

interface IncidentLayerProps {
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
}

// Custom Leaflet DivIcon for Incidents
const createIncidentIcon = (severity: Incident['severity']) => {
  const color = severity === 'critical' || severity === 'high' ? '#E05A5A' : '#E7C65A';
  
  return L.divIcon({
    className: 'custom-incident-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background-color: ${color}; opacity: 0.25; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 20px; height: 20px; border-radius: 50%; background-color: #151B23; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.8);">
          <div style="width: 6px; height: 6px; border-radius: 50%; background-color: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

export const IncidentLayer: React.FC<IncidentLayerProps> = ({ 
  incidents, 
  onSelectIncident 
}) => {
  return (
    <>
      {incidents.map(incident => (
        <Marker
          key={incident.id}
          position={incident.location}
          icon={createIncidentIcon(incident.severity)}
          eventHandlers={{
            click: () => onSelectIncident && onSelectIncident(incident)
          }}
        >
          <Popup className="custom-incident-popup">
            <div className="p-2 max-w-xs text-xs font-sans">
              <div className="flex items-center gap-1.5 font-semibold text-[#E05A5A] mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{incident.type} (Simulated)</span>
              </div>
              <div className="text-[#E8EDF2] font-medium mb-1">
                {incident.roadName}
              </div>
              <p className="text-[#8B98A7] text-[11px] mb-2 leading-relaxed">
                {incident.description}
              </p>
              <div className="space-y-1 font-mono text-[10px] text-[#5E6A78] border-t border-[#28313C] pt-1.5">
                <div className="flex items-center justify-between">
                  <span>Detected:</span>
                  <span className="text-[#8B98A7]">{incident.detectedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Duration:</span>
                  <span className="text-[#8B98A7]">{incident.estimatedDuration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Detection Source:</span>
                  <span className="text-[#4AA3DF]">{incident.reportedBy}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
