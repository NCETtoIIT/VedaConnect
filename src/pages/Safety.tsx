import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Lock, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import SaeClock from '../components/SaeClock';
import StatusPill from '../components/StatusPill';
import RoleGuard from '../components/RoleGuard';
import safetyData from '../data/safety.json';
import { getMeddraOverride, saveMeddraCode } from '../lib/store';
import type { SafetyCase, Causality } from '../lib/types';
import { formatDate } from '../lib/format';
import clsx from 'clsx';

const MEDDRA_OPTIONS = [
  { pt: 'Rash',                   soc: 'Skin and subcutaneous tissue disorders' },
  { pt: 'Nausea',                 soc: 'Gastrointestinal disorders' },
  { pt: 'Elevated liver enzymes', soc: 'Investigations' },
  { pt: 'Dizziness',              soc: 'Nervous system disorders' },
  { pt: 'Fatigue',                soc: 'General disorders and administration site conditions' },
];

const CAUSALITY_OPTIONS: Causality[] = [
  'CERTAIN', 'PROBABLE', 'POSSIBLE', 'UNLIKELY', 'CONDITIONAL', 'UNASSESSABLE', 'NOT ASSESSED'
];

export default function Safety() {
  const { currentRole } = useOutletContext<{ currentRole: string }>();
  const [cases, setCases] = useState<SafetyCase[]>(() => {
    return (safetyData.cases as SafetyCase[]).map(c => {
      const override = getMeddraOverride(c.id);
      if (override) {
        return { ...c, meddraCoded: true, meddraPT: override.meddraPT, meddraSOC: override.meddraSOC, causality: override.causality };
      }
      return c;
    });
  });

  const [codingCase, setCodingCase] = useState<SafetyCase | null>(null);
  const [selectedPT, setSelectedPT] = useState('');
  const [selectedSOC, setSelectedSOC] = useState('');
  const [selectedCausality, setSelectedCausality] = useState<Causality>('NOT ASSESSED');
  const [toast, setToast] = useState('');

  const handleOpenCoding = (c: SafetyCase) => {
    setCodingCase(c);
    const opt = MEDDRA_OPTIONS[0];
    setSelectedPT(c.meddraPT || opt.pt);
    setSelectedSOC(c.meddraSOC || opt.soc);
    setSelectedCausality(c.causality || 'NOT ASSESSED');
  };

  const handlePTChange = (pt: string) => {
    setSelectedPT(pt);
    const found = MEDDRA_OPTIONS.find(o => o.pt === pt);
    if (found) setSelectedSOC(found.soc);
  };

  const handleSaveCoding = () => {
    if (!codingCase) return;
    saveMeddraCode(codingCase.id, selectedPT, selectedSOC, selectedCausality);
    setCases(prev => prev.map(c =>
      c.id === codingCase.id
        ? { ...c, meddraCoded: true, meddraPT: selectedPT, meddraSOC: selectedSOC, causality: selectedCausality }
        : c
    ));
    setCodingCase(null);
    setToast(`MedDRA coding saved for ${codingCase.id} — gate now open ✓`);
    setTimeout(() => setToast(''), 4000);
  };

  const openCases   = cases.filter(c => c.status === 'OPEN');
  const closedCases = cases.filter(c => c.status === 'CLOSED');
  const seriousOpen = cases.filter(c => c.serious && c.status === 'OPEN');

  return (
    <RoleGuard currentRole={currentRole} pageKey="safety">
      <div className="space-y-6">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Cases',    value: cases.length,       color: 'text-ink' },
            { label: 'Open',           value: openCases.length,   color: openCases.length > 0 ? 'text-danger' : 'text-ok' },
            { label: 'SAE (Serious)',  value: seriousOpen.length, color: seriousOpen.length > 0 ? 'text-danger' : 'text-ok' },
            { label: 'MedDRA Pending', value: cases.filter(c => !c.meddraCoded && c.serious).length,
              color: cases.some(c => !c.meddraCoded && c.serious) ? 'text-danger' : 'text-ok' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-ink-mute font-semibold uppercase tracking-wider">{kpi.label}</p>
              <p className={clsx('text-3xl font-bold mt-1', kpi.color)}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Safety Cases Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-ink">Safety Cases — AE / SAE Log</h2>
              <p className="text-xs text-ink-mute mt-0.5">All participant IDs are synthetic (SYN-Pxxxxx) · DPDP 2023</p>
            </div>
            {seriousOpen.length > 0 && (
              <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 text-danger px-3 py-1.5 rounded-lg animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold">{seriousOpen.length} SAE — Action Required</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Case ID', 'Study', 'Site', 'Participant', 'Event', 'Serious?', '24H Clock', 'MedDRA PT / SOC', 'Causality', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-mute uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map(c => {
                  const gate = c.serious && !c.meddraCoded;
                  return (
                    <tr key={c.id} className={clsx(
                      'hover:bg-gray-50 transition-colors',
                      gate && 'bg-danger/3'
                    )}>
                      <td className="px-4 py-3 font-mono text-xs font-bold text-ink whitespace-nowrap">{c.id}</td>
                      <td className="px-4 py-3 text-xs font-medium text-brand whitespace-nowrap">{c.studyId}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">{c.siteId}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-mute whitespace-nowrap">{c.participantToken}</td>
                      <td className="px-4 py-3 text-xs max-w-[180px]">
                        <span className="block">{c.event}</span>
                        {formatDate(c.reportedAtUTC) !== '—' && (
                          <span className="text-ink-mute text-[10px]">Reported: {formatDate(c.reportedAtUTC)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={clsx(
                          'text-xs font-bold px-2 py-0.5 rounded-full border',
                          c.serious
                            ? 'bg-danger/10 text-danger border-danger/30'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        )}>
                          {c.serious ? 'SAE' : 'AE'}
                        </span>
                      </td>
                      <td className="px-4 py-3 min-w-[200px]">
                        {c.status === 'OPEN'
                          ? <SaeClock reportedAtUTC={c.reportedAtUTC} deadlineHours={c.deadlineHours} caseId={c.id} />
                          : <span className="text-xs text-ink-mute italic">Closed</span>
                        }
                      </td>
                      <td className="px-4 py-3 min-w-[160px]">
                        {c.meddraCoded ? (
                          <div>
                            <p className="text-xs font-semibold text-ink">{c.meddraPT}</p>
                            <p className="text-[10px] text-ink-mute">{c.meddraSOC}</p>
                          </div>
                        ) : (
                          gate
                            ? <span className="inline-flex items-center gap-1 text-xs bg-danger/10 text-danger border border-danger/30 font-bold px-2 py-1 rounded-full">
                                <Lock className="w-3 h-3" /> CODING GATE — locked
                              </span>
                            : <span className="text-xs text-ink-mute italic">Not coded</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-ink-soft">{c.causality}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={c.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap space-y-1.5">
                        {c.status === 'OPEN' && (
                          <button
                            onClick={() => handleOpenCoding(c)}
                            className="block w-full text-xs bg-brand text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-dark transition-colors"
                          >
                            Code AE
                          </button>
                        )}
                        <button
                          disabled={gate}
                          className={clsx(
                            'block w-full text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
                            gate
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                              : 'bg-ok text-white hover:bg-green-700'
                          )}
                        >
                          {gate ? '🔒 Publish locked' : 'Publish to regulator'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closed cases note */}
        {closedCases.length > 0 && (
          <p className="text-xs text-ink-mute text-center">
            {closedCases.length} closed case(s) shown above · Synthetic de-identified data — DPDP Act 2023 compliant prototype
          </p>
        )}
      </div>

      {/* MedDRA Coding Modal */}
      {codingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setCodingCase(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            <div className="bg-ink px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50 font-mono">{codingCase.id}</p>
                <h3 className="text-base font-bold text-white mt-1">MedDRA Coding</h3>
              </div>
              <button onClick={() => setCodingCase(null)} className="p-1 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-xs text-ink-mute mb-1">Event</p>
                <p className="font-medium text-ink">{codingCase.event}</p>
                <p className="text-xs text-ink-mute mt-1">Participant: <span className="font-mono">{codingCase.participantToken}</span></p>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-mute uppercase tracking-wider mb-2 block">
                  MedDRA Preferred Term (PT)
                </label>
                <select
                  value={selectedPT}
                  onChange={e => handlePTChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white"
                >
                  {MEDDRA_OPTIONS.map(o => (
                    <option key={o.pt} value={o.pt}>{o.pt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-mute uppercase tracking-wider mb-2 block">
                  System Organ Class (SOC)
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedSOC}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-ink-mute"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-mute uppercase tracking-wider mb-2 block">
                  Causality (WHO-UMC)
                </label>
                <select
                  value={selectedCausality}
                  onChange={e => setSelectedCausality(e.target.value as Causality)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white"
                >
                  {CAUSALITY_OPTIONS.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="bg-ok/10 border border-ok/30 rounded-lg p-3 text-xs text-ok font-medium">
                ✓ After saving, the "Publish to regulator" gate will unlock for this case.
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setCodingCase(null)}
                className="flex-1 py-2.5 border border-gray-200 text-ink text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCoding}
                className="flex-1 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow-sm"
              >
                Save & Unlock Gate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 toast-enter">
          <div className="flex items-center gap-3 bg-ok text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {toast}
          </div>
        </div>
      )}
    </RoleGuard>
  );
}
