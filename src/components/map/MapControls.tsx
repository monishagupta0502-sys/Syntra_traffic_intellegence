import React from 'react';
import { 
  Layers, 
  AlertTriangle, 
  AlertCircle, 
  Siren, 
  Wrench, 
  RotateCcw,
  Compass,
  MapPin,
  Globe,
  Radio
} from 'lucide-react';

interface LayerVisibility {
  traffic: boolean;
  incidents: boolean;
  bottlenecks: boolean;
  emergency: boolean;
  infrastructure: boolean;
}

interface MapControlsProps {
  layers: LayerVisibility;
  onToggleLayer: (layer: keyof LayerVisibility) => void;
  onResetView: () => void;
  onJumpDistrict?: (coords: [number, number], zoom: number) => void;
  activeScenarioName?: string;
  mapEngine?: 'google' | 'carto';
  onChangeMapEngine?: (engine: 'google' | 'carto') => void;
  googleTrafficEnabled?: boolean;
  onToggleGoogleTraffic?: () => void;
  mapStyleType?: 'dark' | 'roadmap' | 'satellite' | 'hybrid';
  onChangeMapStyleType?: (style: 'dark' | 'roadmap' | 'satellite' | 'hybrid') => void;
}

const HYDERABAD_DISTRICTS: { name: string; tag: string; coords: [number, number]; zoom: number }[] = [
  { name: 'Hitec City & Cyber Towers', tag: 'TECH CORRIDOR', coords: [17.4485, 78.3808], zoom: 14 },
  { name: 'Gachibowli & Financial District', tag: 'ORR EXPRESSWAY', coords: [17.4335, 78.3625], zoom: 14 },
  { name: 'Jubilee & Banjara Hills', tag: 'ROAD 36 / 45', coords: [17.4260, 78.4235], zoom: 14 },
  { name: 'Tank Bund & Secretariat', tag: 'CENTRAL HUB', coords: [17.4245, 78.4615], zoom: 14 }
];

export const MapControls: React.FC<MapControlsProps> = ({
  layers,
  onToggleLayer,
  onResetView,
  onJumpDistrict,
  mapEngine = 'google',
  onChangeMapEngine,
  googleTrafficEnabled = true,
  onToggleGoogleTraffic,
  mapStyleType = 'dark',
  onChangeMapStyleType
}) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-auto max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
      {/* Map Engine & Provider Switcher */}
      <div className="bg-[#151B23]/95 backdrop-blur-md border border-[#28313C] rounded-lg shadow-xl p-2.5 flex flex-col gap-1.5 w-56 text-[#E8EDF2]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#28313C]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B98A7]">
            <Globe className="w-3.5 h-3.5 text-[#4AA3DF]" />
            <span>Map Platform</span>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-mono text-[#35C98B] bg-[#35C98B]/10 px-1.5 py-0.5 rounded border border-[#35C98B]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35C98B] animate-pulse"></span>
            API KEY
          </span>
        </div>

        {/* Engine Toggle Buttons */}
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#11161D] rounded border border-[#28313C]">
          <button
            onClick={() => onChangeMapEngine && onChangeMapEngine('google')}
            className={`py-1 px-1.5 rounded text-[11px] font-medium transition-colors ${
              mapEngine === 'google'
                ? 'bg-[#1F2937] text-[#4AA3DF] shadow-sm'
                : 'text-[#8B98A7] hover:text-[#E8EDF2]'
            }`}
          >
            Google Maps
          </button>
          <button
            onClick={() => onChangeMapEngine && onChangeMapEngine('carto')}
            className={`py-1 px-1.5 rounded text-[11px] font-medium transition-colors ${
              mapEngine === 'carto'
                ? 'bg-[#1F2937] text-[#4AA3DF] shadow-sm'
                : 'text-[#8B98A7] hover:text-[#E8EDF2]'
            }`}
          >
            Carto Dark
          </button>
        </div>

        {/* Google Maps Specific Controls */}
        {mapEngine === 'google' && (
          <div className="space-y-1.5 pt-1 border-t border-[#28313C]">
            {/* Live Traffic Layer */}
            <button
              onClick={onToggleGoogleTraffic}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                googleTrafficEnabled 
                  ? 'bg-[#35C98B]/10 text-[#35C98B] border border-[#35C98B]/30' 
                  : 'bg-[#1A212B] text-[#5E6A78] hover:bg-[#11161D]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${googleTrafficEnabled ? 'text-[#35C98B] animate-pulse' : 'text-[#5E6A78]'}`} />
                <span className="font-medium">Google Live Traffic</span>
              </span>
              <span className="font-mono text-[10px]">
                {googleTrafficEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Map Styles Selector */}
            <div className="grid grid-cols-4 gap-1">
              {(['dark', 'roadmap', 'satellite', 'hybrid'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onChangeMapStyleType && onChangeMapStyleType(st)}
                  className={`py-1 rounded text-[10px] font-mono capitalize transition-colors ${
                    mapStyleType === st
                      ? 'bg-[#4AA3DF] text-[#0B0F14] font-semibold'
                      : 'bg-[#1A212B] text-[#8B98A7] hover:text-[#E8EDF2]'
                  }`}
                >
                  {st === 'dark' ? 'Dark' : st.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Control Card */}
      <div 
        id="map-layer-controls"
        className="bg-[#151B23]/95 backdrop-blur-md border border-[#28313C] rounded-lg shadow-xl p-2.5 flex flex-col gap-1.5 w-56 text-[#E8EDF2]"
      >
        <div className="flex items-center justify-between pb-1.5 border-b border-[#28313C] px-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B98A7]">
            <Layers className="w-3.5 h-3.5 text-[#4AA3DF]" />
            <span>Digital Twin Layers</span>
          </div>
          <button
            onClick={onResetView}
            title="Reset Map View to Hyderabad Network"
            aria-label="Reset Map View to Hyderabad Network"
            className="p-1 hover:bg-[#1A212B] text-[#8B98A7] hover:text-[#E8EDF2] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Toggles */}
        <button
          onClick={() => onToggleLayer('traffic')}
          className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
            layers.traffic 
              ? 'bg-[#1A212B] text-[#E8EDF2] border border-[#28313C]' 
              : 'text-[#5E6A78] hover:bg-[#11161D]'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${layers.traffic ? 'bg-[#35C98B]' : 'bg-[#5E6A78]'}`}></span>
            <span>Flow Vectors</span>
          </span>
          <span className="font-mono text-[10px] text-[#8B98A7]">
            {layers.traffic ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={() => onToggleLayer('incidents')}
          className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
            layers.incidents 
              ? 'bg-[#1A212B] text-[#E8EDF2] border border-[#28313C]' 
              : 'text-[#5E6A78] hover:bg-[#11161D]'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className={`w-3.5 h-3.5 ${layers.incidents ? 'text-[#E05A5A]' : 'text-[#5E6A78]'}`} />
            <span>Incidents</span>
          </span>
          <span className="font-mono text-[10px] text-[#8B98A7]">
            {layers.incidents ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={() => onToggleLayer('bottlenecks')}
          className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
            layers.bottlenecks 
              ? 'bg-[#1A212B] text-[#E8EDF2] border border-[#28313C]' 
              : 'text-[#5E6A78] hover:bg-[#11161D]'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className={`w-3.5 h-3.5 ${layers.bottlenecks ? 'text-[#E58B42]' : 'text-[#5E6A78]'}`} />
            <span>Bottlenecks</span>
          </span>
          <span className="font-mono text-[10px] text-[#8B98A7]">
            {layers.bottlenecks ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={() => onToggleLayer('emergency')}
          className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
            layers.emergency 
              ? 'bg-[#1A212B] text-[#E8EDF2] border border-[#28313C]' 
              : 'text-[#5E6A78] hover:bg-[#11161D]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Siren className={`w-3.5 h-3.5 ${layers.emergency ? 'text-[#4AA3DF]' : 'text-[#5E6A78]'}`} />
            <span>Priority Green</span>
          </span>
          <span className="font-mono text-[10px] text-[#8B98A7]">
            {layers.emergency ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={() => onToggleLayer('infrastructure')}
          className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
            layers.infrastructure 
              ? 'bg-[#1A212B] text-[#E8EDF2] border border-[#28313C]' 
              : 'text-[#5E6A78] hover:bg-[#11161D]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Wrench className={`w-3.5 h-3.5 ${layers.infrastructure ? 'text-[#35C98B]' : 'text-[#5E6A78]'}`} />
            <span>Virtual Infra</span>
          </span>
          <span className="font-mono text-[10px] text-[#8B98A7]">
            {layers.infrastructure ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Hyderabad Sector Jump Selector */}
      <div className="bg-[#151B23]/95 backdrop-blur-md border border-[#28313C] rounded-lg shadow-xl p-2.5 w-56 text-[#E8EDF2]">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#4AA3DF] uppercase tracking-wider mb-2">
          <MapPin className="w-3 h-3" />
          <span>Hyderabad Corridors</span>
        </div>
        <div className="space-y-1">
          {HYDERABAD_DISTRICTS.map((dst) => (
            <button
              key={dst.name}
              onClick={() => onJumpDistrict && onJumpDistrict(dst.coords, dst.zoom)}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-[#1A212B] transition-colors flex flex-col group"
            >
              <span className="text-xs font-semibold text-[#E8EDF2] group-hover:text-[#4AA3DF] truncate">
                {dst.name}
              </span>
              <span className="text-[9px] font-mono text-[#8B98A7]">
                {dst.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend Card */}
      <div className="bg-[#151B23]/95 backdrop-blur-md border border-[#28313C] rounded-lg shadow-xl p-2.5 w-56 text-[#E8EDF2]">
        <div className="text-[10px] font-mono text-[#8B98A7] uppercase tracking-wider mb-2">
          Congestion Spectrum
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-full bg-[#35C98B]"></span>
            <span className="text-[#8B98A7] text-[11px]">Normal (&gt;45 km/h)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-full bg-[#E7C65A]"></span>
            <span className="text-[#8B98A7] text-[11px]">Moderate (30-45 km/h)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-full bg-[#E58B42]"></span>
            <span className="text-[#8B98A7] text-[11px]">Heavy (15-30 km/h)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-full bg-[#E05A5A]"></span>
            <span className="text-[#8B98A7] text-[11px]">Severe Gridlock (&lt;15 km/h)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
