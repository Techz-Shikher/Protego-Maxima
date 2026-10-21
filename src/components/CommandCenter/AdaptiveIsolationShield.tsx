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
  CheckCircle2
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

  const levels: { level: IsolationLevel; name: string; riskRange: string; desc: string; hardware: string }[] = [
    {
      level: 1,
      name: 'NORMAL',
      riskRange: '< 20% RISK',
      desc: 'Standard logical container partition with basic audit tap.',
      hardware: 'Logical cgroup v2'
    },
    {
      level: 2,
      name: 'RESTRICTED',
      riskRange: '20% – 40% RISK',
      desc: 'Rate-limiting jitter enabled; ephemeral session isolation applied.',
      hardware: '50ms Constant-Time Buffer'
    },
    {
      level: 3,
      name: 'HIGH ISOLATION',
      riskRange: '40% – 70% RISK',
      desc: 'Dedicated L2/VRAM slicing, constant-time buffering, seccomp lock.',
      hardware: 'Hardware MPS VRAM Slicing'
    },
    {
      level: 4,
      name: 'EMERGENCY CONTAINMENT',
      riskRange: '> 70% RISK',
      desc: 'Zero-egress airgap freeze, synthetic honeypot diversion, memory wipe.',
      hardware: 'Zero-Egress Total Quarantine'
    },
  ];

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden ${
        highlightZone === 'isolation'
          ? 'border-cyan-400 bg-[#091122]/98 glow-cyan ring-2 ring-cyan-400/50'
          : 'border-cyan-500/30 bg-[#070e1e]/95'
      }`}
    >
      {/* Laser Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide font-sans">
                ADAPTIVE ISOLATION PERIMETER
              </h3>
              <span className="rounded-full bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                DYNAMIC CONTROLS
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              MICRO-ARCHITECTURAL CONTAINMENT BOUNDARY FOR TARGET LLM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono font-bold text-cyan-300 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 shadow-sm flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span>CURRENT: LEVEL {isolationLevel} ({isolationName})</span>
          </div>
        </div>
      </div>

      {/* Visual Security Boundary Status & Levels */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {levels.map((lvl) => {
          const isActive = isolationLevel === lvl.level;
          return (
            <button
              key={lvl.level}
              onClick={() => adaptIsolation(lvl.level)}
              disabled={isLiveDemoRunning}
              className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? lvl.level === 4
                    ? 'border-red-500 bg-red-950/50 glow-red ring-2 ring-red-400 shadow-[0_0_25px_rgba(239,68,68,0.35)]'
                    : lvl.level === 3
                    ? 'border-orange-500 bg-orange-950/50 glow-orange ring-2 ring-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.35)]'
                    : lvl.level === 2
                    ? 'border-amber-500 bg-amber-950/40 ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'border-cyan-500 bg-cyan-950/50 glow-cyan ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'border-slate-800 bg-[#091122]/90 hover:border-slate-700 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  STAGE {lvl.level}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-1.5 py-0.5 rounded border border-slate-800">
                  {lvl.riskRange}
                </span>
              </div>
              <div className="mt-2 text-xs font-black text-white tracking-wide font-sans flex items-center justify-between">
                <span>{lvl.name}</span>
                {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
              </div>
              <div className="mt-1 text-xs text-slate-300 leading-tight font-sans">
                {lvl.desc}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400">
                {lvl.hardware}
              </div>
            </button>
          );
        })}
      </div>

      {/* Technical Policy Attributes */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="rounded-xl bg-black/50 p-2.5 border border-slate-800">
          <div className="text-[10px] text-slate-500">MEMORY ISOLATION</div>
          <div className="font-bold text-emerald-400 mt-0.5">
            {isolationLevel >= 2 ? 'ENCRYPTED PARTITION' : 'STANDARD CGROUP'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Zero cross-read</div>
        </div>
        <div className="rounded-xl bg-black/50 p-2.5 border border-slate-800">
          <div className="text-[10px] text-slate-500">GPU VRAM SLICING</div>
          <div className="font-bold text-cyan-400 mt-0.5">
            {isolationLevel >= 3 ? 'HARDWARE MPS MASK' : 'SHARED CUDA QUEUE'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Bus noise blocked</div>
        </div>
        <div className="rounded-xl bg-black/50 p-2.5 border border-slate-800">
          <div className="text-[10px] text-slate-500">EGRESS NETNS</div>
          <div className="font-bold text-amber-400 mt-0.5">
            {isolationLevel >= 4 ? 'ZERO-EGRESS AIRGAP' : 'RESTRICTED VETH'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">No exfiltration</div>
        </div>
        <div className="rounded-xl bg-black/50 p-2.5 border border-slate-800">
          <div className="text-[10px] text-slate-500">RESPONSE BUFFERING</div>
          <div className="font-bold text-purple-400 mt-0.5">
            {isolationLevel >= 2 ? '50ms CONSTANT-TIME' : 'STREAMING NATIVE'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Jitter mitigated</div>
        </div>
      </div>
    </div>
  );
};
