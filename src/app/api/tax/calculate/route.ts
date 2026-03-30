import { NextRequest } from 'next/server';
import { z } from 'zod';
import { calculateTax, isValidProvinceCode } from '@/lib/canadian-tax';
import { apiError, apiSuccess, validateRequest } from '@/lib/api-helpers';

const calculateTaxSchema = z.object({
  subtotal: z.number().min(0),
  provinceCode: z.string().min(2).max(2).toUpperCase(),
});

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequest(request, calculateTaxSchema);

    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { subtotal, provinceCode } = validation.data;

    // Validate province code
    if (!isValidProvinceCode(provinceCode)) {
      return apiError(
        `Invalid province code: ${provinceCode}. Must be one of: ON, QC, BC, AB, SK, MB, NB, NS, NL, PE, NT, NU, YT`,
        400
      );
    }

    const breakdown = calculateTax(subtotal, provinceCode);

    return apiSuccess(breakdown, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, 500);
  }
}
