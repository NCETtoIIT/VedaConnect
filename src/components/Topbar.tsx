import { useState } from 'react';
import { ChevronDown, UserCircle2, ShieldCheck } from 'lucide-react';
import rolesData from '../data/roles.json';
import clsx from 'clsx';

interface TopbarProps {
  currentRole: string;
  onRoleChange: (roleId: string) => void;
  title: string;
  breadcrumb?: string;
  onMenuToggle?: () => void;
}

export default function Topbar({ currentRole, onRoleChange, title, breadcrumb, onMenuToggle }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const currentRoleData = rolesData.roles.find(r => r.id === currentRole);

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-3.5 bg-white border-b border-gray-200 sticky top-0 z-30">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-ink"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          {breadcrumb && <p className="text-xs text-ink-mute">{breadcrumb}</p>}
          <h1 className="text-base font-semibold text-ink leading-tight">{title}</h1>
        </div>
      </div>

      {/* Right: DPDP badge + role switcher */}
      <div className="flex items-center gap-3">
        {/* DPDP badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-ok/10 border border-ok/30 text-ok text-xs font-semibold px-2.5 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Synthetic data · DPDP 2023
        </div>

        {/* Role switcher dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
              open ? 'bg-brand/5 border-brand/30 text-brand' : 'bg-white border-gray-200 text-ink hover:border-brand/30 hover:text-brand'
            )}
          >
            <UserCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:block max-w-[140px] truncate">{currentRoleData?.name ?? currentRole}</span>
            <ChevronDown className={clsx('w-4 h-4 transition-transform', open && 'rotate-180')} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                <p className="px-4 py-2 text-[10px] font-bold text-ink-mute uppercase tracking-wider border-b border-gray-100">
                  Switch Role
                </p>
                {rolesData.roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => { onRoleChange(role.id); setOpen(false); }}
                    className={clsx(
                      'w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                      role.id === currentRole && 'bg-brand/5'
                    )}
                  >
                    <UserCircle2 className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', role.id === currentRole ? 'text-brand' : 'text-gray-400')} />
                    <div>
                      <p className={clsx('text-sm font-medium', role.id === currentRole ? 'text-brand' : 'text-ink')}>
                        {role.name}
                      </p>
                      <p className="text-xs text-ink-mute">{role.email}</p>
                    </div>
                    {role.id === currentRole && (
                      <span className="ml-auto text-[9px] font-bold bg-brand text-white px-1.5 py-0.5 rounded-full mt-1">
                        ACTIVE
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
