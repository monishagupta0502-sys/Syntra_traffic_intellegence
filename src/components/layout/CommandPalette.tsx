import React, { useState, useEffect } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Map as MapIcon, 
  Navigation,
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  FlaskConical, 
  Wrench, 
  Siren, 
  MonitorCheck, 
  BarChart3, 
  X,
  Sliders
} from 'lucide-react';
import { TabType } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  onSelectScenario: (scenario: string) => void;
  onToggleDemoMode: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectScenario,
  onToggleDemoMode
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'tab-overview', label: 'Go to Overview Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => onSelectTab('overview') },
    { id: 'tab-twin', label: 'Go to Digital Twin Map View', category: 'Navigation', icon: MapIcon, action: () => onSelectTab('digital-twin') },
    { id: 'tab-routes', label: 'Go to Optimal Route Navigator (Google + Twin)', category: 'Navigation', icon: Navigation, action: () => onSelectTab('optimal-route') },
    { id: 'tab-traffic', label: 'Go to Traffic Intelligence', category: 'Navigation', icon: Activity, action: () => onSelectTab('traffic') },
    { id: 'tab-forecast', label: 'Go to Predictive Forecasting', category: 'Navigation', icon: TrendingUp, action: () => onSelectTab('forecast') },
    { id: 'tab-incidents', label: 'Go to Incidents Center', category: 'Navigation', icon: AlertTriangle, action: () => onSelectTab('incidents') },
    { id: 'tab-simulations', label: 'Go to What-If Simulation Engine', category: 'Navigation', icon: FlaskConical, action: () => onSelectTab('simulations') },
    { id: 'tab-infra', label: 'Go to Infrastructure Lab', category: 'Navigation', icon: Wrench, action: () => onSelectTab('infrastructure') },
    { id: 'tab-emergency', label: 'Go to Emergency Response Simulation', category: 'Navigation', icon: Siren, action: () => onSelectTab('emergency') },
    { id: 'tab-control', label: 'Go to Virtual Control Room', category: 'Navigation', icon: MonitorCheck, action: () => onSelectTab('control-room') },
    { id: 'tab-analytics', label: 'Go to Analytics & Metrics', category: 'Navigation', icon: BarChart3, action: () => onSelectTab('analytics') },
    { id: 'sim-closure', label: 'Simulate Road Closure: Market Street', category: 'What-If Simulations', icon: FlaskConical, action: () => { onSelectScenario('ROAD_CLOSURE'); onSelectTab('simulations'); } },
    { id: 'sim-diversion', label: 'Simulate Diversion Route Alpha', category: 'What-If Simulations', icon: Sliders, action: () => { onSelectScenario('DIVERSION'); onSelectTab('simulations'); } },
    { id: 'sim-lane', label: 'Simulate +1 Lane Infrastructure Expansion', category: 'What-If Simulations', icon: Wrench, action: () => { onSelectScenario('EXTRA_LANE'); onSelectTab('infrastructure'); } },
    { id: 'sim-emg', label: 'Simulate Trauma Priority Route (Green Wave)', category: 'What-If Simulations', icon: Siren, action: () => { onSelectScenario('EMERGENCY_RESPONSE'); onSelectTab('emergency'); } },
    { id: 'toggle-demo', label: 'Toggle Deterministic Demo Mode', category: 'System', icon: Activity, action: onToggleDemoMode }
  ];

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150">
      <div 
        id="command-palette-modal"
        className="w-full max-w-xl bg-[#151B23] border border-[#28313C] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search header */}
        <div className="flex items-center px-4 border-b border-[#28313C] bg-[#11161D]">
          <Search className="w-4 h-4 text-[#8B98A7] mr-2" />
          <input
            type="text"
            placeholder="Type a command or jump to screen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent py-3 text-sm text-[#E8EDF2] focus:outline-none placeholder:text-[#5E6A78]"
          />
          <button
            onClick={onClose}
            className="text-[#8B98A7] hover:text-[#E8EDF2] p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5E6A78]">
              No matching operations found.
            </div>
          ) : (
            filtered.map(cmd => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-xs text-[#8B98A7] hover:text-[#E8EDF2] hover:bg-[#1A212B] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#4AA3DF]" />
                    <span>{cmd.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5E6A78] uppercase">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 bg-[#11161D] border-t border-[#28313C] flex items-center justify-between text-[11px] font-mono text-[#5E6A78]">
          <div className="flex items-center gap-2">
            <span>[↑↓] to navigate</span>
            <span>•</span>
            <span>[Enter] to select</span>
          </div>
          <span>[Esc] to dismiss</span>
        </div>
      </div>
    </div>
  );
};
