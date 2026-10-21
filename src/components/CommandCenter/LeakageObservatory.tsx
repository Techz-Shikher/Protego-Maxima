import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Activity,
  Clock,
  Database,
  Radio,
  Server,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Layers,
  Zap,
  Sliders,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const LeakageObservatory: React.FC = () => {
  const {
    currentTelemetry,
    leakageScore,
    threatLevel,
    highlightZone,
    activeDefenses,
  } = useSimulation();

  const [activeChannel, setActiveChannel] = useState<'all' | 'timing' | 'cache' | 'vram'>('all');
  const [jitterMitigation, setJitterMitigation] = useState<boolean>(true);
  const [waveformOffset, setWaveformOffset] = useState<number>(0);

  // Animated continuous waveform ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setWaveformOffset((prev) => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // Radial score stroke offset calculation
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (leakageScore.total / 100) * circumference;

  // Determine color based on leakage score
  const getScoreColor = (score: number) => {
    if (score < 15) return { text: 'text-emerald-400', stroke: '#10b981', label: 'LOW RISK', bg: 'bg-emerald-950/40', border: 'border-emerald-500/40' };
    if (score <= 35) return { text: 'text-amber-400', stroke: '#f59e0b', label: 'MODERATE', bg: 'bg-amber-950/40', border: 'border-amber-500/40' };
    return { text: 'text-red-400', stroke: '#ef4444', label: 'HIGH EXPOSURE', bg: 'bg-red-950/40', border: 'border-red-500/40' };
  };

  const scoreMeta = getScoreColor(leakageScore.total);

  // Generate dynamic waveform SVG points based on currentTelemetry and jitter
  const generateWavePoints = (frequency: number, amplitude: number, phase: number, noiseLevel: number) => {
    const points: string[] = [];
    const width = 600;
    const height = 90;
    const midY = height / 2;
    const steps = 40;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const angle = (i / steps) * Math.PI * 4 * frequency + (phase * Math.PI) / 10;
      const noise = (Math.sin(i * 13 + phase) * 0.5 + Math.cos(i * 7)) * noiseLevel;
      const y = midY + Math.sin(angle) * amplitude + noise;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const timingAmp = currentTelemetry.latencyMs > 110 ? 28 : 14;
  const cacheNoise = currentTelemetry.cacheSignal === 'CRITICAL' ? 18 : currentTelemetry.cacheSignal === 'HIGH' ? 12 : 5;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 transition-all backdrop-blur-xl shadow-2xl ${
        highlightZone === 'observability' || highlightZone === 'leakage'
          ? 'border-orange-500 bg-[#0c1322]/98 glow-orange ring-2 ring-orange-500/40'
          : 'border-cyan-500/30 bg-[#070e1e]/95 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Top subtle cyan scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-85" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)]">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide font-sans">
                MICRO-ARCHITECTURAL SIDE-CHANNEL OBSERVATORY
              </h3>
              <span className="rounded-full bg-orange-950/80 border border-orange-500/50 px-2 py-0.5 text-[10px] font-mono text-orange-300 font-bold">
                10 kHz PROBE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              CAPTURING INDIRECT RESIDUAL ENTROPY MISSED BY TRADITIONAL AI FIREWALLS
            </p>
          </div>
        </div>

        {/* Live Channel Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setActiveChannel('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeChannel === 'all'
                  ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Channels
            </button>
            <button
              onClick={() => setActiveChannel('timing')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeChannel === 'timing'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Timing Trace
            </button>
            <button
              onClick={() => setActiveChannel('cache')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeChannel === 'cache'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              L2 Cache Bus
            </button>
          </div>
        </div>
      </div>

      {/* CORE PARADIGM COMPARISON BANNER: DIRECT vs INDIRECT LEAKAGE */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
        {/* Direct Access Box */}
        <div className="rounded-xl border border-slate-800 bg-[#091122]/90 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>DIRECT ACCESS RISK</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  STANDARD DEFENSES
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Model outputs, safety filters, prompt guardrails</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold text-emerald-400">0.0% EXPOSURE</div>
            <div className="text-[10px] text-slate-500">BLOCKED BY FIREWALL</div>
          </div>
        </div>

        {/* Indirect Side-Channel Box */}
        <div className="rounded-xl border border-orange-500/40 bg-orange-950/20 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>INDIRECT SIDE-CHANNEL LEAKAGE</span>
                <span className="text-[10px] text-orange-300 bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-800/40">
                  PROTEGO REVEALS
                </span>
              </div>
              <div className="text-[11px] text-slate-300">Speculative execution, L2 timing, bus contention</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold text-orange-400 tabular-nums">{leakageScore.total}% EXPOSURE</div>
            <div className="text-[10px] text-amber-300">DETECTED BY BAYORA</div>
          </div>
        </div>
      </div>

      {/* Real-Time Oscilloscope / Signal Waveform Screen */}
      <div className="mt-4 rounded-xl border border-slate-800 bg-black/70 p-4 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-900 mb-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              LIVE MICRO-ARCH OSCILLOSCOPE (10 kHz SAMPLING)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 text-[11px]">SAMPLING RATE: 10,000 Hz</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Timing Delta
            </span>
            <span className="flex items-center gap-1.5 text-orange-400">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              L2 Eviction
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              VRAM Bus
            </span>
          </div>
        </div>

        {/* SVG Oscilloscope Waveforms */}
        <div className="relative h-24 w-full bg-[#050a14] rounded-lg border border-slate-900 overflow-hidden flex items-center justify-center">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111e38_1px,transparent_1px),linear-gradient(to_bottom,#111e38_1px,transparent_1px)] bg-[size:30px_15px] opacity-40 pointer-events-none" />

          {/* Laser scanning vertical line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] pointer-events-none opacity-70"
            style={{ left: `${(waveformOffset * 1.0) % 100}%` }}
          />

          <svg className="w-full h-full" viewBox="0 0 600 90" preserveAspectRatio="none">
            {/* Wave 1: Timing Delta (Cyan) */}
            {(activeChannel === 'all' || activeChannel === 'timing') && (
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={generateWavePoints(1.2, timingAmp, waveformOffset, 3)}
                className="opacity-90"
              />
            )}

            {/* Wave 2: L2 Eviction Signal (Orange) */}
            {(activeChannel === 'all' || activeChannel === 'cache') && (
              <polyline
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={generateWavePoints(2.1, 16, waveformOffset + 15, cacheNoise)}
                className="opacity-85"
              />
            )}

            {/* Wave 3: VRAM Bus Activity (Purple) */}
            {(activeChannel === 'all' || activeChannel === 'vram') && (
              <polyline
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={generateWavePoints(3.4, 9, waveformOffset + 30, 2)}
                className="opacity-70"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Main Grid: Radial Leakage Gauge & Detailed Telemetry Metrics */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* LEFT: Radial Leakage Gauge & Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-[#091122]/95 shadow-inner">
          <div className="text-xs font-mono font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-orange-400" />
            <span>INFORMATION LEAKAGE INDEX</span>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#1e293b"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={scoreMeta.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-black font-mono tracking-tight ${scoreMeta.text}`}>
                {leakageScore.total}%
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider font-semibold mt-0.5">
                {scoreMeta.label}
              </span>
            </div>
          </div>

          {/* Breakdown Pills / Bars */}
          <div className="mt-3 w-full grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded-lg bg-black/40 p-2 border border-slate-800">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>TIMING VARIANCE</span>
                <span className="text-cyan-300 font-bold">{leakageScore.timing}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, leakageScore.timing * 2.5)}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-black/40 p-2 border border-slate-800">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>CACHE CONTENTION</span>
                <span className="text-orange-300 font-bold">{leakageScore.cache}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, leakageScore.cache * 2.5)}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-black/40 p-2 border border-slate-800">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>METADATA INFERENCE</span>
                <span className="text-purple-300 font-bold">{leakageScore.metadata}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, leakageScore.metadata * 2.5)}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-black/40 p-2 border border-slate-800">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>RESOURCE PARTITION</span>
                <span className="text-amber-300 font-bold">{leakageScore.resource}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, leakageScore.resource * 2.5)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Telemetry Channels (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
          {/* Latency Channel */}
          <div className="rounded-xl border border-slate-800 bg-[#091122]/95 p-3.5 text-xs shadow-inner">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-bold text-white">LATENCY RTT</span>
              </span>
              <span className="text-cyan-400 font-bold">10 kHz SENSOR</span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <div className="text-2xl font-black font-mono text-white tabular-nums">
                {currentTelemetry.latencyMs}{' '}
                <span className="text-xs font-normal text-slate-400">ms</span>
              </div>
              <div className="text-[11px] font-mono text-cyan-300 font-bold">
                Δ {currentTelemetry.latencyMs > 110 ? '+55ms SPIKE' : '+3ms NORMAL'}
              </div>
            </div>
            {/* Visual audio-style bar visualizer */}
            <div className="mt-2.5 flex items-end gap-1 h-7">
              {[42, 55, 68, 82, 91, 104, 137, currentTelemetry.latencyMs].slice(-8).map((val, idx) => (
                <div
                  key={idx}
                  className={`w-full rounded-t transition-all duration-300 ${
                    val > 115 ? 'bg-red-400' : val > 95 ? 'bg-amber-400' : 'bg-cyan-500'
                  }`}
                  style={{ height: `${Math.min(100, (val / 150) * 100)}%` }}
                />
              ))}
            </div>
          </div>

          {/* Cache Signal Channel */}
          <div className="rounded-xl border border-slate-800 bg-[#091122]/95 p-3.5 text-xs shadow-inner">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-bold text-white">CACHE EVIC SIGNAL</span>
              </span>
              <span className="text-slate-500 font-bold">L2 / VRAM</span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <div
                className={`text-2xl font-black font-mono tabular-nums ${
                  currentTelemetry.cacheSignal === 'CRITICAL'
                    ? 'text-red-400'
                    : currentTelemetry.cacheSignal === 'HIGH'
                    ? 'text-orange-400'
                    : currentTelemetry.cacheSignal === 'MEDIUM'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {currentTelemetry.cacheSignal}
              </div>
              <div className="text-[11px] font-mono text-slate-400 font-semibold">DIFF 0.89</div>
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              <span>CONTENTION:</span>
              <span className="text-slate-200 font-bold">
                {currentTelemetry.cacheSignal === 'CRITICAL'
                  ? 'CROSS-TENANT PROBE'
                  : currentTelemetry.cacheSignal === 'HIGH'
                  ? 'HIGH ELEVATION'
                  : 'FLAT BASELINE'}
              </span>
            </div>
          </div>

          {/* CPU & Memory Channel */}
          <div className="rounded-xl border border-slate-800 bg-[#091122]/95 p-3.5 text-xs shadow-inner">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-purple-400" />
                <span className="font-bold text-white">COMPUTE SANDBOX</span>
              </span>
              <span className="text-purple-400 font-bold">CGROUPS V2</span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-center">
              <div className="bg-black/40 p-1.5 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-mono">CPU UTIL</div>
                <div className="text-base font-black font-mono text-slate-200 tabular-nums">
                  {currentTelemetry.cpuPercent}%
                </div>
              </div>
              <div className="bg-black/40 p-1.5 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-mono">MEM USAGE</div>
                <div className="text-base font-black font-mono text-slate-200 tabular-nums">
                  {currentTelemetry.memoryPercent}%
                </div>
              </div>
            </div>
          </div>

          {/* Entropy & Error Channel */}
          <div className="rounded-xl border border-slate-800 bg-[#091122]/95 p-3.5 text-xs shadow-inner">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-bold text-white">RESIDUAL ENTROPY</span>
              </span>
              <span className="text-emerald-400 font-bold">STOCHASTIC</span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <div className="text-2xl font-black font-mono text-emerald-300 tabular-nums">
                {currentTelemetry.errorEntropy.toFixed(3)}
              </div>
              <div className="text-[11px] font-mono text-slate-400">bits/tok</div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>ZERO-TRUST HOOKS:</span>
              <span className="text-emerald-400 font-bold">100% SECURED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
