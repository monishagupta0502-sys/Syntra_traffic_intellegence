import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  Pause, 
  FastForward, 
  X, 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  GitMerge, 
  Car, 
  Siren, 
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Share2,
  Search,
  Crosshair,
  Building2,
  Hospital,
  Plane,
  Bus,
  Bike,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Shield,
  Zap,
  Info,
  Phone,
  AlertOctagon,
  Activity,
  Check,
  Copy,
  Radio,
  LifeBuoy
} from 'lucide-react';
import { 
  Road, 
  Incident, 
  Bottleneck, 
  RouteOption, 
  RouteStep, 
  LocationPoint, 
  NavigationState,
  ManeuverType 
} from '../../types';
import { 
  HYDERABAD_LANDMARKS, 
  calculateOptimalRoutes 
} from '../../services/router';

interface RoutePlannerProps {
  roads: Road[];
  incidents: Incident[];
  bottlenecks: Bottleneck[];
  activeRoute: RouteOption | null;
  alternativeRoutes: RouteOption[];
  onSelectRoute: (route: RouteOption) => void;
  onRoutesCalculated: (routes: RouteOption[], origin: LocationPoint, destination: LocationPoint) => void;
  navigationState: NavigationState | null;
  onUpdateNavigationState: (state: NavigationState | null) => void;
  onClose?: () => void;
  isSidebarMode?: boolean;
  onReportIncident?: (incident: Incident) => void;
}

export const RoutePlannerDrawer: React.FC<RoutePlannerProps> = ({
  roads,
  incidents,
  bottlenecks,
  activeRoute,
  alternativeRoutes,
  onSelectRoute,
  onRoutesCalculated,
  navigationState,
  onUpdateNavigationState,
  onClose,
  isSidebarMode = false,
  onReportIncident
}) => {
  const [origin, setOrigin] = useState<LocationPoint>(HYDERABAD_LANDMARKS[0]); // Cyber Towers
  const [destination, setDestination] = useState<LocationPoint>(HYDERABAD_LANDMARKS[4]); // Banjara Hills
  const [mode, setMode] = useState<'driving' | 'emergency' | 'transit' | 'bike'>('driving');
  
  // Search & Autocomplete state
  const [originQuery, setOriginQuery] = useState(origin.name);
  const [destQuery, setDestQuery] = useState(destination.name);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // Preference options
  const [avoidBottlenecks, setAvoidBottlenecks] = useState(true);
  const [avoidIncidents, setAvoidIncidents] = useState(true);
  const [preferExpressways, setPreferExpressways] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);

  // Emergency SOS State
  const [isSosActive, setIsSosActive] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(180); // 3 mins ETA
  const [sosDispatchedHospital, setSosDispatchedHospital] = useState('AIG Hospitals Emergency & Trauma');
  const [sosDistanceKm, setSosDistanceKm] = useState(1.4);
  const [sosIncidentReported, setSosIncidentReported] = useState(false);
  const [copiedGps, setCopiedGps] = useState(false);

  // Top Trauma Centers in Hyderabad for nearest ambulance dispatch
  const HYDERABAD_TRAUMA_HOSPITALS = [
    { name: 'AIG Hospitals Emergency & Trauma Center', coordinates: [17.4410, 78.3620] as [number, number], area: 'Gachibowli' },
    { name: 'Apollo Hospitals Emergency & Trauma Care', coordinates: [17.4285, 78.4140] as [number, number], area: 'Jubilee Hills' },
    { name: 'NIMS Hospital Emergency Trauma Care', coordinates: [17.4230, 78.4520] as [number, number], area: 'Punjagutta' },
    { name: 'Care Hospital Emergency Department', coordinates: [17.4145, 78.4410] as [number, number], area: 'Banjara Hills' },
    { name: 'Continental Hospitals 24/7 Emergency', coordinates: [17.4235, 78.3485] as [number, number], area: 'Financial District' }
  ];

  // SOS Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (isSosActive && sosCountdown > 15) {
      timer = setInterval(() => {
        setSosCountdown(prev => Math.max(15, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSosActive, sosCountdown]);

  // Trigger emergency SOS dispatch to ambulance
  const handleTriggerSOS = () => {
    // Audio synthesizer alert beacon
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.setValueAtTime(660, audioCtx.currentTime + 0.15);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }

    const currentPos = navigationState?.currentPosition || origin.coordinates;
    
    // Find nearest trauma hospital
    let nearest = HYDERABAD_TRAUMA_HOSPITALS[0];
    let minDist = Infinity;
    HYDERABAD_TRAUMA_HOSPITALS.forEach(h => {
      const d = Math.sqrt(
        Math.pow(h.coordinates[0] - currentPos[0], 2) +
        Math.pow(h.coordinates[1] - currentPos[1], 2)
      ) * 111;
      if (d < minDist) {
        minDist = d;
        nearest = h;
      }
    });

    setSosDispatchedHospital(nearest.name);
    setSosDistanceKm(Number(minDist.toFixed(1)));
    setIsSosActive(true);
    setShowSosModal(true);
    setSosCountdown(180);

    // Auto-log incident to digital twin
    if (onReportIncident && !sosIncidentReported) {
      const currentRoad = activeRoute?.steps[navigationState?.currentStepIndex || 0]?.roadName || 'Highway Corridor';
      const newInc: Incident = {
        id: `inc-sos-${Date.now()}`,
        type: 'Possible Accident',
        severity: 'critical',
        roadId: 'R-ACCIDENT-SOS',
        roadName: currentRoad,
        location: currentPos,
        detectedTime: 'Just now',
        estimatedDuration: '45 mins',
        affectedRoads: [currentRoad],
        status: 'Active',
        description: `High-priority accident reported via In-Vehicle Emergency SOS. 108 Ambulance dispatched from ${nearest.name}.`,
        reportedBy: 'In-Vehicle Emergency SOS (108 EMRI)'
      };
      onReportIncident(newInc);
      setSosIncidentReported(true);
    }
  };

  const handleCancelSOS = () => {
    setIsSosActive(false);
    setShowSosModal(false);
  };

  const handleCopyGps = () => {
    const pos = navigationState?.currentPosition || origin.coordinates;
    const road = activeRoute?.steps[navigationState?.currentStepIndex || 0]?.roadName || 'Corridor';
    const text = `EMERGENCY ALERT: Road accident on ${road}, Hyderabad. GPS Location: ${pos[0].toFixed(5)}, ${pos[1].toFixed(5)}. 108 Ambulance dispatched.`;
    navigator.clipboard.writeText(text);
    setCopiedGps(true);
    setTimeout(() => setCopiedGps(false), 2500);
  };

  // Sync text inputs when origin/dest objects change
  useEffect(() => {
    setOriginQuery(origin.name);
  }, [origin]);

  useEffect(() => {
    setDestQuery(destination.name);
  }, [destination]);

  // Compute optimal routes
  const computeRoutes = async (orig: LocationPoint, dest: LocationPoint) => {
    setIsCalculating(true);
    try {
      const routes = await calculateOptimalRoutes(
        orig.coordinates,
        dest.coordinates,
        roads,
        incidents,
        bottlenecks,
        {
          avoidBottlenecks,
          avoidIncidents,
          preferExpressways
        }
      );
      if (routes.length > 0) {
        onRoutesCalculated(routes, orig, dest);
        onSelectRoute(routes[0]);
      }
    } catch (err) {
      console.error('Error calculating routes:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Initial calculation
  useEffect(() => {
    if (!activeRoute) {
      computeRoutes(origin, destination);
    }
  }, []);

  // Swap endpoints
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    computeRoutes(destination, temp);
  };

  // Quick preset landmark clicked
  const handleQuickDestination = (loc: LocationPoint) => {
    setDestination(loc);
    setDestQuery(loc.name);
    setShowDestDropdown(false);
    computeRoutes(origin, loc);
  };

  // Set Origin as "Current Operations HQ"
  const handleUseMyLocation = () => {
    const cyberTowers = HYDERABAD_LANDMARKS[0];
    setOrigin(cyberTowers);
    setOriginQuery(cyberTowers.name);
    setShowOriginDropdown(false);
    computeRoutes(cyberTowers, destination);
  };

  // Navigation simulation loop
  useEffect(() => {
    if (!navigationState?.isNavigating || navigationState.isPaused || !activeRoute) return;

    const intervalTime = Math.max(80, 800 / navigationState.speedMultiplier);
    const totalPoints = activeRoute.pathCoordinates.length;

    const timer = setInterval(() => {
      onUpdateNavigationState({
        ...navigationState,
        progressPct: Math.min(100, navigationState.progressPct + 1.5 * navigationState.speedMultiplier),
        currentPosition: (() => {
          const nextIndex = Math.min(
            totalPoints - 1,
            Math.floor(((navigationState.progressPct + 1.5 * navigationState.speedMultiplier) / 100) * totalPoints)
          );
          return activeRoute.pathCoordinates[nextIndex] || activeRoute.pathCoordinates[totalPoints - 1];
        })(),
        remainingDistanceKm: Math.max(
          0,
          Number((activeRoute.distanceKm * (1 - navigationState.progressPct / 100)).toFixed(1))
        ),
        remainingDurationMin: Math.max(
          0,
          Math.round(activeRoute.durationMin * (1 - navigationState.progressPct / 100))
        ),
        currentStepIndex: Math.min(
          activeRoute.steps.length - 1,
          Math.floor((navigationState.progressPct / 100) * activeRoute.steps.length)
        )
      });

      if (navigationState.progressPct >= 100) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [navigationState, activeRoute]);

  const handleStartNavigation = () => {
    if (!activeRoute) return;
    onUpdateNavigationState({
      isNavigating: true,
      activeRouteId: activeRoute.id,
      currentStepIndex: 0,
      progressPct: 0,
      currentSpeedKmh: activeRoute.steps[0]?.speedKmh || 48,
      remainingDistanceKm: activeRoute.distanceKm,
      remainingDurationMin: activeRoute.durationMin,
      currentPosition: activeRoute.pathCoordinates[0] || origin.coordinates,
      isPaused: false,
      speedMultiplier: 1
    });
  };

  const handleStopNavigation = () => {
    onUpdateNavigationState(null);
  };

  const handleTogglePause = () => {
    if (!navigationState) return;
    onUpdateNavigationState({
      ...navigationState,
      isPaused: !navigationState.isPaused
    });
  };

  const handleCycleSpeed = () => {
    if (!navigationState) return;
    const nextSpeed = navigationState.speedMultiplier === 1 ? 2 : navigationState.speedMultiplier === 2 ? 5 : 1;
    onUpdateNavigationState({
      ...navigationState,
      speedMultiplier: nextSpeed
    });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'tech_park':
        return <Building2 className="w-3.5 h-3.5 text-[#388BFD]" />;
      case 'hospital':
        return <Hospital className="w-3.5 h-3.5 text-[#E05A5A]" />;
      case 'transit':
        return <Plane className="w-3.5 h-3.5 text-[#FFA116]" />;
      case 'landmark':
        return <Sparkles className="w-3.5 h-3.5 text-[#A371F7]" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-[#8B98A7]" />;
    }
  };

  const renderManeuverIcon = (maneuver: ManeuverType, className = 'w-5 h-5') => {
    switch (maneuver) {
      case 'turn-left':
      case 'turn-slight-left':
      case 'turn-sharp-left':
        return <CornerUpLeft className={className} />;
      case 'turn-right':
      case 'turn-slight-right':
      case 'turn-sharp-right':
        return <CornerUpRight className={className} />;
      case 'merge':
      case 'ramp-right':
      case 'ramp-left':
        return <GitMerge className={className} />;
      case 'destination':
        return <MapPin className={className} />;
      default:
        return <ArrowUp className={className} />;
    }
  };

  // Filter landmarks for search autocomplete
  const filteredOrigins = HYDERABAD_LANDMARKS.filter(l => 
    l.name.toLowerCase().includes(originQuery.toLowerCase()) || 
    l.address.toLowerCase().includes(originQuery.toLowerCase())
  );

  const filteredDests = HYDERABAD_LANDMARKS.filter(l => 
    l.name.toLowerCase().includes(destQuery.toLowerCase()) || 
    l.address.toLowerCase().includes(destQuery.toLowerCase())
  );

  // Compute live ETA timestamp
  const getArrivalTime = (durationMinutes: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + durationMinutes);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ----------------------------------------------------
  // Active Navigation Mode: Google Maps Turn-by-Turn HUD
  // ----------------------------------------------------
  if (navigationState?.isNavigating && activeRoute) {
    const currentStep = activeRoute.steps[navigationState.currentStepIndex] || activeRoute.steps[0];
    const nextStep = activeRoute.steps[navigationState.currentStepIndex + 1];
    const isFinished = navigationState.progressPct >= 100;

    return (
      <div className="absolute inset-0 z-[500] pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none font-sans">
        {/* Top Google Maps Dark Navigation Header */}
        <div className="w-full max-w-xl mx-auto pointer-events-auto animate-in slide-in-from-top-4 duration-300 flex flex-col gap-2.5">
          {/* Active Emergency SOS Alert Banner */}
          {isSosActive && (
            <div 
              onClick={() => setShowSosModal(true)}
              className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white p-3.5 rounded-2xl shadow-2xl shadow-red-900/70 border border-red-400 flex items-center justify-between cursor-pointer animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                  <Siren className="w-5 h-5 text-yellow-300 animate-spin" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider uppercase font-mono flex items-center gap-2">
                    <span>108 AMBULANCE DISPATCHED</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400 text-black font-extrabold font-sans">
                      EN ROUTE
                    </span>
                  </div>
                  <div className="text-[11px] text-white/90 font-medium">
                    From {sosDispatchedHospital.split(' ')[0]} • ETA ~{Math.ceil(sosCountdown / 60)} min • Signal Green Wave Active
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold bg-white/25 hover:bg-white/35 px-2.5 py-1 rounded-lg transition-colors">
                View Tracker
              </span>
            </div>
          )}

          {/* Main Navigation Card */}
          <div className="bg-[#0D5936] text-white rounded-2xl shadow-2xl shadow-black/80 border border-[#1A7F4E] overflow-hidden">
            <div className="p-4 flex items-start gap-4">
              {/* Maneuver Arrow Box */}
              <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0 shadow-inner">
                {renderManeuverIcon(currentStep.maneuver, 'w-8 h-8 text-white')}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200 font-mono">
                    {isFinished ? 'Destination Reached' : `In ${Math.max(50, Math.round(currentStep.distanceKm * 1000))} m`}
                  </span>

                  <div className="flex items-center gap-2 text-xs text-emerald-100">
                    {/* Top Emergency SOS Button */}
                    <button
                      onClick={handleTriggerSOS}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all transform active:scale-95 ${
                        isSosActive 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black border border-amber-300 animate-pulse shadow-amber-500/40' 
                          : 'bg-[#E05A5A] hover:bg-[#C93B3B] text-white shadow-red-600/50 border border-red-300 animate-pulse'
                      }`}
                      title="Emergency SOS: Instant Alert to 108 Ambulance"
                    >
                      <Siren className="w-4 h-4" />
                      <span>{isSosActive ? 'SOS ACTIVE' : 'SOS AMBULANCE'}</span>
                    </button>

                    <button 
                      onClick={() => setVoiceMuted(!voiceMuted)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      title={voiceMuted ? 'Unmute Audio Guidance' : 'Mute Audio Guidance'}
                    >
                      {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={handleStopNavigation}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      title="Exit Navigation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-lg md:text-xl font-bold text-white mt-1 leading-snug">
                  {isFinished ? `You have arrived at ${destination.name}` : currentStep.instruction}
                </div>

                <div className="text-xs text-emerald-100/90 mt-1 flex items-center gap-2">
                  <span>Onto <strong className="text-white">{currentStep.roadName}</strong></span>
                  <span>•</span>
                  <span>Flow: <strong className="text-emerald-300">{currentStep.speedKmh} km/h</strong></span>
                </div>
              </div>
            </div>

            {/* Next Turn Preview Bar */}
            {nextStep && !isFinished && (
              <div className="bg-[#0A472B] px-4 py-2 text-xs text-emerald-200/90 flex items-center gap-2 border-t border-white/10">
                <span className="text-white/60">Then:</span>
                <span className="text-white font-medium truncate">{nextStep.instruction}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Floating Navigation Status Dock */}
        <div className="w-full max-w-2xl mx-auto pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#11161F]/95 backdrop-blur-md rounded-2xl p-4 border border-[#252E3B] shadow-2xl flex items-center justify-between">
            {/* ETA & Remaining Time */}
            <div className="flex items-center gap-5">
              <div>
                <div className="text-3xl font-extrabold font-mono text-[#35C98B] flex items-baseline gap-1">
                  {navigationState.remainingDurationMin}
                  <span className="text-sm font-sans font-medium text-[#8B98A7]">min</span>
                </div>
                <div className="text-xs text-[#8B98A7] flex items-center gap-2 font-mono mt-0.5">
                  <span>{navigationState.remainingDistanceKm} km</span>
                  <span>•</span>
                  <span className="text-[#E8EDF2] font-semibold">{getArrivalTime(navigationState.remainingDurationMin)}</span>
                </div>
              </div>

              <div className="h-9 w-px bg-[#252E3B] hidden sm:block"></div>

              {/* Speedometer */}
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-full border-2 border-[#388BFD] bg-[#161D26] flex flex-col items-center justify-center font-mono">
                  <span className="text-sm font-bold text-[#E8EDF2] leading-none">{navigationState.currentSpeedKmh}</span>
                  <span className="text-[8px] text-[#8B98A7] uppercase leading-none mt-0.5">km/h</span>
                </div>
                <div className="text-[11px] font-mono leading-tight">
                  <div className="text-[#8B98A7]">SPEED LIMIT</div>
                  <div className="text-[#35C98B] font-bold">60 KM/H</div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerSOS}
                className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                  isSosActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-black border-amber-300'
                    : 'bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border-red-800/50'
                }`}
                title="Emergency SOS Ambulance Dispatch"
              >
                <Siren className="w-3.5 h-3.5 text-red-400" />
                <span>{isSosActive ? 'SOS EN ROUTE' : 'SOS 108'}</span>
              </button>

              <button
                onClick={handleTogglePause}
                className="p-2.5 rounded-xl bg-[#1A2330] hover:bg-[#252E3B] text-[#E8EDF2] border border-[#252E3B] transition-colors"
                title={navigationState.isPaused ? 'Resume Navigation' : 'Pause Navigation'}
              >
                {navigationState.isPaused ? <Play className="w-4 h-4 text-[#35C98B]" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                onClick={handleCycleSpeed}
                className="px-3 py-2 rounded-xl bg-[#1A2330] hover:bg-[#252E3B] text-[#388BFD] font-mono text-xs font-bold border border-[#252E3B] transition-colors"
                title="Simulation Speed"
              >
                {navigationState.speedMultiplier}x
              </button>

              <button
                onClick={handleStopNavigation}
                className="px-4 py-2.5 rounded-xl bg-[#E05A5A] hover:bg-[#E05A5A]/90 text-white text-xs font-bold shadow-lg shadow-[#E05A5A]/25 transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Emergency SOS Ambulance Dispatch Modal */}
        {showSosModal && (
          <div className="fixed inset-0 z-[1000] pointer-events-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#11161F] border-2 border-red-500/80 rounded-2xl max-w-lg w-full shadow-2xl shadow-red-950/80 overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
                    <Siren className="w-6 h-6 text-yellow-300 animate-spin" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-widest uppercase font-mono bg-yellow-400 text-black px-2 py-0.5 rounded">
                        108 EMERGENCY DISPATCH
                      </span>
                      <span className="text-[11px] font-mono text-white/90">LIVE ALERT</span>
                    </div>
                    <h3 className="text-base font-extrabold mt-0.5">Accident Emergency Signal Sent</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowSosModal(false)}
                  className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
                  title="Minimize (Keep SOS Active in Background)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-xs font-sans">
                {/* Emergency Status Banner */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                    <span className="font-mono font-bold text-red-300 uppercase tracking-wide">
                      Ambulance Dispatched & En Route
                    </span>
                  </div>
                  <div className="font-mono text-sm font-extrabold text-white bg-red-600/30 px-2.5 py-1 rounded-lg border border-red-500/40">
                    ETA {Math.floor(sosCountdown / 60)}:{(sosCountdown % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Dispatch Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#161D26] border border-[#252E3B] p-3 rounded-xl">
                    <div className="text-[#8B98A7] text-[10px] font-mono uppercase">Assigned Hospital</div>
                    <div className="text-sm font-bold text-[#E8EDF2] mt-1 truncate" title={sosDispatchedHospital}>
                      {sosDispatchedHospital}
                    </div>
                    <div className="text-[11px] text-[#35C98B] font-mono mt-0.5 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{sosDistanceKm} km from location</span>
                    </div>
                  </div>

                  <div className="bg-[#161D26] border border-[#252E3B] p-3 rounded-xl">
                    <div className="text-[#8B98A7] text-[10px] font-mono uppercase">Assigned Unit</div>
                    <div className="text-sm font-bold text-yellow-400 font-mono mt-1">
                      Ambulance #TS-108-EMRI-42
                    </div>
                    <div className="text-[11px] text-[#8B98A7] font-mono mt-0.5">
                      Paramedic: Off. K. Varma
                    </div>
                  </div>
                </div>

                {/* Location & Corridor */}
                <div className="bg-[#161D26] border border-[#252E3B] p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B98A7] text-[10px] font-mono uppercase">Accident Location GPS</span>
                    <button
                      onClick={handleCopyGps}
                      className="text-[11px] text-[#388BFD] hover:underline flex items-center gap-1"
                    >
                      {copiedGps ? <Check className="w-3 h-3 text-[#35C98B]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedGps ? 'Copied Coordinates' : 'Copy GPS'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs font-semibold text-[#E8EDF2]">
                    {(navigationState?.currentPosition || origin.coordinates)[0].toFixed(5)}° N, {(navigationState?.currentPosition || origin.coordinates)[1].toFixed(5)}° E
                  </div>
                  <div className="text-xs text-[#8B98A7]">
                    Corridor: <strong className="text-[#E8EDF2]">{currentStep.roadName}</strong>, Hyderabad
                  </div>
                </div>

                {/* Corridor Green Wave Status */}
                <div className="bg-[#0D5936]/30 border border-[#1A7F4E]/40 rounded-xl p-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#35C98B]/20 text-[#35C98B] flex items-center justify-center shrink-0 mt-0.5">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                      <span>Corridor Green Wave Preemption Active</span>
                    </div>
                    <div className="text-[11px] text-emerald-100/80 mt-0.5 leading-relaxed">
                      Traffic signals along this route have been automatically synchronized to green for the inbound ambulance unit.
                    </div>
                  </div>
                </div>

                {/* Emergency Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <a
                    href="tel:108"
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all text-center"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>Call 108 Emergency Helpline</span>
                  </a>

                  <button
                    onClick={() => setShowSosModal(false)}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#1A2330] hover:bg-[#252E3B] text-[#E8EDF2] font-semibold text-xs border border-[#252E3B] transition-colors"
                  >
                    Return to Navigation
                  </button>
                </div>

                {/* Cancel Emergency Option */}
                <div className="text-center pt-1">
                  <button
                    onClick={handleCancelSOS}
                    className="text-xs text-[#8B98A7] hover:text-red-400 transition-colors underline"
                  >
                    Cancel SOS (Accidental / False Alarm)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // Default Mode: Authentic Google Maps Directions Panel
  // ----------------------------------------------------
  return (
    <div className={`w-full ${isSidebarMode ? 'h-full' : 'max-w-md'} bg-[#11161F] border border-[#252E3B] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#E8EDF2] select-none font-sans`}>
      {/* Top Google Maps Mode Bar */}
      <div className="p-3 bg-[#161D26] border-b border-[#252E3B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/syntra-icon.jpg" 
            alt="SYNTRA" 
            className="w-7 h-7 rounded-lg object-cover border border-[#28313C] shadow-sm shrink-0" 
          />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode('driving')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'driving'
                ? 'bg-[#388BFD] text-white shadow-md shadow-[#388BFD]/30'
                : 'text-[#8B98A7] hover:text-[#E8EDF2] hover:bg-[#1A2330]'
            }`}
            title="Driving Route"
          >
            <Car className="w-3.5 h-3.5" />
            <span>Drive</span>
          </button>

          <button
            onClick={() => setMode('emergency')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'emergency'
                ? 'bg-[#E05A5A] text-white shadow-md shadow-[#E05A5A]/30'
                : 'text-[#8B98A7] hover:text-[#E8EDF2] hover:bg-[#1A2330]'
            }`}
            title="Emergency Priority Corridor (Green Wave)"
          >
            <Siren className="w-3.5 h-3.5" />
            <span>Emergency</span>
          </button>

          <button
            onClick={() => setMode('transit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'transit'
                ? 'bg-[#A371F7] text-white shadow-md shadow-[#A371F7]/30'
                : 'text-[#8B98A7] hover:text-[#E8EDF2] hover:bg-[#1A2330]'
            }`}
            title="Metro & Transit Integration"
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Transit</span>
          </button>
        </div>
      </div>

        <div className="flex items-center gap-1 text-xs text-[#8B98A7]">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showOptions ? 'bg-[#1A2330] text-[#388BFD] border-[#388BFD]/40' : 'border-transparent hover:bg-[#1A2330] text-[#8B98A7]'
            }`}
            title="Route Options & Avoidances"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#1A2330] text-[#8B98A7] hover:text-[#E8EDF2] transition-colors"
              title="Close Directions"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Origin & Destination Inputs (Google Maps Style) */}
      <div className="p-4 bg-[#11161F] border-b border-[#252E3B] space-y-3 relative">
        <div className="flex items-center gap-3">
          {/* Vertical Visual Line: Hollow Circle to Solid Pin */}
          <div className="flex flex-col items-center justify-between py-1 self-stretch shrink-0">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#388BFD] bg-[#11161F]"></div>
            <div className="w-0.5 flex-1 bg-[#252E3B] my-1"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#E05A5A] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="flex-1 space-y-2 relative">
            {/* Origin Input */}
            <div className="relative">
              <input
                type="text"
                value={originQuery}
                onFocus={() => setShowOriginDropdown(true)}
                onChange={(e) => {
                  setOriginQuery(e.target.value);
                  setShowOriginDropdown(true);
                }}
                placeholder="Choose starting point..."
                className="w-full bg-[#161D26] border border-[#252E3B] rounded-xl px-3 py-2 text-xs font-medium text-[#E8EDF2] placeholder-[#5E6A78] focus:outline-none focus:border-[#388BFD] transition-colors pr-7"
              />
              {originQuery && (
                <button
                  onClick={() => {
                    setOriginQuery('');
                    setShowOriginDropdown(true);
                  }}
                  className="absolute right-2 top-2.5 text-[#5E6A78] hover:text-[#8B98A7]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Origin Autocomplete Popover */}
              {showOriginDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#161D26] border border-[#252E3B] rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-[#252E3B]/60 animate-in fade-in-50 duration-150">
                  <div
                    onClick={handleUseMyLocation}
                    className="p-2.5 hover:bg-[#1A2330] cursor-pointer flex items-center gap-2.5 text-xs text-[#388BFD] font-medium"
                  >
                    <Crosshair className="w-4 h-4 shrink-0" />
                    <span>Your Location (Cyber Towers Operations HQ)</span>
                  </div>

                  {filteredOrigins.map((loc) => (
                    <div
                      key={`orig-opt-${loc.id}`}
                      onClick={() => {
                        setOrigin(loc);
                        setOriginQuery(loc.name);
                        setShowOriginDropdown(false);
                        computeRoutes(loc, destination);
                      }}
                      className="p-2.5 hover:bg-[#1A2330] cursor-pointer flex items-start gap-2.5 text-xs"
                    >
                      <div className="mt-0.5">{getCategoryIcon(loc.category)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#E8EDF2] truncate">{loc.name}</div>
                        <div className="text-[11px] text-[#8B98A7] truncate mt-0.5">{loc.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Input */}
            <div className="relative">
              <input
                type="text"
                value={destQuery}
                onFocus={() => setShowDestDropdown(true)}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  setShowDestDropdown(true);
                }}
                placeholder="Choose destination..."
                className="w-full bg-[#161D26] border border-[#252E3B] rounded-xl px-3 py-2 text-xs font-medium text-[#E8EDF2] placeholder-[#5E6A78] focus:outline-none focus:border-[#388BFD] transition-colors pr-7"
              />
              {destQuery && (
                <button
                  onClick={() => {
                    setDestQuery('');
                    setShowDestDropdown(true);
                  }}
                  className="absolute right-2 top-2.5 text-[#5E6A78] hover:text-[#8B98A7]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Destination Autocomplete Popover */}
              {showDestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#161D26] border border-[#252E3B] rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-[#252E3B]/60 animate-in fade-in-50 duration-150">
                  {filteredDests.map((loc) => (
                    <div
                      key={`dest-opt-${loc.id}`}
                      onClick={() => {
                        setDestination(loc);
                        setDestQuery(loc.name);
                        setShowDestDropdown(false);
                        computeRoutes(origin, loc);
                      }}
                      className="p-2.5 hover:bg-[#1A2330] cursor-pointer flex items-start gap-2.5 text-xs"
                    >
                      <div className="mt-0.5">{getCategoryIcon(loc.category)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#E8EDF2] truncate">{loc.name}</div>
                        <div className="text-[11px] text-[#8B98A7] truncate mt-0.5">{loc.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reverse / Swap Button */}
          <button
            onClick={handleSwap}
            className="p-2 rounded-xl bg-[#161D26] hover:bg-[#1A2330] text-[#8B98A7] hover:text-[#388BFD] border border-[#252E3B] transition-colors shrink-0"
            title="Reverse Origin and Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Landmark Preset Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-[11px]">
          <span className="text-[#5E6A78] shrink-0">Quick:</span>
          {HYDERABAD_LANDMARKS.slice(0, 6).map((landmark) => (
            <button
              key={`preset-${landmark.id}`}
              onClick={() => handleQuickDestination(landmark)}
              className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors shrink-0 ${
                destination.id === landmark.id
                  ? 'bg-[#388BFD]/20 text-[#388BFD] border-[#388BFD]/40 font-semibold'
                  : 'bg-[#161D26] text-[#8B98A7] border-[#252E3B] hover:text-[#E8EDF2] hover:bg-[#1A2330]'
              }`}
            >
              {landmark.name.split(',')[0]}
            </button>
          ))}
        </div>

        {/* Options & Avoidances Accordion */}
        {showOptions && (
          <div className="p-3 bg-[#161D26] border border-[#252E3B] rounded-xl space-y-2 text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#8B98A7] font-semibold">
              Route Optimization Aspects
            </div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#E8EDF2]">Evolve past Bottlenecks & Queues</span>
              <input
                type="checkbox"
                checked={avoidBottlenecks}
                onChange={(e) => {
                  setAvoidBottlenecks(e.target.checked);
                  computeRoutes(origin, destination);
                }}
                className="w-4 h-4 rounded bg-[#11161F] border-[#252E3B] text-[#388BFD] focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#E8EDF2]">Avoid Incident & Accident Stalls</span>
              <input
                type="checkbox"
                checked={avoidIncidents}
                onChange={(e) => {
                  setAvoidIncidents(e.target.checked);
                  computeRoutes(origin, destination);
                }}
                className="w-4 h-4 rounded bg-[#11161F] border-[#252E3B] text-[#388BFD] focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#E8EDF2]">Prioritize Elevated Expressways</span>
              <input
                type="checkbox"
                checked={preferExpressways}
                onChange={(e) => {
                  setPreferExpressways(e.target.checked);
                  computeRoutes(origin, destination);
                }}
                className="w-4 h-4 rounded bg-[#11161F] border-[#252E3B] text-[#388BFD] focus:ring-0"
              />
            </label>
          </div>
        )}
      </div>

      {/* Traffic Summary Status Header */}
      <div className="px-4 py-2 bg-[#161D26]/70 border-b border-[#252E3B] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#35C98B] animate-pulse"></span>
          <span className="text-[#8B98A7]">
            Live Traffic: <strong className="text-[#E8EDF2] font-medium">Synced with Google Maps</strong>
          </span>
        </div>
        {isCalculating ? (
          <span className="text-[#388BFD] font-mono text-[11px] flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#388BFD] animate-ping"></span>
            Recalculating...
          </span>
        ) : (
          <span className="text-[#5E6A78] font-mono text-[11px]">
            {alternativeRoutes.length} route options
          </span>
        )}
      </div>

      {/* Route Cards List (Google Maps Alternatives Layout) */}
      <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
        {alternativeRoutes.map((route, idx) => {
          const isSelected = activeRoute?.id === route.id;
          const isOptimal = route.tag === 'AI_OPTIMAL' || route.isRecommended;

          // Traffic color: fast (<30m green, >30m orange, high delay red)
          const timeColor = route.delayMin > 5 ? 'text-[#FFA116]' : 'text-[#35C98B]';

          return (
            <div
              key={route.id || idx}
              onClick={() => onSelectRoute(route)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#161D26] border-[#388BFD] shadow-lg shadow-[#388BFD]/10 ring-2 ring-[#388BFD]/30'
                  : 'bg-[#141A23] border-[#252E3B] hover:border-[#388BFD]/40 hover:bg-[#161D26]'
              }`}
            >
              {/* Top Row: Hero Duration, Distance, and ETA */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-extrabold font-mono tracking-tight ${timeColor}`}>
                      {route.durationMin}
                      <span className="text-sm font-sans font-normal text-[#8B98A7] ml-1">min</span>
                    </span>
                    <span className="text-xs text-[#8B98A7] font-mono">
                      {route.distanceKm} km
                    </span>
                    <span className="text-xs text-[#E8EDF2] font-semibold font-mono">
                      • ETA {getArrivalTime(route.durationMin)}
                    </span>
                  </div>

                  {/* Via Road Title */}
                  <div className="text-xs font-semibold text-[#E8EDF2] mt-1 flex items-center gap-1.5">
                    <span>{route.summary}</span>
                  </div>
                </div>

                {/* Badges: AI Optimal / Fastest */}
                <div>
                  {isOptimal ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#35C98B]/15 text-[#35C98B] border border-[#35C98B]/30 uppercase font-mono">
                      <Sparkles className="w-3 h-3" />
                      Optimal
                    </span>
                  ) : route.tag === 'FASTEST' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#388BFD]/15 text-[#388BFD] border border-[#388BFD]/30 uppercase font-mono">
                      Expressway
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Traffic status description line */}
              <div className="mt-2 text-xs text-[#8B98A7] leading-relaxed">
                {route.delayMin === 0 ? (
                  <span className="text-[#35C98B] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Fastest route now, free-flowing traffic
                  </span>
                ) : (
                  <span className="text-[#FFA116] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    +{route.delayMin} min delay due to corridor congestion
                  </span>
                )}
              </div>

              {/* Digital Twin Telemetry Strip */}
              <div className="mt-3 pt-2.5 border-t border-[#252E3B] flex items-center justify-between text-[11px] text-[#8B98A7]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#35C98B]" />
                  <span>Bypasses <strong className="text-[#E8EDF2]">{route.bottlenecksAvoided}</strong> bottlenecks</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#35C98B] font-semibold">Twin Flow {route.twinScore}/100</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer: Start Navigation & Turn-by-Turn Steps */}
      {activeRoute && (
        <div className="p-4 bg-[#161D26] border-t border-[#252E3B] space-y-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleStartNavigation}
              className="flex-1 py-3 px-4 rounded-xl bg-[#388BFD] hover:bg-[#2A75E0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#388BFD]/25 transition-all transform active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Start Navigation</span>
            </button>

            <button
              onClick={() => setExpandedSteps(!expandedSteps)}
              className={`px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                expandedSteps
                  ? 'bg-[#1A2330] text-[#388BFD] border-[#388BFD]/40'
                  : 'bg-[#141A23] text-[#8B98A7] hover:text-[#E8EDF2] border-[#252E3B] hover:bg-[#1A2330]'
              }`}
              title="Toggle Detailed Directions"
            >
              <span>Steps</span>
              {expandedSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Detailed Turn-by-Turn Directions List */}
          {expandedSteps && activeRoute.steps && (
            <div className="mt-2 pt-3 border-t border-[#252E3B] max-h-60 overflow-y-auto space-y-2 pr-1 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8B98A7] mb-2 font-semibold">
                <span>Directions to {destination.name.split(',')[0]}</span>
                <span>{activeRoute.steps.length} turns</span>
              </div>

              {activeRoute.steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-[#11161F] border border-[#252E3B] text-xs hover:border-[#388BFD]/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#161D26] text-[#388BFD] flex items-center justify-center shrink-0 mt-0.5 border border-[#252E3B]">
                    {renderManeuverIcon(step.maneuver, 'w-4 h-4')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#E8EDF2] leading-snug">
                      {step.instruction}
                    </div>
                    <div className="text-[11px] text-[#8B98A7] mt-1 flex items-center gap-2.5 font-mono">
                      <span className="text-[#388BFD] font-bold">{step.distanceKm} km</span>
                      <span>•</span>
                      <span className="text-[#35C98B]">{step.speedKmh} km/h flow</span>
                    </div>
                    {step.bottleneckNotice && (
                      <div className="text-[11px] text-[#35C98B] mt-1 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span>{step.bottleneckNotice}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
