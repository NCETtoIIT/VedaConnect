import rolesData from '../data/roles.json';

interface RoleGuardProps {
  currentRole: string;
  pageKey: string;
  children: React.ReactNode;
}

export function can(roleId: string, pageKey: string): boolean {
  return (rolesData.roles.find(r => r.id === roleId)?.sees ?? []).includes(pageKey);
}

export default function RoleGuard({ currentRole, pageKey, children }: RoleGuardProps) {
  const role = rolesData.roles.find(r => r.id === currentRole);
  if (!role || !can(currentRole, pageKey)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-4xl">🔒</span>
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">Access Restricted</h2>
        <p className="text-ink-mute text-sm max-w-sm">
          Read-only / Access restricted for <strong>{role?.name ?? currentRole}</strong>. RBAC is enforced by role.
        </p>
        <p className="mt-3 text-xs text-ink-mute">
          Switch to a role with access using the Role Switcher in the top bar.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
