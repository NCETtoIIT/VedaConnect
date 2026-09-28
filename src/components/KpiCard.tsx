import clsx from 'clsx';
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: 'brand' | 'danger' | 'ayush' | 'ok' | 'info' | 'default';
  sub?: string;
  pulse?: boolean;
}

const colorMap = {
  brand:   { bg: 'bg-brand/10',  icon: 'text-brand',  border: 'border-brand/20' },
  danger:  { bg: 'bg-danger/10', icon: 'text-danger',  border: 'border-danger/20' },
  ayush:   { bg: 'bg-ayush/10',  icon: 'text-ayush',   border: 'border-ayush/20' },
  ok:      { bg: 'bg-ok/10',     icon: 'text-ok',      border: 'border-ok/20' },
  info:    { bg: 'bg-info/10',   icon: 'text-info',    border: 'border-info/20' },
  default: { bg: 'bg-gray-100',  icon: 'text-gray-500', border: 'border-gray-200' },
};

export default function KpiCard({ label, value, icon, color = 'default', sub, pulse }: KpiCardProps) {
  const c = colorMap[color];
  return (
    <div className={clsx(
      'bg-white rounded-xl border p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow',
      c.border
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-mute uppercase tracking-wider">{label}</span>
        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', c.bg)}>
          <span className={clsx('w-5 h-5', c.icon, pulse && 'animate-pulse')}>{icon}</span>
        </div>
      </div>
      <div>
        <p className={clsx('text-3xl font-bold tracking-tight', color === 'danger' ? 'text-danger' : color === 'ayush' ? 'text-ayush' : 'text-ink')}>
          {value}
        </p>
        {sub && <p className="text-xs text-ink-mute mt-1">{sub}</p>}
      </div>
    </div>
  );
}
