import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { validatePortalToken } from '@/lib/portal-tokens';
import { z } from 'zod';

const requestChangesSchema = z.object({
  message: z.string().min(1).max(1000),
});

/**
 * POST /api/portal/[token]/estimates/[id]/request-changes
 * Public endpoint - validates token and records change request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; id: string }> }
) {
  try {
    const { token, id } = await params;

    if (!token || token.length !== 32) {
      return apiError('Invalid token format', 400);
    }

    if (!id) {
      return apiError('Estimate ID is required', 400);
    }

    const body = await request.json();
    const validation = requestChangesSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Invalid request: message is required', 400);
    }

    const supabase = await createServerComponentClient();

    // Get the estimate first
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select('*, contacts(id, org_id)')
      .eq('id', id)
      .single();

    if (estimateError || !estimate) {
      return apiError('Estimate not found', 404);
    }

    // Validate token
    const contact = estimate.contacts;
    if (!validatePortalToken(token, contact.id, contact.org_id)) {
      return apiError('Invalid token', 401);
    }

    // Update estimate status to reflect changes requested
    const { data: updated, error: updateError } = await supabase
      .from('estimates')
      .update({
        status: 'viewed',
        responded_at: new Date().toISOString(),
        notes: `${estimate.notes || ''}\n\n[Customer Request]: ${validation.data.message}`,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return apiError(updateError.message, 500);
    }

    return apiSuccess(
      {
        estimate: updated,
        message: 'Change request recorded. The business will contact you soon.',
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, 500);
  }
}
