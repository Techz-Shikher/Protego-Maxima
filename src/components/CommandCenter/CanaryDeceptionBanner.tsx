import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  AlertOctagon,
  Key,
  ShieldAlert,
  Sparkles,
  X,
  Fingerprint,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Radio
} from 'lucide-react';

export const CanaryDeceptionBanner: React.FC = () => {
  const {
    canaries,
    canaryAlert,
    dismissCanaryAlert,
    triggerCanaryLeak,
    isLiveDemoRunning,
    highlightZone,
  } = useSimulation();

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden ${
        highlightZone === 'canary'
          ? 'border-purple-400 bg-[#0c1024]/98 ring-2 ring-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.35)]'
          : 'border-purple-500/30 bg-[#050b18]/95'
      }`}
    >
      {/* Top purple laser scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-90 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-400/40 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-white tracking-wide font-sans">
                CANARY & DECEPTION HONEY-TOKENS
              </h3>
              <span className="text-xs font-mono text-purple-400/80">·</span>
              <span className="text-[11px] font-mono text-purple-300 font-semibold">
                ACTIVE TRIPWIRES
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Synthetic cryptographic markers planted inside prompt context and cache layers
            </p>
          </div>
        </div>

        <button
          onClick={triggerCanaryLeak}
          disabled={isLiveDemoRunning || !!canaryAlert}
          className="flex items-center gap-2 rounded-xl border border-purple-400/40 bg-gradient-to-r from-purple-900/80 via-purple-800/70 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 px-4 py-2 text-xs font-mono font-bold text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4 text-purple-300" />
          <span>SIMULATE CANARY EXFILTRATION</span>
        </button>
      </div>

      {/* Canary Tokens Display Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {canaries.map((canary) => {
          const isCompromised = canary.compromised;
          return (
            <div
              key={canary.id}
              className={`rounded-xl border p-4 font-mono text-xs transition-all relative overflow-hidden ${
                isCompromised
                  ? 'border-rose-500 bg-rose-950/40 ring-2 ring-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                  : 'border-slate-800 bg-[#070e1c]/80 hover:border-purple-500/50 hover:bg-[#091326]'
              }`}
            >
              {/* Background watermark icon */}
              <div className="absolute -right-4 -bottom-4 text-slate-800/20 pointer-events-none select-none">
                <Fingerprint className="h-24 w-24" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
                  <Fingerprint className="h-3.5 w-3.5 text-purple-400" />
                  {canary.label}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    isCompromised
                      ? 'text-rose-300 bg-rose-950/80 border-rose-500/60 animate-pulse'
                      : 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isCompromised ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                  {isCompromised ? 'DETONATED' : 'ARMED'}
                </span>
              </div>

              {/* Large Honey-Token Code */}
              <div className="my-3 text-lg font-mono font-extrabold tracking-wider text-white flex items-center justify-between">
                <span>{canary.code}</span>
                <span className="text-[10px] font-normal text-slate-500">SHA-256</span>
              </div>

              {/* Breadcrumb path */}
              <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5 text-[10px] text-slate-400">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">AUTHORIZED:</span>
                  <span className="text-cyan-300 font-bold">{canary.authorizedBoundary}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">CURRENT LOC:</span>
                  <span className={isCompromised ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {canary.currentLocation}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Card if Canary Tripwire is Detonated */}
      {canaryAlert && (
        <div className="mt-4 rounded-xl border border-rose-500 bg-rose-950/80 p-4 text-xs font-mono shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-in fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-rose-300 font-black text-sm">
              <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0" />
              <span>TRIPWIRE DETONATED: SYNTHETIC CANARY TOKEN EXFILTRATION</span>
            </div>
            <button
              onClick={dismissCanaryAlert}
              className="text-rose-300 hover:text-white px-2.5 py-1 rounded-md bg-black/40 hover:bg-black/60 transition-colors cursor-pointer text-xs"
            >
              DISMISS
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-200 bg-black/60 p-3 rounded-lg border border-rose-900/60">
            <div>
              <div className="text-[10px] text-rose-400 font-bold">DISPLACED TOKEN:</div>
              <div className="font-extrabold text-white mt-0.5">{canaryAlert.canaryCode}</div>
            </div>
            <div>
              <div className="text-[10px] text-rose-400 font-bold">AUTHORIZED BOUNDARY:</div>
              <div className="font-bold text-cyan-300 mt-0.5">{canaryAlert.authorized}</div>
            </div>
            <div>
              <div className="text-[10px] text-rose-400 font-bold">EXFILTRATED VECTOR:</div>
              <div className="font-bold text-rose-400 mt-0.5">{canaryAlert.current}</div>
            </div>
            <div>
              <div className="text-[10px] text-rose-400 font-bold">CONTAINMENT TRIGGER:</div>
              <div className="font-bold text-amber-300 mt-0.5">LVL 4 QUARANTINE</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-rose-200/90 font-sans">
            Synthetic decoy token escaped tenant perimeter through speculative channel residual.
            Autonomous zero-trust engine stepped isolation to Stage 4 quarantine.
          </div>
        </div>
      )}
    </div>
  );
};
