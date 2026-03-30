import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { validatePortalToken } from '@/lib/portal-tokens';

/**
 * POST /api/portal/[token]/estimates/[id]/approve
 * Public endpoint - validates token and approves estimate
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

    // Update estimate status to approved
    const { data: updated, error: updateError } = await supabase
      .from('estimates')
      .update({
        status: 'approved',
        responded_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return apiError(updateError.message, 500);
    }

    return apiSuccess(updated, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, 500);
  }
}
