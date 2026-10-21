import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Play, ArrowRight, Layers } from 'lucide-react';
import { InteractiveHeroTitle } from './InteractiveHeroTitle';
import { InteractiveParadigmStudio } from './InteractiveParadigmStudio';

export const LandingPage: React.FC = () => {
  const { runLiveDemo, setActiveTab, setArchitectureModalOpen } = useSimulation();

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Animated 3D Interactive Hero with Directional Mouse Hover */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <InteractiveHeroTitle />

          <blockquote className="text-base sm:text-lg text-cyan-300/90 italic font-mono border-y border-slate-800/80 py-4 max-w-xl mx-auto">
            "Don't just test whether AI can be broken.
            <br />
            Measure what the attacker can learn."
          </blockquote>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={runLiveDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 border border-cyan-400/40 px-6 py-3.5 text-sm font-bold text-white shadow-lg glow-cyan transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>RUN LIVE DEMO</span>
            </button>

            <button
              onClick={() => setActiveTab('attack_lab')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-950/40 hover:bg-red-900/50 px-6 py-3.5 text-sm font-bold text-red-200 shadow-md transition-all cursor-pointer hover:border-red-400"
            >
              <ArrowRight className="h-4 w-4 text-red-400" />
              <span>TEST REAL MODEL (GEMINI 3.8)</span>
            </button>

            <button
              onClick={() => setActiveTab('command_center')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#0A1222] hover:border-slate-600 hover:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <span>COMMAND CENTER</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 tracking-widest pt-2">
            REAL GEMINI MODEL · ATTACK · DETECT · ADAPT · DEFEND · PROVE
          </div>
        </div>

        {/* Humanized, Deeply Animated Paradigm Studio & Tri-Agent Arena */}
        <InteractiveParadigmStudio />

        {/* Quick Architecture Drawer Trigger */}
        <div className="text-center mt-6">
          <button
            onClick={() => setArchitectureModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Inspect Full Zero-Trust System Pipeline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
