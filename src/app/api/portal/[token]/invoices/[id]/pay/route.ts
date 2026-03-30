import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { validatePortalToken } from '@/lib/portal-tokens';
import { z } from 'zod';

const paymentSchema = z.object({
  amount: z.number().min(0.01),
  paymentMethod: z.enum(['stripe', 'bank_transfer']),
});

/**
 * POST /api/portal/[token]/invoices/[id]/pay
 * Public endpoint - validates token and initiates payment
 * For now, just records intent; Stripe integration would happen here
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
      return apiError('Invoice ID is required', 400);
    }

    const body = await request.json();
    const validation = paymentSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Invalid request: amount and paymentMethod required', 400);
    }

    const supabase = await createServerComponentClient();

    // Get the invoice first
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, contacts(id, org_id)')
      .eq('id', id)
      .single();

    if (invoiceError || !invoice) {
      return apiError('Invoice not found', 404);
    }

    // Validate token
    const contact = invoice.contacts;
    if (!validatePortalToken(token, contact.id, contact.org_id)) {
      return apiError('Invalid token', 401);
    }

    // Verify amount doesn't exceed balance
    const balanceDue = invoice.total - invoice.amount_paid;
    if (validation.data.amount > balanceDue) {
      return apiError('Payment amount exceeds balance due', 400);
    }

    // In production, would integrate with Stripe here
    // For now, return payment intent info
    if (validation.data.paymentMethod === 'stripe') {
      // TODO: Create Stripe payment intent
      // const stripe = getStripeInstance();
      // const paymentIntent = await stripe.paymentIntents.create({...});
      return apiSuccess(
        {
          paymentMethod: 'stripe',
          status: 'pending',
          message: 'Stripe integration coming soon. Please contact the business for payment.',
          invoice: {
            id: invoice.id,
            number: invoice.number,
            amountDue: balanceDue,
            requestedAmount: validation.data.amount,
          },
        },
        200
      );
    }

    // Bank transfer
    return apiSuccess(
      {
        paymentMethod: 'bank_transfer',
        status: 'pending',
        message: 'Bank transfer details will be provided by the business.',
        invoice: {
          id: invoice.id,
          number: invoice.number,
          amountDue: balanceDue,
          requestedAmount: validation.data.amount,
        },
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, 500);
  }
}
