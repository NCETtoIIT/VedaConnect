import { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { saeClock, formatCountdown } from '../lib/saeClock';
import clsx from 'clsx';

interface SaeClockProps {
  reportedAtUTC: string;
  deadlineHours?: number;
  caseId: string;
}

export default function SaeClock({ reportedAtUTC, deadlineHours = 24, caseId }: SaeClockProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const clock = saeClock(reportedAtUTC, deadlineHours);
  const { expired, urgent, percentUsed, msLeft } = clock;

  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ * (1 - percentUsed / 100);

  const ringColor = expired ? '#DC2626' : urgent ? '#D97706' : '#0D9488';
  const textColor = expired ? 'text-danger' : urgent ? 'text-ayush' : 'text-ok';
  const bgColor   = expired ? 'bg-danger/5 border-danger/30' : urgent ? 'bg-ayush/5 border-ayush/30' : 'bg-ok/5 border-ok/20';

  // Suppress unused variable warning — tick forces re-render each second
  void tick;
  void caseId;

  return (
    <div className={clsx(
      'inline-flex items-center gap-3 rounded-lg border px-3 py-2',
      bgColor,
      urgent && !expired && 'ring-pulse animate-pulse'
    )}>
      {/* Circular progress ring */}
      <svg width="52" height="52" className="flex-shrink-0">
        <circle cx="26" cy="26" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="5" />
        <circle
          cx="26" cy="26" r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        <text x="26" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill={ringColor}>
          {expired ? '!' : `${Math.round(100 - percentUsed)}%`}
        </text>
      </svg>

      <div className="min-w-0">
        <div className={clsx('font-mono font-bold text-lg leading-none', textColor)}>
          {expired ? 'EXPIRED' : formatCountdown(msLeft)}
        </div>
        <div className="flex items-center gap-1 mt-1">
          {urgent && !expired ? (
            <AlertTriangle className="w-3.5 h-3.5 text-ayush flex-shrink-0" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-ink-mute flex-shrink-0" />
          )}
          <span className={clsx('text-xs font-medium', urgent ? 'text-ayush' : 'text-ink-mute')}>
            {expired ? 'DEADLINE MISSED' : urgent ? 'URGENT — escalate now' : `${deadlineHours}h window`}
          </span>
        </div>
      </div>
    </div>
  );
}
