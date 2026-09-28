// ─── Study ─────────────────────────────────────────────────────────────────
export interface Study {
  id: string;
  title: string;
  phase: string;
  stageNo: number;
  stageName: string;
  principalInvestigator: string;
  sites: number;
  enrolled: number;
  target: number;
  riskScore: number;
  status: 'ON TRACK' | 'WATCH' | 'AT RISK';
  openQueries: number;
  deviations: number;
  overdueMonitoring: number;
  ctriNo: string;
  iecValidTill: string;
}

// ─── Site ───────────────────────────────────────────────────────────────────
export interface Site {
  id: string;
  name: string;
  city: string;
  state: string;
  studyIds: string[];
  coordinator: string;
  enrolled: number;
  target: number;
  openQueries: number;
  monitoringLast: string | null;
  monitoringDue: string;
  overdueMonitoring: boolean;
  deviations: number;
  status: 'ON TRACK' | 'WATCH' | 'AT RISK';
}

// ─── Alert ──────────────────────────────────────────────────────────────────
export type AlertType = 'ETHICS' | 'CTRI' | 'MONITORING' | 'DATA_QUALITY' | 'SAFETY';
export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Alert {
  id: string;
  type: AlertType;
  severity: Severity;
  title: string;
  detail: string;
  dueDate: string;
  studyId: string;
  siteId: string | null;
  action: string;
  read: boolean;
}

// ─── Safety Case ────────────────────────────────────────────────────────────
export type Causality =
  | 'CERTAIN' | 'PROBABLE' | 'POSSIBLE'
  | 'UNLIKELY' | 'CONDITIONAL' | 'UNASSESSABLE' | 'NOT ASSESSED';

export interface SafetyCase {
  id: string;
  studyId: string;
  siteId: string;
  participantToken: string;
  event: string;
  serious: boolean;
  reportedAtUTC: string;
  deadlineHours: number;
  meddraCoded: boolean;
  meddraPT: string;
  meddraSOC: string;
  causality: Causality;
  status: 'OPEN' | 'CLOSED';
  escalated: boolean;
}

// ─── Lifecycle ──────────────────────────────────────────────────────────────
export interface LifecycleStage {
  no: number;
  name: string;
  group: string;
  hardGate: boolean;
  gateRule?: string;
}

// ─── Role ───────────────────────────────────────────────────────────────────
export interface Role {
  id: string;
  name: string;
  email: string;
  sees: string[];
}

export interface Feature {
  category: string;
  items: string[];
}

// ─── SAE Clock ──────────────────────────────────────────────────────────────
export interface SaeClockResult {
  msLeft: number;
  hoursLeft: number;
  expired: boolean;
  urgent: boolean;
  percentUsed: number;
}

// ─── AppState ───────────────────────────────────────────────────────────────
export interface AppState {
  readAlerts: string[];
  currentRole: string;
  meddraOverrides: Record<string, { meddraPT: string; meddraSOC: string; causality: Causality }>;
}
