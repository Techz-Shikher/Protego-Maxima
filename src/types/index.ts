export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IsolationLevel = 1 | 2 | 3 | 4;

export type IsolationName = 'NORMAL' | 'RESTRICTED' | 'HIGH ISOLATION' | 'EMERGENCY CONTAINMENT';

export type AttackCategory =
  | 'Prompt Injection'
  | 'Context Manipulation'
  | 'Information Inference'
  | 'Policy Extraction'
  | 'Resource Probing';

export interface AttackVector {
  id: string;
  name: string;
  category: AttackCategory;
  severity: ThreatLevel;
  confidence: number;
  payloadSummary: string;
  directAccessImpact: string;
  sideChannelFootprint: string;
  suggestedDefense: string;
}

export interface TelemetrySample {
  timeLabel: string;
  latencyMs: number;
  cacheSignal: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cpuPercent: number;
  memoryPercent: number;
  networkPackets: number;
  errorEntropy: number;
}

export interface LeakageBreakdown {
  timing: number;
  cache: number;
  metadata: number;
  resource: number;
  total: number;
}

export interface CanaryToken {
  id: string;
  label: string;
  code: string;
  authorizedBoundary: 'BLUE TEAM' | 'TARGET LLM' | 'RED TEAM';
  currentLocation: 'BLUE TEAM' | 'TARGET LLM' | 'RED TEAM';
  compromised: boolean;
  detectedAt?: string;
}

export interface DefenseItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'AVAILABLE' | 'DEPLOYING' | 'ACTIVE';
  mitigatesAttackId?: string;
}

export interface AttackEvolutionNode {
  version: string;
  title: string;
  result: 'FAILED' | 'PARTIAL' | 'SUCCESSFUL' | 'DEFENSE DEPLOYED' | 'BLOCKED';
  leakageObserved: string;
  timestamp: string;
  details: string;
}

export interface SecurityFinding {
  id: string;
  type: string;
  severity: ThreatLevel;
  reproduced: string;
  confidence: number;
  status: 'VULNERABLE' | 'CONTAINED' | 'MITIGATED';
  defense: string;
  retest: 'PASSED' | 'FAILED' | 'IN_PROGRESS';
  timestamp: string;
}

export interface AuditEvent {
  index: number;
  id: string;
  timestamp: string;
  event: string;
  entity: string;
  details: string;
  prevHash: string;
  hash: string;
}

export interface SecurityScoreMetrics {
  total: number;
  isolation: number;
  leakageResistance: number;
  auditability: number;
  robustness: number;
  defense: number;
}

export type ActiveHighlightZone =
  | 'none'
  | 'red_team'
  | 'target_llm'
  | 'observability'
  | 'leakage'
  | 'isolation'
  | 'blue_team'
  | 'defense'
  | 'score'
  | 'audit'
  | 'canary';

export interface DemoStepInfo {
  step: number;
  title: string;
  phase: string;
  actionText: string;
  highlightZone: ActiveHighlightZone;
}
