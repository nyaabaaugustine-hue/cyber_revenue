import { UserRole, Permission } from "../types";

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'dashboard', actions: ['view'] },
    { resource: 'map', actions: ['view'] },
    { resource: 'businesses', actions: ['view', 'create', 'edit', 'delete'] },
    { resource: 'agents', actions: ['view', 'create', 'edit', 'delete'] },
    { resource: 'collections', actions: ['view', 'create', 'edit', 'delete'] },
    { resource: 'reports', actions: ['view', 'create', 'delete'] },
    { resource: 'ledger', actions: ['view', 'create', 'edit'] },
    { resource: 'anomalies', actions: ['view', 'resolve'] },
    { resource: 'users', actions: ['view', 'create', 'edit', 'delete'] },
    { resource: 'settings', actions: ['view', 'edit'] },
    { resource: 'activity', actions: ['view'] },
    { resource: 'commissions', actions: ['view', 'create', 'edit'] },
    { resource: 'compliance', actions: ['view', 'create'] },
    { resource: 'disputes', actions: ['view', 'create', 'resolve'] },
    { resource: 'reconciliation', actions: ['view', 'create', 'edit'] },
    { resource: 'assets', actions: ['view', 'create', 'edit', 'delete'] },
  ],
  supervisor: [
    { resource: 'dashboard', actions: ['view'] },
    { resource: 'map', actions: ['view'] },
    { resource: 'businesses', actions: ['view', 'create', 'edit'] },
    { resource: 'agents', actions: ['view'] },
    { resource: 'collections', actions: ['view', 'create'] },
    { resource: 'reports', actions: ['view'] },
    { resource: 'anomalies', actions: ['view', 'resolve'] },
    { resource: 'disputes', actions: ['view', 'create'] },
    { resource: 'compliance', actions: ['view'] },
    { resource: 'commissions', actions: ['view'] },
    { resource: 'activity', actions: ['view'] },
  ],
  accountant: [
    { resource: 'dashboard', actions: ['view'] },
    { resource: 'reports', actions: ['view', 'create'] },
    { resource: 'ledger', actions: ['view', 'create', 'edit'] },
    { resource: 'collections', actions: ['view'] },
    { resource: 'commissions', actions: ['view'] },
    { resource: 'reconciliation', actions: ['view', 'create', 'edit'] },
    { resource: 'anomalies', actions: ['view'] },
    { resource: 'disputes', actions: ['view'] },
  ],
  manager: [
    { resource: 'dashboard', actions: ['view'] },
    { resource: 'map', actions: ['view'] },
    { resource: 'businesses', actions: ['view', 'create', 'edit'] },
    { resource: 'collections', actions: ['view'] },
    { resource: 'reports', actions: ['view', 'create'] },
    { resource: 'users', actions: ['view'] },
    { resource: 'anomalies', actions: ['view', 'resolve'] },
    { resource: 'disputes', actions: ['view', 'resolve'] },
    { resource: 'commissions', actions: ['view'] },
    { resource: 'compliance', actions: ['view'] },
    { resource: 'activity', actions: ['view'] },
    { resource: 'ledger', actions: ['view'] },
  ],
  field_officer: [
    { resource: 'dashboard', actions: ['view'] },
    { resource: 'map', actions: ['view'] },
    { resource: 'businesses', actions: ['view'] },
    { resource: 'collections', actions: ['view', 'create'] },
    { resource: 'agents', actions: ['view'] },
  ],
};

export function hasPermission(
  userRole: UserRole | string,
  resource: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'resolve'
): boolean {
  const permissions = rolePermissions[userRole as UserRole];
  if (!permissions) return false;
  const resourcePermission = permissions.find((p) => p.resource === resource);
  return resourcePermission ? resourcePermission.actions.includes(action) : false;
}

export function getAccessibleResources(userRole: UserRole): string[] {
  return rolePermissions[userRole]?.map((p) => p.resource) || [];
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  supervisor: 'Revenue Supervisor',
  accountant: 'Accountant',
  manager: 'Operations Manager',
  field_officer: 'Field Revenue Officer',
};

export const roleBadgeVariants: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
  admin: "default",
  supervisor: "secondary",
  accountant: "outline",
  manager: "secondary",
  field_officer: "outline",
};

export const roleBadgeStyles: Record<UserRole, string> = {
  admin: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400',
  supervisor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  accountant: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
  manager: 'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400',
  field_officer: 'bg-orange-500/10 text-orange-600 border-orange-500/30 dark:text-orange-400',
};
