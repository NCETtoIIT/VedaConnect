import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import {
  FlaskConical, Users, AlertCircle, Activity,
  BarChart3, Lock, ClipboardCheck
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import RiskBadge from '../components/RiskBadge';
import StatusPill from '../components/StatusPill';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import RoleGuard from '../components/RoleGuard';
import studiesData from '../data/studies.json';
import sitesData from '../data/sites.json';
import lifecycleData from '../data/lifecycle.json';
import type { Study } from '../lib/types';
import { avgRisk, pct } from '../lib/format';

const enrolmentCurve = [
  { month: 'Apr', enrolled: 120, target: 150 },
  { month: 'May', enrolled: 198, target: 210 },
  { month: 'Jun', enrolled: 285, target: 300 },
  { month: 'Jul', enrolled: 390, target: 420 },
  { month: 'Aug', enrolled: 568, target: 600 },
  { month: 'Sep', enrolled: 820, target: 900 },
];

const RISK_COLORS: Record<string, string> = {
  'AT RISK': '#DC2626',
  'WATCH':   '#D97706',
  'ON TRACK': '#0D9488',
};

export default function Dashboard() {
  const { currentRole } = useOutletContext<{ currentRole: string }>();
  const navigate = useNavigate();
  const studies = studiesData.studies as Study[];
  const sites = sitesData.sites;

  const totalEnrolled = studies.reduce((s, st) => s + st.enrolled, 0);
  const totalQueries  = studies.reduce((s, st) => s + st.openQueries, 0);
  const totalOverdue  = studies.reduce((s, st) => s + st.overdueMonitoring, 0);
  const portfolioRisk = avgRisk(studies.map(s => s.riskScore));

  const riskChartData = studies.map(s => ({
    id: s.id,
    title: s.id,
    score: s.riskScore,
    status: s.status,
  }));

  const columns: Column<Study>[] = [
    { key: 'id',       label: 'Study ID',    sortable: true, render: r => <span className="font-mono font-semibold text-brand">{r.id}</span> },
    { key: 'title',    label: 'Title',        render: r => <span className="max-w-xs truncate block text-xs">{r.title}</span> },
    { key: 'phase',    label: 'Phase',        sortable: true },
    { key: 'stageNo',  label: 'Stage',        sortable: true, render: r => <span className="font-medium">{r.stageNo}/10 — {r.stageName}</span> },
    { key: 'sites',    label: 'Sites',        sortable: true },
    { key: 'enrolled', label: 'Enrolled/Target', sortable: true, render: r => (
      <div className="min-w-[120px]">
        <span className="text-xs font-medium">{r.enrolled}/{r.target}</span>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
          <div className="bg-brand h-1.5 rounded-full" style={{ width: `${pct(r.enrolled, r.target)}%` }} />
        </div>
      </div>
    )},
    { key: 'openQueries', label: 'Open Queries', sortable: true, render: r => (
      r.openQueries > 0 ? <span className="text-xs font-bold text-ayush bg-ayush/10 px-2 py-0.5 rounded-full">{r.openQueries}</span> : <span className="text-ink-mute">0</span>
    )},
    { key: 'riskScore', label: 'Risk', sortable: true, render: r => <RiskBadge score={r.riskScore} size="sm" /> },
    { key: 'status',   label: 'Status', render: r => <StatusPill status={r.status} size="sm" /> },
  ];

  return (
    <RoleGuard currentRole={currentRole} pageKey="dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard label="Active Studies"         value={studies.length} icon={<FlaskConical className="w-5 h-5" />} color="brand" sub="Total portfolio" />
          <KpiCard label="Participating Centres"  value={sites.length}   icon={<ClipboardCheck className="w-5 h-5" />} color="info" sub="Across India" />
          <KpiCard label="Participants Enrolled"  value={totalEnrolled.toLocaleString()} icon={<Users className="w-5 h-5" />} color="ok" sub="Synthetic IDs only" />
          <KpiCard label="Open Queries"           value={totalQueries}   icon={<AlertCircle className="w-5 h-5" />} color={totalQueries > 0 ? 'ayush' : 'ok'} pulse={totalQueries > 0} />
          <KpiCard label="Overdue Monitoring"     value={totalOverdue}   icon={<Activity className="w-5 h-5" />} color={totalOverdue > 0 ? 'danger' : 'ok'} sub="SDV visits overdue" pulse={totalOverdue > 0} />
          <KpiCard label="Avg Portfolio Risk"     value={portfolioRisk}  icon={<BarChart3 className="w-5 h-5" />} color={portfolioRisk >= 70 ? 'danger' : portfolioRisk >= 45 ? 'ayush' : 'ok'} sub="Score 0–100" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Risk Bar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-ink mb-4">Study-wise Risk Score</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="title" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <ReferenceLine y={70} stroke="#DC2626" strokeDasharray="4 4" label={{ value: 'HIGH', fontSize: 10, fill: '#DC2626' }} />
                  <ReferenceLine y={45} stroke="#D97706" strokeDasharray="4 4" label={{ value: 'WATCH', fontSize: 10, fill: '#D97706' }} />
                  <Tooltip
                    content={({ active, payload }) => active && payload?.length ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
                        <p className="font-bold text-ink">{payload[0].payload.id}</p>
                        <p className="text-ink-mute">Risk Score: <strong className="text-ink">{payload[0].value}</strong></p>
                      </div>
                    ) : null}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {riskChartData.map((entry, idx) => (
                      <Cell key={idx} fill={RISK_COLORS[entry.status] ?? '#6B7280'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enrolment S-Curve */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-ink mb-4">Enrolment S-Curve — Portfolio vs Target</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrolmentCurve} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip
                    content={({ active, payload, label }) => active && payload?.length ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
                        <p className="font-bold text-ink">{label}</p>
                        {payload.map(p => (
                          <p key={String(p.dataKey)} style={{ color: String(p.color) }}>{p.name}: {p.value}</p>
                        ))}
                      </div>
                    ) : null}
                  />
                  <Line type="monotone" dataKey="enrolled" stroke="#0D9488" strokeWidth={2.5} dot={{ fill: '#0D9488', r: 4 }} name="Enrolled" />
                  <Line type="monotone" dataKey="target"   stroke="#D97706" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hard Gates card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-ayush" />
            <h2 className="text-sm font-semibold text-ink">Hard Gates — {lifecycleData.hardGateRules.length} Locks Active</h2>
            <span className="ml-auto text-xs bg-ayush/10 text-ayush font-bold px-2 py-0.5 rounded-full border border-ayush/30">
              🔒 {lifecycleData.hardGateRules.length} Gates
            </span>
          </div>
          <ol className="space-y-2">
            {lifecycleData.hardGateRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 bg-ok/10 text-ok rounded-full flex items-center justify-center text-xs font-bold border border-ok/30">
                  {idx + 1}
                </span>
                <span className="text-ink-soft">{rule}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Studies table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-ink">Studies — Lifecycle Status</h2>
            <p className="text-xs text-ink-mute mt-0.5">Click a row to view full study detail</p>
          </div>
          <div className="p-5">
            <DataTable
              columns={columns}
              data={studies}
              rowKey={r => r.id}
              onRowClick={r => navigate(`/study/${r.id}`)}
            />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
