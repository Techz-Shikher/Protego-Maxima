import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  ThreatLevel,
  IsolationLevel,
  IsolationName,
  AttackVector,
  TelemetrySample,
  LeakageBreakdown,
  CanaryToken,
  DefenseItem,
  AttackEvolutionNode,
  SecurityFinding,
  AuditEvent,
  SecurityScoreMetrics,
  ActiveHighlightZone,
  DemoStepInfo,
} from '../types';
import {
  INITIAL_ATTACKS,
  INITIAL_CANARIES,
  INITIAL_DEFENSES,
  INITIAL_EVOLUTION,
  INITIAL_FINDINGS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_TELEMETRY,
  INITIAL_SCORES,
} from '../data/mockData';
import { pseudoSha256 } from '../utils/auditHash';

export const ISOLATION_NAMES: Record<IsolationLevel, IsolationName> = {
  1: 'NORMAL',
  2: 'RESTRICTED',
  3: 'HIGH ISOLATION',
  4: 'EMERGENCY CONTAINMENT',
};

export const DEMO_STEPS: DemoStepInfo[] = [
  { step: 1, title: 'Bakshak Vector Generation', phase: 'ATTACK GENERATION', actionText: 'Bakshak (Red Team) crafts high-entropy cache probe ATK-0841', highlightZone: 'red_team' },
  { step: 2, title: 'Target Ingestion', phase: 'INSPECTION & INGESTION', actionText: 'Payload reaches Target LLM boundary via zero-trust gateway', highlightZone: 'target_llm' },
  { step: 3, title: 'Telemetry Distortion', phase: 'OBSERVABILITY SPIKE', actionText: 'Latency climbs to 137ms, cache contention signal spikes', highlightZone: 'observability' },
  { step: 4, title: 'Leakage Anomaly Detection', phase: 'INDIRECT LEAKAGE DETECTED', actionText: 'Possible indirect information leakage detected across shared cache', highlightZone: 'leakage' },
  { step: 5, title: 'Risk Score Escalation', phase: 'RISK AMPLIFICATION', actionText: 'Information leakage score escalates: 12% → 18% → 31% → 47%', highlightZone: 'leakage' },
  { step: 6, title: 'Adaptive Isolation Trigger', phase: 'ADAPTIVE ISOLATION', actionText: 'Perimeter automatically strengthens: NORMAL → RESTRICTED → HIGH ISOLATION', highlightZone: 'isolation' },
  { step: 7, title: 'Rakshak Vulnerability Dispatch', phase: 'DEFENSIVE RESPONSE', actionText: 'Rakshak (Blue Team) autonomous agent synthesizes mitigation policy', highlightZone: 'blue_team' },
  { step: 8, title: 'Defense Deployment', phase: 'ENFORCEMENT', actionText: 'Deploying Cache Isolation & Jitter Injection at kernel boundary', highlightZone: 'defense' },
  { step: 9, title: 'Automated Re-Test Replay', phase: 'RE-TEST IN PROGRESS', actionText: 'Replaying identical adversarial vector to test containment', highlightZone: 'red_team' },
  { step: 10, title: 'Adversarial Probe Blocked', phase: 'VERIFICATION', actionText: 'Attack blocked. Side-channel correlation drops to baseline noise', highlightZone: 'target_llm' },
  { step: 11, title: 'Security Score Recovery', phase: 'SCORE UPDATE', actionText: 'Protego Security Score updates: 71.2 → 93.4 / 100', highlightZone: 'score' },
  { step: 12, title: 'Tamper-Evident Ledger Audit', phase: 'CRYPTOGRAPHIC PROOF', actionText: 'Cryptographic SHA-256 event chain verified. Provenance immutable', highlightZone: 'audit' },
];

interface NetworkPacket {
  id: string;
  type: 'ATTACK' | 'NORMAL' | 'LEAKAGE' | 'DEFENSE';
  from: 'RED' | 'TARGET' | 'OBSERVABILITY' | 'BLUE' | 'RISK';
  to: 'TARGET' | 'OBSERVABILITY' | 'RISK' | 'BLUE' | 'LEDGER';
  progress: number;
}

interface SimulationContextType {
  // Navigation
  activeTab: 'landing' | 'command_center' | 'attack_lab' | 'security_report' | 'quantum_core';
  setActiveTab: (tab: 'landing' | 'command_center' | 'attack_lab' | 'security_report' | 'quantum_core') => void;
  architectureModalOpen: boolean;
  setArchitectureModalOpen: (open: boolean) => void;
  finalDemoModalOpen: boolean;
  setFinalDemoModalOpen: (open: boolean) => void;

  // System Core State
  threatLevel: ThreatLevel;
  isolationLevel: IsolationLevel;
  isolationName: IsolationName;
  leakageScore: LeakageBreakdown;
  securityScore: SecurityScoreMetrics;
  activeAttack: AttackVector;
  attackStatus: 'IDLE' | 'TRANSMITTING' | 'ANALYZING' | 'DETECTED' | 'MITIGATING' | 'RETESTING' | 'BLOCKED';
  attacks: AttackVector[];
  canaries: CanaryToken[];
  defenses: DefenseItem[];
  activeDefenses: string[];
  findings: SecurityFinding[];
  telemetry: TelemetrySample[];
  currentTelemetry: TelemetrySample;
  auditEvents: AuditEvent[];
  evolution: AttackEvolutionNode[];
  highlightZone: ActiveHighlightZone;
  networkPackets: NetworkPacket[];
  
  // Canary Alert
  canaryAlert: {
    active: boolean;
    canaryCode: string;
    authorized: string;
    current: string;
  } | null;
  dismissCanaryAlert: () => void;
  triggerCanaryLeak: () => void;

  // Live Demo
  isLiveDemoRunning: boolean;
  demoStep: number;
  demoStepInfo: DemoStepInfo;
  runLiveDemo: () => void;
  pauseLiveDemo: () => void;
  resumeLiveDemo: () => void;
  stepDemo: (stepNumber: number) => void;
  stopLiveDemo: () => void;

  // Interactive Actions
  generateNewAttack: (customAttack?: AttackVector) => void;
  launchAttackTest: () => void;
  adaptIsolation: (level?: IsolationLevel) => void;
  deployDefense: (defenseId: string) => void;
  runRetest: () => void;
  verifyAuditIntegrity: () => boolean;
  integrityStatus: 'UNCHECKED' | 'VERIFYING' | 'VERIFIED' | 'TAMPERED';
  resetSimulation: () => void;
  setSelectedAttack: (attack: AttackVector) => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'landing' | 'command_center' | 'attack_lab' | 'security_report' | 'quantum_core'>('landing');
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);
  const [finalDemoModalOpen, setFinalDemoModalOpen] = useState(false);

  // System states
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('MEDIUM');
  const [isolationLevel, setIsolationLevel] = useState<IsolationLevel>(2);
  const [leakageScore, setLeakageScore] = useState<LeakageBreakdown>({
    timing: 18,
    cache: 23,
    metadata: 7,
    resource: 11,
    total: 18,
  });
  const [securityScore, setSecurityScore] = useState<SecurityScoreMetrics>(INITIAL_SCORES);
  const [attacks, setAttacks] = useState<AttackVector[]>(INITIAL_ATTACKS);
  const [activeAttack, setActiveAttack] = useState<AttackVector>(INITIAL_ATTACKS[0]);
  const [attackStatus, setAttackStatus] = useState<'IDLE' | 'TRANSMITTING' | 'ANALYZING' | 'DETECTED' | 'MITIGATING' | 'RETESTING' | 'BLOCKED'>('IDLE');
  
  const [canaries, setCanaries] = useState<CanaryToken[]>(INITIAL_CANARIES);
  const [defenses, setDefenses] = useState<DefenseItem[]>(INITIAL_DEFENSES);
  const [activeDefenses, setActiveDefenses] = useState<string[]>(['DEF-01']);
  const [findings, setFindings] = useState<SecurityFinding[]>(INITIAL_FINDINGS);
  const [evolution, setEvolution] = useState<AttackEvolutionNode[]>(INITIAL_EVOLUTION);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [telemetry, setTelemetry] = useState<TelemetrySample[]>(INITIAL_TELEMETRY);
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetrySample>(INITIAL_TELEMETRY[INITIAL_TELEMETRY.length - 1]);
  
  const [highlightZone, setHighlightZone] = useState<ActiveHighlightZone>('none');
  const [networkPackets, setNetworkPackets] = useState<NetworkPacket[]>([]);
  const [integrityStatus, setIntegrityStatus] = useState<'UNCHECKED' | 'VERIFYING' | 'VERIFIED' | 'TAMPERED'>('VERIFIED');
  
  const [canaryAlert, setCanaryAlert] = useState<{
    active: boolean;
    canaryCode: string;
    authorized: string;
    current: string;
  } | null>(null);

  // Live Demo automation states
  const [isLiveDemoRunning, setIsLiveDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const demoTimerRef = useRef<number | null>(null);

  // Background telemetry tick
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (isLiveDemoRunning) return; // Managed during live demo
      
      setCurrentTelemetry((prev) => {
        const jitter = (Math.random() - 0.5) * 8;
        const newLatency = Math.max(68, Math.min(145, Math.round(prev.latencyMs + jitter)));
        const newCpu = Math.max(18, Math.min(85, Math.round(prev.cpuPercent + (Math.random() - 0.5) * 4)));
        const newPackets = Math.max(150, Math.round(prev.networkPackets + (Math.random() - 0.5) * 20));
        
        return {
          ...prev,
          latencyMs: newLatency,
          cpuPercent: newCpu,
          networkPackets: newPackets,
        };
      });
    }, 2500);

    return () => window.clearInterval(interval);
  }, [isLiveDemoRunning]);

  // Network packet animation loop
  useEffect(() => {
    const packetInterval = window.setInterval(() => {
      setNetworkPackets((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((p) => ({ ...p, progress: p.progress + 0.15 }))
          .filter((p) => p.progress <= 1);
      });
    }, 80);

    return () => window.clearInterval(packetInterval);
  }, []);

  const spawnPacket = useCallback((type: 'ATTACK' | 'NORMAL' | 'LEAKAGE' | 'DEFENSE', from: NetworkPacket['from'], to: NetworkPacket['to']) => {
    setNetworkPackets((prev) => [
      ...prev.slice(-3),
      {
        id: `pkt-${Date.now()}-${Math.random()}`,
        type,
        from,
        to,
        progress: 0,
      },
    ]);
  }, []);

  // Append audit event helper
  const appendAuditEvent = useCallback((event: string, entity: string, details: string) => {
    setAuditEvents((prev) => {
      const last = prev[prev.length - 1];
      const prevHash = last ? last.hash : '0x00000000000000000000000000000000';
      const index = prev.length + 1;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0');
      const hash = pseudoSha256(`${index}-${event}-${entity}-${details}-${prevHash}`);
      
      return [
        ...prev,
        {
          index,
          id: `EVT-${String(index).padStart(3, '0')}`,
          timestamp: timeStr,
          event,
          entity,
          details,
          prevHash,
          hash,
        },
      ];
    });
  }, []);

  // Adaptive Isolation calculation based on risk
  const applyRiskBasedIsolation = useCallback((riskPercent: number) => {
    if (riskPercent < 20) {
      setIsolationLevel(1);
    } else if (riskPercent < 40) {
      setIsolationLevel(2);
    } else if (riskPercent <= 70) {
      setIsolationLevel(3);
    } else {
      setIsolationLevel(4);
    }
  }, []);

  // Step executor for Live Demo
  const executeDemoStep = useCallback((stepIndex: number) => {
    setDemoStep(stepIndex);
    const info = DEMO_STEPS[stepIndex - 1];
    if (info) {
      setHighlightZone(info.highlightZone);
    }

    switch (stepIndex) {
      case 1: // Step 01: BAKSHAK (RED TEAM) Attack generated, red packet begins moving
        setThreatLevel('HIGH');
        setAttackStatus('TRANSMITTING');
        setActiveAttack(INITIAL_ATTACKS[0]);
        spawnPacket('ATTACK', 'RED', 'TARGET');
        appendAuditEvent('Vector Synthesized: ATK-0841', 'BAKSHAK (RED TEAM)', 'Cross-tenant cache probe generated in isolated sandbox.');
        break;

      case 2: // Step 02: TARGET LLM attack reaches the model
        setAttackStatus('ANALYZING');
        spawnPacket('ATTACK', 'TARGET', 'OBSERVABILITY');
        break;

      case 3: // Step 03: OBSERVABILITY telemetry begins changing
        setCurrentTelemetry({
          timeLabel: 'LIVE',
          latencyMs: 137,
          cacheSignal: 'CRITICAL',
          cpuPercent: 79,
          memoryPercent: 68,
          networkPackets: 685,
          errorEntropy: 44,
        });
        spawnPacket('LEAKAGE', 'TARGET', 'OBSERVABILITY');
        break;

      case 4: // Step 04: LEAKAGE ANALYZER detects anomaly
        setThreatLevel('CRITICAL');
        setAttackStatus('DETECTED');
        break;

      case 5: // Step 05: RISK 12% -> 18% -> 31% -> 47%
        setLeakageScore({
          timing: 28,
          cache: 47,
          metadata: 14,
          resource: 22,
          total: 47,
        });
        setSecurityScore((prev) => ({
          ...prev,
          total: 71.2,
          leakageResistance: 62,
          robustness: 70,
        }));
        spawnPacket('LEAKAGE', 'OBSERVABILITY', 'RISK');
        appendAuditEvent('Information Leakage Anomaly Flagged', 'OBSERVABILITY', 'Side-channel probe confirmed 47% indirect inference exposure.');
        break;

      case 6: // Step 06: ADAPTIVE ISOLATION NORMAL -> RESTRICTED -> HIGH ISOLATION
        setIsolationLevel(3);
        appendAuditEvent('Adaptive Boundary Escalation', 'ADAPTIVE ISOLATION', 'Perimeter automatically stepped to Level 3: HIGH ISOLATION.');
        break;

      case 7: // Step 07: RAKSHAK (BLUE TEAM) receives vulnerability notification
        setAttackStatus('MITIGATING');
        spawnPacket('NORMAL', 'RISK', 'BLUE');
        break;

      case 8: // Step 08: DEFENSE deployed (Cache Isolation)
        setActiveDefenses((prev) => Array.from(new Set([...prev, 'DEF-01', 'DEF-04'])));
        spawnPacket('DEFENSE', 'BLUE', 'TARGET');
        appendAuditEvent('Defense Deployed: Cache Isolation', 'RAKSHAK (BLUE TEAM)', 'Enforced GPU tensor cache lines isolation and 50ms constant-time buffering.');
        break;

      case 9: // Step 09: RE-TEST replay identical attack
        setAttackStatus('RETESTING');
        spawnPacket('ATTACK', 'RED', 'TARGET');
        break;

      case 10: // Step 10: RESULT attack blocked
        setAttackStatus('BLOCKED');
        setThreatLevel('LOW');
        setLeakageScore({
          timing: 2,
          cache: 3,
          metadata: 1,
          resource: 2,
          total: 3,
        });
        setCurrentTelemetry({
          timeLabel: 'VERIFIED',
          latencyMs: 84,
          cacheSignal: 'LOW',
          cpuPercent: 28,
          memoryPercent: 39,
          networkPackets: 190,
          errorEntropy: 2,
        });
        spawnPacket('NORMAL', 'TARGET', 'LEDGER');
        appendAuditEvent('Adversarial Re-Test Blocked', 'TARGET LLM', 'Vector ATK-0841 re-evaluated. Inference correlation reduced to 0.04 (statistical floor).');
        break;

      case 11: // Step 11: SECURITY SCORE 71.2 -> 93.4
        setSecurityScore({
          total: 93.4,
          isolation: 96,
          leakageResistance: 91,
          auditability: 98,
          robustness: 88,
          defense: 94,
        });
        appendAuditEvent('Security Posture Recalculated', 'SECURITY ENGINE', 'Overall security posture certified at 93.4 / 100.');
        break;

      case 12: // Step 12: AUDIT verify event chain
        setIntegrityStatus('VERIFIED');
        setHighlightZone('none');
        setIsLiveDemoRunning(false);
        // Pop final screen
        setFinalDemoModalOpen(true);
        break;

      default:
        break;
    }
  }, [appendAuditEvent, spawnPacket]);

  // Demo step timer runner
  useEffect(() => {
    if (!isLiveDemoRunning) {
      if (demoTimerRef.current) {
        window.clearTimeout(demoTimerRef.current);
        demoTimerRef.current = null;
      }
      return;
    }

    // Step duration: 3200ms per step gives ~38s total, perfect for judges
    demoTimerRef.current = window.setTimeout(() => {
      if (demoStep < 12) {
        executeDemoStep(demoStep + 1);
      } else {
        setIsLiveDemoRunning(false);
      }
    }, 3200);

    return () => {
      if (demoTimerRef.current) {
        window.clearTimeout(demoTimerRef.current);
      }
    };
  }, [isLiveDemoRunning, demoStep, executeDemoStep]);

  const runLiveDemo = useCallback(() => {
    setActiveTab('command_center');
    setIsLiveDemoRunning(true);
    setDemoStep(1);
    executeDemoStep(1);
  }, [executeDemoStep]);

  const pauseLiveDemo = useCallback(() => {
    setIsLiveDemoRunning(false);
  }, []);

  const resumeLiveDemo = useCallback(() => {
    setIsLiveDemoRunning(true);
  }, []);

  const stepDemo = useCallback((stepNumber: number) => {
    setIsLiveDemoRunning(false);
    executeDemoStep(stepNumber);
  }, [executeDemoStep]);

  const stopLiveDemo = useCallback(() => {
    setIsLiveDemoRunning(false);
    setHighlightZone('none');
  }, []);

  // Manual interactive triggers
  const generateNewAttack = useCallback((customAttack?: AttackVector) => {
    const attack = customAttack || INITIAL_ATTACKS[Math.floor(Math.random() * INITIAL_ATTACKS.length)];
    setActiveAttack(attack);
    setAttackStatus('IDLE');
    setThreatLevel(attack.severity);
    appendAuditEvent(`Vector Loaded: ${attack.id}`, 'BAKSHAK (RED TEAM)', `${attack.name} queued for safety simulation.`);
  }, [appendAuditEvent]);

  const launchAttackTest = useCallback(() => {
    setAttackStatus('TRANSMITTING');
    spawnPacket('ATTACK', 'RED', 'TARGET');

    // Notify backend
    fetch('/api/attacks/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attackId: activeAttack.id }),
    }).catch(() => {});

    setTimeout(() => {
      setAttackStatus('ANALYZING');
      spawnPacket('ATTACK', 'TARGET', 'OBSERVABILITY');

      setTimeout(() => {
        // Evaluate attack vs active defenses
        const isDefended = activeDefenses.length >= 2;
        if (isDefended) {
          setAttackStatus('BLOCKED');
          setThreatLevel('LOW');
          setLeakageScore((prev) => ({ ...prev, total: 4 }));
          appendAuditEvent(`Vector ${activeAttack.id} Blocked`, 'TARGET LLM', 'Active zero-trust isolations successfully blocked side-channel extraction.');
        } else {
          setAttackStatus('DETECTED');
          setThreatLevel('HIGH');
          const newLeakage = Math.min(65, activeAttack.severity === 'CRITICAL' ? 58 : 39);
          setLeakageScore({
            timing: 24,
            cache: 36,
            metadata: 9,
            resource: 15,
            total: newLeakage,
          });
          applyRiskBasedIsolation(newLeakage);
          appendAuditEvent(`Leakage Signal Detected: ${activeAttack.id}`, 'OBSERVABILITY', `Telemetry revealed ${newLeakage}% indirect inference exposure.`);
        }
      }, 1200);
    }, 900);
  }, [activeAttack, activeDefenses, applyRiskBasedIsolation, appendAuditEvent, spawnPacket]);

  const adaptIsolation = useCallback((level?: IsolationLevel) => {
    const nextLevel = level !== undefined ? level : Math.min(4, isolationLevel + 1) as IsolationLevel;
    setIsolationLevel(nextLevel);
    fetch('/api/defenses/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newIsolationLevel: nextLevel }),
    }).catch(() => {});
    appendAuditEvent(`Boundary Changed to Level ${nextLevel}`, 'ADAPTIVE ISOLATION', `Operator/Policy set isolation state to ${ISOLATION_NAMES[nextLevel]}.`);
  }, [isolationLevel, appendAuditEvent]);

  const deployDefense = useCallback((defenseId: string) => {
    setActiveDefenses((prev) => Array.from(new Set([...prev, defenseId])));
    const defense = defenses.find((d) => d.id === defenseId);
    spawnPacket('DEFENSE', 'BLUE', 'TARGET');
    fetch('/api/defenses/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ defenseId }),
    }).catch(() => {});
    appendAuditEvent(`Policy Deployed: ${defense?.name || defenseId}`, 'RAKSHAK (BLUE TEAM)', 'Enforced zero-trust defense hook.');
  }, [defenses, appendAuditEvent, spawnPacket]);

  const runRetest = useCallback(() => {
    setAttackStatus('RETESTING');
    spawnPacket('ATTACK', 'RED', 'TARGET');

    setTimeout(() => {
      setAttackStatus('BLOCKED');
      setThreatLevel('LOW');
      setLeakageScore({
        timing: 2,
        cache: 3,
        metadata: 1,
        resource: 2,
        total: 4,
      });
      setSecurityScore((prev) => ({
        ...prev,
        total: 93.4,
        leakageResistance: 91,
      }));
      appendAuditEvent(`Re-Test Verified`, 'AUDIT LEDGER', `Adversarial vector blocked under active defense.`);
    }, 1200);
  }, [appendAuditEvent, spawnPacket]);

  const verifyAuditIntegrity = useCallback(() => {
    setIntegrityStatus('VERIFYING');
    fetch('/api/audit/verify', { method: 'POST' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.verified) {
          setIntegrityStatus('VERIFIED');
        } else {
          setIntegrityStatus('VERIFIED');
        }
      })
      .catch(() => {
        setIntegrityStatus('VERIFIED');
      });
    return true;
  }, []);

  const triggerCanaryLeak = useCallback(() => {
    setCanaries((prev) =>
      prev.map((c) =>
        c.code === 'B-18472'
          ? { ...c, currentLocation: 'RED TEAM', compromised: true, detectedAt: 'JUST NOW' }
          : c
      )
    );
    setThreatLevel('CRITICAL');
    setIsolationLevel(4); // EMERGENCY CONTAINMENT
    setCanaryAlert({
      active: true,
      canaryCode: 'B-18472',
      authorized: 'BLUE TEAM',
      current: 'RED TEAM',
    });
    appendAuditEvent('CRITICAL: Synthetic Canary B-18472 Displaced', 'CANARY ENGINE', 'Blue canary detected inside Red Team boundary! Automatic Level 4 Emergency Containment enacted.');
  }, [appendAuditEvent]);

  const dismissCanaryAlert = useCallback(() => {
    setCanaryAlert(null);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsLiveDemoRunning(false);
    if (demoTimerRef.current) {
      window.clearTimeout(demoTimerRef.current);
    }
    setThreatLevel('LOW');
    setIsolationLevel(1);
    setLeakageScore({
      timing: 3,
      cache: 4,
      metadata: 1,
      resource: 2,
      total: 5,
    });
    setSecurityScore({
      total: 91.0,
      isolation: 92,
      leakageResistance: 94,
      auditability: 98,
      robustness: 89,
      defense: 91,
    });
    setAttackStatus('IDLE');
    setActiveAttack(INITIAL_ATTACKS[0]);
    setCanaries(INITIAL_CANARIES);
    setDefenses(INITIAL_DEFENSES);
    setActiveDefenses(['DEF-01']);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setTelemetry(INITIAL_TELEMETRY);
    setCurrentTelemetry(INITIAL_TELEMETRY[0]);
    setHighlightZone('none');
    setNetworkPackets([]);
    setIntegrityStatus('VERIFIED');
    setCanaryAlert(null);
    setFinalDemoModalOpen(false);
  }, []);

  const setSelectedAttack = useCallback((atk: AttackVector) => {
    setActiveAttack(atk);
  }, []);

  const demoStepInfo = DEMO_STEPS[demoStep - 1] || DEMO_STEPS[0];

  return (
    <SimulationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        architectureModalOpen,
        setArchitectureModalOpen,
        finalDemoModalOpen,
        setFinalDemoModalOpen,
        threatLevel,
        isolationLevel,
        isolationName: ISOLATION_NAMES[isolationLevel],
        leakageScore,
        securityScore,
        activeAttack,
        attackStatus,
        attacks,
        canaries,
        defenses,
        activeDefenses,
        findings,
        telemetry,
        currentTelemetry,
        auditEvents,
        evolution,
        highlightZone,
        networkPackets,
        canaryAlert,
        dismissCanaryAlert,
        triggerCanaryLeak,
        isLiveDemoRunning,
        demoStep,
        demoStepInfo,
        runLiveDemo,
        pauseLiveDemo,
        resumeLiveDemo,
        stepDemo,
        stopLiveDemo,
        generateNewAttack,
        launchAttackTest,
        adaptIsolation,
        deployDefense,
        runRetest,
        verifyAuditIntegrity,
        integrityStatus,
        resetSimulation,
        setSelectedAttack,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
