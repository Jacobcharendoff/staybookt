'use client';

import { useMemo } from 'react';
import {
  calculateTax,
  getTaxRate,
  getAllProvinces,
  formatTaxLine,
  formatCurrency,
  calculateTotalTax,
  calculateTotal,
  TaxRate,
  TaxBreakdown,
} from '@/lib/canadian-tax';

interface UseTaxReturn {
  /**
   * Calculate tax breakdown for a given subtotal
   */
  calculateTax: (subtotal: number) => TaxBreakdown;

  /**
   * Get tax rate information for the province
   */
  taxRate: TaxRate | undefined;

  /**
   * Get all available provinces
   */
  provinces: TaxRate[];

  /**
   * Format tax lines for display
   */
  formatTaxLine: (breakdown: TaxBreakdown) => string[];

  /**
   * Format currency
   */
  formatCurrency: (amount: number) => string;

  /**
   * Calculate just the tax amount
   */
  calculateTotalTax: (subtotal: number) => number;

  /**
   * Calculate subtotal + tax
   */
  calculateTotal: (subtotal: number) => number;

  /**
   * Province code (if provided)
   */
  provinceCode: string;
}

/**
 * React hook for Canadian tax calculations
 * Uses the tax calculation library directly (no API calls for pure math operations)
 * @param provinceCode Two-letter province code (e.g., 'ON', 'QC', 'BC')
 * @returns Object with tax calculation functions and data
 */
export function useTax(provinceCode: string): UseTaxReturn {
  const taxRate = useMemo(() => getTaxRate(provinceCode), [provinceCode]);

  const provinces = useMemo(() => getAllProvinces(), []);

  const calculateTaxBreakdown = useMemo(
    () => (subtotal: number) => calculateTax(subtotal, provinceCode),
    [provinceCode]
  );

  const formatTaxLines = useMemo(
    () => (breakdown: TaxBreakdown) => formatTaxLine(breakdown),
    []
  );

  const calculateTaxAmount = useMemo(
    () => (subtotal: number) => calculateTotalTax(subtotal, provinceCode),
    [provinceCode]
  );

  const calculateFinalTotal = useMemo(
    () => (subtotal: number) => calculateTotal(subtotal, provinceCode),
    [provinceCode]
  );

  return {
    calculateTax: calculateTaxBreakdown,
    taxRate,
    provinces,
    formatTaxLine: formatTaxLines,
    formatCurrency,
    calculateTotalTax: calculateTaxAmount,
    calculateTotal: calculateFinalTotal,
    provinceCode,
  };
}
