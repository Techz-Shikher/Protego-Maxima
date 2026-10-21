import React, { useState, useEffect, useRef } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  AlertTriangle,
  ShieldAlert,
  X,
  Zap,
  TrendingUp,
  Shield,
  Activity,
  Bell,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';

export interface RiskToast {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  riskValue: number;
  severity: 'CRITICAL' | 'ELEVATED';
  threshold: number;
  factors: string[];
  suggestedAction: 'ISOLATE' | 'DEPLOY_DEFENSE' | 'REVIEW';
  dismissed?: boolean;
}

const CRITICAL_RISK_THRESHOLD = 50; // Threshold percentage for Critical alert
const ELEVATED_RISK_THRESHOLD = 35; // Threshold percentage for Elevated alert

export const RiskAlertToastContainer: React.FC = () => {
  const {
    leakageScore,
    isolationLevel,
    isolationName,
    activeAttack,
    attackStatus,
    activeDefenses,
    threatLevel,
    adaptIsolation,
    deployDefense,
  } = useSimulation();

  const [toasts, setToasts] = useState<RiskToast[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoDismissPaused, setAutoDismissPaused] = useState<boolean>(false);
  const lastAlertTimeRef = useRef<number>(0);
  const lastTriggeredThresholdRef = useRef<number>(0);

  // Synthesize current predicted risk based on simulation & node health metrics
  const currentRisk = leakageScore.total;
  const isAttackActive = attackStatus === 'TRANSMITTING' || attackStatus === 'DETECTED';

  // Compute forecast surge projection
  const projectedRisk = Number(
    (isAttackActive
      ? Math.min(98, currentRisk + 18 - (activeDefenses.length * 6) - (isolationLevel * 4))
      : currentRisk
    ).toFixed(1)
  );

  // Play audio chime effect using Web Audio API (tactical synth beep)
  const playAlertChime = (severity: 'CRITICAL' | 'ELEVATED') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = severity === 'CRITICAL' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(severity === 'CRITICAL' ? 880 : 587.33, audioCtx.currentTime); // A5 or D5
      osc.frequency.exponentialRampToValueAtTime(severity === 'CRITICAL' ? 440 : 880, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.26);
    } catch {
      // AudioContext could be blocked by autoplay policies
    }
  };

  // Evaluate risk metrics whenever telemetry or attacks change
  useEffect(() => {
    const now = Date.now();
    // Throttle duplicate alerts within 8 seconds unless risk dramatically surges
    const timeSinceLast = now - lastAlertTimeRef.current;

    let triggeredSeverity: 'CRITICAL' | 'ELEVATED' | null = null;
    let thresholdUsed = 0;

    if (projectedRisk >= CRITICAL_RISK_THRESHOLD) {
      triggeredSeverity = 'CRITICAL';
      thresholdUsed = CRITICAL_RISK_THRESHOLD;
    } else if (projectedRisk >= ELEVATED_RISK_THRESHOLD && threatLevel !== 'LOW') {
      triggeredSeverity = 'ELEVATED';
      thresholdUsed = ELEVATED_RISK_THRESHOLD;
    }

    if (triggeredSeverity && (timeSinceLast > 8000 || thresholdUsed > lastTriggeredThresholdRef.current)) {
      lastAlertTimeRef.current = now;
      lastTriggeredThresholdRef.current = thresholdUsed;

      const factors: string[] = [];
      if (leakageScore.timing > 20) factors.push(`Timing Jitter: +${leakageScore.timing}%`);
      if (leakageScore.cache > 20) factors.push(`L2 Cache Eviction: +${leakageScore.cache}%`);
      if (isolationLevel < 3) factors.push(`Perimeter LVL ${isolationLevel} (${isolationName})`);
      if (activeDefenses.length === 0) factors.push('Zero Active Countermeasures');

      const newToast: RiskToast = {
        id: `toast-${now}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString(),
        title: triggeredSeverity === 'CRITICAL'
          ? 'CRITICAL PREDICTED RISK SURGE'
          : 'ELEVATED RISK METRIC DETECTED',
        message: triggeredSeverity === 'CRITICAL'
          ? `Predicted side-channel risk forecast reached ${projectedRisk}%, breaching critical boundary (${thresholdUsed}%). Hardware isolation response strongly recommended.`
          : `Predicted risk trajectory climbed to ${projectedRisk}%, exceeding baseline threshold (${thresholdUsed}%).`,
        riskValue: projectedRisk,
        severity: triggeredSeverity,
        threshold: thresholdUsed,
        factors: factors.length ? factors : ['Unmitigated Side-Channel Signals'],
        suggestedAction: isolationLevel < 3 ? 'ISOLATE' : 'DEPLOY_DEFENSE',
      };

      setToasts(prev => [newToast, ...prev.slice(0, 3)]); // Keep max 4 concurrent toasts
      playAlertChime(triggeredSeverity);
    }
  }, [
    projectedRisk,
    threatLevel,
    isolationLevel,
    isolationName,
    leakageScore.timing,
    leakageScore.cache,
    activeDefenses.length,
  ]);

  // Auto-dismiss toasts after 9 seconds if not hovered
  useEffect(() => {
    if (autoDismissPaused || toasts.length === 0) return;

    const timer = setInterval(() => {
      setToasts(prev => {
        if (prev.length === 0) return prev;
        // Expire the oldest toast
        return prev.slice(0, prev.length - 1);
      });
    }, 9000);

    return () => clearInterval(timer);
  }, [toasts.length, autoDismissPaused]);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleApplyRemediation = (toast: RiskToast) => {
    if (toast.suggestedAction === 'ISOLATE') {
      adaptIsolation(Math.min(4, isolationLevel + 1) as any);
    } else {
      deployDefense('DEF-01');
    }
    dismissToast(toast.id);
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none"
      onMouseEnter={() => setAutoDismissPaused(true)}
      onMouseLeave={() => setAutoDismissPaused(false)}
    >
      {/* Toast HUD Controls Header (Sound & Clear) */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#091122]/95 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-400 shadow-xl backdrop-blur-md pointer-events-auto w-fit self-end">
        <span className="flex items-center gap-1.5 text-cyan-300 mr-2">
          <Bell className="h-3 w-3 text-cyan-400 animate-pulse" />
          <span>REAL-TIME RISK MONITOR ({toasts.length})</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
          >
            {soundEnabled ? <Volume2 className="h-3 w-3 text-cyan-400" /> : <VolumeX className="h-3 w-3 text-slate-500" />}
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setToasts([])}
            className="hover:text-red-400 transition-colors cursor-pointer"
          >
            DISMISS ALL
          </button>
        </div>
      </div>

      {/* Render Toast Cards */}
      {toasts.map((toast) => {
        const isCritical = toast.severity === 'CRITICAL';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 relative overflow-hidden ${
              isCritical
                ? 'border-red-500/80 bg-[#12080f]/95 glow-red ring-2 ring-red-500/40'
                : 'border-orange-500/80 bg-[#120c08]/95 glow-orange ring-1 ring-orange-500/40'
            }`}
          >
            {/* Top Alert Pulse Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                isCritical
                  ? 'from-red-600 via-rose-400 to-red-600 animate-pulse'
                  : 'from-orange-500 via-amber-400 to-orange-500'
              }`}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                    isCritical
                      ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                  }`}
                >
                  {isCritical ? (
                    <AlertTriangle className="h-5 w-5 animate-pulse" />
                  ) : (
                    <ShieldAlert className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-black font-mono tracking-wider ${
                        isCritical ? 'text-red-400' : 'text-orange-400'
                      }`}
                    >
                      {toast.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {toast.timestamp}
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-mono text-slate-300 leading-relaxed">
                    {toast.message}
                  </p>
                </div>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metric Details & Contributing Factors */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">THRESHOLD:</span>
                <span className="text-slate-400 font-bold">{toast.threshold}%</span>
                <span className="text-slate-700">·</span>
                <span className="text-[10px] text-slate-500">PEAK:</span>
                <span
                  className={`font-black ${
                    isCritical ? 'text-red-400' : 'text-orange-400'
                  }`}
                >
                  {toast.riskValue}%
                </span>
              </div>

              {/* Contributing factors badge */}
              <div className="flex flex-wrap items-center gap-1">
                {toast.factors.slice(0, 2).map((factor, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-black/60 border border-slate-800 text-slate-400"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* Tactical Remediation Action Button */}
            <div className="mt-3 flex items-center gap-2 font-mono">
              <button
                onClick={() => handleApplyRemediation(toast)}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                  isCritical
                    ? 'bg-red-600 hover:bg-red-500 glow-red'
                    : 'bg-orange-600 hover:bg-orange-500 glow-orange'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>
                  {toast.suggestedAction === 'ISOLATE'
                    ? `AUTOMATE ISOLATION (TO LVL ${Math.min(4, isolationLevel + 1)})`
                    : 'ENFORCE DEFENSIVE MITIGATION'}
                </span>
              </button>
              <button
                onClick={() => dismissToast(toast.id)}
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                IGNORE
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
