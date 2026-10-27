import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Shield,
  Lock,
  ShieldAlert,
  Cpu,
  Layers,
  Radio,
  AlertTriangle,
  Server,
  Zap,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { IsolationLevel } from '../../types';

export const AdaptiveIsolationShield: React.FC = () => {
  const {
    isolationLevel,
    isolationName,
    adaptIsolation,
    leakageScore,
    isLiveDemoRunning,
    highlightZone,
  } = useSimulation();

  const levels: {
    level: IsolationLevel;
    name: string;
    riskRange: string;
    desc: string;
    hardware: string;
    color: string;
  }[] = [
    {
      level: 1,
      name: 'NORMAL',
      riskRange: '< 20% RISK',
      desc: 'Standard logical container partition with basic audit tap.',
      hardware: 'cgroups v2 + Namespace Isolation',
      color: 'cyan',
    },
    {
      level: 2,
      name: 'RESTRICTED',
      riskRange: '20% – 40% RISK',
      desc: 'Rate-limiting jitter enabled; ephemeral session isolation applied.',
      hardware: '50ms Constant-Time Buffer',
      color: 'amber',
    },
    {
      level: 3,
      name: 'HIGH ISOLATION',
      riskRange: '40% – 70% RISK',
      desc: 'Dedicated L2/VRAM slicing, constant-time buffering, seccomp lock.',
      hardware: 'Hardware MPS VRAM Slicing',
      color: 'orange',
    },
    {
      level: 4,
      name: 'EMERGENCY CONTAINMENT',
      riskRange: '> 70% RISK',
      desc: 'Zero-egress airgap freeze, synthetic honeypot diversion, memory wipe.',
      hardware: 'Zero-Egress Total Quarantine',
      color: 'rose',
    },
  ];

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden ${
        highlightZone === 'isolation'
          ? 'border-cyan-400 bg-[#091122]/98 ring-2 ring-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.35)]'
          : 'border-cyan-500/30 bg-[#050b18]/95'
      }`}
    >
      {/* Sci-Fi Top Laser Glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-white tracking-wide font-sans">
                ADAPTIVE ISOLATION PERIMETER
              </h3>
              <span className="text-xs font-mono text-cyan-400/80">·</span>
              <span className="text-[11px] font-mono font-semibold text-cyan-300">
                ACTIVE RING: LVL {isolationLevel}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Micro-architectural hardware containment boundary for target enclave
            </p>
          </div>
        </div>

        {/* Current State Indicator */}
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono font-bold text-slate-200 px-3.5 py-1.5 rounded-xl bg-black/40 border border-cyan-500/30 shadow-inner flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-400 font-normal">STATUS:</span>
            <span className="text-cyan-300">{isolationName.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Interactive Isolation Stage Cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {levels.map((lvl) => {
          const isActive = isolationLevel === lvl.level;
          return (
            <button
              key={lvl.level}
              onClick={() => adaptIsolation(lvl.level)}
              disabled={isLiveDemoRunning}
              className={`rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                isActive
                  ? lvl.level === 4
                    ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.35)]'
                    : lvl.level === 3
                    ? 'border-orange-500 bg-orange-950/40 ring-2 ring-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.35)]'
                    : lvl.level === 2
                    ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'border-cyan-500 bg-cyan-950/40 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'border-slate-800 bg-[#070e1c]/80 hover:border-slate-700 hover:bg-[#091326] opacity-80 hover:opacity-100'
              }`}
            >
              {/* Top Stage Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  STAGE {lvl.level}
                </span>
                <span className="text-[10px] text-slate-400 bg-black/50 px-2 py-0.5 rounded border border-slate-800">
                  {lvl.riskRange}
                </span>
              </div>

              {/* Title & Active Beacon */}
              <div className="mt-2.5 text-xs font-bold text-white tracking-wide font-sans flex items-center justify-between">
                <span>{lvl.name}</span>
                {isActive && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>ENFORCED</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                {lvl.desc}
              </p>

              {/* Hardware Layer Divider */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400/90 flex items-center gap-1.5">
                <Cpu className="h-3 w-3 text-cyan-400" />
                <span className="truncate">{lvl.hardware}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Technical Policy Attributes */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="rounded-xl bg-black/40 p-3 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase">Memory Isolation</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="font-bold text-emerald-400 mt-1">
            {isolationLevel >= 2 ? 'ENCRYPTED PARTITION' : 'STANDARD CGROUP'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Zero cross-read memory lock</div>
        </div>

        <div className="rounded-xl bg-black/40 p-3 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase">GPU VRAM Slicing</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </div>
          <div className="font-bold text-cyan-400 mt-1">
            {isolationLevel >= 3 ? 'HARDWARE MPS MASK' : 'SHARED CUDA QUEUE'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Bus contention shielded</div>
        </div>

        <div className="rounded-xl bg-black/40 p-3 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase">Egress NetNS</span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          </div>
          <div className="font-bold text-amber-400 mt-1">
            {isolationLevel >= 4 ? 'AIRGAP QUARANTINE' : 'RESTRICTED VETH'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">No exfiltration routes</div>
        </div>

        <div className="rounded-xl bg-black/40 p-3 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase">Response Buffering</span>
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          </div>
          <div className="font-bold text-violet-400 mt-1">
            {isolationLevel >= 2 ? '50ms CONSTANT-TIME' : 'STREAMING PASSTHROUGH'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Micro-timing jitter neutralized</div>
        </div>
      </div>
    </div>
  );
};
