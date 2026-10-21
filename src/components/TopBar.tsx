import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Play, RotateCcw, Layers, Activity, Sparkles, Terminal } from 'lucide-react';
import protegoLogo from '../assets/images/protego_shield_logo_1791520495337.jpg';

export const TopBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    runLiveDemo,
    isLiveDemoRunning,
    resetSimulation,
    threatLevel,
    securityScore,
    setArchitectureModalOpen,
  } = useSimulation();

  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [resetRotating, setResetRotating] = useState(false);

  const handleResetClick = () => {
    setResetRotating(true);
    resetSimulation();
    setTimeout(() => setResetRotating(false), 600);
  };

  const navItems = [
    { id: 'landing', label: 'Overview', code: '01' },
    { id: 'command_center', label: 'Command Center', code: '02' },
    { id: 'attack_lab', label: 'Model Attack Lab', code: '03' },
    { id: 'security_report', label: 'Security Report', code: '04' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#050914]/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Animated Top Laser Scanline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 animate-pulse" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Official Logo + Brand Wordmark with 3D Cyber Shimmer */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            {/* Attached 3D Metallic Shield Logo with Animated Orbital Glow */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-cyan-400/40 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:border-cyan-300 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300">
              {/* Rotating orbital ring around logo */}
              <div className="absolute -inset-1 rounded-xl border border-cyan-400/30 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none opacity-60 group-hover:opacity-100" />
              
              <img
                src={protegoLogo}
                alt="Protego Maxima Shield Logo"
                className="h-full w-full object-contain rounded-lg drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:scale-105 transition-transform duration-300"
              />

              {/* Glowing active core dot */}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 border-2 border-[#050914] shadow-[0_0_6px_#22d3ee] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-wider text-white whitespace-nowrap bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent group-hover:to-cyan-200 transition-all">
                  PROTEGO MAXIMA
                </span>
                <span className="hidden sm:inline-block rounded border border-cyan-500/30 bg-cyan-950/60 px-1.5 py-0.2 text-[9px] font-mono font-bold text-cyan-300 tracking-wider">
                  BAYORA
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-widest hidden sm:block">
                ADAPTIVE ZERO-TRUST CORE
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Animated Tactical Navigation Deck */}
        <nav className="hidden md:flex items-center gap-1 bg-[#091122]/80 border border-slate-800/80 rounded-xl p-1 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative px-3.5 py-1.5 text-xs font-mono font-semibold transition-all duration-200 rounded-lg whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {/* Active Glowing Indicator Bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                )}

                <span className="flex items-center gap-1.5">
                  <span className={`text-[10px] ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                    {item.code}
                  </span>
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}

          {/* Architecture trigger tab */}
          <button
            onClick={() => setArchitectureModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-colors whitespace-nowrap"
          >
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Zone 3: Live Telemetry HUD + Kinetic Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Animated Telemetry HUD Pod */}
          <div className="hidden lg:flex items-center gap-3 rounded-lg border border-slate-800 bg-[#091122]/90 px-3 py-1.5 text-xs font-mono">
            {/* Live Security Score */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500">SCORE</span>
              <span className="font-bold text-cyan-300 tabular-nums">
                {securityScore.total.toFixed(1)}
              </span>
            </div>

            <div className="h-3 w-[1px] bg-slate-800" />

            {/* Pulsing Threat Level with Radar Pulse */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500">THREAT</span>
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    threatLevel === 'CRITICAL'
                      ? 'bg-red-400'
                      : threatLevel === 'HIGH'
                      ? 'bg-orange-400'
                      : threatLevel === 'MEDIUM'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    threatLevel === 'CRITICAL'
                      ? 'bg-red-500'
                      : threatLevel === 'HIGH'
                      ? 'bg-orange-500'
                      : threatLevel === 'MEDIUM'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span
                className={`font-bold tabular-nums text-[11px] ${
                  threatLevel === 'CRITICAL'
                    ? 'text-red-400'
                    : threatLevel === 'HIGH'
                    ? 'text-orange-400'
                    : threatLevel === 'MEDIUM'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {threatLevel}
              </span>
            </div>
          </div>

          {/* Quick Simulation Reset Tool */}
          <button
            onClick={handleResetClick}
            title="Reset Simulation State"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-[#0A1222] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800 transition-all group"
          >
            <RotateCcw
              className={`h-4 w-4 transition-transform duration-500 ${
                resetRotating ? 'rotate-180 text-cyan-400' : 'group-hover:-rotate-45'
              }`}
            />
          </button>

          {/* High-Impact "RUN LIVE DEMO" Action with Glowing Electric Sweep */}
          <button
            onClick={runLiveDemo}
            className={`relative group overflow-hidden flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold tracking-wide text-white transition-all shadow-lg whitespace-nowrap ${
              isLiveDemoRunning
                ? 'bg-red-600/90 hover:bg-red-600 border border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-300/40 shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-[1.02]'
            }`}
          >
            {/* Shimmer light sweep bar */}
            <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

            <Play
              className={`h-3.5 w-3.5 fill-white transition-transform ${
                isLiveDemoRunning ? 'animate-spin' : 'group-hover:scale-110'
              }`}
            />
            <span>{isLiveDemoRunning ? 'DEMO ACTIVE' : 'RUN LIVE DEMO'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Deck */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#070D1B]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`px-3 py-1 text-xs font-mono rounded-lg whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setArchitectureModalOpen(true)}
          className="px-3 py-1 text-xs font-mono text-slate-400 hover:text-white whitespace-nowrap"
        >
          Architecture
        </button>
      </div>

      {/* Bottom Subtle Ambient Glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
    </header>
  );
};
