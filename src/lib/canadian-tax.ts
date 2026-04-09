/**
 * Canadian Tax Engine for Staybookt
 * Handles all 13 provinces/territories with correct 2026 tax rates
 * Supports HST, GST+PST, GST+QST, and GST-only systems
 */

export interface TaxRate {
  province: string;
  provinceCode: string;
  gst: number;
  pst: number;
  hst: number;
  qst: number;
  taxType: 'HST' | 'GST+PST' | 'GST+QST' | 'GST';
  effectiveRate: number;
}

export interface TaxBreakdown {
  subtotal: number;
  gst: number;
  pst: number;
  hst: number;
  qst: number;
  total: number;
  taxRate: TaxRate;
  breakdown: { name: string; rate: number; amount: number }[];
}

// All 13 provinces/territories with 2026 rates
const CANADIAN_TAX_RATES: Record<string, TaxRate> = {
  // HST Provinces (5 provinces)
  ON: {
    province: 'Ontario',
    provinceCode: 'ON',
    gst: 0.05,
    pst: 0,
    hst: 0.13,
    qst: 0,
    taxType: 'HST',
    effectiveRate: 0.13,
  },
  NB: {
    province: 'New Brunswick',
    provinceCode: 'NB',
    gst: 0.05,
    pst: 0,
    hst: 0.15,
    qst: 0,
    taxType: 'HST',
    effectiveRate: 0.15,
  },
  NL: {
    province: 'Newfoundland & Labrador',
    provinceCode: 'NL',
    gst: 0.05,
    pst: 0,
    hst: 0.15,
    qst: 0,
    taxType: 'HST',
    effectiveRate: 0.15,
  },
  NS: {
    province: 'Nova Scotia',
    provinceCode: 'NS',
    gst: 0.05,
    pst: 0,
    hst: 0.15,
    qst: 0,
    taxType: 'HST',
    effectiveRate: 0.15,
  },
  PE: {
    province: 'Prince Edward Island',
    provinceCode: 'PE',
    gst: 0.05,
    pst: 0,
    hst: 0.15,
    qst: 0,
    taxType: 'HST',
    effectiveRate: 0.15,
  },

  // GST+PST Provinces (4 provinces)
  BC: {
    province: 'British Columbia',
    provinceCode: 'BC',
    gst: 0.05,
    pst: 0.07,
    hst: 0,
    qst: 0,
    taxType: 'GST+PST',
    effectiveRate: 0.12,
  },
  SK: {
    province: 'Saskatchewan',
    provinceCode: 'SK',
    gst: 0.05,
    pst: 0.06,
    hst: 0,
    qst: 0,
    taxType: 'GST+PST',
    effectiveRate: 0.11,
  },
  MB: {
    province: 'Manitoba',
    provinceCode: 'MB',
    gst: 0.05,
    pst: 0.07,
    hst: 0,
    qst: 0,
    taxType: 'GST+PST',
    effectiveRate: 0.12,
  },

  // GST+QST (Quebec)
  QC: {
    province: 'Quebec',
    provinceCode: 'QC',
    gst: 0.05,
    pst: 0,
    hst: 0,
    qst: 0.09975,
    taxType: 'GST+QST',
    effectiveRate: 0.14975,
  },

  // GST Only (4 territories/provinces)
  AB: {
    province: 'Alberta',
    provinceCode: 'AB',
    gst: 0.05,
    pst: 0,
    hst: 0,
    qst: 0,
    taxType: 'GST',
    effectiveRate: 0.05,
  },
  NT: {
    province: 'Northwest Territories',
    provinceCode: 'NT',
    gst: 0.05,
    pst: 0,
    hst: 0,
    qst: 0,
    taxType: 'GST',
    effectiveRate: 0.05,
  },
  NU: {
    province: 'Nunavut',
    provinceCode: 'NU',
    gst: 0.05,
    pst: 0,
    hst: 0,
    qst: 0,
    taxType: 'GST',
    effectiveRate: 0.05,
  },
  YT: {
    province: 'Yukon',
    provinceCode: 'YT',
    gst: 0.05,
    pst: 0,
    hst: 0,
    qst: 0,
    taxType: 'GST',
    effectiveRate: 0.05,
  },
};

/**
 * Get tax rate for a province by code
 * @param provinceCode Two-letter province code (e.g., 'ON', 'QC', 'BC')
 * @returns TaxRate object or undefined if province not found
 */
export function getTaxRate(provinceCode: string): TaxRate | undefined {
  const code = provinceCode.toUpperCase();
  return CANADIAN_TAX_RATES[code];
}

/**
 * Calculate tax breakdown for a subtotal in a given province
 * @param subtotal The subtotal before tax
 * @param provinceCode Two-letter province code
 * @returns Complete tax breakdown with all components
 */
export function calculateTax(
  subtotal: number,
  provinceCode: string
): TaxBreakdown {
  const taxRate = getTaxRate(provinceCode);

  if (!taxRate) {
    throw new Error(`Unknown province code: ${provinceCode}`);
  }

  // Round to 2 decimal places to avoid floating point issues
  const round = (num: number) => Math.round(num * 100) / 100;

  let gst = 0;
  let pst = 0;
  let hst = 0;
  let qst = 0;

  const breakdown: { name: string; rate: number; amount: number }[] = [];

  if (taxRate.taxType === 'HST') {
    hst = round(subtotal * taxRate.hst);
    breakdown.push({
      name: `HST (${(taxRate.hst * 100).toFixed(0)}%)`,
      rate: taxRate.hst,
      amount: hst,
    });
  } else if (taxRate.taxType === 'GST+PST') {
    gst = round(subtotal * taxRate.gst);
    pst = round(subtotal * taxRate.pst);
    breakdown.push({
      name: `GST (${(taxRate.gst * 100).toFixed(1)}%)`,
      rate: taxRate.gst,
      amount: gst,
    });
    breakdown.push({
      name: `PST (${(taxRate.pst * 100).toFixed(1)}%)`,
      rate: taxRate.pst,
      amount: pst,
    });
  } else if (taxRate.taxType === 'GST+QST') {
    gst = round(subtotal * taxRate.gst);
    qst = round(subtotal * taxRate.qst);
    breakdown.push({
      name: `GST (${(taxRate.gst * 100).toFixed(1)}%)`,
      rate: taxRate.gst,
      amount: gst,
    });
    breakdown.push({
      name: `QST (${(taxRate.qst * 100).toFixed(3)}%)`,
      rate: taxRate.qst,
      amount: qst,
    });
  } else if (taxRate.taxType === 'GST') {
    gst = round(subtotal * taxRate.gst);
    breakdown.push({
      name: `GST (${(taxRate.gst * 100).toFixed(1)}%)`,
      rate: taxRate.gst,
      amount: gst,
    });
  }

  const totalTax = gst + pst + hst + qst;
  const total = round(subtotal + totalTax);

  return {
    subtotal: round(subtotal),
    gst: round(gst),
    pst: round(pst),
    hst: round(hst),
    qst: round(qst),
    total,
    taxRate,
    breakdown,
  };
}

/**
 * Get all provinces with their tax rates
 * Useful for dropdown menus and province selection
 * @returns Array of all TaxRate objects
 */
export function getAllProvinces(): TaxRate[] {
  return Object.values(CANADIAN_TAX_RATES).sort((a, b) =>
    a.province.localeCompare(b.province)
  );
}

/**
 * Format tax breakdown as human-readable lines
 * Returns an array of strings like "HST (13%): $65.00" or "GST (5%): $25.00"
 * @param breakdown TaxBreakdown object from calculateTax
 * @returns Array of formatted tax line strings
 */
export function formatTaxLine(breakdown: TaxBreakdown): string[] {
  return breakdown.breakdown.map(
    (line) =>
      `${line.name}: $${line.amount.toLocaleString('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
  );
}

/**
 * Format currency for Canadian display
 * @param amount Number to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculate total tax amount without full breakdown
 * Convenience function when you just need the tax total
 * @param subtotal The subtotal before tax
 * @param provinceCode Two-letter province code
 * @returns Total tax amount
 */
export function calculateTotalTax(
  subtotal: number,
  provinceCode: string
): number {
  const breakdown = calculateTax(subtotal, provinceCode);
  return breakdown.gst + breakdown.pst + breakdown.hst + breakdown.qst;
}

/**
 * Calculate final total with tax
 * @param subtotal The subtotal before tax
 * @param provinceCode Two-letter province code
 * @returns Subtotal + tax
 */
export function calculateTotal(
  subtotal: number,
  provinceCode: string
): number {
  const breakdown = calculateTax(subtotal, provinceCode);
  return breakdown.total;
}

/**
 * Validate if a province code is valid
 * @param provinceCode Two-letter code to validate
 * @returns true if valid, false otherwise
 */
export function isValidProvinceCode(provinceCode: string): boolean {
  return getTaxRate(provinceCode) !== undefined;
}

/**
 * Get province name from code
 * @param provinceCode Two-letter province code
 * @returns Full province name or undefined
 */
export function getProvinceName(provinceCode: string): string | undefined {
  return getTaxRate(provinceCode)?.province;
}
