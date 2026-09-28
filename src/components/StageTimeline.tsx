import { Lock, CheckCircle2, Circle } from 'lucide-react';
import clsx from 'clsx';
import type { LifecycleStage } from '../lib/types';

interface StageTimelineProps {
  stages: LifecycleStage[];
  currentStageNo: number;
}

const groupColors: Record<string, string> = {
  'PARTICIPANT INTAKE': 'bg-info/10 text-info border-info/30',
  'REGULATORY & CTRI':  'bg-ayush/10 text-ayush border-ayush/30',
  'eCRF & VISITS':      'bg-brand/10 text-brand border-brand/30',
  'CLOSE-OUT':          'bg-ink-soft/10 text-ink-soft border-ink-soft/20',
};

export default function StageTimeline({ stages, currentStageNo }: StageTimelineProps) {
  return (
    <div className="w-full">
      {/* Desktop: horizontal scroll */}
      <div className="hidden md:flex items-start gap-0 overflow-x-auto pb-4">
        {stages.map((stage, idx) => {
          const isDone    = stage.no < currentStageNo;
          const isCurrent = stage.no === currentStageNo;
          const isLocked  = stage.no > currentStageNo && stage.hardGate;
          const isNext    = stage.no > currentStageNo && !stage.hardGate;

          return (
            <div key={stage.no} className="flex items-start flex-shrink-0">
              {/* Stage node */}
              <div className="flex flex-col items-center w-28 group relative">
                {/* Connector line left */}
                {idx > 0 && (
                  <div className={clsx('absolute top-5 right-full w-full h-0.5', isDone ? 'bg-brand' : 'bg-gray-200')} />
                )}

                {/* Icon circle */}
                <div className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 relative flex-shrink-0',
                  isDone    && 'bg-brand border-brand text-white',
                  isCurrent && 'bg-ayush border-ayush text-white ring-4 ring-ayush/30 animate-pulse',
                  isLocked  && 'bg-gray-100 border-gray-300 text-gray-400',
                  isNext    && 'bg-white border-gray-300 text-gray-400',
                )}>
                  {isDone    && <CheckCircle2 className="w-5 h-5" />}
                  {isCurrent && <span className="text-sm font-bold">{stage.no}</span>}
                  {isLocked  && <Lock className="w-4 h-4" />}
                  {isNext    && <Circle className="w-4 h-4" />}
                </div>

                {/* Stage label */}
                <div className="mt-2 text-center px-1">
                  <p className={clsx(
                    'text-xs font-semibold leading-tight',
                    isCurrent ? 'text-ayush' : isDone ? 'text-brand' : 'text-ink-mute'
                  )}>
                    {stage.no}. {stage.name}
                  </p>
                  {stage.hardGate && (
                    <span className="mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-ayush/10 text-ayush border border-ayush/30">
                      HARD GATE
                    </span>
                  )}
                  {stage.gateRule && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-ink text-white text-xs rounded-lg p-2 shadow-xl
                      opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      🔒 {stage.gateRule}
                    </div>
                  )}
                </div>

                {/* Group label on first of group */}
                {(idx === 0 || stages[idx - 1].group !== stage.group) && (
                  <span className={clsx(
                    'mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full border',
                    groupColors[stage.group] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                  )}>
                    {stage.group}
                  </span>
                )}
              </div>

              {/* Connector line between stages */}
              {idx < stages.length - 1 && (
                <div className={clsx('h-0.5 w-6 mt-5 flex-shrink-0', isDone ? 'bg-brand' : 'bg-gray-200')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden space-y-3">
        {stages.map(stage => {
          const isDone    = stage.no < currentStageNo;
          const isCurrent = stage.no === currentStageNo;
          const isLocked  = stage.no > currentStageNo && stage.hardGate;

          return (
            <div key={stage.no} className={clsx(
              'flex items-center gap-3 p-3 rounded-lg border',
              isCurrent ? 'bg-ayush/5 border-ayush/30' : isDone ? 'bg-brand/5 border-brand/20' : 'bg-white border-gray-200'
            )}>
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                isDone ? 'bg-brand text-white' : isCurrent ? 'bg-ayush text-white' : isLocked ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-300 text-gray-400'
              )}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : <span className="text-xs font-bold">{stage.no}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={clsx('text-sm font-semibold', isCurrent ? 'text-ayush' : isDone ? 'text-brand' : 'text-ink-mute')}>
                  Stage {stage.no}: {stage.name}
                </p>
                {stage.hardGate && <span className="text-xs text-ayush font-medium">⚠ Hard Gate</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
