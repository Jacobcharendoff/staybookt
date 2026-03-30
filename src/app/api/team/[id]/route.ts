import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { hasPermission, canManageRole, Role } from '@/lib/rbac';

const updateTeamMemberSchema = z.object({
  role: z.enum(['owner', 'admin', 'manager', 'technician', 'viewer'] as const),
});

type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;

/**
 * PATCH /api/team/[id]
 * Update a team member's role.
 * Requires: update permission on 'team' resource AND ability to manage the target role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);
    const { id: targetUserId } = await params;

    // Check permission
    if (!hasPermission(user.role as Role, 'team', 'update')) {
      return apiError('You do not have permission to update team members', 403);
    }

    // Prevent self-modification
    if (targetUserId === user.userId) {
      return apiError('You cannot change your own role', 400);
    }

    // Validate request
    const validation = await validateRequest(request, updateTeamMemberSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { role } = validation.data;

    // Check if current user can manage the target role
    if (!canManageRole(user.role as Role, role)) {
      return apiError(
        `You do not have permission to assign the ${role} role`,
        403
      );
    }

    // Get the target user to ensure they're in our org
    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('id, org_id, role')
      .eq('id', targetUserId)
      .single();

    if (fetchError || !targetUser) {
      return apiError('Team member not found', 404);
    }

    if (targetUser.org_id !== user.orgId) {
      return apiError('You do not have permission to update this team member', 403);
    }

    // Update the user's role
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ role })
      .eq('id', targetUserId)
      .select('id, email, name, role, avatar, is_active, created_at, updated_at')
      .single();

    if (updateError) {
      return apiError(updateError.message, 500);
    }

    return apiSuccess(updatedUser, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(
      message,
      error instanceof Error && message === 'Not authenticated' ? 401 : 500
    );
  }
}

/**
 * DELETE /api/team/[id]
 * Remove a team member from the organization.
 * Requires: delete permission on 'team' resource AND ability to manage the target role
 * Note: Only owner can delete team members (per RBAC rules)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);
    const { id: targetUserId } = await params;

    // Check permission
    if (!hasPermission(user.role as Role, 'team', 'delete')) {
      return apiError('You do not have permission to remove team members', 403);
    }

    // Prevent self-deletion
    if (targetUserId === user.userId) {
      return apiError('You cannot remove yourself from the team', 400);
    }

    // Get the target user to ensure they're in our org
    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('id, org_id, role')
      .eq('id', targetUserId)
      .single();

    if (fetchError || !targetUser) {
      return apiError('Team member not found', 404);
    }

    if (targetUser.org_id !== user.orgId) {
      return apiError('You do not have permission to remove this team member', 403);
    }

    // Check if current user can manage the target role
    if (!canManageRole(user.role as Role, targetUser.role as Role)) {
      return apiError(
        `You do not have permission to remove a ${targetUser.role}`,
        403
      );
    }

    // Soft delete by marking as inactive (to preserve data integrity)
    const { error: deleteError } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', targetUserId);

    if (deleteError) {
      return apiError(deleteError.message, 500);
    }

    return apiSuccess({ id: targetUserId, message: 'Team member removed' }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(
      message,
      error instanceof Error && message === 'Not authenticated' ? 401 : 500
    );
  }
}
