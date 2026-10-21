import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { CheckCircle2, Award, Shield, X, ArrowRight, RotateCcw } from 'lucide-react';

export const FinalDemoModal: React.FC = () => {
  const {
    finalDemoModalOpen,
    setFinalDemoModalOpen,
    securityScore,
    resetSimulation,
    setActiveTab,
  } = useSimulation();

  if (!finalDemoModalOpen) return null;

  const checklist = [
    { label: 'ATTACK', status: 'DETECTED', icon: CheckCircle2 },
    { label: 'LEAKAGE', status: 'CONTAINED', icon: CheckCircle2 },
    { label: 'ISOLATION', status: 'ADAPTED', icon: CheckCircle2 },
    { label: 'DEFENSE', status: 'DEPLOYED', icon: CheckCircle2 },
    { label: 'RE-TEST', status: 'PASSED', icon: CheckCircle2 },
    { label: 'AUDIT', status: 'VERIFIED', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/50 bg-[#050914] p-8 shadow-2xl glow-cyan text-center">
        <button
          onClick={() => setFinalDemoModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Kicker */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-3">
          <span>PROTEGO MAXIMA</span>
          <span className="text-slate-600">·</span>
          <span>BAYORA ZERO-TRUST</span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          SECURITY EVALUATION REPORT
        </h2>

        {/* 6-Item Verification Checklist */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          {checklist.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-slate-800 bg-[#0A1222] p-3 flex items-center justify-between font-mono text-xs"
            >
              <span className="text-slate-400">{item.label}</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Final Score Hero */}
        <div className="mt-6 rounded-xl border border-cyan-500/40 bg-[#0A1222] p-5">
          <div className="text-xs font-mono text-slate-400">CERTIFIED SECURITY SCORE</div>
          <div className="mt-1 flex items-baseline justify-center gap-1 font-mono">
            <span className="text-4xl font-extrabold text-white tabular-nums">
              {securityScore.total.toFixed(1)}
            </span>
            <span className="text-sm text-slate-400">/ 100</span>
          </div>
          <div className="mt-1 text-xs font-mono text-cyan-400 font-bold">
            ZERO-TRUST PARADIGM ENFORCED
          </div>
        </div>

        {/* Tagline Callout */}
        <blockquote className="mt-6 text-sm text-cyan-200/90 italic font-mono border-t border-slate-800 pt-4">
          "Don't just test whether AI can be broken.
          <br />
          Measure what the attacker can learn."
        </blockquote>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setFinalDemoModalOpen(false);
              setActiveTab('security_report');
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow glow-cyan transition-all"
          >
            <span>VIEW FULL REPORT</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              setFinalDemoModalOpen(false);
              resetSimulation();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>RESET DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
