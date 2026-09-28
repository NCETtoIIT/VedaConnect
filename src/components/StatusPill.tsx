import clsx from 'clsx';

type Status = 'ON TRACK' | 'WATCH' | 'AT RISK' | string;

interface StatusPillProps {
  status: Status;
  size?: 'sm' | 'md';
}

const statusMap: Record<string, string> = {
  'ON TRACK': 'bg-ok/10 text-ok border-ok/30',
  'WATCH':    'bg-ayush/10 text-ayush border-ayush/30',
  'AT RISK':  'bg-danger/10 text-danger border-danger/30',
  'OPEN':     'bg-danger/10 text-danger border-danger/30',
  'CLOSED':   'bg-ok/10 text-ok border-ok/30',
  'PENDING':  'bg-info/10 text-info border-info/30',
};

const dotMap: Record<string, string> = {
  'ON TRACK': 'bg-ok',
  'WATCH':    'bg-ayush',
  'AT RISK':  'bg-danger',
  'OPEN':     'bg-danger',
  'CLOSED':   'bg-ok',
  'PENDING':  'bg-info',
};

export default function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const cls = statusMap[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  const dot = dotMap[status] ?? 'bg-gray-400';
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 font-semibold border rounded-full whitespace-nowrap',
      cls,
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
    )}>
      <span className={clsx('rounded-full flex-shrink-0', dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {status}
    </span>
  );
}
