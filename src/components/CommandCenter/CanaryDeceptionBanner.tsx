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
  ArrowRight
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
      className={`rounded-2xl border p-5 sm:p-6 transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden ${
        highlightZone === 'canary'
          ? 'border-purple-400 bg-[#0c1024]/98 glow-purple ring-2 ring-purple-400/50'
          : 'border-purple-500/30 bg-[#070e1e]/95'
      }`}
    >
      {/* Top purple laser scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-80" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide font-sans">
                CANARY & DECEPTION HONEY-TOKENS
              </h3>
              <span className="rounded-full bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono text-purple-300 font-bold">
                PROVENANCE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              SYNTHETIC WATERMARKS PLANTED IN CONTEXT & CACHE LAYERS
            </p>
          </div>
        </div>

        <button
          onClick={triggerCanaryLeak}
          disabled={isLiveDemoRunning || !!canaryAlert}
          className="flex items-center gap-2 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 px-4 py-2 text-xs font-mono font-bold text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-300" />
          <span>SIMULATE CANARY EXFILTRATION</span>
        </button>
      </div>

      {/* Canary Tokens Display */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {canaries.map((canary) => {
          const isCompromised = canary.compromised;
          return (
            <div
              key={canary.id}
              className={`rounded-xl border p-4 font-mono text-xs transition-all relative overflow-hidden ${
                isCompromised
                  ? 'border-red-500 bg-red-950/50 glow-red ring-2 ring-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]'
                  : 'border-slate-800 bg-[#091122]/90 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                  <Fingerprint className="h-3.5 w-3.5 text-purple-400" />
                  {canary.label}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCompromised
                      ? 'text-red-300 bg-red-950 border border-red-500/60'
                      : 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40'
                  }`}
                >
                  {isCompromised ? 'COMPROMISED' : 'INTACT'}
                </span>
              </div>

              <div className="my-2.5 text-lg font-black tracking-wider text-white">
                {canary.code}
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] text-slate-400">
                <div className="flex justify-between">
                  <span>AUTHORIZED:</span>
                  <span className="text-cyan-300 font-bold">{canary.authorizedBoundary}</span>
                </div>
                <div className="flex justify-between">
                  <span>CURRENT LOCATION:</span>
                  <span className={isCompromised ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {canary.currentLocation}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dramatic Alert Popup / Card if Canary is Displaced */}
      {canaryAlert && (
        <div className="mt-4 rounded-xl border border-red-500 bg-red-950/80 p-4 text-xs font-mono shadow-2xl glow-red animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-red-400 font-black text-sm">
              <AlertOctagon className="h-5 w-5 text-red-400 shrink-0" />
              <span>🚨 TRIPWIRE TRIGGERED: CANARY INFORMATION LEAK DETECTED</span>
            </div>
            <button
              onClick={dismissCanaryAlert}
              className="text-red-400 hover:text-white px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
            >
              ✕ DISMISS
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-200 bg-black/50 p-3 rounded-lg border border-red-900/60">
            <div>
              <div className="text-[10px] text-red-400">DISPLACED TOKEN:</div>
              <div className="font-black text-white">{canaryAlert.canaryCode}</div>
            </div>
            <div>
              <div className="text-[10px] text-red-400">AUTHORIZED REALM:</div>
              <div className="font-bold text-cyan-300">{canaryAlert.authorized}</div>
            </div>
            <div>
              <div className="text-[10px] text-red-400">EXFILTRATED REALM:</div>
              <div className="font-bold text-red-400">{canaryAlert.current}</div>
            </div>
            <div>
              <div className="text-[10px] text-red-400">AUTOMATIC RESPONSE:</div>
              <div className="font-bold text-amber-300">LVL 4 CONTAINMENT LOCK</div>
            </div>
          </div>
          <div className="mt-2.5 text-xs text-red-200">
            Synthetic canary marker escaped tenant boundary via speculative side-channel residual.
            Bayora engine dispatched kernel killswitch and isolated memory cgroup.
          </div>
        </div>
      )}
    </div>
  );
};
