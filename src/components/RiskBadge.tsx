import clsx from 'clsx';

interface RiskBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export default function RiskBadge({ score, size = 'md' }: RiskBadgeProps) {
  const color =
    score >= 70 ? 'bg-danger/10 text-danger border-danger/30' :
    score >= 45 ? 'bg-ayush/10 text-ayush border-ayush/30' :
                  'bg-ok/10 text-ok border-ok/30';
  const label =
    score >= 70 ? 'HIGH RISK' :
    score >= 45 ? 'WATCH' :
                  'LOW RISK';

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 font-semibold border rounded-full',
      color,
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
    )}>
      <span className={clsx(
        'rounded-full',
        score >= 70 ? 'bg-danger' : score >= 45 ? 'bg-ayush' : 'bg-ok',
        size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
      )} />
      {score} — {label}
    </span>
  );
}
