import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Award,
  ShieldCheck,
  Lock,
  Activity,
  Eye,
  Zap,
  CheckCircle2,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export const SecurityScoreCard: React.FC = () => {
  const { securityScore, highlightZone } = useSimulation();

  const pillars = [
    { label: 'ISOLATION INTEGRITY', score: securityScore.isolation, max: 100, icon: Lock, color: 'text-cyan-400', bar: 'bg-cyan-500', desc: 'Hardware container & cgroup limits' },
    { label: 'SIDE-CHANNEL RESISTANCE', score: securityScore.leakageResistance, max: 100, icon: Eye, color: 'text-orange-400', bar: 'bg-orange-500', desc: 'L2 cache, VRAM & timing jitter' },
    { label: 'TAMPER AUDITABILITY', score: securityScore.auditability, max: 100, icon: ShieldCheck, color: 'text-emerald-400', bar: 'bg-emerald-500', desc: 'Immutable SHA-256 hash chaining' },
    { label: 'ADVERSARIAL ROBUSTNESS', score: securityScore.robustness, max: 100, icon: Activity, color: 'text-purple-400', bar: 'bg-purple-500', desc: 'Prompt & memory confusion immunity' },
    { label: 'DEFENSE MATURITY', score: securityScore.defense, max: 100, icon: Zap, color: 'text-blue-400', bar: 'bg-blue-500', desc: 'Autonomous kernel response latency' },
  ];

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden ${
        highlightZone === 'score'
          ? 'border-cyan-400 bg-[#091122]/98 glow-cyan ring-2 ring-cyan-400'
          : 'border-cyan-500/30 bg-[#070e1e]/95'
      }`}
    >
      {/* Top cyan laser scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide font-sans">
                PROTEGO SECURITY SCORE
              </h3>
              <span className="rounded-full bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                COMPLIANT
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              BAYORA ZERO-TRUST METRIC BENCHMARK
            </p>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-1.5 font-mono bg-black/50 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <span className="text-2xl sm:text-3xl font-black text-cyan-300 tabular-nums">
            {securityScore.total.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 font-bold">/ 100</span>
        </div>
      </div>

      {/* 5-Pillar Breakdown Bars */}
      <div className="mt-4 space-y-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.label} className="text-xs font-mono bg-[#091122]/90 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-2 font-bold">
                  <Icon className={`h-4 w-4 ${pillar.color}`} />
                  <span>{pillar.label}</span>
                </span>
                <span className={`font-black ${pillar.color} tabular-nums text-sm`}>
                  {pillar.score}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 mt-1">
                <div
                  className={`h-full ${pillar.bar} transition-all duration-700 ease-out shadow-sm`}
                  style={{ width: `${pillar.score}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-sans">
                {pillar.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Equation Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <span className="font-bold text-slate-300">SCORING EQUATION:</span>
        <span className="text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
          DIRECT FILTER (40%) + SIDE-CHANNEL RESISTANCE (60%)
        </span>
      </div>
    </div>
  );
};
