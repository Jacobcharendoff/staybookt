import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { getResend } from '@/lib/resend';
import { getTrialEmail, renderTrialEmail } from '@/lib/trial-emails';

interface SendDueResult {
  success: boolean;
  emailsSent: number;
  errors: Array<{
    userId: string;
    day: number;
    error: string;
  }>;
  details: Array<{
    userId: string;
    day: number;
    email: string;
    sent: boolean;
  }>;
}

/**
 * POST /api/email/trial-sequence/send-due
 * Batch send trial emails to all users whose next email is due
 *
 * This should be called by a cron job (e.g., Vercel Cron)
 * Authorization: X-Cron-Secret header
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const cronSecret = request.headers.get('X-Cron-Secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      return apiError('Unauthorized', 401);
    }

    const supabase = await createServerComponentClient();

    // Trial email schedule: [0, 1, 3, 5, 7, 10, 13]
    const emailSchedule = [0, 1, 3, 5, 7, 10, 13];

    // Get all users with active trials
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, name, org_id, trial_started_at, created_at')
      .eq('is_trial', true)
      .not('trial_started_at', 'is', null)
      .gt('trial_ends_at', 'now()');

    if (usersError) {
      console.error('Failed to fetch trial users:', usersError);
      return apiError('Failed to fetch users', 500);
    }

    if (!users || users.length === 0) {
      return apiSuccess({ emailsSent: 0, errors: [] }, 200);
    }

    const result: SendDueResult = {
      success: true,
      emailsSent: 0,
      errors: [],
      details: [],
    };

    const resend = getResend();
    if (!resend) {
      return apiError('Email service not configured', 500);
    }

    // Process each user
    for (const user of users) {
      const trialStart = new Date(user.trial_started_at || user.created_at);
      const now = new Date();
      const daysSinceStart = Math.floor(
        (now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Get already-sent emails for this user
      const { data: sentActivities, error: activitiesError } = await supabase
        .from('activities')
        .select('metadata')
        .eq('user_id', user.id)
        .eq('org_id', user.org_id)
        .eq('type', 'email')
        .ilike('description', '%Trial sequence email sent%');

      if (activitiesError) {
        console.warn(`Failed to fetch activities for user ${user.id}:`, activitiesError);
        continue;
      }

      const sentDays = new Set<number>();
      (sentActivities || []).forEach((activity) => {
        const metadata = activity.metadata as Record<string, unknown>;
        const day = metadata?.trial_day as number;
        if (day !== undefined) {
          sentDays.add(day);
        }
      });

      // Find next email to send
      for (const scheduledDay of emailSchedule) {
        if (sentDays.has(scheduledDay)) {
          continue; // Already sent
        }

        if (daysSinceStart < scheduledDay) {
          continue; // Not yet due
        }

        // This email is due! Send it
        try {
          const trialEmail = getTrialEmail(scheduledDay);
          if (!trialEmail) {
            result.errors.push({
              userId: user.id,
              day: scheduledDay,
              error: 'No email template found',
            });
            result.details.push({
              userId: user.id,
              day: scheduledDay,
              email: user.email,
              sent: false,
            });
            continue;
          }

          // Get organization details
          const { data: orgData } = await supabase
            .from('organizations')
            .select('id, name, email, phone')
            .eq('id', user.org_id)
            .single();

          // Render email
          const firstName = user.first_name || user.name?.split(' ')[0] || 'there';
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const renderedEmail = renderTrialEmail(trialEmail, {
            firstName,
            ctaUrl: `${appUrl}${trialEmail.cta.url}`,
            docsUrl: `${appUrl}/docs`,
            unsubscribeUrl: `${appUrl}/unsubscribe/${user.id}`,
            supportUrl: `${appUrl}/support`,
          });

          // Send via Resend
          const { data: emailData, error: emailError } = await resend.emails.send({
            from: `${orgData?.name || 'Staybookt'} <onboarding@resend.dev>`,
            to: user.email,
            subject: renderedEmail.subject,
            html: renderedEmail.html,
            headers: {
              'X-Trial-Day': scheduledDay.toString(),
              'X-User-ID': user.id,
            },
          });

          if (emailError || !emailData) {
            throw new Error('Failed to send email via Resend');
          }

          // Log as activity
          const { error: activityError } = await supabase.from('activities').insert({
            org_id: user.org_id,
            user_id: user.id,
            type: 'email',
            description: `Trial sequence email sent: Day ${scheduledDay}`,
            metadata: {
              trial_day: scheduledDay,
              resend_id: emailData.id,
              template: `trial_day_${scheduledDay}`,
              subject: renderedEmail.subject,
              sent_via_batch: true,
            },
          });

          if (activityError) {
            console.warn(`Failed to log activity for user ${user.id}:`, activityError);
          }

          result.emailsSent++;
          result.details.push({
            userId: user.id,
            day: scheduledDay,
            email: user.email,
            sent: true,
          });

          // Only send one email per user per batch run
          break;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          result.errors.push({
            userId: user.id,
            day: scheduledDay,
            error: message,
          });
          result.details.push({
            userId: user.id,
            day: scheduledDay,
            email: user.email,
            sent: false,
          });
        }
      }
    }

    return apiSuccess(result, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in trial-sequence send-due:', error);
    return apiError(message, 500);
  }
}

/**
 * GET /api/email/trial-sequence/send-due
 * Health check for the cron job
 */
export async function GET() {
  return apiSuccess(
    {
      status: 'ok',
      description: 'Trial sequence batch sender endpoint. Use POST with X-Cron-Secret header.',
      schedule: 'Should be called via cron job (e.g., daily via Vercel Cron)',
      emailDays: [0, 1, 3, 5, 7, 10, 13],
    },
    200
  );
}
