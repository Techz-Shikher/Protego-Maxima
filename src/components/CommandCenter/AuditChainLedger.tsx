import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  FileCheck,
  CheckCircle2,
  ShieldCheck,
  Hash,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';

export const AuditChainLedger: React.FC = () => {
  const {
    auditEvents,
    verifyAuditIntegrity,
    integrityStatus,
    highlightZone,
  } = useSimulation();

  const [verifying, setVerifying] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleVerify = () => {
    setVerifying(true);
    verifyAuditIntegrity();
    setTimeout(() => {
      setVerifying(false);
    }, 700);
  };

  const handleCopy = (hash: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 1500);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden ${
        highlightZone === 'audit'
          ? 'border-cyan-400 bg-[#091122]/98 glow-cyan ring-2 ring-cyan-400'
          : 'border-cyan-500/30 bg-[#070e1e]/95'
      }`}
    >
      {/* Laser Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Hash className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide font-sans">
                TAMPER-EVIDENT AUDIT LEDGER
              </h3>
              <span className="rounded-full bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                IMMUTABLE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              CRYPTOGRAPHIC SHA-256 STATE HASH CHAIN
            </p>
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="flex items-center gap-2 rounded-xl border border-cyan-500/50 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 px-4 py-2 text-xs font-mono font-bold text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>{verifying ? 'COMPUTING MERKLE ROOT...' : 'VERIFY HASH CHAIN'}</span>
        </button>
      </div>

      {/* Verification Status Banner */}
      <div className="mt-4 flex flex-wrap items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3.5 py-2.5 text-xs font-mono text-emerald-300 gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-bold">CRYPTOGRAPHIC CHAIN VALIDATED</span>
          <span className="text-slate-500">·</span>
          <span>NO TAMPERING OR TIME DRIFT DETECTED</span>
        </div>
        <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700/50 font-bold">
          100% AUDITABLE
        </span>
      </div>

      {/* Cryptographic Chain Blocks List */}
      <div className="mt-4 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
        {auditEvents.slice(-5).map((evt, idx) => (
          <div
            key={evt.id}
            className="rounded-xl border border-slate-800 bg-[#091122]/90 p-3 text-xs font-mono transition-all hover:border-cyan-500/40 shadow-inner"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40 text-[10px]">
                  BLOCK #{evt.index}
                </span>
                <span className="font-bold text-white text-xs">{evt.event}</span>
                <span className="text-slate-500 text-[10px]">({evt.entity})</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
            </div>

            <div className="mt-1.5 text-xs text-slate-300 font-sans leading-normal">
              {evt.details}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] text-slate-500 gap-2">
              <span className="truncate max-w-[170px] text-slate-500">
                PREV: {evt.prevHash.slice(0, 14)}...
              </span>
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 font-bold font-mono">
                  HASH: {evt.hash.slice(0, 16)}...
                </span>
                <button
                  onClick={() => handleCopy(evt.hash)}
                  title="Copy full SHA-256 hash"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedHash === evt.hash ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
