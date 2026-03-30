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

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['owner', 'admin', 'manager', 'technician', 'viewer'] as const),
});

type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;

/**
 * GET /api/team
 * List all team members in the organization.
 * Requires: read permission on 'team' resource
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Check permission
    if (!hasPermission(user.role as Role, 'team', 'read')) {
      return apiError('You do not have permission to view team members', 403);
    }

    // Get all active users in the organization
    const { data: teamMembers, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar, is_active, created_at, updated_at')
      .eq('org_id', user.orgId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess(teamMembers || [], 200, {
      total: teamMembers?.length || 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(
      message,
      error instanceof Error && message === 'Not authenticated' ? 401 : 500
    );
  }
}

/**
 * POST /api/team
 * Invite a new team member to the organization.
 * Requires: create permission on 'team' resource AND ability to manage the target role
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Check permission to create team members
    if (!hasPermission(user.role as Role, 'team', 'create')) {
      return apiError('You do not have permission to invite team members', 403);
    }

    // Validate request
    const validation = await validateRequest(request, inviteTeamMemberSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { email, name, role } = validation.data;

    // Check if current user can manage the target role
    if (!canManageRole(user.role as Role, role)) {
      return apiError(
        `You do not have permission to assign the ${role} role`,
        403
      );
    }

    // Check if user with this email already exists in the org
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('org_id', user.orgId)
      .eq('email', email)
      .single();

    if (existingUser) {
      return apiError('A user with this email already exists in your organization', 409);
    }

    // Create new user with the specified role
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        org_id: user.orgId,
        email,
        name,
        role,
        is_active: true,
      })
      .select('id, email, name, role, avatar, is_active, created_at, updated_at')
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    // TODO: Send invite email via Resend with sign-up link
    // const emailSent = await sendTeamInviteEmail({
    //   to: email,
    //   name,
    //   orgName: org.name,
    //   invitedBy: user.email,
    //   signupUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${newUser.id}`,
    // });

    return apiSuccess(newUser, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(
      message,
      error instanceof Error && message === 'Not authenticated' ? 401 : 500
    );
  }
}
