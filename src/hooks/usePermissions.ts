'use client';

/**
 * usePermissions Hook
 *
 * Provides permission checking utilities for the current user.
 * Fetches the current user's role from the Supabase database.
 */

import { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import {
  Role,
  Resource,
  Action,
  hasPermission,
  canAccess,
  getRoleLabel,
} from '@/lib/rbac';

interface UsePermissionsReturn {
  role: Role | null;
  isLoading: boolean;
  hasPermission: (resource: Resource, action: Action) => boolean;
  canAccess: (resource: Resource) => boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isTechnician: boolean;
  isViewer: boolean;
  roleLabel: string;
}

/**
 * Hook that provides permission checking for the current user.
 *
 * Fetches the user's role from the Supabase 'users' table.
 * The role is cached locally and updated on mount.
 */
export function usePermissions(): UsePermissionsReturn {
  const supabase = getSupabase();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchUserRole() {
      try {
        // Get current authenticated user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) {
            setRole(null);
            setIsLoading(false);
          }
          return;
        }

        // Get user's role from users table
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (mounted && userData) {
          const userRole = userData.role as Role;
          // Validate that it's a valid role
          if (['owner', 'admin', 'manager', 'technician', 'viewer'].includes(userRole)) {
            setRole(userRole);
          } else {
            setRole('viewer');
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        if (mounted) {
          setRole('viewer');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUserRole();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return useMemo(
    () => ({
      role,
      isLoading,
      hasPermission: (resource: Resource, action: Action) =>
        role ? hasPermission(role, resource, action) : false,
      canAccess: (resource: Resource) =>
        role ? canAccess(role, resource) : false,
      isOwner: role === 'owner',
      isAdmin: role === 'admin' || role === 'owner',
      isManager: role === 'manager' || role === 'admin' || role === 'owner',
      isTechnician: role === 'technician' || role === 'manager' || role === 'admin' || role === 'owner',
      isViewer: role !== null, // Everyone is at least a viewer
      roleLabel: role ? getRoleLabel(role) : 'Guest',
    }),
    [role, isLoading]
  );
}
