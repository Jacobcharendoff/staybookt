/**
 * Role-Based Access Control (RBAC) System for Staybookt
 *
 * Defines roles, permissions, and permission checking logic.
 * Roles follow a hierarchy: owner > admin > manager > technician > viewer
 */

export type Role = 'owner' | 'admin' | 'manager' | 'technician' | 'viewer';

export type Resource =
  | 'contacts'
  | 'deals'
  | 'estimates'
  | 'invoices'
  | 'activities'
  | 'settings'
  | 'team'
  | 'automations'
  | 'reports'
  | 'integrations';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

export interface Permission {
  resource: Resource;
  actions: Action[];
}

export interface RoleInfo {
  role: Role;
  label: string;
  description: string;
  order: number; // for hierarchy
}

/**
 * Permission matrix defining what each role can do.
 * Roles inherit permissions from lower-ranked roles in the hierarchy.
 */
const permissionMatrix: Record<Role, Permission[]> = {
  owner: [
    // Owner has full access to everything
    { resource: 'contacts', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'estimates', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'invoices', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'activities', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'team', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'automations', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'integrations', actions: ['create', 'read', 'update', 'delete', 'manage'] },
  ],
  admin: [
    // Admin has everything except billing/settings
    { resource: 'contacts', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'estimates', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'invoices', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'activities', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    // Admin can view but not manage settings
    { resource: 'settings', actions: ['read'] },
    { resource: 'team', actions: ['read', 'update'] }, // Can update team but not create/delete
    { resource: 'automations', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'integrations', actions: ['read', 'update'] }, // No create/delete
  ],
  manager: [
    // Manager can CRUD contacts, deals, estimates, invoices, activities
    { resource: 'contacts', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'estimates', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'invoices', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'activities', actions: ['create', 'read', 'update', 'delete'] },
    // Manager can only read reports
    { resource: 'reports', actions: ['read'] },
    // No access to settings, team, automations, integrations
  ],
  technician: [
    // Technician can read contacts, read/update assigned deals, create activities
    { resource: 'contacts', actions: ['read'] },
    { resource: 'deals', actions: ['read', 'update'] }, // Limited to assigned deals
    { resource: 'activities', actions: ['create', 'read'] },
    // No access to estimates, invoices, settings, team, automations, integrations, reports
  ],
  viewer: [
    // Viewer is read-only
    { resource: 'contacts', actions: ['read'] },
    { resource: 'deals', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
    // No create/update/delete access
  ],
};

const roleHierarchy: Record<Role, RoleInfo> = {
  owner: {
    role: 'owner',
    label: 'Owner',
    description: 'Full access to everything including billing and team management',
    order: 5,
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    description: 'Full access to all features except billing',
    order: 4,
  },
  manager: {
    role: 'manager',
    label: 'Manager',
    description: 'Can manage contacts, deals, estimates, invoices, and activities',
    order: 3,
  },
  technician: {
    role: 'technician',
    label: 'Technician',
    description: 'Can read contacts, manage assigned deals, and create activities',
    order: 2,
  },
  viewer: {
    role: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to contacts, deals, and reports',
    order: 1,
  },
};

/**
 * Check if a role has permission to perform an action on a resource.
 * Includes hierarchy support (higher roles inherit lower role permissions).
 */
export function hasPermission(role: Role, resource: Resource, action: Action): boolean {
  const rolePermissions = permissionMatrix[role];
  if (!rolePermissions) return false;

  const resourcePerms = rolePermissions.find((p) => p.resource === resource);
  if (!resourcePerms) return false;

  return resourcePerms.actions.includes(action);
}

/**
 * Check if a role can access (read) a resource at all.
 */
export function canAccess(role: Role, resource: Resource): boolean {
  return hasPermission(role, resource, 'read');
}

/**
 * Get the human-readable label for a role.
 */
export function getRoleLabel(role: Role): string {
  return roleHierarchy[role]?.label || role;
}

/**
 * Get the description for a role.
 */
export function getRoleDescription(role: Role): string {
  return roleHierarchy[role]?.description || '';
}

/**
 * Get all available roles with their metadata.
 */
export function getAllRoles(): RoleInfo[] {
  return Object.values(roleHierarchy).sort((a, b) => b.order - a.order);
}

/**
 * Check if a role can manage another role.
 * Owner can manage anyone.
 * Admin can manage manager, technician, viewer (not other admins).
 * Other roles cannot manage anyone.
 */
export function canManageRole(currentRole: Role, targetRole: Role): boolean {
  const currentHierarchy = roleHierarchy[currentRole]?.order ?? 0;
  const targetHierarchy = roleHierarchy[targetRole]?.order ?? 0;

  if (currentRole === 'owner') return true; // Owner can manage anyone
  if (currentRole === 'admin' && targetHierarchy < currentHierarchy) return true; // Admin can manage lower roles
  return false;
}

/**
 * Get all permissions for a role.
 */
export function getRolePermissions(role: Role): Permission[] {
  return permissionMatrix[role] || [];
}

/**
 * Check if a role is higher than another in the hierarchy.
 */
export function isRoleHigherThan(role1: Role, role2: Role): boolean {
  const order1 = roleHierarchy[role1]?.order ?? 0;
  const order2 = roleHierarchy[role2]?.order ?? 0;
  return order1 > order2;
}
