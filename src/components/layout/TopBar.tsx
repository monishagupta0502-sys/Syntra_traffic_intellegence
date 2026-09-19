import React from 'react';
import { 
  Activity, 
  Cpu, 
  Radio, 
  Clock, 
  Command, 
  Play, 
  Pause, 
  FastForward,
  ChevronDown
} from 'lucide-react';
import { ControlRoomStatus } from '../../types';

interface TopBarProps {
  status: ControlRoomStatus;
  currentScenario: string;
  onSelectScenario: (scenario: string) => void;
  onToggleDemoMode: () => void;
  onOpenCommandPalette: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  simSpeed: number;
  onChangeSimSpeed: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  status,
  currentScenario,
  onSelectScenario,
  onToggleDemoMode,
  onOpenCommandPalette,
  isPlaying,
  onTogglePlay,
  simSpeed,
  onChangeSimSpeed
}) => {
  const scenarioOptions = [
    { value: 'NORMAL_TRAFFIC', label: 'Baseline: Hyderabad Metro Network' },
    { value: 'PEAK_TRAFFIC', label: 'Peak Hour Tech Commute Surge' },
    { value: 'HEAVY_CONGESTION', label: 'Hitec City - Madhapur Gridlock' },
    { value: 'ROAD_INCIDENT', label: 'Active Collision: Cable Bridge' },
    { value: 'ROAD_CLOSURE', label: 'What-If: Cyber Towers Closure' },
    { value: 'EXTRA_LANE', label: 'Infrastructure: +1 Lane Capacity' },
    { value: 'DIVERSION', label: 'ORR Financial District Bypass' },
    { value: 'EMERGENCY_RESPONSE', label: 'Trauma Green Wave: AIG to NIMS' }
  ];

  return (
    <header 
      id="syntra-topbar"
      className="h-14 bg-[#11161D] border-b border-[#28313C] px-4 flex items-center justify-between z-30 shrink-0 select-none"
    >
      {/* Brand Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img 
            src="/syntra-icon.jpg" 
            alt="SYNTRA Logo" 
            className="w-9 h-9 rounded-lg object-cover border border-[#28313C] shadow-md shadow-cyan-950/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-sm text-[#E8EDF2] font-mono">
                SYNTRA
              </span>
              <span className="text-[10px] bg-[#1A212B] text-[#4AA3DF] px-1.5 py-0.2 rounded border border-[#28313C] font-mono">
                v2.4-TWIN
              </span>
              <span className="text-[10px] bg-[#1A212B] text-[#35C98B] px-1.5 py-0.2 rounded border border-[#28313C] font-mono hidden sm:inline">
                HYDERABAD
              </span>
            </div>
            <div className="text-[9px] text-[#4AA3DF] tracking-wider uppercase font-mono font-medium hidden md:block">
              AI-POWERED TRAFFIC INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-[#28313C] hidden sm:block"></div>

        {/* Scenario Selector */}
        <div className="relative hidden lg:flex items-center">
          <label htmlFor="scenario-select" className="text-xs text-[#8B98A7] mr-2 flex items-center gap-1 font-mono">
            <Radio className="w-3 h-3 text-[#4AA3DF]" />
            <span>SCENARIO:</span>
          </label>
          <div className="relative">
            <select
              id="scenario-select"
              value={currentScenario}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-[#151B23] border border-[#28313C] text-xs text-[#E8EDF2] rounded px-2.5 py-1.5 pr-7 appearance-none cursor-pointer hover:border-[#4AA3DF]/60 focus:outline-none focus:border-[#4AA3DF] transition-colors font-mono"
            >
              {scenarioOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#151B23] text-[#E8EDF2]">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8B98A7] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Center Simulation Clock & Speed */}
      <div className="hidden xl:flex items-center gap-3 bg-[#151B23] border border-[#28313C] rounded px-3 py-1">
        <div className="flex items-center gap-1.5 text-xs text-[#8B98A7] font-mono">
          <Clock className="w-3.5 h-3.5 text-[#4AA3DF]" />
          <span className="text-[#E8EDF2]">{status.simTime}</span>
        </div>
        <div className="h-3.5 w-px bg-[#28313C]"></div>
        <div className="flex items-center gap-1">
          <button
            id="sim-play-pause-btn"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            className="p-1 rounded text-[#8B98A7] hover:text-[#E8EDF2] hover:bg-[#1A212B] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            id="sim-speed-btn"
            onClick={onChangeSimSpeed}
            title="Toggle Speed"
            className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#8B98A7] hover:text-[#4AA3DF] hover:bg-[#1A212B] transition-colors flex items-center gap-0.5"
          >
            <FastForward className="w-3 h-3" />
            <span>{simSpeed}x</span>
          </button>
        </div>
      </div>

      {/* Right Controls: SUMO Status, Demo Badge, Command Palette */}
      <div className="flex items-center gap-2.5">
        {/* SUMO Engine Status Indicator (Truth in simulation) */}
        <div 
          id="sumo-engine-status-badge"
          title={status.sumoStatus === 'CONNECTED' ? 'SUMO TraCI socket active' : 'SUMO native engine offline (calibrated physics standby)'}
          className={`flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded border transition-colors ${
            status.sumoStatus === 'CONNECTED'
              ? 'bg-[#35C98B]/10 text-[#35C98B] border-[#35C98B]/30'
              : 'bg-[#151B23] text-[#8B98A7] border-[#28313C]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SUMO:</span>
          <span>{status.sumoStatus === 'CONNECTED' ? 'ONLINE' : 'STANDBY'}</span>
        </div>

        {/* DEMO MODE Badge */}
        <button
          id="demo-mode-toggle-btn"
          onClick={onToggleDemoMode}
          title="Toggle deterministic presentation mode"
          className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded border bg-[#4AA3DF]/10 text-[#4AA3DF] border-[#4AA3DF]/30 hover:bg-[#4AA3DF]/20 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4AA3DF] animate-pulse"></span>
          <span>DEMO MODE</span>
        </button>

        {/* Command Palette Trigger */}
        <button
          id="command-palette-btn"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 bg-[#151B23] hover:bg-[#1A212B] border border-[#28313C] text-xs text-[#8B98A7] hover:text-[#E8EDF2] px-2.5 py-1.5 rounded transition-colors"
          title="Open Command Palette (Cmd + K)"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px] font-mono">⌘K</span>
        </button>
      </div>
    </header>
  );
};
