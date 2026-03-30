import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { getResend } from '@/lib/resend';
import { getTrialEmail, renderTrialEmail } from '@/lib/trial-emails';

const sendTrialEmailSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  day: z.number().int().min(0).max(13),
});

type SendTrialEmailInput = z.infer<typeof sendTrialEmailSchema>;

interface TrialEmailResponse {
  sent: boolean;
  day: number;
  subject: string;
  recipient: string;
  timestamp: string;
}

interface TrialEmailHistoryResponse {
  userId: string;
  emailsSent: Array<{
    day: number;
    subject: string;
    sentAt: string;
  }>;
  nextEmailDue: number | null;
}

/**
 * POST /api/email/trial-sequence
 * Send a specific trial email to a user
 * Body: { userId, day }
 *
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Validate request
    const validation = await validateRequest(request, sendTrialEmailSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { userId, day } = validation.data;

    // Check if user has permission to send emails for this user
    // (either sending to themselves or they're an org admin)
    if (userId !== user.userId) {
      // TODO: Check if current user has admin permissions to send emails for org
      return apiError('You do not have permission to send emails for this user', 403);
    }

    // Get the trial email template for this day
    const trialEmail = getTrialEmail(day);
    if (!trialEmail) {
      return apiError(`No trial email template for day ${day}`, 404);
    }

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, name, first_name, org_id, trial_started_at')
      .eq('id', userId)
      .eq('org_id', user.orgId)
      .single();

    if (userError || !userData) {
      return apiError('User not found', 404);
    }

    // Check if this email has already been sent (via activities table)
    const { data: existingActivity } = await supabase
      .from('activities')
      .select('id')
      .eq('user_id', userId)
      .eq('org_id', user.orgId)
      .eq('type', 'email')
      .ilike('description', `%trial_day_${day}%`)
      .single();

    if (existingActivity) {
      return apiError(`Trial email for day ${day} already sent to this user`, 409);
    }

    // Get organization details for branding
    const { data: orgData } = await supabase
      .from('organizations')
      .select('id, name, email, phone')
      .eq('id', user.orgId)
      .single();

    // Render the email with variables
    const firstName = userData.first_name || userData.name?.split(' ')[0] || 'there';
    const renderedEmail = renderTrialEmail(trialEmail, {
      firstName,
      ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${trialEmail.cta.url}`,
      docsUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/docs`,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe/${userId}`,
      supportUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support`,
    });

    // Send email via Resend
    const resend = getResend();
    if (!resend) {
      return apiError('Email service not configured', 500);
    }

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${orgData?.name || 'GrowthOS'} <onboarding@resend.dev>`,
      to: userData.email,
      subject: renderedEmail.subject,
      html: renderedEmail.html,
      headers: {
        'X-Trial-Day': day.toString(),
        'X-User-ID': userId,
      },
    });

    if (emailError || !emailData) {
      console.error('Resend email send failed:', emailError);
      return apiError('Failed to send email', 500);
    }

    // Log this as an activity
    const { error: activityError } = await supabase.from('activities').insert({
      org_id: user.orgId,
      user_id: userId,
      type: 'email',
      description: `Trial sequence email sent: Day ${day}`,
      metadata: {
        trial_day: day,
        resend_id: emailData.id,
        template: `trial_day_${day}`,
        subject: renderedEmail.subject,
      },
    });

    if (activityError) {
      console.warn('Failed to log activity:', activityError);
      // Don't fail the whole request if activity logging fails
    }

    const response: TrialEmailResponse = {
      sent: true,
      day,
      subject: renderedEmail.subject,
      recipient: userData.email,
      timestamp: new Date().toISOString(),
    };

    return apiSuccess(response, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(
      message,
      error instanceof Error && message === 'Not authenticated' ? 401 : 500
    );
  }
}

/**
 * GET /api/email/trial-sequence?userId=xxx
 * Get trial email sending history for a user
 *
 * Returns: which emails have been sent, next email due
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return apiError('userId query parameter is required', 400);
    }

    // Validate user ID format
    if (!z.string().uuid().safeParse(userId).success) {
      return apiError('Invalid userId format', 400);
    }

    // Check if user has permission to view history for this user
    if (userId !== user.userId) {
      // TODO: Check if current user has admin permissions
      return apiError('You do not have permission to view this user\'s email history', 403);
    }

    // Get user trial start date
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, trial_started_at, created_at')
      .eq('id', userId)
      .eq('org_id', user.orgId)
      .single();

    if (userError || !userData) {
      return apiError('User not found', 404);
    }

    const trialStartDate = userData.trial_started_at || userData.created_at;
    if (!trialStartDate) {
      return apiError('User trial start date not found', 404);
    }

    // Get all trial emails that have been sent
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('created_at, description, metadata')
      .eq('user_id', userId)
      .eq('org_id', user.orgId)
      .eq('type', 'email')
      .ilike('description', '%Trial sequence email sent%')
      .order('created_at', { ascending: false });

    if (activitiesError) {
      console.error('Failed to fetch activities:', activitiesError);
      return apiError('Failed to fetch email history', 500);
    }

    // Extract trial days that have been sent
    const sentDays = new Set<number>();
    const emailHistory = (activities || []).map((activity) => {
      const metadata = activity.metadata as Record<string, unknown>;
      const day = metadata?.trial_day as number;
      if (day !== undefined) {
        sentDays.add(day);
      }

      return {
        day: day || 0,
        subject: metadata?.subject as string || activity.description,
        sentAt: new Date(activity.created_at).toISOString(),
      };
    });

    // Calculate next email due
    const now = new Date();
    const trialStart = new Date(trialStartDate);
    const daysSinceStart = Math.floor(
      (now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Trial email schedule: [0, 1, 3, 5, 7, 10, 13]
    const emailSchedule = [0, 1, 3, 5, 7, 10, 13];
    let nextEmailDue: number | null = null;

    for (const scheduledDay of emailSchedule) {
      if (!sentDays.has(scheduledDay) && daysSinceStart >= scheduledDay) {
        nextEmailDue = scheduledDay;
        break;
      }
    }

    const response: TrialEmailHistoryResponse = {
      userId,
      emailsSent: emailHistory,
      nextEmailDue,
    };

    return apiSuccess(response, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(
      message,
      error instanceof Error && message === 'Not authenticated' ? 401 : 500
    );
  }
}
