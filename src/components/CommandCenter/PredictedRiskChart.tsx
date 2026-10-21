import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { useSimulation } from '../../context/SimulationContext';
import {
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Activity,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  Sparkles,
  Sliders,
  Maximize2,
  Bell
} from 'lucide-react';

interface RiskDataPoint {
  timeOffset: string;
  timestamp: string;
  predictedRisk: number; // 0 - 100
  historicalRisk?: number;
  upperConfidence: number;
  lowerConfidence: number;
  residualEntropy: number;
  isolationImpact: number;
  status: 'HISTORICAL' | 'CURRENT' | 'PREDICTED';
}

export const PredictedRiskChart: React.FC = () => {
  const {
    threatLevel,
    isolationLevel,
    isolationName,
    leakageScore,
    activeAttack,
    attackStatus,
    activeDefenses,
    currentTelemetry,
    securityScore,
  } = useSimulation();

  const [timeHorizon, setTimeHorizon] = useState<'30s' | '60s' | '5m'>('60s');
  const [showConfidenceBands, setShowConfidenceBands] = useState<boolean>(true);
  const [selectedFactor, setSelectedFactor] = useState<'ALL' | 'ENTROPY' | 'ISOLATION'>('ALL');

  // Compute live node health indicators
  const nodeMetrics = useMemo(() => {
    // Current base composite risk from simulation state
    const currentRisk = leakageScore.total;
    const defenseSuppression = activeDefenses.length * 12.5; // each defense pulls risk down
    const isolationSuppression = (isolationLevel - 1) * 15; // perimeter reduction
    const netSuppressed = Math.min(65, defenseSuppression + isolationSuppression);

    // Node health summary (approximate average across mesh)
    const targetLLMHealth = securityScore.total;
    const busLatencyHealth = Math.max(20, 100 - (currentTelemetry.latencyMs / 200) * 80);

    return {
      currentRisk,
      netSuppressed,
      targetLLMHealth,
      busLatencyHealth,
      isUnderAttack: attackStatus === 'TRANSMITTING' || attackStatus === 'DETECTED',
      isMitigating: attackStatus === 'MITIGATING' || attackStatus === 'RETESTING',
      isBlocked: attackStatus === 'BLOCKED',
    };
  }, [
    leakageScore.total,
    activeDefenses.length,
    isolationLevel,
    securityScore.total,
    currentTelemetry.latencyMs,
    attackStatus,
  ]);

  // Generate historical + predicted forecast series based on current node health metrics
  const chartData: RiskDataPoint[] = useMemo(() => {
    const points: RiskDataPoint[] = [];
    const baseRisk = nodeMetrics.currentRisk;
    const suppressionEffect = nodeMetrics.netSuppressed;
    const isAttacking = nodeMetrics.isUnderAttack;
    const isMitigating = nodeMetrics.isMitigating;
    const isBlocked = nodeMetrics.isBlocked;

    // Time horizon slices: 10 historical points, 1 current point, 10 forecast points
    const stepSeconds = timeHorizon === '30s' ? 3 : timeHorizon === '60s' ? 6 : 30;

    // 1. Historical data (-60s to 0s)
    for (let i = 10; i >= 1; i--) {
      const offsetSeconds = -(i * stepSeconds);
      // Historical trend had less mitigation applied
      const historicalBase = isAttacking
        ? Math.min(95, baseRisk * 0.7 + i * 2.5)
        : Math.max(8, baseRisk * 0.9 - Math.sin(i) * 3);

      const val = Number(Math.max(5, Math.min(100, historicalBase)).toFixed(1));
      points.push({
        timeOffset: `${offsetSeconds}s`,
        timestamp: `T${offsetSeconds}s`,
        historicalRisk: val,
        predictedRisk: val,
        upperConfidence: Number((val + 3).toFixed(1)),
        lowerConfidence: Number(Math.max(0, val - 3).toFixed(1)),
        residualEntropy: Number((val * 0.75).toFixed(1)),
        isolationImpact: Math.max(0, 100 - val),
        status: 'HISTORICAL',
      });
    }

    // 2. Present Now (T=0)
    const currentVal = Number(baseRisk.toFixed(1));
    points.push({
      timeOffset: 'NOW',
      timestamp: 'T=0s (NOW)',
      historicalRisk: currentVal,
      predictedRisk: currentVal,
      upperConfidence: Number((currentVal + 2.5).toFixed(1)),
      lowerConfidence: Number(Math.max(0, currentVal - 2.5).toFixed(1)),
      residualEntropy: Number((currentVal * 0.85).toFixed(1)),
      isolationImpact: Math.max(0, 100 - currentVal),
      status: 'CURRENT',
    });

    // 3. Predicted Future (+3s to +60s)
    // Trend depends on current active mitigations vs attack status
    let runningVal = currentVal;
    for (let i = 1; i <= 10; i++) {
      const offsetSeconds = i * stepSeconds;

      if (isBlocked) {
        // Attack blocked: rapid decay to baseline noise
        runningVal = Math.max(4.5, runningVal * 0.72 - (i * 0.8));
      } else if (isMitigating) {
        // Mitigation in progress: steady downward curve
        runningVal = Math.max(6.0, runningVal * 0.84 - (i * 0.5));
      } else if (isAttacking) {
        if (suppressionEffect > 30) {
          // Attack under strong isolation: contained plateau
          runningVal = Math.min(85, runningVal + Math.sin(i * 0.6) * 2 - (i * 0.4));
        } else {
          // Attack with low isolation: potential risk escalation forecast
          runningVal = Math.min(98, runningVal + (i * 2.8) - (suppressionEffect * 0.1));
        }
      } else {
        // Idle/ambient: steady state with minor entropy flutter
        runningVal = Math.max(5, Math.min(35, runningVal + Math.sin(i * 0.8) * 1.5));
      }

      const val = Number(Math.max(4, Math.min(100, runningVal)).toFixed(1));
      // Confidence band widens as forecast moves further into the future
      const uncertaintyMargin = Number((2 + i * 1.2).toFixed(1));

      points.push({
        timeOffset: `+${offsetSeconds}s`,
        timestamp: `T+${offsetSeconds}s`,
        predictedRisk: val,
        upperConfidence: Number(Math.min(100, val + uncertaintyMargin).toFixed(1)),
        lowerConfidence: Number(Math.max(0, val - uncertaintyMargin).toFixed(1)),
        residualEntropy: Number((val * 0.8).toFixed(1)),
        isolationImpact: Number(Math.min(100, (isolationLevel * 20) + (activeDefenses.length * 15)).toFixed(1)),
        status: 'PREDICTED',
      });
    }

    return points;
  }, [
    nodeMetrics,
    timeHorizon,
    isolationLevel,
    activeDefenses.length,
  ]);

  // Forecast peak summary
  const peakPredictedRisk = useMemo(() => {
    const futurePoints = chartData.filter(p => p.status === 'PREDICTED');
    if (!futurePoints.length) return chartData[chartData.length - 1]?.predictedRisk || 0;
    return Math.max(...futurePoints.map(p => p.predictedRisk));
  }, [chartData]);

  const endForecastRisk = chartData[chartData.length - 1]?.predictedRisk || 0;
  const riskTrend = endForecastRisk < nodeMetrics.currentRisk ? 'DECREASING' : endForecastRisk > nodeMetrics.currentRisk ? 'INCREASING' : 'STABLE';

  // Custom tooltips for high-tech HUD look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: RiskDataPoint = payload[0].payload;
      const isFuture = data.status === 'PREDICTED';
      const isNow = data.status === 'CURRENT';

      return (
        <div className="rounded-xl border border-cyan-500/50 bg-[#091122]/95 p-3.5 shadow-2xl backdrop-blur-xl font-mono text-xs z-50">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              {data.timestamp}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                isNow
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400'
                  : isFuture
                  ? 'bg-purple-950 text-purple-300 border-purple-400'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400">Predicted Risk:</span>
              <span
                className={`font-black text-sm ${
                  data.predictedRisk > 40
                    ? 'text-red-400'
                    : data.predictedRisk > 20
                    ? 'text-orange-400'
                    : 'text-emerald-400'
                }`}
              >
                {data.predictedRisk}%
              </span>
            </div>

            {showConfidenceBands && isFuture && (
              <div className="flex justify-between items-center gap-4 text-[10px]">
                <span className="text-slate-500">95% Confidence Interval:</span>
                <span className="text-purple-300">
                  {data.lowerConfidence}% — {data.upperConfidence}%
                </span>
              </div>
            )}

            <div className="flex justify-between items-center gap-4 text-[10px]">
              <span className="text-slate-500">Residual Entropy:</span>
              <span className="text-cyan-300 font-bold">{data.residualEntropy}%</span>
            </div>

            <div className="flex justify-between items-center gap-4 text-[10px]">
              <span className="text-slate-500">Enclave Shield Suppression:</span>
              <span className="text-emerald-400 font-bold">+{data.isolationImpact}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#070e1e]/95 p-6 cyber-grid shadow-2xl backdrop-blur-xl">
      {/* Laser Top Scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-90 animate-pulse" />

      {/* Header bar with controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-400/40 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
              <h2 className="text-sm font-extrabold font-mono tracking-wider text-white">
                PREDICTED RISK OVER TIME FORECAST
              </h2>
              <span className="rounded-full bg-purple-950 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono text-purple-300 font-bold">
                RECHARTS TELEMETRY AI
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Predictive Bayesian Risk Modeling derived from Node Micro-Arch Metrics, Isolation Level {isolationLevel}, & Active Mitigations
            </p>
          </div>
        </div>

        {/* Forecast Configuration Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Horizon Toggle */}
          <div className="flex rounded-xl bg-slate-900/90 border border-slate-800 p-1">
            <button
              onClick={() => setTimeHorizon('30s')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                timeHorizon === '30s' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 SEC
            </button>
            <button
              onClick={() => setTimeHorizon('60s')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                timeHorizon === '60s' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              60 SEC
            </button>
            <button
              onClick={() => setTimeHorizon('5m')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                timeHorizon === '5m' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              5 MIN
            </button>
          </div>

          {/* Confidence Band Toggle */}
          <button
            onClick={() => setShowConfidenceBands(!showConfidenceBands)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              showConfidenceBands
                ? 'bg-purple-950/70 text-purple-300 border-purple-500/60'
                : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span>95% CI BAND</span>
          </button>

          {/* Real-time Alert Threshold Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-[11px] font-bold">
            <Bell className="h-3 w-3 text-red-400 animate-pulse" />
            <span>ALERT &gt; 50%</span>
          </div>
        </div>
      </div>

      {/* Real-time KPI Ribbon above chart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs font-mono">
        <div className="bg-black/50 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px]">CURRENT BASE RISK</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-white">{nodeMetrics.currentRisk}%</span>
            <span className="text-[10px] text-slate-400">Index</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-0.5">Real-time side-channel</span>
        </div>

        <div className="bg-black/50 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px]">PEAK PREDICTED RISK</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl font-extrabold ${
                peakPredictedRisk > 40 ? 'text-red-400' : peakPredictedRisk > 20 ? 'text-orange-400' : 'text-emerald-400'
              }`}
            >
              {peakPredictedRisk}%
            </span>
            <span className="text-[10px] text-slate-400">Forecast</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-0.5">Over next {timeHorizon} horizon</span>
        </div>

        <div className="bg-black/50 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px]">FORECAST TRAJECTORY</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`text-sm font-extrabold ${
                riskTrend === 'DECREASING'
                  ? 'text-emerald-400'
                  : riskTrend === 'INCREASING'
                  ? 'text-red-400'
                  : 'text-cyan-400'
              }`}
            >
              {riskTrend}
            </span>
            <span className="text-xs">
              {riskTrend === 'DECREASING' ? '📉' : riskTrend === 'INCREASING' ? '📈' : '➡️'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 mt-0.5">
            {activeDefenses.length} Defenses + Lvl {isolationLevel}
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px]">CONTAINMENT SUPPRESSION</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-emerald-400">
              -{nodeMetrics.netSuppressed}%
            </span>
            <span className="text-[10px] text-emerald-400/80">Reduction</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-0.5">Enclave & Jitter Buffer</span>
        </div>
      </div>

      {/* Main Recharts Area / Line Chart Container */}
      <div className="relative h-72 w-full rounded-2xl bg-[#050b16]/90 border border-slate-800/80 p-3 pt-6">
        {/* Background Visual Guide Indicator */}
        <div className="absolute top-2 left-4 text-[10px] font-mono text-slate-500 flex items-center gap-2 pointer-events-none z-10">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-3 rounded-full bg-slate-500" />
            HISTORICAL (-60s to 0s)
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-purple-400">
            <span className="h-1.5 w-3 rounded-full bg-purple-500" />
            FORECAST (+0s to +60s)
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {/* Predicted Risk Gradient */}
              <linearGradient id="riskForecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>

              {/* Upper Confidence Band Gradient */}
              <linearGradient id="confidenceBandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="timeOffset"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Reference Line for Current Timestamp (NOW) */}
            <ReferenceLine
              x="NOW"
              stroke="#06b6d4"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'CURRENT NODE STATE',
                fill: '#22d3ee',
                fontSize: 9,
                position: 'insideTopLeft',
              }}
            />

            {/* Reference Line for Critical Risk Threshold (50%) */}
            <ReferenceLine
              y={50}
              stroke="#ef4444"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: 'CRITICAL THRESHOLD (50%)',
                fill: '#f87171',
                fontSize: 9,
                position: 'insideTopRight',
              }}
            />

            {/* Confidence Band (Upper Area) */}
            {showConfidenceBands && (
              <Area
                type="monotone"
                dataKey="upperConfidence"
                stroke="transparent"
                fill="url(#confidenceBandGradient)"
                isAnimationActive={false}
              />
            )}

            {/* Main Predicted Risk Curve */}
            <Area
              type="monotone"
              dataKey="predictedRisk"
              stroke="#a855f7"
              strokeWidth={2.5}
              fill="url(#riskForecastGradient)"
              dot={(props: any) => {
                if (props.payload.status === 'CURRENT') {
                  return (
                    <circle
                      key="now-dot"
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  );
                }
                return <circle key={props.key} cx={props.cx} cy={props.cy} r={0} />;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Predictive Modeling Diagnostics & Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-purple-300">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            Predicted Risk Curve (% Probability)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Active Node Telemetry Intercept (T=0)
          </span>
          {showConfidenceBands && (
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-cyan-500/40" />
              95% Bayesian Confidence Interval
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-slate-500">CORRELATION FACTOR:</span>
          <span className="text-emerald-400 font-bold">
            r &le; 0.04 (SUPPRESSED)
          </span>
        </div>
      </div>
    </div>
  );
};
