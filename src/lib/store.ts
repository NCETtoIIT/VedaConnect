import type { AppState, Causality } from './types';

const KEY = 'vcn_state_v1';

const DEFAULT_STATE: AppState = {
  readAlerts: [],
  currentRole: 'admin',
  meddraOverrides: {},
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) } as AppState;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function markAlertRead(id: string): void {
  const state = loadState();
  if (!state.readAlerts.includes(id)) {
    state.readAlerts.push(id);
    saveState(state);
  }
}

export function isAlertRead(id: string): boolean {
  return loadState().readAlerts.includes(id);
}

export function getRole(): string {
  return loadState().currentRole;
}

export function setRole(roleId: string): void {
  const state = loadState();
  state.currentRole = roleId;
  saveState(state);
}

export function getMeddraOverride(caseId: string) {
  return loadState().meddraOverrides[caseId] ?? null;
}

export function saveMeddraCode(
  caseId: string,
  meddraPT: string,
  meddraSOC: string,
  causality: Causality
): void {
  const state = loadState();
  state.meddraOverrides[caseId] = { meddraPT, meddraSOC, causality };
  saveState(state);
}
