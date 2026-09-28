import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ShieldCheck, FileCheck, ClipboardCheck, AlertTriangle, Database,
  CheckCircle2, ExternalLink, Bell
} from 'lucide-react';
import RoleGuard from '../components/RoleGuard';
import EmptyState from '../components/EmptyState';
import alertsData from '../data/alerts.json';
import { markAlertRead, isAlertRead } from '../lib/store';
import type { Alert, AlertType } from '../lib/types';
import { formatDate } from '../lib/format';
import clsx from 'clsx';

type FilterChip = 'ALL' | AlertType;

const TYPE_ICONS: Record<AlertType, React.ReactNode> = {
  ETHICS:       <ShieldCheck className="w-4 h-4" />,
  CTRI:         <FileCheck className="w-4 h-4" />,
  MONITORING:   <ClipboardCheck className="w-4 h-4" />,
  DATA_QUALITY: <Database className="w-4 h-4" />,
  SAFETY:       <AlertTriangle className="w-4 h-4" />,
};

const SEVERITY_STRIP: Record<string, string> = {
  HIGH:   'bg-danger',
  MEDIUM: 'bg-ayush',
  LOW:    'bg-gray-300',
};

const SEVERITY_LABEL: Record<string, string> = {
  HIGH:   'bg-danger/10 text-danger border-danger/30',
  MEDIUM: 'bg-ayush/10 text-ayush border-ayush/30',
  LOW:    'bg-gray-100 text-gray-500 border-gray-200',
};

const TYPE_CHIPS: { key: FilterChip; label: string }[] = [
  { key: 'ALL',          label: 'All' },
  { key: 'ETHICS',       label: 'Ethics' },
  { key: 'CTRI',         label: 'CTRI' },
  { key: 'MONITORING',   label: 'Monitoring' },
  { key: 'DATA_QUALITY', label: 'Data Quality' },
  { key: 'SAFETY',       label: 'Safety' },
];

export default function Alerts() {
  const { currentRole } = useOutletContext<{ currentRole: string }>();
  const [alerts, setAlerts] = useState<Alert[]>(() =>
    (alertsData.alerts as Alert[]).map(a => ({ ...a, read: isAlertRead(a.id) }))
  );
  const [filter, setFilter] = useState<FilterChip>('ALL');
  const [, setTick] = useState(0);

  // Re-sync read state from localStorage on mount
  useEffect(() => {
    setAlerts(prev => prev.map(a => ({ ...a, read: isAlertRead(a.id) })));
    setTick(t => t + 1);
  }, []);

  const handleMarkRead = (id: string) => {
    markAlertRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const unread  = alerts.filter(a => !a.read);
  const highCnt = unread.filter(a => a.severity === 'HIGH').length;
  const medCnt  = unread.filter(a => a.severity === 'MEDIUM').length;
  const lowCnt  = unread.filter(a => a.severity === 'LOW').length;

  const filtered = alerts.filter(a => filter === 'ALL' || a.type === filter);

  return (
    <RoleGuard currentRole={currentRole} pageKey="alerts">
      <div className="space-y-5">
        {/* Summary counters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 text-danger px-4 py-2 rounded-xl">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-bold">{highCnt}</span>
            <span className="text-xs font-semibold">HIGH</span>
          </div>
          <div className="flex items-center gap-2 bg-ayush/10 border border-ayush/30 text-ayush px-4 py-2 rounded-xl">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-bold">{medCnt}</span>
            <span className="text-xs font-semibold">MEDIUM</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-500 px-4 py-2 rounded-xl">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-bold">{lowCnt}</span>
            <span className="text-xs font-semibold">LOW</span>
          </div>
          <div className="ml-auto text-xs text-ink-mute self-center">
            {unread.length} unread · {alerts.length - unread.length} dismissed
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {TYPE_CHIPS.map(chip => (
            <button
              key={chip.key}
              onClick={() => setFilter(chip.key)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                filter === chip.key
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-ink-mute border-gray-200 hover:border-brand/30 hover:text-brand'
              )}
            >
              {chip.label}
              {chip.key !== 'ALL' && (
                <span className="ml-1.5 opacity-60">
                  {alerts.filter(a => a.type === chip.key && !a.read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Alerts list */}
        {filtered.length === 0 ? (
          <EmptyState title="No alerts" description="All alerts have been dismissed or no alerts match this filter." />
        ) : (
          <div className="space-y-3">
            {filtered.map(alert => (
              <div
                key={alert.id}
                className={clsx(
                  'bg-white rounded-xl border overflow-hidden shadow-sm transition-all',
                  alert.read ? 'opacity-60 border-gray-200' : 'border-gray-200 hover:shadow-md'
                )}
              >
                <div className="flex">
                  {/* Severity colour strip */}
                  <div className={clsx('w-1 flex-shrink-0', SEVERITY_STRIP[alert.severity])} />

                  {/* Content */}
                  <div className="flex-1 px-4 py-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Type icon */}
                        <div className={clsx(
                          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                          alert.severity === 'HIGH'   ? 'bg-danger/10 text-danger' :
                          alert.severity === 'MEDIUM' ? 'bg-ayush/10 text-ayush' :
                                                        'bg-gray-100 text-gray-500'
                        )}>
                          {TYPE_ICONS[alert.type as AlertType]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={clsx('text-sm font-semibold', alert.read ? 'text-ink-mute' : 'text-ink')}>
                              {alert.title}
                            </p>
                            <span className={clsx(
                              'text-[10px] font-bold px-1.5 py-0.5 rounded-full border',
                              SEVERITY_LABEL[alert.severity]
                            )}>
                              {alert.severity}
                            </span>
                            <span className="text-[10px] font-semibold text-ink-mute bg-gray-100 px-1.5 py-0.5 rounded-full">
                              {alert.type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-ink-mute mt-0.5">{alert.detail}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                        <span className="text-xs text-ink-mute">
                          Due: <span className={clsx('font-medium', new Date(alert.dueDate) < new Date() ? 'text-danger' : 'text-ink-soft')}>
                            {formatDate(alert.dueDate)}
                          </span>
                        </span>
                        {!alert.read && (
                          <button
                            onClick={() => handleMarkRead(alert.id)}
                            className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 text-ink-mute px-3 py-1.5 rounded-lg hover:bg-ok/10 hover:text-ok hover:border-ok/30 transition-colors font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark as read
                          </button>
                        )}
                        {alert.studyId && (
                          <Link
                            to={`/study/${alert.studyId}`}
                            className="flex items-center gap-1.5 text-xs bg-brand/10 text-brand border border-brand/30 px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-colors font-semibold"
                          >
                            Open study
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Action recommendation */}
                    <div className="mt-3 flex items-start gap-2">
                      <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-ink-mute">
                        <span className="font-semibold text-ink">Recommended action:</span> {alert.action}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
