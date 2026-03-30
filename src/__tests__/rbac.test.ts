import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  canAccess,
  getRoleLabel,
  getRoleDescription,
  getAllRoles,
  canManageRole,
  getRolePermissions,
  isRoleHigherThan,
  type Role,
} from '@/lib/rbac';

describe('Role-Based Access Control (RBAC)', () => {
  describe('Owner Permissions', () => {
    it('should have all permissions', () => {
      const owner: Role = 'owner';

      expect(hasPermission(owner, 'contacts', 'create')).toBe(true);
      expect(hasPermission(owner, 'contacts', 'read')).toBe(true);
      expect(hasPermission(owner, 'contacts', 'update')).toBe(true);
      expect(hasPermission(owner, 'contacts', 'delete')).toBe(true);
      expect(hasPermission(owner, 'contacts', 'manage')).toBe(true);

      expect(hasPermission(owner, 'settings', 'manage')).toBe(true);
      expect(hasPermission(owner, 'integrations', 'delete')).toBe(true);
    });
  });

  describe('Viewer Permissions', () => {
    it('should be read-only', () => {
      const viewer: Role = 'viewer';

      expect(hasPermission(viewer, 'contacts', 'read')).toBe(true);
      expect(hasPermission(viewer, 'deals', 'read')).toBe(true);
      expect(hasPermission(viewer, 'reports', 'read')).toBe(true);

      expect(hasPermission(viewer, 'contacts', 'create')).toBe(false);
      expect(hasPermission(viewer, 'deals', 'update')).toBe(false);
      expect(hasPermission(viewer, 'contacts', 'delete')).toBe(false);
    });

    it('should not have access to settings', () => {
      const viewer: Role = 'viewer';

      expect(canAccess(viewer, 'settings')).toBe(false);
      expect(canAccess(viewer, 'team')).toBe(false);
      expect(canAccess(viewer, 'automations')).toBe(false);
    });
  });

  describe('Technician Permissions', () => {
    it('should be able to read contacts', () => {
      const technician: Role = 'technician';

      expect(hasPermission(technician, 'contacts', 'read')).toBe(true);
    });

    it('should not be able to create estimates', () => {
      const technician: Role = 'technician';

      expect(hasPermission(technician, 'estimates', 'create')).toBe(false);
      expect(hasPermission(technician, 'estimates', 'read')).toBe(false);
    });

    it('should be able to read and update assigned deals', () => {
      const technician: Role = 'technician';

      expect(hasPermission(technician, 'deals', 'read')).toBe(true);
      expect(hasPermission(technician, 'deals', 'update')).toBe(true);
      expect(hasPermission(technician, 'deals', 'delete')).toBe(false);
    });

    it('should be able to create activities', () => {
      const technician: Role = 'technician';

      expect(hasPermission(technician, 'activities', 'create')).toBe(true);
      expect(hasPermission(technician, 'activities', 'read')).toBe(true);
    });
  });

  describe('Manager Permissions', () => {
    it('should be able to CRUD contacts and deals', () => {
      const manager: Role = 'manager';

      expect(hasPermission(manager, 'contacts', 'create')).toBe(true);
      expect(hasPermission(manager, 'contacts', 'read')).toBe(true);
      expect(hasPermission(manager, 'contacts', 'update')).toBe(true);
      expect(hasPermission(manager, 'contacts', 'delete')).toBe(true);

      expect(hasPermission(manager, 'deals', 'create')).toBe(true);
      expect(hasPermission(manager, 'deals', 'read')).toBe(true);
      expect(hasPermission(manager, 'deals', 'update')).toBe(true);
      expect(hasPermission(manager, 'deals', 'delete')).toBe(true);
    });

    it('should be able to CRUD estimates and invoices', () => {
      const manager: Role = 'manager';

      expect(hasPermission(manager, 'estimates', 'create')).toBe(true);
      expect(hasPermission(manager, 'estimates', 'delete')).toBe(true);

      expect(hasPermission(manager, 'invoices', 'create')).toBe(true);
      expect(hasPermission(manager, 'invoices', 'delete')).toBe(true);
    });

    it('should only be able to read reports', () => {
      const manager: Role = 'manager';

      expect(hasPermission(manager, 'reports', 'read')).toBe(true);
      expect(hasPermission(manager, 'reports', 'create')).toBe(false);
      expect(hasPermission(manager, 'reports', 'update')).toBe(false);
      expect(hasPermission(manager, 'reports', 'delete')).toBe(false);
    });

    it('should not have access to settings or team management', () => {
      const manager: Role = 'manager';

      expect(canAccess(manager, 'settings')).toBe(false);
      expect(canAccess(manager, 'team')).toBe(false);
      expect(canAccess(manager, 'automations')).toBe(false);
      expect(canAccess(manager, 'integrations')).toBe(false);
    });
  });

  describe('Role Hierarchy', () => {
    it('should enforce role hierarchy for management', () => {
      const owner: Role = 'owner';
      const admin: Role = 'admin';
      const manager: Role = 'manager';
      const technician: Role = 'technician';
      const viewer: Role = 'viewer';

      expect(canManageRole(owner, admin)).toBe(true);
      expect(canManageRole(owner, manager)).toBe(true);
      expect(canManageRole(owner, technician)).toBe(true);
      expect(canManageRole(owner, viewer)).toBe(true);

      expect(canManageRole(admin, manager)).toBe(true);
      expect(canManageRole(admin, technician)).toBe(true);
      expect(canManageRole(admin, viewer)).toBe(true);
      expect(canManageRole(admin, admin)).toBe(false); // Admin cannot manage other admins

      expect(canManageRole(manager, technician)).toBe(false);
      expect(canManageRole(viewer, admin)).toBe(false);
    });

    it('should identify higher roles correctly', () => {
      expect(isRoleHigherThan('owner', 'admin')).toBe(true);
      expect(isRoleHigherThan('owner', 'manager')).toBe(true);
      expect(isRoleHigherThan('admin', 'manager')).toBe(true);
      expect(isRoleHigherThan('admin', 'technician')).toBe(true);
      expect(isRoleHigherThan('technician', 'viewer')).toBe(true);

      expect(isRoleHigherThan('viewer', 'owner')).toBe(false);
      expect(isRoleHigherThan('manager', 'admin')).toBe(false);
    });
  });

  describe('Utility Functions', () => {
    it('should return correct role labels', () => {
      expect(getRoleLabel('owner')).toBe('Owner');
      expect(getRoleLabel('admin')).toBe('Admin');
      expect(getRoleLabel('manager')).toBe('Manager');
      expect(getRoleLabel('technician')).toBe('Technician');
      expect(getRoleLabel('viewer')).toBe('Viewer');
    });

    it('should return correct role descriptions', () => {
      const ownerDesc = getRoleDescription('owner');
      expect(ownerDesc.toLowerCase()).toContain('full');

      const viewerDesc = getRoleDescription('viewer');
      expect(viewerDesc.toLowerCase()).toContain('read-only');
    });

    it('should return all roles sorted by hierarchy', () => {
      const roles = getAllRoles();

      expect(roles.length).toBe(5);
      expect(roles[0].role).toBe('owner');
      expect(roles[roles.length - 1].role).toBe('viewer');
    });

    it('should return permissions for each role', () => {
      const ownerPerms = getRolePermissions('owner');
      const viewerPerms = getRolePermissions('viewer');

      expect(ownerPerms.length).toBeGreaterThan(viewerPerms.length);

      const ownerContactPerms = ownerPerms.find((p) => p.resource === 'contacts');
      expect(ownerContactPerms?.actions).toContain('create');
      expect(ownerContactPerms?.actions).toContain('delete');
      expect(ownerContactPerms?.actions).toContain('manage');
    });
  });

  describe('Access Control', () => {
    it('should allow canAccess for readable resources', () => {
      const owner: Role = 'owner';
      const viewer: Role = 'viewer';

      expect(canAccess(owner, 'contacts')).toBe(true);
      expect(canAccess(viewer, 'contacts')).toBe(true);

      expect(canAccess(owner, 'settings')).toBe(true);
      expect(canAccess(viewer, 'settings')).toBe(false);
    });
  });

  describe('Complex Permission Scenarios', () => {
    it('should handle manager trying to create estimate', () => {
      const manager: Role = 'manager';

      expect(hasPermission(manager, 'estimates', 'create')).toBe(true);
    });

    it('should block technician from creating estimates', () => {
      const technician: Role = 'technician';

      expect(hasPermission(technician, 'estimates', 'create')).toBe(false);
    });

    it('should allow admin to manage integrations but not create', () => {
      const admin: Role = 'admin';

      expect(hasPermission(admin, 'integrations', 'read')).toBe(true);
      expect(hasPermission(admin, 'integrations', 'update')).toBe(true);
      expect(hasPermission(admin, 'integrations', 'create')).toBe(false);
      expect(hasPermission(admin, 'integrations', 'delete')).toBe(false);
    });

    it('should allow manager to manage automations', () => {
      const manager: Role = 'manager';

      expect(hasPermission(manager, 'automations', 'create')).toBe(false);
    });
  });
});
