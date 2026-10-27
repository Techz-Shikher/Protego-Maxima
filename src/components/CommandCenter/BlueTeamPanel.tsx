import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Layers,
  Lock,
  Zap,
  Sparkles,
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';

export const BlueTeamPanel: React.FC = () => {
  const {
    defenses,
    activeDefenses,
    deployDefense,
    runRetest,
    isLiveDemoRunning,
    leakageScore,
  } = useSimulation();

  const [synthesizing, setSynthesizing] = useState(false);

  const handleGenerateDefense = () => {
    setSynthesizing(true);
    setTimeout(() => {
      setSynthesizing(false);
      // Auto deploy next available if any
      const nextAvailable = defenses.find(d => !activeDefenses.includes(d.id));
      if (nextAvailable) {
        deployDefense(nextAvailable.id);
      }
    }, 700);
  };

  const getHardwareHookTag = (id: string) => {
    switch (id) {
      case 'DEF-01': return 'KERNEL CGROUP V2';
      case 'DEF-02': return 'L2 CACHE PARTITION';
      case 'DEF-03': return 'CONSTANT-TIME JITTER';
      case 'DEF-04': return 'SECCOMP AIRGAP';
      default: return 'ZERO-TRUST SANDBOX';
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-emerald-500/30 bg-[#070e1e]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Top emerald laser scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide font-sans">
                RAKSHAK (BLUE TEAM)
              </h3>
              <span className="rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
                GUARDIAN SHIELD · रक्षक
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              AUTONOMOUS ZERO-TRUST ISOLATION & KERNEL MITIGATOR
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 shadow-sm flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {activeDefenses.length} POLICIES ACTIVE
        </span>
      </div>

      {/* Defensive Capabilities List */}
      <div className="my-4 space-y-2">
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
          <span className="font-bold text-slate-300">ZERO-TRUST COUNTERMEASURES</span>
          <span className="text-[11px] text-slate-500">ENFORCED IN HARDWARE & RUNTIME</span>
        </div>

        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {defenses.map((def) => {
            const isActive = activeDefenses.includes(def.id);
            return (
              <div
                key={def.id}
                className={`rounded-xl border p-3.5 transition-all text-xs ${
                  isActive
                    ? 'border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'border-slate-800 bg-[#091122]/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}
                    />
                    <span className="font-bold text-white text-xs">{def.name}</span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                      {getHardwareHookTag(def.id)}
                    </span>
                  </div>
                  <button
                    onClick={() => deployDefense(def.id)}
                    disabled={isLiveDemoRunning || isActive}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 cursor-default shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-emerald-700 hover:text-white'
                    }`}
                  >
                    {isActive ? '✓ ENFORCED' : '+ DEPLOY'}
                  </button>
                </div>
                <div className="mt-1.5 text-xs text-slate-300 leading-normal font-sans pl-6">
                  {def.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defensive Operations Buttons */}
      <div className="mt-2 grid grid-cols-3 gap-2.5">
        <button
          onClick={handleGenerateDefense}
          disabled={isLiveDemoRunning || synthesizing}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-[#091122] px-3 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
        >
          <Plus className="h-4 w-4 text-emerald-400" />
          <span>{synthesizing ? 'SYNTHESIZING...' : 'SYNTHESIZE'}</span>
        </button>

        <button
          onClick={() => {
            defenses.forEach((d) => deployDefense(d.id));
          }}
          disabled={isLiveDemoRunning}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer disabled:opacity-50"
        >
          <Cpu className="h-4 w-4 text-white" />
          <span>DEPLOY ALL</span>
        </button>

        <button
          onClick={runRetest}
          disabled={isLiveDemoRunning}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3 py-2.5 text-xs font-bold text-cyan-200 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all cursor-pointer disabled:opacity-50"
        >
          <ShieldAlert className="h-4 w-4 text-cyan-400" />
          <span>RE-TEST</span>
        </button>
      </div>

      {/* Verification Criteria callout */}
      <div className="mt-3.5 rounded-xl border border-slate-800 bg-black/60 p-3 text-xs font-mono text-slate-300 flex items-start gap-2">
        <Activity className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-emerald-400 font-bold">BAYORA ZERO-TRUST VERIFICATION: </span>
          <span>Side-channel Pearson correlation coefficient r &le; 0.04 &amp; 0 canary bytes displaced across logical boundaries.</span>
        </div>
      </div>
    </div>
  );
};
