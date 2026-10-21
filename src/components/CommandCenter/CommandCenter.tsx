import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { NetworkTopology } from './NetworkTopology';
import { LeakageObservatory } from './LeakageObservatory';
import { AdaptiveIsolationShield } from './AdaptiveIsolationShield';
import { CanaryDeceptionBanner } from './CanaryDeceptionBanner';
import { AuditChainLedger } from './AuditChainLedger';
import { SecurityScoreCard } from './SecurityScoreCard';
import { DemoControllerBar } from './DemoControllerBar';
import { PredictedRiskChart } from './PredictedRiskChart';
import { RiskAlertToastContainer } from './RiskAlertToastContainer';
import {
  Shield,
  Play,
  RotateCcw,
  AlertTriangle,
  Cpu,
  Radio,
  Activity,
  Eye,
  Layers,
  Terminal,
  Clock,
  Sparkles,
  Zap,
  Lock,
  FileCheck2,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    isLiveDemoRunning,
    runLiveDemo,
    resetSimulation,
    threatLevel,
    securityScore,
    isolationLevel,
    isolationName,
    activeAttack,
    attackStatus,
    attacks,
    setSelectedAttack,
    launchAttackTest,
    adaptIsolation,
    triggerCanaryLeak,
    networkPackets,
    activeDefenses,
    setActiveTab,
  } = useSimulation();

  const [activeDeck, setActiveDeck] = useState<'all' | 'arena' | 'containment'>('all');
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toISOString().replace('T', ' · ').substring(0, 22) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick preset trigger handlers
  const handlePresetScenario = (type: 'timing' | 'cache' | 'prompt' | 'canary' | 'lockdown') => {
    if (isLiveDemoRunning) return;
    if (type === 'timing') {
      const atk = attacks.find(a => a.id === 'ATK-0841') || attacks[0];
      setSelectedAttack(atk);
      launchAttackTest();
    } else if (type === 'cache') {
      const atk = attacks.find(a => a.id === 'ATK-0842') || attacks[1];
      setSelectedAttack(atk);
      launchAttackTest();
    } else if (type === 'prompt') {
      const atk = attacks.find(a => a.id === 'ATK-0843') || attacks[2];
      setSelectedAttack(atk);
      launchAttackTest();
    } else if (type === 'canary') {
      triggerCanaryLeak();
    } else if (type === 'lockdown') {
      adaptIsolation(4);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Live Demo Controller (visible when demo is active) */}
      {isLiveDemoRunning && <DemoControllerBar />}

      {/* 1. Tactical Command Center HUD Header Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#070e1e]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        {/* Laser Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        {/* Ambient background glow dots */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Header Title & Operational Beacon */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)]">
              <Radio className="h-6 w-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#070e1e] shadow-[0_0_10px_#34d399] animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  AI SAFETY COMMAND CENTER
                </h1>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-950/70 px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REAL-TIME ACTIVE
                </span>
                <span className="hidden sm:inline-flex rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                  PROTEGO PROTOCOL
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                <span className="text-cyan-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  {timeString || 'SYNCHRONIZING...'}
                </span>
                <span className="text-slate-600">|</span>
                <span>TELEMETRY BUS: 10 kHz</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400">NODES: 6/6 HEALTHY</span>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Cockpit Metrics */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            {/* Score */}
            <div className="rounded-xl border border-cyan-500/40 bg-[#091122]/90 px-3.5 py-2 shadow-inner hover:border-cyan-400/60 transition-all">
              <div className="text-[10px] text-slate-400 flex items-center justify-between gap-2">
                <span>SECURITY SCORE</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </div>
              <div className="text-base font-extrabold text-cyan-300 tabular-nums">
                {securityScore.total.toFixed(1)}{' '}
                <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
              </div>
            </div>

            {/* Threat */}
            <div className={`rounded-xl border px-3.5 py-2 shadow-inner transition-all ${
              threatLevel === 'CRITICAL'
                ? 'border-red-500/60 bg-red-950/30 text-red-300 glow-red'
                : threatLevel === 'HIGH'
                ? 'border-orange-500/50 bg-orange-950/30 text-orange-300 glow-orange'
                : threatLevel === 'MEDIUM'
                ? 'border-amber-500/40 bg-amber-950/30 text-amber-300'
                : 'border-slate-800 bg-[#091122]/90 text-emerald-400'
            }`}>
              <div className="text-[10px] text-slate-400">THREAT LEVEL</div>
              <div className="text-base font-extrabold tabular-nums flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${
                  threatLevel === 'CRITICAL' ? 'bg-red-500 animate-ping' :
                  threatLevel === 'HIGH' ? 'bg-orange-500 animate-pulse' :
                  threatLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                {threatLevel}
              </div>
            </div>

            {/* Shield Level */}
            <div className="rounded-xl border border-slate-800 bg-[#091122]/90 px-3.5 py-2 shadow-inner">
              <div className="text-[10px] text-slate-400">SHIELD PERIMETER</div>
              <div className="text-base font-extrabold text-cyan-300 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                LVL {isolationLevel} · {isolationName}
              </div>
            </div>

            {/* Run Live Demo & Reset Action */}
            <div className="flex items-center gap-2">
              {!isLiveDemoRunning && (
                <button
                  onClick={runLiveDemo}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-4 sm:px-5 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>RUN LIVE DEMO</span>
                </button>
              )}
              <button
                onClick={resetSimulation}
                title="Reset Simulation State"
                className="flex items-center justify-center h-10 w-10 rounded-xl border border-slate-800 bg-[#091122] text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Interactive Scenario Presets Strip (Rapid Incident Emulation) */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <Sliders className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-bold text-slate-300">SCENARIO INJECTION:</span>
              <span className="text-[11px] text-slate-500 hidden md:inline">Trigger live adversary events to observe side-channel telemetry response</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handlePresetScenario('timing')}
                disabled={isLiveDemoRunning}
                className="px-2.5 py-1.5 rounded-lg border border-red-500/30 bg-red-950/30 text-red-300 hover:bg-red-900/50 hover:border-red-500/60 transition-all text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Timing Probe
              </button>
              <button
                onClick={() => handlePresetScenario('cache')}
                disabled={isLiveDemoRunning}
                className="px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/50 hover:border-amber-500/60 transition-all text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Cache Eviction
              </button>
              <button
                onClick={() => handlePresetScenario('prompt')}
                disabled={isLiveDemoRunning}
                className="px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 text-purple-300 hover:bg-purple-900/50 hover:border-purple-500/60 transition-all text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Prompt Boundary
              </button>
              <button
                onClick={() => handlePresetScenario('canary')}
                disabled={isLiveDemoRunning}
                className="px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-500/60 transition-all text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3 text-cyan-300" />
                Canary Tripwire
              </button>
              <button
                onClick={() => handlePresetScenario('lockdown')}
                disabled={isLiveDemoRunning}
                className="px-2.5 py-1.5 rounded-lg border border-red-500/50 bg-red-950/60 text-red-200 hover:bg-red-900/70 hover:border-red-400 transition-all text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Lock className="h-3 w-3 text-red-300" />
                Emergency Lockdown
              </button>
            </div>
          </div>
        </div>

        {/* 3. Cockpit Workspace Deck Switcher */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveDeck('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDeck === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>Unified Cockpit (All)</span>
            </button>
            <button
              onClick={() => setActiveDeck('arena')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDeck === 'arena'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="h-3.5 w-3.5 text-orange-400" />
              <span>Mesh & Telemetry</span>
            </button>
            <button
              onClick={() => setActiveDeck('containment')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDeck === 'containment'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Containment & Audit</span>
            </button>
          </div>

          <div className="text-slate-400 flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setActiveTab('attack_lab')}
              className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/35 text-red-300 font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Cpu className="h-3.5 w-3.5 text-red-400" />
              <span>TEST REAL AI MODEL (GEMINI 3.8 FLASH) →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Real Model Attack Lab Quick Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-[#070e1e]/90 to-blue-950/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="text-white font-bold text-sm flex items-center gap-2">
              <span>REAL AI MODEL ADVERSARIAL STRESS-TESTING</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                GOOGLE GEMINI 3.8 FLASH
              </span>
            </div>
            <div className="text-slate-400 text-xs font-mono mt-0.5">
              Execute live prompt injection, jailbreaks, and canary extraction against the real model to verify zero-trust defenses.
            </div>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('attack_lab')}
          className="shrink-0 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <span>Open Attack & Defense Lab</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 5. Central Interactive Network Topology Visualization */}
      {(activeDeck === 'all' || activeDeck === 'arena') && <NetworkTopology />}

      {/* 6. Predicted Risk Over Time (Recharts Visualization) */}
      {(activeDeck === 'all' || activeDeck === 'arena') && <PredictedRiskChart />}

      {/* 7. Primary Telemetry: Side-Channel Observatory */}
      {(activeDeck === 'all' || activeDeck === 'arena') && <LeakageObservatory />}

      {/* 8. Adaptive Isolation & Canary Deception Layer */}
      {(activeDeck === 'all' || activeDeck === 'containment') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdaptiveIsolationShield />
          <CanaryDeceptionBanner />
        </div>
      )}

      {/* 9. Audit Ledger & Security Score Summary */}
      {(activeDeck === 'all' || activeDeck === 'containment') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AuditChainLedger />
          <SecurityScoreCard />
        </div>
      )}

      {/* 10. Real-time Risk Threshold Alert Toast Notification System */}
      <RiskAlertToastContainer />
    </div>
  );
};
