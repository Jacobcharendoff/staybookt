'use client';

/**
 * PermissionGate Component
 *
 * Conditionally renders content based on the current user's permissions.
 * Shows fallback content if the user doesn't have permission.
 */

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Resource, Action } from '@/lib/rbac';

interface PermissionGateProps {
  /** The resource being accessed (e.g., 'contacts', 'invoices') */
  resource: Resource;
  /** The action being performed (e.g., 'create', 'delete') */
  action: Action;
  /** Content to show if user has permission */
  children: React.ReactNode;
  /** Content to show if user doesn't have permission (optional, default: null) */
  fallback?: React.ReactNode;
  /** CSS class to apply to the wrapper (optional) */
  className?: string;
}

/**
 * Gate component that only renders children if the user has the required permission.
 *
 * @example
 * ```tsx
 * <PermissionGate resource="invoices" action="delete">
 *   <button onClick={handleDelete}>Delete Invoice</button>
 * </PermissionGate>
 * ```
 *
 * @example
 * ```tsx
 * <PermissionGate
 *   resource="settings"
 *   action="update"
 *   fallback={<p>You don't have permission to edit settings.</p>}
 * >
 *   <SettingsForm />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  resource,
  action,
  children,
  fallback = null,
  className,
}: PermissionGateProps): React.ReactNode {
  const { hasPermission, isLoading } = usePermissions();

  // While loading permissions, don't render anything
  if (isLoading) {
    return null;
  }

  // Check if user has permission
  const allowed = hasPermission(resource, action);

  if (!allowed) {
    return fallback;
  }

  // Render children with optional wrapper class
  if (className) {
    return <div className={className}>{children}</div>;
  }

  return children;
}

/**
 * Higher-order component that wraps a component with permission checking.
 *
 * @example
 * ```tsx
 * const ProtectedButton = withPermissionGate(DeleteButton, 'invoices', 'delete');
 * ```
 */
export function withPermissionGate<P extends object>(
  Component: React.ComponentType<P>,
  resource: Resource,
  action: Action,
  fallback?: React.ReactNode
) {
  return function PermissionGateWrapper(props: P) {
    return (
      <PermissionGate resource={resource} action={action} fallback={fallback}>
        <Component {...props} />
      </PermissionGate>
    );
  };
}
