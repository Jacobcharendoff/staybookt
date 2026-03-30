import { describe, it, expect } from 'vitest';
import {
  calculateTax,
  getTaxRate,
  getAllProvinces,
  formatTaxLine,
  calculateTotalTax,
  calculateTotal,
  isValidProvinceCode,
  getProvinceName,
} from '@/lib/canadian-tax';

describe('Canadian Tax Engine', () => {
  describe('HST Provinces', () => {
    it('should calculate Ontario 13% HST correctly', () => {
      const result = calculateTax(100, 'ON');
      expect(result.hst).toBe(13);
      expect(result.total).toBe(113);
      expect(result.taxRate.effectiveRate).toBe(0.13);
      expect(result.breakdown.length).toBe(1);
      expect(result.breakdown[0].name).toContain('13%');
    });

    it('should calculate New Brunswick 15% HST correctly', () => {
      const result = calculateTax(100, 'NB');
      expect(result.hst).toBe(15);
      expect(result.total).toBe(115);
      expect(result.taxRate.effectiveRate).toBe(0.15);
    });

    it('should calculate Newfoundland & Labrador 15% HST correctly', () => {
      const result = calculateTax(100, 'NL');
      expect(result.hst).toBe(15);
      expect(result.total).toBe(115);
    });

    it('should calculate Nova Scotia 15% HST correctly', () => {
      const result = calculateTax(100, 'NS');
      expect(result.hst).toBe(15);
      expect(result.total).toBe(115);
    });

    it('should calculate Prince Edward Island 15% HST correctly', () => {
      const result = calculateTax(100, 'PE');
      expect(result.hst).toBe(15);
      expect(result.total).toBe(115);
    });
  });

  describe('GST+PST Provinces', () => {
    it('should calculate British Columbia 12% (5% GST + 7% PST) correctly', () => {
      const result = calculateTax(100, 'BC');
      expect(result.gst).toBe(5);
      expect(result.pst).toBe(7);
      expect(result.total).toBe(112);
      expect(result.taxRate.effectiveRate).toBe(0.12);
      expect(result.breakdown.length).toBe(2);
    });

    it('should calculate Saskatchewan 11% (5% GST + 6% PST) correctly', () => {
      const result = calculateTax(100, 'SK');
      expect(result.gst).toBe(5);
      expect(result.pst).toBe(6);
      expect(result.total).toBe(111);
      expect(result.taxRate.effectiveRate).toBe(0.11);
    });

    it('should calculate Manitoba 12% (5% GST + 7% PST) correctly', () => {
      const result = calculateTax(100, 'MB');
      expect(result.gst).toBe(5);
      expect(result.pst).toBe(7);
      expect(result.total).toBe(112);
    });
  });

  describe('GST+QST (Quebec)', () => {
    it('should calculate Quebec 14.975% (5% GST + 9.975% QST) correctly', () => {
      const result = calculateTax(100, 'QC');
      expect(result.gst).toBe(5);
      expect(result.qst).toBe(9.98); // Rounded to 2 decimals
      expect(result.total).toBe(114.98);
      expect(result.taxRate.effectiveRate).toBe(0.14975);
      expect(result.breakdown.length).toBe(2);
    });
  });

  describe('GST-Only Provinces/Territories', () => {
    it('should calculate Alberta 5% GST only', () => {
      const result = calculateTax(100, 'AB');
      expect(result.gst).toBe(5);
      expect(result.total).toBe(105);
      expect(result.taxRate.effectiveRate).toBe(0.05);
    });

    it('should calculate Northwest Territories 5% GST only', () => {
      const result = calculateTax(100, 'NT');
      expect(result.gst).toBe(5);
      expect(result.total).toBe(105);
    });

    it('should calculate Nunavut 5% GST only', () => {
      const result = calculateTax(100, 'NU');
      expect(result.gst).toBe(5);
      expect(result.total).toBe(105);
    });

    it('should calculate Yukon 5% GST only', () => {
      const result = calculateTax(100, 'YT');
      expect(result.gst).toBe(5);
      expect(result.total).toBe(105);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero subtotal', () => {
      const result = calculateTax(0, 'ON');
      expect(result.subtotal).toBe(0);
      expect(result.hst).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should throw error for unknown province code', () => {
      expect(() => calculateTax(100, 'XX')).toThrow('Unknown province code: XX');
    });

    it('should handle decimal amounts with proper rounding', () => {
      const result = calculateTax(19.99, 'ON');
      expect(result.hst).toBe(2.60); // 19.99 * 0.13 = 2.5987, rounded to 2.60
      expect(result.total).toBe(22.59); // 19.99 + 2.60
    });

    it('should handle large amounts', () => {
      const result = calculateTax(100000, 'ON');
      expect(result.hst).toBe(13000);
      expect(result.total).toBe(113000);
    });

    it('should handle case-insensitive province codes', () => {
      const resultLower = calculateTax(100, 'on');
      const resultUpper = calculateTax(100, 'ON');
      expect(resultLower.total).toBe(resultUpper.total);
    });
  });

  describe('Utility Functions', () => {
    it('getTaxRate should return correct tax rate for province', () => {
      const rate = getTaxRate('ON');
      expect(rate).toBeDefined();
      expect(rate?.province).toBe('Ontario');
      expect(rate?.effectiveRate).toBe(0.13);
    });

    it('getTaxRate should return undefined for unknown province', () => {
      const rate = getTaxRate('XX');
      expect(rate).toBeUndefined();
    });

    it('getAllProvinces should return all 13 provinces sorted by name', () => {
      const provinces = getAllProvinces();
      expect(provinces.length).toBe(13);
      // Verify sorted by name
      expect(provinces[0].province).toBe('Alberta');
      expect(provinces[provinces.length - 1].province).toBe('Yukon');
    });

    it('formatTaxLine should format tax breakdown as readable strings', () => {
      const result = calculateTax(100, 'BC');
      const lines = formatTaxLine(result);
      expect(lines.length).toBe(2);
      expect(lines[0]).toContain('GST');
      expect(lines[0]).toContain('$5.00');
      expect(lines[1]).toContain('PST');
      expect(lines[1]).toContain('$7.00');
    });

    it('calculateTotalTax should return only tax amount', () => {
      const tax = calculateTotalTax(100, 'ON');
      expect(tax).toBe(13);
    });

    it('calculateTotal should return subtotal + tax', () => {
      const total = calculateTotal(100, 'ON');
      expect(total).toBe(113);
    });

    it('isValidProvinceCode should validate province codes', () => {
      expect(isValidProvinceCode('ON')).toBe(true);
      expect(isValidProvinceCode('QC')).toBe(true);
      expect(isValidProvinceCode('XX')).toBe(false);
    });

    it('getProvinceName should return province name', () => {
      expect(getProvinceName('ON')).toBe('Ontario');
      expect(getProvinceName('BC')).toBe('British Columbia');
      expect(getProvinceName('XX')).toBeUndefined();
    });
  });
});
