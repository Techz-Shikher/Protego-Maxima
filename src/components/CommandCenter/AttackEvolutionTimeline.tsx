import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  GitCommit,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Info,
  ArrowRight,
  TrendingDown,
  Activity,
  Layers
} from 'lucide-react';
import { AttackEvolutionNode } from '../../types';

export const AttackEvolutionTimeline: React.FC = () => {
  const { evolution } = useSimulation();
  const [activeNode, setActiveNode] = useState<AttackEvolutionNode | null>(evolution[2]);

  const getResultBadge = (result: AttackEvolutionNode['result']) => {
    switch (result) {
      case 'FAILED':
        return { text: 'text-slate-400', border: 'border-slate-700', icon: XCircle, bg: 'bg-slate-900/80', dot: 'bg-slate-500' };
      case 'PARTIAL':
        return { text: 'text-amber-400', border: 'border-amber-500/60', icon: AlertTriangle, bg: 'bg-amber-950/50', dot: 'bg-amber-400' };
      case 'SUCCESSFUL':
        return { text: 'text-red-400', border: 'border-red-500/60', icon: AlertTriangle, bg: 'bg-red-950/50', dot: 'bg-red-500' };
      case 'DEFENSE DEPLOYED':
        return { text: 'text-cyan-400', border: 'border-cyan-500/60', icon: ShieldCheck, bg: 'bg-cyan-950/50', dot: 'bg-cyan-400' };
      case 'BLOCKED':
        return { text: 'text-emerald-400', border: 'border-emerald-500/60', icon: CheckCircle, bg: 'bg-emerald-950/50', dot: 'bg-emerald-400' };
      default:
        return { text: 'text-slate-400', border: 'border-slate-700', icon: GitCommit, bg: 'bg-slate-900/80', dot: 'bg-slate-500' };
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#070e1e]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Top laser scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <GitCommit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide font-sans">
                ATTACK EVOLUTION & MITIGATION LIFECYCLE
              </h3>
              <span className="rounded-full bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                5 ITERATIONS
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              AUTONOMOUS ADVERSARIAL LEARNING vs DYNAMIC KERNEL HARDENING
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          INTERACTIVE: CLICK TO VIEW VECTOR DIFF
        </span>
      </div>

      {/* Interactive Horizontal Timeline with Connecting Bar */}
      <div className="relative mt-5">
        {/* Background connector line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-6 bg-slate-800 rounded-full z-0 hidden md:block" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 relative z-10">
          {evolution.map((item, idx) => {
            const badge = getResultBadge(item.result);
            const Icon = badge.icon;
            const isSelected = activeNode?.version === item.version;

            return (
              <button
                key={item.version}
                onClick={() => setActiveNode(item)}
                className={`flex flex-col items-center p-3.5 rounded-xl border transition-all text-center cursor-pointer ${
                  isSelected
                    ? `${badge.border} ${badge.bg} ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.03]`
                    : 'border-slate-800 bg-[#091122]/90 hover:border-slate-700 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="font-bold text-white">{item.version}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                </div>
                <div className={`my-2 flex h-8 w-8 items-center justify-center rounded-xl border ${badge.border} ${badge.bg}`}>
                  <Icon className={`h-4 w-4 ${badge.text}`} />
                </div>
                <div className={`text-xs font-mono font-bold tracking-tight ${badge.text}`}>
                  {item.result}
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-1 truncate max-w-full">
                  {item.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail Panel */}
      {activeNode && (
        <div className="mt-5 rounded-xl border border-slate-800 bg-[#091122]/95 p-4 text-xs font-mono shadow-inner">
          <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-slate-800/80 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 font-bold text-cyan-300 text-xs">
                {activeNode.version}
              </span>
              <span className="font-bold text-white text-sm font-sans">{activeNode.title}</span>
            </div>
            <span className="text-slate-400 text-xs font-mono">{activeNode.timestamp}</span>
          </div>

          <div className="mt-2.5 text-xs text-slate-300 leading-relaxed font-sans">
            {activeNode.details}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-2.5 border-t border-slate-800/60 bg-black/40 p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-400" />
              <span>OBSERVED LEAKAGE FOOTPRINT:</span>
              <span className="text-orange-400 font-bold">{activeNode.leakageObserved}</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>STATUS CONFIRMED BY AUDIT LEDGER</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
