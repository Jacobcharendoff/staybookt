import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { apiError, apiSuccess, getCurrentUser } from '@/lib/api-helpers';
import { generatePortalUrl } from '@/lib/portal-tokens';
import { z } from 'zod';

const generateTokenSchema = z.object({
  contactId: z.string().min(1),
});

/**
 * POST /api/portal/generate
 * Protected endpoint - requires auth
 * Generates a portal link for a customer
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const body = await request.json();
    const validation = generateTokenSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Invalid request: contactId is required', 400);
    }

    const { contactId } = validation.data;

    // Verify the contact belongs to this organization
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('id, name, email, org_id')
      .eq('id', contactId)
      .eq('org_id', user.orgId)
      .single();

    if (contactError || !contact) {
      return apiError('Contact not found', 404);
    }

    // Generate portal URL
    const portalUrl = generatePortalUrl(contactId, user.orgId);

    return apiSuccess(
      {
        url: portalUrl,
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
        },
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(
      message,
      message === 'Not authenticated' ? 401 : 500
    );
  }
}
