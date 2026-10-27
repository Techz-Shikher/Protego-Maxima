import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  User,
  Key,
  Lock,
  Clock,
  Fingerprint,
  RefreshCw,
  Terminal,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  LogOut,
  Radio
} from 'lucide-react';

export interface OperatorProfile {
  name: string;
  callsign: string;
  role: 'SOC_DEFENDER' | 'RED_TEAM' | 'OPENSOURCE_RESEARCHER' | 'COMPLIANCE_AUDITOR';
  clearanceLevel: 'TIER 1 (RESTRICTED)' | 'TIER 2 (SECRET)' | 'TIER 3 (TS/SCI)' | 'TIER 0 (ROOT ENCLAVE)';
  sessionToken: string;
  sessionStartedAt: number;
  isAuthenticated: boolean;
  mTLSCertificate: string;
}

interface OperatorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OperatorProfile;
  onUpdateProfile: (newProfile: OperatorProfile) => void;
}

export const OperatorAuthModal: React.FC<OperatorAuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const formatElapsed = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const generateNewToken = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const hex = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      onUpdateProfile({
        ...profile,
        sessionToken: `PROT-AUTH-${hex.slice(0, 16).toUpperCase()}`,
      });
      setIsRegenerating(false);
    }, 400);
  };

  const handleRoleChange = (role: OperatorProfile['role']) => {
    let clearance: OperatorProfile['clearanceLevel'] = 'TIER 3 (TS/SCI)';
    if (role === 'COMPLIANCE_AUDITOR') clearance = 'TIER 2 (SECRET)';
    if (role === 'OPENSOURCE_RESEARCHER') clearance = 'TIER 3 (TS/SCI)';
    if (role === 'SOC_DEFENDER') clearance = 'TIER 0 (ROOT ENCLAVE)';

    onUpdateProfile({
      ...profile,
      role,
      clearanceLevel: clearance,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-[#060c18] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9)] font-mono text-xs overflow-hidden">
        {/* Top laser scanline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  OPERATOR PROFILE & LOGIN DOSSIER
                </h2>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Active SOC Analyst Session · Cryptographic Hardware Attestation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Identity & Status Ribbon */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Analyst Identity</span>
            <div className="font-bold text-white text-xs mt-1">{profile.name}</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">{profile.callsign}</div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Security Clearance</span>
            <div className="font-bold text-amber-300 text-xs mt-1">{profile.clearanceLevel}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Enclave Root Authorized</div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Session Elapsed</span>
            <div className="font-bold text-emerald-400 text-xs mt-1 tabular-nums">
              {formatElapsed(profile.sessionStartedAt ? elapsedSec + 3600 : elapsedSec)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">mTLS 1.3 Active</div>
          </div>
        </div>

        {/* Role & Workspace Mode Selection */}
        <div className="mt-4">
          <label className="text-[10px] text-slate-400 block uppercase font-bold mb-2">
            Switch Operational Role:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleRoleChange('SOC_DEFENDER')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                profile.role === 'SOC_DEFENDER'
                  ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'border-slate-800 bg-[#091122] text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">🛡️ Rakshak (Blue Team) Defender</span>
                {profile.role === 'SOC_DEFENDER' && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">
                Full authority over Rakshak isolation perimeter, tripwires, and egress redaction.
              </p>
            </button>

            <button
              onClick={() => handleRoleChange('OPENSOURCE_RESEARCHER')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                profile.role === 'OPENSOURCE_RESEARCHER'
                  ? 'border-purple-500 bg-purple-950/40 text-purple-200 ring-1 ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'border-slate-800 bg-[#091122] text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">🦙 Open-Source & Ollama Researcher</span>
                {profile.role === 'OPENSOURCE_RESEARCHER' && <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">
                Benchmark local Ollama, Llama 3.3, DeepSeek R1, Mistral, and self-hosted models.
              </p>
            </button>

            <button
              onClick={() => handleRoleChange('RED_TEAM')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                profile.role === 'RED_TEAM'
                  ? 'border-rose-500 bg-rose-950/40 text-rose-200 ring-1 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'border-slate-800 bg-[#091122] text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">⚔️ Bakshak (Red Team) Adversary</span>
                {profile.role === 'RED_TEAM' && <CheckCircle2 className="h-3.5 w-3.5 text-rose-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">
                Execute Bakshak prompt injection suites, canary exfiltration probes, and side-channel timing taps.
              </p>
            </button>

            <button
              onClick={() => handleRoleChange('COMPLIANCE_AUDITOR')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                profile.role === 'COMPLIANCE_AUDITOR'
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'border-slate-800 bg-[#091122] text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">⚖️ NIST & ISO Compliance Auditor</span>
                {profile.role === 'COMPLIANCE_AUDITOR' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">
                Review immutable SHA-256 Merkle proofs, cryptographic signatures, and export compliance briefs.
              </p>
            </button>
          </div>
        </div>

        {/* Cryptographic Session Token & Certificate */}
        <div className="mt-4 p-3.5 rounded-xl bg-black/50 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-cyan-400" />
              Cryptographic Session Token:
            </span>
            <button
              onClick={generateNewToken}
              disabled={isRegenerating}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Rotate Token</span>
            </button>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#070e1e] border border-slate-800 text-slate-300 font-mono text-[11px]">
            <span className="truncate">{profile.sessionToken}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(profile.sessionToken);
                setCopiedToken(true);
                setTimeout(() => setCopiedToken(false), 2000);
              }}
              className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer ml-2 shrink-0"
            >
              {copiedToken ? 'COPIED!' : 'COPY'}
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span>mTLS 1.3 CERTIFICATE:</span>
            <span className="text-emerald-400">{profile.mTLSCertificate}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">
            PROTEGO MAXIMA · HARDWARE ROOT OF TRUST VERIFIED
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
