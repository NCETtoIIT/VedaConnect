import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, FlaskConical, ShieldAlert, Bell, X, Leaf } from 'lucide-react';
import { can } from './RoleGuard';
import clsx from 'clsx';

interface SidebarProps {
  currentRole: string;
  onClose?: () => void;
}

const navItems = [
  { key: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard, to: '/' },
  { key: 'sites',     label: 'Sites',        icon: Building2,       to: '/sites' },
  { key: 'study',     label: 'Studies',      icon: FlaskConical,    to: '/study/AYU-003' },
  { key: 'safety',    label: 'Safety',       icon: ShieldAlert,     to: '/safety' },
  { key: 'alerts',    label: 'Alerts',       icon: Bell,            to: '/alerts' },
];

export default function Sidebar({ currentRole, onClose }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-ink text-white w-64 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-base leading-tight">VedaConnect</p>
            <p className="text-[10px] text-white/50 leading-tight">AIIA CTMS · SIH26046</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          if (!can(currentRole, item.key)) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0 w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* GCP badge */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
          <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Compliance</p>
          <div className="flex flex-wrap gap-1">
            {['GCP', 'CTRI', 'IEC', 'MedDRA', 'DPDP'].map(tag => (
              <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 bg-brand/20 text-brand rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
