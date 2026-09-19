import React from 'react';
import { 
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
  Network
} from 'lucide-react';

export type TabType = 
  | 'overview' 
  | 'digital-twin' 
  | 'optimal-route'
  | 'traffic' 
  | 'forecast' 
  | 'incidents' 
  | 'simulations' 
  | 'infrastructure' 
  | 'emergency' 
  | 'control-room' 
  | 'analytics';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Digital Twin', icon: MapIcon, badge: 'MAP' },
    { id: 'optimal-route', label: 'Optimal Route', icon: Navigation, badge: 'NAV' },
    { id: 'traffic', label: 'Traffic Intelligence', icon: Activity },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: '3' },
    { id: 'simulations', label: 'What-If Engine', icon: FlaskConical, badge: 'CORE' },
    { id: 'infrastructure', label: 'Infrastructure Lab', icon: Wrench },
    { id: 'emergency', label: 'Emergency Response', icon: Siren },
    { id: 'control-room', label: 'Virtual Control Room', icon: MonitorCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <aside 
      id="syntra-sidebar"
      className="w-64 bg-[#11161D] border-r border-[#28313C] flex flex-col justify-between shrink-0 select-none z-20"
    >
      {/* Navigation list */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#5E6A78]">
          Operations Console
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#1A212B] text-[#E8EDF2] border-l-2 border-[#4AA3DF]'
                  : 'text-[#8B98A7] hover:bg-[#151B23] hover:text-[#E8EDF2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#4AA3DF]' : 'text-[#8B98A7]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive 
                    ? 'bg-[#4AA3DF]/20 text-[#4AA3DF]' 
                    : 'bg-[#1A212B] text-[#8B98A7] border border-[#28313C]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Network Telemetry Status Card */}
      <div className="p-3 border-t border-[#28313C] bg-[#0B0F14]/50 space-y-2.5">
        <div className="flex items-center gap-2.5 p-2 rounded bg-[#151B23] border border-[#28313C]">
          <img 
            src="/syntra-icon.jpg" 
            alt="SYNTRA" 
            className="w-7 h-7 rounded-md object-cover border border-[#28313C] shrink-0 shadow-sm" 
          />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-[#E8EDF2] font-mono leading-tight">
              SYNTRA
            </div>
            <div className="text-[9px] text-[#4AA3DF] font-mono tracking-wider truncate">
              TRAFFIC INTELLIGENCE
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded bg-[#151B23] border border-[#28313C] text-[11px] font-mono">
          <div className="flex items-center justify-between text-[#8B98A7] mb-1.5">
            <span className="flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#4AA3DF]" />
              <span>TWIN TOPOLOGY</span>
            </span>
            <span className="text-[#35C98B]">SYNCED</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-[#5E6A78] border-t border-[#28313C] pt-1.5">
            <div>Edges: <strong className="text-[#E8EDF2]">14 Sectors</strong></div>
            <div>Junctions: <strong className="text-[#E8EDF2]">28 Nodes</strong></div>
            <div>Vehicles: <strong className="text-[#E8EDF2]">1,942</strong></div>
            <div>Physics: <strong className="text-[#E8EDF2]">SUMO CF</strong></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
