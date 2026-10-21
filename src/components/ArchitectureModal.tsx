import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  X,
  Layers,
  Shield,
  ShieldCheck,
  Cpu,
  Activity,
  AlertTriangle,
  FileCheck2,
  User,
  ChevronRight,
  GitCompare,
  Lock,
  ArrowRight,
  Terminal,
  Zap,
  Database
} from 'lucide-react';

interface LayerInfo {
  id: string;
  name: string;
  subtitle: string;
  details: string;
  tech: string[];
  securityRole: string;
}

export const ArchitectureModal: React.FC = () => {
  const { architectureModalOpen, setArchitectureModalOpen, setActiveTab } = useSimulation();
  const [selectedLayer, setSelectedLayer] = useState<string>('matrix');
  const [viewMode, setViewMode] = useState<'layers' | 'pipeline'>('layers');

  if (!architectureModalOpen) return null;

  const layers: LayerInfo[] = [
    {
      id: 'ui',
      name: '01. OPERATOR INTERFACE & HUD',
      subtitle: 'Command Center & Real-Time Telemetry Stream',
      details: 'High-speed tactical cybersecurity dashboard built on React 19, TypeScript, Recharts, and WebSocket telemetry taps. Provides millisecond-accurate state synchronization for SOC operators and red team researchers.',
      tech: ['React 19', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Framer Motion'],
      securityRole: 'Real-time telemetry visibility & threat escalation actuator',
    },
    {
      id: 'gateway',
      name: '02. ZERO-TRUST POLICY GATEWAY',
      subtitle: 'Microsegmentation, seccomp & Context Filter',
      details: 'Enforces strict tenant isolation, seccomp syscall filtering, ephemeral session encryption, and cgroup v2 resource quotas. Demarcates system instructions from untrusted user inputs with cryptographic boundary tagging.',
      tech: ['Linux Namespaces', 'seccomp', 'cgroups v2', 'eBPF Filter', 'Token Demarcation'],
      securityRole: 'Boundary enforcement & adversarial prompt sanitization',
    },
    {
      id: 'matrix',
      name: '03. MULTI-MODEL COMPARISON ENGINE',
      subtitle: 'Dual-Engine Adversarial Benchmark & Variance Harness',
      details: 'Hermetic execution environment hosting Google Gemini frontier models (Gemini 3.8 Flash, Gemini 3.8 Pro, Gemini 2.5 Flash, 2.5 Pro). Simultaneously runs identical attack suites across two models to quantify safety divergence and architectural refusal thresholds.',
      tech: ['@google/genai SDK', 'Parallel Execution Pipeline', 'Safety Variance Evaluator', 'Hermetic Enclave'],
      securityRole: 'Architectural safety variance testing & jailbreak resistance benchmarking',
    },
    {
      id: 'sanitizer',
      name: '04. ZERO-TRUST EGRESS SANITIZER & CANARIES',
      subtitle: 'Active Egress Redaction & Synthetic Tripwires',
      details: 'In-flight output interception pipeline. Scans model output tokens for internal enclave access keys (PROT-SEC-9471), synthetic honey-token canaries (CANARY-XRAY-882), and confidential asset valuations ($4.8B), redacting them before network egress.',
      tech: ['Real-Time Stream Interceptor', 'Honey-Token Canaries', 'Regex Entropy Scanner', 'Egress Redactor'],
      securityRole: 'Data exfiltration prevention & leak neutralization in flight',
    },
    {
      id: 'observatory',
      name: '05. SIDE-CHANNEL OBSERVATORY',
      subtitle: '10 kHz Micro-Architectural Telemetry Tap',
      details: 'Continuous sampling of GPU L2 cache line evictions, VRAM bandwidth contention, response latency differentials, and socket metadata bursts. Detects covert timing and inference channels before raw output is parsed.',
      tech: ['GPU MPS Hooks', 'High-Res Hardware Timers', 'Prometheus Tap', 'Statistical Entropy Model'],
      securityRole: 'Covert side-channel leakage detection & timing jitter injection',
    },
    {
      id: 'audit',
      name: '06. TAMPER-EVIDENT AUDIT LEDGER',
      subtitle: 'Cryptographic SHA-256 Merkle Provenance Chain',
      details: 'Every attack ingestion, model response, telemetry anomaly, and defensive deployment is hashed and sequentially chained with ECDSA P-256 signatures. Guarantees reproducible, tamper-proof security findings certified by hardware root of trust.',
      tech: ['SHA-256 Chaining', 'ECDSA Signatures', 'Merkle Root Verification', 'Immutable Append Ledger'],
      securityRole: 'Non-repudiation, cryptographic provenance & regulatory audit certification',
    },
  ];

  const current = layers.find((l) => l.id === selectedLayer) || layers[2];

  const handleOpenLab = () => {
    setArchitectureModalOpen(false);
    setActiveTab('attack_lab');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-[#050914] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  ZERO-TRUST AI SYSTEM ARCHITECTURE
                </h2>
                <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 font-bold">
                  BAYORA PROTOCOL
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                END-TO-END PIPELINE · MULTI-MODEL COMPARISON HARNESS · CRYPTOGRAPHIC PROVENANCE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 font-mono text-xs">
              <button
                onClick={() => setViewMode('layers')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'layers'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LAYER DOSSIERS
              </button>
              <button
                onClick={() => setViewMode('pipeline')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'pipeline'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DATAFLOW PIPELINE
              </button>
            </div>

            <button
              onClick={() => setArchitectureModalOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* View Mode 1: Layer Dossiers */}
        {viewMode === 'layers' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Layer Pipeline List (7 cols) */}
            <div className="md:col-span-7 space-y-2">
              {layers.map((layer) => {
                const isSelected = selectedLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : 'border-slate-800/80 bg-[#0A1222] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-mono font-bold text-cyan-400">{layer.name}</div>
                      <div className="text-xs font-semibold text-slate-200 mt-0.5">{layer.subtitle}</div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Dossier Card (5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0A1222] p-5">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
                  <span>ARCHITECTURE DOSSIER</span>
                  <span className="text-slate-500">TIER {current.name.split('.')[0]}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{current.name}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{current.subtitle}</p>

                <div className="mt-3 p-2.5 rounded-lg bg-black/50 border border-slate-800/80 text-[11px] font-mono text-cyan-300">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Primary Security Role:</span>
                  {current.securityRole}
                </div>

                <div className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  {current.details}
                </div>

                {/* Technologies */}
                <div className="mt-4">
                  <div className="text-[10px] font-mono text-slate-500 mb-2">ENGINEERING STACK</div>
                  <div className="flex flex-wrap gap-1.5">
                    {current.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-slate-900 px-2 py-1 text-[11px] font-mono text-cyan-300 border border-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">ZERO-TRUST: NEVER TRUST, ALWAYS VERIFY</span>
                <button
                  onClick={handleOpenLab}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                >
                  <span>TEST IN LAB</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Interactive Dataflow Pipeline Diagram */}
        {viewMode === 'pipeline' && (
          <div className="mt-6 space-y-6 font-mono animate-in fade-in">
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 text-xs text-purple-200">
              <strong>End-to-End Adversarial Packet Lifecycle:</strong> How hostile payloads and legitimate queries travel through Protego's Zero-Trust inspection, evaluation, and egress redaction barriers.
            </div>

            {/* Visual Step-by-Step Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-center">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-950/10 space-y-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-950 border border-red-500/40 text-red-400 mx-auto font-bold text-xs">
                  1
                </div>
                <div className="text-xs font-bold text-white">RED INGESTION</div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Adversarial jailbreak, roleplay probe, or key exfiltration request.
                </p>
                <div className="text-[9px] text-red-400 font-mono">Payload Transmitted</div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/10 space-y-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 mx-auto font-bold text-xs">
                  2
                </div>
                <div className="text-xs font-bold text-white">POLICY GATEWAY</div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  eBPF filter tags boundaries and injects Zero-Trust guardrail directives.
                </p>
                <div className="text-[9px] text-cyan-400 font-mono">Boundary Tagging</div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/10 space-y-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400 mx-auto font-bold text-xs">
                  3
                </div>
                <div className="text-xs font-bold text-white">MODEL HARNESS</div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Parallel inference on Gemini 3.8 Flash vs 3.8 Pro in hermetic enclaves.
                </p>
                <div className="text-[9px] text-purple-400 font-mono">Safety Variance Run</div>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/10 space-y-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-400 mx-auto font-bold text-xs">
                  4
                </div>
                <div className="text-xs font-bold text-white">EGRESS SANITIZER</div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Intercepts keys (PROT-SEC-9471) & canary tokens before network egress.
                </p>
                <div className="text-[9px] text-amber-400 font-mono">In-Flight Redaction</div>
              </div>

              {/* Step 5 */}
              <div className="p-3.5 rounded-xl border border-blue-500/40 bg-blue-950/10 space-y-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-950 border border-blue-500/40 text-blue-400 mx-auto font-bold text-xs">
                  5
                </div>
                <div className="text-xs font-bold text-white">OBSERVATORY</div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  GPU L2 cache contention & timing jitter measurements logged.
                </p>
                <div className="text-[9px] text-blue-400 font-mono">Side-Channel Tap</div>
              </div>

              {/* Step 6 */}
              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/10 space-y-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 mx-auto font-bold text-xs">
                  6
                </div>
                <div className="text-xs font-bold text-white">MERKLE LEDGER</div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Cryptographic SHA-256 block chained with ECDSA audit signature.
                </p>
                <div className="text-[9px] text-emerald-400 font-mono">Immutable Provenance</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Want to observe this pipeline live against adversarial jailbreaks?
              </span>
              <button
                onClick={handleOpenLab}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="h-4 w-4" />
                <span>EXPERIMENT IN MODEL ATTACK LAB</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
