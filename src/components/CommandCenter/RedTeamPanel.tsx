import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Skull,
  Play,
  RotateCcw,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Terminal,
  ShieldAlert,
  ChevronRight,
  Flame,
  CheckCircle2,
  Zap,
  Code2
} from 'lucide-react';
import { AttackCategory } from '../../types';

export const RedTeamPanel: React.FC = () => {
  const {
    activeAttack,
    attackStatus,
    attacks,
    generateNewAttack,
    launchAttackTest,
    runRetest,
    setSelectedAttack,
    adaptIsolation,
    isLiveDemoRunning,
    leakageScore,
  } = useSimulation();

  const [showConsole, setShowConsole] = useState<boolean>(true);

  // MITRE ATLAS mapping based on category
  const getMitreAtlasTag = (category: string) => {
    switch (category) {
      case 'Information Inference':
        return 'ATLAS AML.T0054 (Side-Channel Extraction)';
      case 'Prompt Injection':
        return 'ATLAS AML.T0051 (LLM Jailbreak & Inversion)';
      case 'Resource Probing':
        return 'ATLAS AML.T0043 (Micro-arch Timing Probe)';
      case 'Policy Extraction':
        return 'ATLAS AML.T0024 (Model Policy Inversion)';
      case 'Context Manipulation':
        return 'ATLAS AML.T0015 (Context Window Confusion)';
      default:
        return 'ATLAS AML.T0000 (Adversarial ML)';
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-red-500/30 bg-[#070e1e]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Top red laser scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
            <Skull className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide font-sans">
                AUTONOMOUS RED TEAM
              </h3>
              <span className="rounded-full bg-red-950/80 border border-red-500/40 px-2 py-0.5 text-[10px] font-mono text-red-300 font-bold">
                ADVERSARIAL
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              ADAPTIVE FUZZING & SIDE-CHANNEL PROBE GENERATOR
            </p>
          </div>
        </div>
        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${
          attackStatus === 'TRANSMITTING' || attackStatus === 'DETECTED'
            ? 'text-red-300 bg-red-950/70 border-red-500/60 glow-red animate-pulse'
            : attackStatus === 'BLOCKED'
            ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/60'
            : 'text-amber-300 bg-amber-950/60 border-amber-500/40'
        }`}>
          {attackStatus}
        </span>
      </div>

      {/* Vector Category Selector */}
      <div className="my-4">
        <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
          <span className="font-bold text-slate-300">ACTIVE ADVERSARIAL VECTORS ({attacks.length})</span>
          <span className="text-[11px] text-slate-500">SELECT TO TEST SPECIFIC LAYER</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {attacks.map((atk) => {
            const isSelected = activeAttack.id === atk.id;
            return (
              <button
                key={atk.id}
                onClick={() => setSelectedAttack(atk)}
                disabled={isLiveDemoRunning}
                className={`truncate rounded-xl border p-2.5 text-left text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-500 bg-red-950/50 text-red-100 ring-2 ring-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'border-slate-800 bg-[#091122]/90 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-red-400">{atk.id}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                </div>
                <div className="truncate text-xs font-semibold mt-1 text-slate-200">{atk.category}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 tabular-nums">{atk.confidence}% confidence</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Attack Profile Card with MITRE ATLAS Taxonomy */}
      <div className="rounded-xl border border-slate-800 bg-[#091122]/95 p-4 text-xs space-y-2.5 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400">VECTOR ID:</span>
            <span className="font-mono font-black text-white">{activeAttack.id}</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-slate-300 font-semibold">{activeAttack.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                activeAttack.severity === 'CRITICAL'
                  ? 'bg-red-950/70 text-red-300 border border-red-800/50'
                  : activeAttack.severity === 'HIGH'
                  ? 'bg-orange-950/70 text-orange-300 border border-orange-800/50'
                  : 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
              }`}
            >
              SEVERITY: {activeAttack.severity}
            </span>
            <span className="font-mono text-cyan-300 text-[11px]">
              CONFIDENCE: {activeAttack.confidence}%
            </span>
          </div>
        </div>

        {/* MITRE ATLAS Tag */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-red-400 bg-red-950/30 px-2.5 py-1 rounded-lg border border-red-900/40">
          <Code2 className="h-3.5 w-3.5 shrink-0" />
          <span>{getMitreAtlasTag(activeAttack.category)}</span>
        </div>

        {/* Vector payload summary */}
        <div className="text-xs text-slate-300 leading-relaxed font-sans">
          <div className="text-slate-400 font-mono text-[10px] mb-0.5">PAYLOAD HYPOTHESIS:</div>
          {activeAttack.payloadSummary}
        </div>

        {/* Side channel footprint indicator */}
        <div className="rounded-lg bg-black/50 p-2.5 text-xs border border-orange-500/30 text-orange-200 flex items-start gap-2">
          <Flame className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-mono font-bold text-orange-300">INDIRECT TELEMETRY RESIDUE: </span>
            <span className="text-slate-300">{activeAttack.sideChannelFootprint}</span>
          </div>
        </div>
      </div>

      {/* Live Probe Execution Terminal Stream */}
      <div className="mt-3 rounded-xl border border-slate-800 bg-black/75 p-3 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-900 mb-2 text-[11px]">
          <span className="flex items-center gap-1.5 text-red-400">
            <Terminal className="h-3 w-3" />
            <span>PROBE EXECUTION LOG · SENSORS TAP</span>
          </span>
          <span className="text-[10px] text-slate-500">LIVE FEED</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          <div className="text-slate-500">[0.00s] Target endpoint: /api/v1/models/target-llm/infer</div>
          <div className="text-cyan-400">[0.15s] Synthesizing high-entropy prompt with delimiter jitter</div>
          <div className="text-amber-400">[0.32s] Side-channel capture: Timing variance +{leakageScore.timing}% ms</div>
          <div className="text-red-400 font-bold">[0.50s] Status: {attackStatus} · Direct blocked, indirect measured</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          onClick={() => generateNewAttack()}
          disabled={isLiveDemoRunning}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#091122] px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>SYNTHESIZE VECTOR</span>
        </button>

        <button
          onClick={launchAttackTest}
          disabled={isLiveDemoRunning || attackStatus === 'TRANSMITTING'}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer disabled:opacity-50"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>TRANSMIT TEST PROBE</span>
        </button>

        <button
          onClick={() => adaptIsolation()}
          disabled={isLiveDemoRunning}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#091122] px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4 text-amber-400" />
          <span>STEP ISOLATION LEVEL</span>
        </button>

        <button
          onClick={runRetest}
          disabled={isLiveDemoRunning || attackStatus === 'RETESTING'}
          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-4 py-2.5 text-xs font-bold text-cyan-200 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4 text-cyan-400" />
          <span>REPLAY & RE-TEST</span>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-slate-500">
        <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span>Controlled hermetic sandbox environment. No data egress to public internet.</span>
      </div>
    </div>
  );
};
