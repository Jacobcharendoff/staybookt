import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { validatePortalToken } from '@/lib/portal-tokens';

/**
 * GET /api/portal/[token]
 * Public endpoint - no auth required
 * Validates token and returns customer data + their estimates and invoices
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token || token.length !== 32) {
      return apiError('Invalid token format', 400);
    }

    const supabase = await createServerComponentClient();

    // Find contact by fetching all contacts and validating token
    // Note: In production, you'd want to store the org_id with the token
    // For now, we'll search contacts to find matching token
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('id, name, email, phone, address, org_id');

    if (contactsError || !contacts || contacts.length === 0) {
      return apiError('Contact not found', 404);
    }

    // Find the contact that matches this token
    let validContact = null;
    for (const contact of contacts) {
      if (validatePortalToken(token, contact.id, contact.org_id)) {
        validContact = contact;
        break;
      }
    }

    if (!validContact) {
      return apiError('Invalid token', 401);
    }

    // Get customer's estimates
    const { data: estimates, error: estimatesError } = await supabase
      .from('estimates')
      .select('*')
      .eq('contact_id', validContact.id)
      .order('created_at', { ascending: false });

    if (estimatesError) {
      return apiError(estimatesError.message, 500);
    }

    // Get customer's invoices
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('contact_id', validContact.id)
      .order('created_at', { ascending: false });

    if (invoicesError) {
      return apiError(invoicesError.message, 500);
    }

    return apiSuccess(
      {
        contact: {
          id: validContact.id,
          name: validContact.name,
          email: validContact.email,
          phone: validContact.phone,
          address: validContact.address,
        },
        estimates: estimates || [],
        invoices: invoices || [],
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, 500);
  }
}
