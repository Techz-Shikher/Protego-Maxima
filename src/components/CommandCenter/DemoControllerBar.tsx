import React from 'react';
import { useSimulation, DEMO_STEPS } from '../../context/SimulationContext';
import { Play, Pause, SkipForward, SkipBack, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const DemoControllerBar: React.FC = () => {
  const {
    isLiveDemoRunning,
    demoStep,
    demoStepInfo,
    pauseLiveDemo,
    resumeLiveDemo,
    stepDemo,
    stopLiveDemo,
  } = useSimulation();

  return (
    <div className="sticky top-16 z-30 mb-6 w-full rounded-xl border border-cyan-500/50 bg-[#0A1222]/95 p-3.5 shadow-2xl backdrop-blur-md glow-cyan">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Step indicator & summary */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono font-bold text-xs shrink-0">
            {String(demoStep).padStart(2, '0')}/12
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                {demoStepInfo.phase}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-white font-semibold">
                {demoStepInfo.title}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {demoStepInfo.actionText}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => stepDemo(Math.max(1, demoStep - 1))}
            disabled={demoStep <= 1}
            title="Previous Step"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>

          {isLiveDemoRunning ? (
            <button
              onClick={pauseLiveDemo}
              className="flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-950/60 px-3 py-1.5 text-xs font-mono font-semibold text-amber-200 hover:bg-amber-900/60 transition-colors"
            >
              <Pause className="h-3.5 w-3.5" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={resumeLiveDemo}
              className="flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-950/60 px-3 py-1.5 text-xs font-mono font-semibold text-cyan-200 hover:bg-cyan-900/60 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-cyan-400" />
              <span>RESUME</span>
            </button>
          )}

          <button
            onClick={() => stepDemo(Math.min(12, demoStep + 1))}
            disabled={demoStep >= 12}
            title="Next Step"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={stopLiveDemo}
            title="Exit Live Demo"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-400 hover:text-red-400 transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 12-Step Progress Dots / Scrubber */}
      <div className="mt-3 flex items-center gap-1">
        {DEMO_STEPS.map((step) => {
          const isDone = demoStep > step.step;
          const isCurrent = demoStep === step.step;

          return (
            <button
              key={step.step}
              onClick={() => stepDemo(step.step)}
              title={`Step ${step.step}: ${step.title}`}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                isCurrent
                  ? 'bg-cyan-400 ring-2 ring-cyan-400/40'
                  : isDone
                  ? 'bg-emerald-500/70 hover:bg-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
