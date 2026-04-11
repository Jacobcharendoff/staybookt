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
import { getResend } from '@/lib/resend';

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

    // Send invite email via Resend with sign-up link
    const resend = getResend();
    if (resend) {
      try {
        // Get organization details for email context
        const { data: orgData } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', user.orgId)
          .single();

        const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${newUser.id}`;
        const orgName = orgData?.name || 'Staybookt';

        await resend.emails.send({
          from: `${orgName} <onboarding@resend.dev>`,
          to: email,
          subject: `You've been invited to join ${orgName}`,
          html: `
            <html>
              <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
                <h2>Welcome to ${orgName}!</h2>
                <p>Hi ${name},</p>
                <p>${user.email} has invited you to join their team on Staybookt.</p>
                <p>
                  <a href="${signupUrl}" style="background-color:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Accept Invitation</a>
                </p>
                <p>Or copy this link: ${signupUrl}</p>
                <p>Best regards,<br>The Staybookt Team</p>
              </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.warn('Failed to send team invite email:', emailError);
        // Don't fail the invite creation if email sending fails
      }
    } else {
      console.warn('Resend API key not configured, skipping invite email');
    }

    return apiSuccess(newUser, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(
      message,
      error instanceof Error && message === 'Not authenticated' ? 401 : 500
    );
  }
}
