import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getRole, setRole } from '../lib/store';
import clsx from 'clsx';

const PAGE_TITLES: Record<string, { title: string; breadcrumb: string }> = {
  '/':        { title: 'Dashboard — Portfolio & Live KPIs',     breadcrumb: 'VedaConnect CTMS' },
  '/sites':   { title: 'Sites — 29 Participating Centres',      breadcrumb: 'VedaConnect CTMS' },
  '/safety':  { title: 'Safety — AE/SAE & 24H Countdown',       breadcrumb: 'VedaConnect CTMS' },
  '/alerts':  { title: 'Alerts Center — Ethics / CTRI Warnings', breadcrumb: 'VedaConnect CTMS' },
};

export default function Layout() {
  const [currentRole, setCurrentRole] = useState(() => getRole());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageInfo = PAGE_TITLES[location.pathname] ?? {
    title: 'Study Detail',
    breadcrumb: 'Studies'
  };

  const handleRoleChange = (roleId: string) => {
    setRole(roleId);
    setCurrentRole(roleId);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar currentRole={currentRole} />
      </div>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-shrink-0 z-10">
            <Sidebar currentRole={currentRole} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          title={pageInfo.title}
          breadcrumb={pageInfo.breadcrumb}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />
        <main className={clsx('flex-1 overflow-y-auto p-4 lg:p-6')}>
          <Outlet context={{ currentRole }} />
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-gray-200 bg-white text-center text-xs text-ink-mute">
          Synthetic de-identified data — DPDP Act 2023 compliant prototype · VedaConnect AIIA CTMS · Smart India Hackathon 2026 · SIH26046
        </footer>
      </div>
    </div>
  );
}
