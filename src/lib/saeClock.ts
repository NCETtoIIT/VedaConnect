import type { SaeClockResult } from './types';

export function saeClock(reportedAtUTC: string, deadlineHours = 24): SaeClockResult {
  const start = new Date(reportedAtUTC).getTime();
  const deadline = start + deadlineHours * 3600 * 1000;
  const now = Date.now();
  const msLeft = deadline - now;
  const hoursLeft = msLeft / 3600000;
  return {
    msLeft,
    hoursLeft,
    expired: msLeft <= 0,
    urgent: msLeft > 0 && msLeft <= 6 * 3600 * 1000,
    percentUsed: Math.min(
      100,
      Math.max(0, ((deadlineHours * 3600 * 1000 - Math.max(msLeft, 0)) / (deadlineHours * 3600 * 1000)) * 100)
    ),
  };
}

export function formatCountdown(msLeft: number): string {
  if (msLeft <= 0) return 'EXPIRED';
  const totalSeconds = Math.floor(msLeft / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}
