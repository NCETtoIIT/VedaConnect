import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, AlertTriangle, MapPin, ClipboardCheck, Calendar } from 'lucide-react';
import StatusPill from '../components/StatusPill';
import EmptyState from '../components/EmptyState';
import RoleGuard from '../components/RoleGuard';
import sitesData from '../data/sites.json';
import studiesData from '../data/studies.json';
import type { Site } from '../lib/types';
import { formatDate, pct } from '../lib/format';
import clsx from 'clsx';

type StatusFilter = 'ALL' | 'ON TRACK' | 'WATCH' | 'AT RISK';

export default function Sites() {
  const { currentRole } = useOutletContext<{ currentRole: string }>();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const sites = sitesData.sites as Site[];
  const studies = studiesData.studies;

  const filtered = sites.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()) || s.state.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const countByStatus = (st: string) => sites.filter(s => s.status === st).length;

  return (
    <RoleGuard currentRole={currentRole} pageKey="sites">
      <div className="space-y-5">
        {/* Header + filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Sites — {sites.length} Participating Centres</h2>
            <p className="text-xs text-ink-mute mt-0.5">
              <span className="text-ok font-semibold">{countByStatus('ON TRACK')} On Track</span>
              {' · '}
              <span className="text-ayush font-semibold">{countByStatus('WATCH')} Watch</span>
              {' · '}
              <span className="text-danger font-semibold">{countByStatus('AT RISK')} At Risk</span>
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search city or site name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as StatusFilter)}
                className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none bg-white cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="ON TRACK">On Track</option>
                <option value="WATCH">Watch</option>
                <option value="AT RISK">At Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Site cards grid */}
        {filtered.length === 0 ? (
          <EmptyState title="No sites found" description="Try changing the search or filter." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(site => {
              const enrolPct = pct(site.enrolled, site.target);
              return (
                <div
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={clsx(
                    'bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition-all group',
                    site.status === 'AT RISK' ? 'border-danger/30 hover:border-danger/50' :
                    site.status === 'WATCH'   ? 'border-ayush/30 hover:border-ayush/50' :
                                                'border-gray-200 hover:border-brand/30'
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-ink-mute">{site.id}</p>
                      <h3 className="text-sm font-semibold text-ink leading-tight mt-0.5 group-hover:text-brand transition-colors">
                        {site.name}
                      </h3>
                    </div>
                    <StatusPill status={site.status} size="sm" />
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-ink-mute mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {site.city}, {site.state}
                  </div>

                  {/* Enrolment progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink-mute">Enrolment</span>
                      <span className="font-semibold text-ink">{site.enrolled}/{site.target} ({enrolPct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={clsx('h-2 rounded-full progress-bar-animate',
                          enrolPct >= 90 ? 'bg-ok' : enrolPct >= 60 ? 'bg-brand' : 'bg-ayush'
                        )}
                        style={{ width: `${enrolPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {site.openQueries > 0 && (
                      <span className="text-xs bg-ayush/10 text-ayush border border-ayush/30 font-semibold px-2 py-0.5 rounded-full">
                        {site.openQueries} Queries
                      </span>
                    )}
                    {site.deviations > 0 && (
                      <span className="text-xs bg-danger/10 text-danger border border-danger/30 font-semibold px-2 py-0.5 rounded-full">
                        {site.deviations} Deviations
                      </span>
                    )}
                    {site.deviations === 0 && site.openQueries === 0 && (
                      <span className="text-xs bg-ok/10 text-ok border border-ok/30 font-semibold px-2 py-0.5 rounded-full">
                        ✓ Clean
                      </span>
                    )}
                  </div>

                  {/* Monitoring */}
                  <div className={clsx(
                    'flex items-center gap-2 p-2 rounded-lg text-xs',
                    site.overdueMonitoring ? 'bg-danger/5 border border-danger/20' : 'bg-gray-50'
                  )}>
                    {site.overdueMonitoring ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-danger flex-shrink-0" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5 text-ink-mute flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      {site.overdueMonitoring ? (
                        <span className="text-danger font-semibold">⚠ SDV overdue — due {formatDate(site.monitoringDue)}</span>
                      ) : (
                        <span className="text-ink-mute">
                          Last: {formatDate(site.monitoringLast)} · Due: {formatDate(site.monitoringDue)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Site detail modal */}
      {selectedSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedSite(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
            <div className="bg-ink px-6 py-5">
              <p className="text-xs text-white/50 font-mono">{selectedSite.id}</p>
              <h3 className="text-base font-bold text-white mt-1">{selectedSite.name}</h3>
              <p className="text-sm text-white/60 mt-1">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />{selectedSite.city}, {selectedSite.state}
              </p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-ink-mute">Coordinator</span>
                <span className="text-sm font-semibold text-ink">{selectedSite.coordinator}</span>
              </div>
              <div>
                <span className="text-sm text-ink-mute block mb-2">Studies at this site</span>
                <div className="flex flex-wrap gap-2">
                  {selectedSite.studyIds.map(id => {
                    const study = studies.find(s => s.id === id);
                    return (
                      <div key={id} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <p className="text-xs font-mono font-bold text-brand">{id}</p>
                        {study && <p className="text-xs text-ink-mute mt-0.5 max-w-[200px] truncate">{study.title}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-ink-mute" />
                <span className="text-sm text-ink-mute">Status:</span>
                <StatusPill status={selectedSite.status} />
              </div>
            </div>
            <div className="px-6 pb-5">
              <button
                onClick={() => setSelectedSite(null)}
                className="w-full py-2.5 bg-ink text-white rounded-lg text-sm font-semibold hover:bg-ink-soft transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
}
