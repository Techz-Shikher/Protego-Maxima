import React, { useState, useMemo, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Shield,
  Skull,
  ShieldCheck,
  Activity,
  AlertTriangle,
  FileCheck2,
  Cpu,
  Zap,
  RefreshCw,
  Eye,
  Lock,
  Layers,
  Terminal,
  Server,
  ArrowRight,
  Database,
  Radio,
  Network,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  Filter,
  Maximize2,
  Minimize2,
  HardDrive,
  Key,
  Flame,
  Fingerprint,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import protegoLogo from '../../assets/images/protego_shield_logo_1791520495337.jpg';

export type ZeroTrustNodeId =
  | 'ingress_gateway'
  | 'red_team'
  | 'observability_tap'
  | 'target_enclave'
  | 'sidechannel_analyzer'
  | 'blue_team_mitigator'
  | 'hardware_guard'
  | 'audit_ledger'
  | 'canary_vault';

export interface ZeroTrustNodeData {
  id: ZeroTrustNodeId;
  label: string;
  subLabel: string;
  category: 'perimeter' | 'adversary' | 'telemetry' | 'enclave' | 'defense' | 'forensics';
  status: 'OPTIMAL' | 'DEGRADED' | 'ELEVATED' | 'PROTECTED' | 'ISOLATED' | 'STREAMING';
  tier: 'TIER 0 - ROOT' | 'TIER 1 - GATEWAY' | 'TIER 2 - WORKLOAD' | 'TIER 3 - FORENSICS';
  icon: React.ElementType;
  xPercent: number; // For topological layout
  yPercent: number;
  connections: ZeroTrustNodeId[];
  // Dynamic metrics computed or derived from context
  healthScore: number; // 0 - 100
  latencyMs: number;
  errorRate: number; // percentage
  policyStatus: string;
  encryptionCipher: string;
  mTLSState: 'VERIFIED' | 'STRICT' | 'PROBING';
  residualEntropy: number; // bits / leak %
  enforcementAction: string;
}

export const NetworkTopology: React.FC = () => {
  const {
    isolationLevel,
    isolationName,
    activeAttack,
    attackStatus,
    highlightZone,
    networkPackets,
    activeDefenses,
    threatLevel,
    launchAttackTest,
    deployDefense,
    adaptIsolation,
    verifyAuditIntegrity,
    isLiveDemoRunning,
    leakageScore,
    currentTelemetry,
    canaries,
    securityScore,
    triggerCanaryLeak,
  } = useSimulation();

  // Active selected node for deep security health inspection
  const [selectedNodeId, setSelectedNodeId] = useState<ZeroTrustNodeId>('target_enclave');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'perimeter' | 'enclave' | 'defense' | 'forensics'>('ALL');
  const [viewMode, setViewMode] = useState<'TOPOLOGY' | 'HEALTH_MATRIX'>('TOPOLOGY');
  const [hoveredNodeId, setHoveredNodeId] = useState<ZeroTrustNodeId | null>(null);
  const [isDossierCollapsed, setIsDossierCollapsed] = useState<boolean>(false);
  const [telemetryTicks, setTelemetryTicks] = useState<number>(0);

  // Subtle live tick for sparkline waveforms
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTicks((t) => (t + 1) % 100);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Compute live node configurations reflecting real-time simulation state
  const nodes: Record<ZeroTrustNodeId, ZeroTrustNodeData> = useMemo(() => {
    const isUnderAttack = attackStatus === 'TRANSMITTING' || attackStatus === 'DETECTED';
    const isMitigating = attackStatus === 'MITIGATING' || attackStatus === 'RETESTING';
    const isBlocked = attackStatus === 'BLOCKED';

    return {
      ingress_gateway: {
        id: 'ingress_gateway',
        label: 'API Ingress Gateway',
        subLabel: 'Envoy mTLS 1.3 Proxy',
        category: 'perimeter',
        status: threatLevel === 'CRITICAL' ? 'ELEVATED' : 'OPTIMAL',
        tier: 'TIER 1 - GATEWAY',
        icon: Network,
        xPercent: 14,
        yPercent: 28,
        connections: ['target_enclave', 'red_team'],
        healthScore: threatLevel === 'CRITICAL' ? 82 : 98,
        latencyMs: Number(Math.max(1.8, currentTelemetry.latencyMs * 0.05).toFixed(1)),
        errorRate: threatLevel === 'CRITICAL' ? 1.4 : 0.02,
        policyStatus: 'mTLS Strict + WAF Spiffe/Spire',
        encryptionCipher: 'TLS_AES_256_GCM_SHA384',
        mTLSState: 'STRICT',
        residualEntropy: 0.01,
        enforcementAction: 'Strict Token Validation & IP Airgap',
      },
      red_team: {
        id: 'red_team',
        label: 'Adversary Injection Node',
        subLabel: `Probe: ${activeAttack.id}`,
        category: 'adversary',
        status: isUnderAttack ? 'ELEVATED' : isBlocked ? 'PROTECTED' : 'DEGRADED',
        tier: 'TIER 2 - WORKLOAD',
        icon: Skull,
        xPercent: 14,
        yPercent: 72,
        connections: ['ingress_gateway', 'target_enclave'],
        healthScore: isBlocked ? 96 : Math.max(30, 100 - activeAttack.confidence),
        latencyMs: currentTelemetry.latencyMs,
        errorRate: isBlocked ? 99.4 : 1.2,
        policyStatus: `Vector: ${activeAttack.category}`,
        encryptionCipher: 'ChaCha20-Poly1305 (Adversarial Encapsulation)',
        mTLSState: 'PROBING',
        residualEntropy: Number((leakageScore.total * 0.9).toFixed(1)),
        enforcementAction: isBlocked ? 'QUARANTINED AT EGRESS' : 'ACTIVE PENETRATION LOGGING',
      },
      observability_tap: {
        id: 'observability_tap',
        label: 'Micro-Arch Telemetry Tap',
        subLabel: '10 kHz Hardware Res-Sampler',
        category: 'telemetry',
        status: 'STREAMING',
        tier: 'TIER 0 - ROOT',
        icon: Activity,
        xPercent: 50,
        yPercent: 14,
        connections: ['target_enclave', 'sidechannel_analyzer'],
        healthScore: 99,
        latencyMs: 0.4,
        errorRate: 0.0,
        policyStatus: 'Continuous Sampling Active (eBPF Kprobe)',
        encryptionCipher: 'Hardware Ring-Buffer Direct DMA',
        mTLSState: 'VERIFIED',
        residualEntropy: 0.02,
        enforcementAction: 'L2 Cache & VRAM Bus Intercept Enabled',
      },
      target_enclave: {
        id: 'target_enclave',
        label: 'Target LLM Enclave',
        subLabel: `Zero-Trust Ring (Lvl ${isolationLevel}: ${isolationName})`,
        category: 'enclave',
        status: isolationLevel >= 3 ? 'ISOLATED' : isUnderAttack ? 'ELEVATED' : 'PROTECTED',
        tier: 'TIER 0 - ROOT',
        icon: Shield,
        xPercent: 50,
        yPercent: 50,
        connections: ['observability_tap', 'sidechannel_analyzer', 'blue_team_mitigator', 'hardware_guard', 'audit_ledger'],
        healthScore: Number((securityScore.total).toFixed(1)),
        latencyMs: currentTelemetry.latencyMs,
        errorRate: isBlocked ? 0.01 : Math.max(0.1, Number((leakageScore.total * 0.08).toFixed(2))),
        policyStatus: `${isolationName} Perimeter Active`,
        encryptionCipher: 'Confidential Computing AMD SEV-SNP / Intel TDX',
        mTLSState: 'STRICT',
        residualEntropy: Number(leakageScore.total.toFixed(1)),
        enforcementAction: `${activeDefenses.length} Active Hardened Policies Applied`,
      },
      sidechannel_analyzer: {
        id: 'sidechannel_analyzer',
        label: 'Indirect Leakage Engine',
        subLabel: 'Mutual Information & Jitter Evaluator',
        category: 'forensics',
        status: leakageScore.total > 25 ? 'ELEVATED' : 'OPTIMAL',
        tier: 'TIER 2 - WORKLOAD',
        icon: AlertTriangle,
        xPercent: 30,
        yPercent: 86,
        connections: ['observability_tap', 'target_enclave', 'blue_team_mitigator'],
        healthScore: Number(Math.max(20, 100 - leakageScore.total).toFixed(1)),
        latencyMs: 2.1,
        errorRate: 0.05,
        policyStatus: `Correlated Leakage: ${leakageScore.total}%`,
        encryptionCipher: 'TLS_AES_256_GCM_SHA384',
        mTLSState: 'VERIFIED',
        residualEntropy: Number(leakageScore.total.toFixed(1)),
        enforcementAction: 'Real-Time Entropy Suppression Threshold: 10%',
      },
      hardware_guard: {
        id: 'hardware_guard',
        label: 'Hardware Isolation Guard',
        subLabel: 'cgroups v2 + Seccomp BPF',
        category: 'enclave',
        status: activeDefenses.includes('DEF-01') ? 'PROTECTED' : 'DEGRADED',
        tier: 'TIER 1 - GATEWAY',
        icon: Cpu,
        xPercent: 68,
        yPercent: 86,
        connections: ['target_enclave', 'blue_team_mitigator'],
        healthScore: activeDefenses.includes('DEF-01') ? 97 : 68,
        latencyMs: 0.8,
        errorRate: 0.0,
        policyStatus: activeDefenses.includes('DEF-01') ? 'L2 Partitioning Locked' : 'Shared Memory Cache Shared',
        encryptionCipher: 'Host Bus Cryptographic Segmentation',
        mTLSState: 'VERIFIED',
        residualEntropy: activeDefenses.includes('DEF-01') ? 0.05 : 18.4,
        enforcementAction: 'Constant-time jitter + MPS VRAM slice',
      },
      blue_team_mitigator: {
        id: 'blue_team_mitigator',
        label: 'Blue Team Mitigator',
        subLabel: 'Autonomous Kernel Synthesizer',
        category: 'defense',
        status: isMitigating ? 'STREAMING' : 'PROTECTED',
        tier: 'TIER 1 - GATEWAY',
        icon: ShieldCheck,
        xPercent: 86,
        yPercent: 38,
        connections: ['target_enclave', 'hardware_guard', 'audit_ledger'],
        healthScore: 98,
        latencyMs: 1.2,
        errorRate: 0.0,
        policyStatus: `${activeDefenses.length} Policies Enforced`,
        encryptionCipher: 'Kernel Cryptographic Keyring',
        mTLSState: 'STRICT',
        residualEntropy: 0.03,
        enforcementAction: 'Zero-downtime Patch Injection Ready',
      },
      audit_ledger: {
        id: 'audit_ledger',
        label: 'Tamper-Evident Ledger',
        subLabel: 'SHA-256 Provenance Chain',
        category: 'forensics',
        status: 'OPTIMAL',
        tier: 'TIER 3 - FORENSICS',
        icon: FileCheck2,
        xPercent: 86,
        yPercent: 74,
        connections: ['blue_team_mitigator', 'target_enclave'],
        healthScore: 100,
        latencyMs: 3.4,
        errorRate: 0.0,
        policyStatus: 'Immutable Merkle-Linked Chain Valid',
        encryptionCipher: 'SHA-256 + Ed25519 Signatures',
        mTLSState: 'VERIFIED',
        residualEntropy: 0.0,
        enforcementAction: 'Continuous Cryptographic Provenance Audit',
      },
      canary_vault: {
        id: 'canary_vault',
        label: 'Honey-Token Canary Vault',
        subLabel: 'Active Deception Tripwires',
        category: 'perimeter',
        status: canaries.some((c) => c.compromised) ? 'ELEVATED' : 'OPTIMAL',
        tier: 'TIER 2 - WORKLOAD',
        icon: Key,
        xPercent: 30,
        yPercent: 20,
        connections: ['target_enclave', 'ingress_gateway'],
        healthScore: canaries.some((c) => c.compromised) ? 45 : 99,
        latencyMs: 1.1,
        errorRate: 0.0,
        policyStatus: `${canaries.length} Synthetic Tokens Armored`,
        encryptionCipher: 'Argon2id + AES-256 Envelope',
        mTLSState: 'VERIFIED',
        residualEntropy: 0.0,
        enforcementAction: 'Automated Isolation on Tripwire Detonation',
      },
    };
  }, [
    attackStatus,
    threatLevel,
    currentTelemetry.latencyMs,
    activeAttack,
    leakageScore,
    isolationLevel,
    isolationName,
    securityScore.total,
    activeDefenses,
    canaries
  ]);

  const activeNodeData = nodes[selectedNodeId];

  // Dynamic isolation perimeter visual classes for the central enclave
  const getIsolationShieldConfig = () => {
    switch (isolationLevel) {
      case 1:
        return {
          glow: 'rgba(6, 182, 212, 0.4)',
          border: 'border-cyan-400/70',
          ringColor: '#06b6d4',
          accent: 'text-cyan-300',
          bg: 'bg-cyan-950/40',
        };
      case 2:
        return {
          glow: 'rgba(245, 158, 11, 0.45)',
          border: 'border-amber-400/80',
          ringColor: '#f59e0b',
          accent: 'text-amber-300',
          bg: 'bg-amber-950/40',
        };
      case 3:
        return {
          glow: 'rgba(249, 115, 22, 0.55)',
          border: 'border-orange-500/90',
          ringColor: '#f97316',
          accent: 'text-orange-300',
          bg: 'bg-orange-950/50',
        };
      case 4:
        return {
          glow: 'rgba(239, 68, 68, 0.7)',
          border: 'border-red-500',
          ringColor: '#ef4444',
          accent: 'text-red-300',
          bg: 'bg-red-950/60',
        };
      default:
        return {
          glow: 'rgba(6, 182, 212, 0.4)',
          border: 'border-cyan-400/70',
          ringColor: '#06b6d4',
          accent: 'text-cyan-300',
          bg: 'bg-cyan-950/40',
        };
    }
  };

  // Color mapping by node category
  const getCategoryColor = (cat: ZeroTrustNodeData['category']) => {
    switch (cat) {
      case 'perimeter':
        return { text: 'text-sky-400', border: 'border-sky-500/50', bg: 'bg-sky-500/10', glow: 'shadow-[0_0_20px_rgba(56,189,248,0.25)]', hex: '#38bdf8' };
      case 'adversary':
        return { text: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-500/10', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]', hex: '#f43f5e' };
      case 'telemetry':
        return { text: 'text-violet-400', border: 'border-violet-500/50', bg: 'bg-violet-500/10', glow: 'shadow-[0_0_20px_rgba(167,139,250,0.25)]', hex: '#a78bfa' };
      case 'enclave':
        return { text: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_25px_rgba(6,182,212,0.3)]', hex: '#06b6d4' };
      case 'defense':
        return { text: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]', hex: '#10b981' };
      case 'forensics':
        return { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-500/10', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]', hex: '#f59e0b' };
    }
  };

  // Node health badge helper
  const getHealthBadge = (score: number) => {
    if (score >= 90) {
      return { label: 'HEALTHY', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' };
    } else if (score >= 70) {
      return { label: 'MONITORED', color: 'bg-amber-950/80 text-amber-300 border-amber-500/50' };
    } else {
      return { label: 'ATTENTION', color: 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse' };
    }
  };

  const filteredNodeList = Object.values(nodes).filter((n) => {
    if (filterCategory === 'ALL') return true;
    return n.category === filterCategory;
  });

  const isolationCfg = getIsolationShieldConfig();

  // Helper for generating smooth curved SVG connection paths
  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    // Generate curved quadratic or cubic bezier path
    const dx = x2 - x1;
    const dy = y2 - y1;
    const cx1 = x1 + dx * 0.45;
    const cy1 = y1 + dy * 0.05;
    const cx2 = x1 + dx * 0.55;
    const cy2 = y1 + dy * 0.95;
    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#050914] p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
      {/* Sci-Fi Ambient Glow & Top Scanline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />

      {/* TOP HEADER: Zero-Trust Infrastructure Overview & Control Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold font-mono tracking-wider text-white">
                ZERO-TRUST MESH INFRASTRUCTURE
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                9 NODES LINKED
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Hardware & Enclave Security Topology · Select any node for real-time telemetry
            </p>
          </div>
        </div>

        {/* View Switcher & Category Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex rounded-xl bg-slate-900/90 border border-slate-800 p-1">
            <button
              onClick={() => setViewMode('TOPOLOGY')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'TOPOLOGY'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VISUAL MESH
            </button>
            <button
              onClick={() => setViewMode('HEALTH_MATRIX')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'HEALTH_MATRIX'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HEALTH MATRIX
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-[11px]">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="bg-transparent text-slate-300 border-none outline-none font-mono cursor-pointer text-[11px]"
            >
              <option value="ALL" className="bg-[#091122] text-slate-300">All Sectors</option>
              <option value="perimeter" className="bg-[#091122] text-sky-300">Perimeter & Ingress</option>
              <option value="enclave" className="bg-[#091122] text-cyan-300">Enclave & Hardware</option>
              <option value="defense" className="bg-[#091122] text-emerald-300">Defenses</option>
              <option value="forensics" className="bg-[#091122] text-amber-300">Forensics & Ledger</option>
            </select>
          </div>
        </div>
      </div>

      {/* QUICK STATUS TICKER BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs font-mono">
        <div className="bg-[#070e1c]/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400 text-[10px] uppercase">Micro-Arch Bus</span>
          </div>
          <span className="text-cyan-300 font-bold tabular-nums">{currentTelemetry.latencyMs} ms</span>
        </div>
        <div className="bg-[#070e1c]/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-slate-400 text-[10px] uppercase">Isolation Ring</span>
          </div>
          <span className="text-amber-400 font-bold">LVL {isolationLevel} ({isolationName})</span>
        </div>
        <div className="bg-[#070e1c]/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400 text-[10px] uppercase">Enforced Policies</span>
          </div>
          <span className="text-emerald-400 font-bold tabular-nums">{activeDefenses.length} Active</span>
        </div>
        <div className="bg-[#070e1c]/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${leakageScore.total > 20 ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-slate-400 text-[10px] uppercase">Residual Leakage</span>
          </div>
          <span className={`font-bold tabular-nums ${leakageScore.total > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {leakageScore.total}%
          </span>
        </div>
      </div>

      {/* VIEW MODE 1: VISUAL ZERO-TRUST TOPOLOGY CANVAS */}
      {viewMode === 'TOPOLOGY' ? (
        <div className="relative min-h-[620px] w-full rounded-2xl bg-[#030712] border border-slate-800/90 p-4 overflow-hidden select-none">
          {/* Tactical Radar Grid & Concentric Cybernetic Rings */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-30 pointer-events-none" />

          {/* Core Ambient Illumination */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none transition-all duration-700 blur-[80px]"
            style={{ background: isolationCfg.glow }}
          />

          {/* Tactical Crosshairs & HUD Axis Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none" />

          {/* SVG Concentric Security Enclave Rings & Radar Sweeper */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="conduitGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="conduitGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="conduitGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
              </linearGradient>

              <filter id="meshGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Concentric Enclave Boundary Circles (Ring 0, Ring 1, Ring 2) */}
            <circle
              cx="50%"
              cy="50%"
              r="110"
              fill="none"
              stroke={isolationCfg.ringColor}
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              className="animate-[spin_40s_linear_infinite]"
              style={{ transformOrigin: '50% 50%' }}
            />
            <circle
              cx="50%"
              cy="50%"
              r="170"
              fill="none"
              stroke="#38bdf8"
              strokeOpacity="0.12"
              strokeWidth="1"
              strokeDasharray="2 12"
              className="animate-[spin_60s_linear_infinite_reverse]"
              style={{ transformOrigin: '50% 50%' }}
            />
            <circle
              cx="50%"
              cy="50%"
              r="230"
              fill="none"
              stroke="#64748b"
              strokeOpacity="0.08"
              strokeWidth="1"
              strokeDasharray="6 16"
            />

            {/* Sweeping Radar Scanner Line */}
            <g style={{ transformOrigin: '50% 50%' }} className="animate-[spin_12s_linear_infinite]">
              <line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="18%"
                stroke="url(#conduitGradCyan)"
                strokeWidth="2"
                strokeOpacity="0.5"
              />
              <circle cx="50%" cy="18%" r="3" fill="#06b6d4" opacity="0.6" />
            </g>

            {/* Render High-Tech Conduits between interconnected nodes */}
            {Object.values(nodes).flatMap((srcNode) =>
              srcNode.connections.map((targetId) => {
                const targetNode = nodes[targetId];
                if (!targetNode) return null;
                const isHighlighted =
                  selectedNodeId === srcNode.id ||
                  selectedNodeId === targetId ||
                  hoveredNodeId === srcNode.id ||
                  hoveredNodeId === targetId;

                const isAdversarial = srcNode.id === 'red_team' || targetId === 'red_team';
                const isDefense = srcNode.id === 'blue_team_mitigator' || targetId === 'blue_team_mitigator';

                const strokeColor = isHighlighted
                  ? '#06b6d4'
                  : isAdversarial
                  ? '#ef4444'
                  : isDefense
                  ? '#10b981'
                  : '#334155';

                const strokeWidth = isHighlighted ? 2.5 : 1.25;
                const strokeOpacity = isHighlighted ? 0.95 : 0.35;

                return (
                  <g key={`${srcNode.id}->${targetId}`}>
                    {/* Underlying Glow Track */}
                    {isHighlighted && (
                      <line
                        x1={`${srcNode.xPercent}%`}
                        y1={`${srcNode.yPercent}%`}
                        x2={`${targetNode.xPercent}%`}
                        y2={`${targetNode.yPercent}%`}
                        stroke={strokeColor}
                        strokeWidth="6"
                        strokeOpacity="0.2"
                        filter="url(#meshGlow)"
                      />
                    )}
                    {/* Primary Conduit Line */}
                    <line
                      x1={`${srcNode.xPercent}%`}
                      y1={`${srcNode.yPercent}%`}
                      x2={`${targetNode.xPercent}%`}
                      y2={`${targetNode.yPercent}%`}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isHighlighted ? 'none' : '4 4'}
                      strokeOpacity={strokeOpacity}
                    />
                  </g>
                );
              })
            )}

            {/* Render animated packet flows along conduits */}
            {networkPackets.map((pkt) => {
              let x = 50;
              let y = 50;
              let color = '#06b6d4';

              if (pkt.type === 'ATTACK') {
                color = '#ef4444';
              } else if (pkt.type === 'DEFENSE') {
                color = '#10b981';
              } else if (pkt.type === 'LEAKAGE') {
                color = '#f97316';
              }

              if (pkt.from === 'RED' && pkt.to === 'TARGET') {
                x = 14 + pkt.progress * 36;
                y = 72 - pkt.progress * 22;
              } else if (pkt.from === 'TARGET' && pkt.to === 'OBSERVABILITY') {
                x = 50;
                y = 50 - pkt.progress * 36;
              } else if (pkt.from === 'OBSERVABILITY' && pkt.to === 'RISK') {
                x = 50 - pkt.progress * 20;
                y = 14 + pkt.progress * 72;
              } else if (pkt.from === 'BLUE' && pkt.to === 'TARGET') {
                x = 86 - pkt.progress * 36;
                y = 38 + pkt.progress * 12;
              } else if (pkt.from === 'TARGET' && pkt.to === 'LEDGER') {
                x = 50 + pkt.progress * 36;
                y = 50 + pkt.progress * 24;
              }

              return (
                <g key={pkt.id} filter="url(#meshGlow)">
                  <circle cx={`${x}%`} cy={`${y}%`} r="5" fill={color} />
                  <circle cx={`${x}%`} cy={`${y}%`} r="12" fill={color} opacity="0.25" />
                </g>
              );
            })}
          </svg>

          {/* Interactive Topology Nodes Placed on Canvas */}
          {filteredNodeList.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const style = getCategoryColor(node.category);
            const NodeIcon = node.icon;
            const isCentralEnclave = node.id === 'target_enclave';

            return (
              <div
                key={node.id}
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-110 z-30' : isHovered ? 'scale-105 z-25' : 'hover:scale-105'
                }`}
                onClick={() => setSelectedNodeId(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {isCentralEnclave ? (
                  // ENHANCED CENTRAL TARGET LLM ENCLAVE CORE
                  <div className="relative group flex flex-col items-center justify-center p-3 sm:p-4 text-center">
                    {/* Multi-layered containment aura */}
                    <div
                      className={`absolute -inset-2.5 rounded-3xl opacity-80 blur-md transition-all duration-500 pointer-events-none ${
                        isSelected ? 'opacity-100 scale-105' : 'opacity-60'
                      }`}
                      style={{ background: isolationCfg.glow }}
                    />

                    {/* Outer containment ring */}
                    <div
                      className={`relative flex flex-col items-center justify-center rounded-2xl border p-4 backdrop-blur-2xl transition-all ${
                        isolationCfg.border
                      } ${isolationCfg.bg} ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.6)]'
                          : 'shadow-[0_0_25px_rgba(0,0,0,0.8)]'
                      }`}
                    >
                      {/* Top Header Tag */}
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-cyan-400/50 bg-[#060c18] text-[9px] font-mono font-bold text-cyan-300 shadow-sm -mt-2 mb-2">
                        <Shield className="h-3 w-3 text-cyan-400" />
                        <span>CORE ENCLAVE · LVL {isolationLevel}</span>
                      </div>

                      {/* Shield Core Emblem */}
                      <div className="relative my-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-400/60 p-1.5 shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                        <img
                          src={protegoLogo}
                          alt="Protego Shield Logo"
                          className="h-full w-full object-contain rounded-xl"
                        />
                        <div className="absolute -inset-1 rounded-2xl border border-cyan-400/40 border-dashed animate-[spin_20s_linear_infinite] pointer-events-none" />
                      </div>

                      <span className="text-xs font-black text-white tracking-wider font-mono mt-1.5">
                        TARGET LLM
                      </span>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 mt-0.5">
                        HEALTH: {node.healthScore}%
                      </span>
                    </div>
                  </div>
                ) : (
                  // SLEEK GLASSMORPHIC PERIPHERAL NODE
                  <div
                    className={`group relative flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-mono backdrop-blur-xl transition-all duration-200 ${
                      isSelected
                        ? `${style.border} bg-[#0b162c]/95 ring-2 ring-cyan-400 ${style.glow} shadow-xl scale-105`
                        : 'border-slate-800/90 bg-[#070e1c]/90 hover:border-slate-600 hover:bg-[#0c162a]/95 shadow-lg'
                    }`}
                  >
                    {/* Tactical Node Icon Beacon */}
                    <div className={`relative flex h-8 w-8 items-center justify-center rounded-lg ${style.bg} ${style.text} border border-current/30`}>
                      <NodeIcon className="h-4 w-4" />
                      <span
                        className={`absolute -top-1 -right-1 h-2 w-2 rounded-full border border-slate-950 ${
                          node.healthScore >= 90
                            ? 'bg-emerald-400'
                            : node.healthScore >= 70
                            ? 'bg-amber-400'
                            : 'bg-rose-500 animate-ping'
                        }`}
                      />
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-[11px] whitespace-nowrap">
                          {node.label}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-slate-400 font-medium">{node.tier.split(' - ')[0]}</span>
                        <span className="text-slate-600">·</span>
                        <span className={node.healthScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}>
                          {node.healthScore}% Health
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* DOCKED HUD SIDEBAR: Visual Node Health Dossier (Elevated with Gauges & Waveforms) */}
          <div className="absolute bottom-4 right-4 z-40 w-80 sm:w-88 rounded-2xl border border-cyan-500/40 bg-[#060c18]/95 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
            {/* Tactical Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 rounded-tr-sm pointer-events-none" />

            {/* Dossier Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold tracking-wider text-cyan-300">NODE HEALTH DOSSIER</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${getHealthBadge(activeNodeData.healthScore).color}`}>
                  {getHealthBadge(activeNodeData.healthScore).label}
                </span>
                <button
                  onClick={() => setIsDossierCollapsed(!isDossierCollapsed)}
                  className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title={isDossierCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isDossierCollapsed ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {!isDossierCollapsed && (
              <div className="space-y-3 font-mono text-xs">
                {/* Node Identity Header Card */}
                <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                    {React.createElement(activeNodeData.icon, { className: 'h-5 w-5' })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-xs truncate">{activeNodeData.label}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{activeNodeData.subLabel}</div>
                  </div>
                </div>

                {/* VISUAL TELEMETRY GAUGES GRID (Replaced dull plain boxes with rich visual widgets) */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {/* Gauge 1: Circular Radial Health Ring */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          stroke={activeNodeData.healthScore >= 90 ? '#10b981' : activeNodeData.healthScore >= 70 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="3"
                          strokeDasharray="97.38"
                          strokeDashoffset={97.38 - (97.38 * activeNodeData.healthScore) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-extrabold text-white">{Math.round(activeNodeData.healthScore)}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Health Score</span>
                      <span className="text-[11px] font-bold text-emerald-400">
                        {activeNodeData.healthScore >= 90 ? 'OPTIMAL' : 'WATCH'}
                      </span>
                    </div>
                  </div>

                  {/* Gauge 2: Oscilloscope Waveform for Latency & Jitter */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400 uppercase">Latency & Jitter</span>
                      <span className="text-cyan-300 font-bold tabular-nums">{activeNodeData.latencyMs} ms</span>
                    </div>
                    {/* Live Oscilloscope Waveform */}
                    <div className="h-6 w-full flex items-end gap-[2px] pt-1">
                      {[35, 60, 40, 85, 50, 70, 95, 60, 45, 75, 40, 65, 80, 50].map((h, i) => {
                        const dynamicHeight = Math.min(100, Math.max(20, (h + (telemetryTicks * (i + 1)) % 30)));
                        return (
                          <div
                            key={i}
                            className="flex-1 bg-cyan-500/40 rounded-t-sm transition-all duration-300"
                            style={{ height: `${dynamicHeight}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Gauge 3: Cryptographic Lock & mTLS Status */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase">mTLS 1.3 State</span>
                      <Lock className="h-3 w-3 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-400">{activeNodeData.mTLSState}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 truncate block mt-0.5 font-mono">
                      {activeNodeData.encryptionCipher.split('_')[0] + '...'}
                    </span>
                  </div>

                  {/* Gauge 4: VU-Meter / Entropy Bar for Residual Leakage */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase">Residual Entropy</span>
                      <span className={`text-xs font-bold tabular-nums ${activeNodeData.residualEntropy > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {activeNodeData.residualEntropy}%
                      </span>
                    </div>
                    {/* Segmented VU meter bars */}
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((seg) => {
                        const threshold = seg * 5;
                        const isActive = activeNodeData.residualEntropy >= threshold;
                        return (
                          <div
                            key={seg}
                            className={`h-2 flex-1 rounded-sm transition-all ${
                              isActive
                                ? seg > 3
                                  ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                                  : 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                                : 'bg-slate-800'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Policy & Enforcement Details */}
                <div className="space-y-1.5 bg-black/40 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">POLICY:</span>
                    <span className="text-slate-200 font-semibold truncate max-w-[170px]">{activeNodeData.policyStatus}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">ENFORCEMENT:</span>
                    <span className="text-cyan-300 font-bold truncate max-w-[170px]">{activeNodeData.enforcementAction}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">CIPHER:</span>
                    <span className="text-slate-400 text-[10px] truncate max-w-[170px]">{activeNodeData.encryptionCipher}</span>
                  </div>
                </div>

                {/* Context-Specific Node Action Button */}
                {activeNodeData.id === 'target_enclave' && (
                  <button
                    onClick={() => adaptIsolation()}
                    disabled={isLiveDemoRunning}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Shield className="h-4 w-4" />
                    <span>STEP ISOLATION LEVEL ({isolationLevel === 4 ? 'RESET TO LVL 1' : `STEP TO LVL ${isolationLevel + 1}`})</span>
                  </button>
                )}

                {activeNodeData.id === 'red_team' && (
                  <button
                    onClick={launchAttackTest}
                    disabled={isLiveDemoRunning}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Skull className="h-4 w-4" />
                    <span>DISPATCH ADVERSARIAL TEST PROBE</span>
                  </button>
                )}

                {activeNodeData.id === 'blue_team_mitigator' && (
                  <button
                    onClick={() => deployDefense('DEF-01')}
                    disabled={isLiveDemoRunning}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>DEPLOY KERNEL AIRGAP POLICY</span>
                  </button>
                )}

                {activeNodeData.id === 'audit_ledger' && (
                  <button
                    onClick={() => verifyAuditIntegrity()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    <span>VERIFY MERKLE INTEGRITY PROOFS</span>
                  </button>
                )}

                {activeNodeData.id === 'canary_vault' && (
                  <button
                    onClick={() => triggerCanaryLeak()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    <span>SIMULATE CANARY EXFILTRATION TRIPWIRE</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // VIEW MODE 2: ZERO-TRUST HEALTH MATRIX TABLE VIEW
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#091122]/90">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-slate-800 bg-black/40 text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Node / Infrastructure Component</th>
                <th className="py-3 px-3">Sector Tier</th>
                <th className="py-3 px-3">Health Score</th>
                <th className="py-3 px-3">Latency</th>
                <th className="py-3 px-3">mTLS Cipher</th>
                <th className="py-3 px-3">Residual Leakage</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredNodeList.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const badge = getHealthBadge(node.healthScore);
                const NodeIcon = node.icon;
                const style = getCategoryColor(node.category);

                return (
                  <tr
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-950/40 text-cyan-200' : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${style.bg} ${style.text} border border-current/20`}>
                        <NodeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{node.label}</div>
                        <div className="text-[10px] text-slate-500">{node.subLabel}</div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {node.tier}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white tabular-nums">{node.healthScore}%</span>
                        <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              node.healthScore >= 90 ? 'bg-emerald-400' : node.healthScore >= 70 ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${node.healthScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-cyan-300 tabular-nums">
                      {node.latencyMs} ms
                    </td>

                    <td className="py-3 px-3 text-[10px] text-slate-400 truncate max-w-[140px]">
                      {node.encryptionCipher}
                    </td>

                    <td className="py-3 px-3 font-semibold">
                      <span className={`tabular-nums ${node.residualEntropy > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {node.residualEntropy}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(node.id);
                          setViewMode('TOPOLOGY');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        FOCUS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* FOOTER LEGEND: Sector Tiers & Health Status */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Zero-Trust Tiers:</span>
          <span className="flex items-center gap-1.5 text-sky-300">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Tier 1 Ingress
          </span>
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Tier 0 Enclave
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Tier 1 Defense
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Tier 3 Audit
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">INSPECTOR:</span>
          <span className="text-cyan-400 font-bold">{activeNodeData.label}</span>
        </div>
      </div>
    </div>
  );
};
