'use client';

import { TaxBreakdown, formatCurrency } from '@/lib/canadian-tax';
import { useTheme } from '@/components/ThemeProvider';

interface TaxBreakdownProps {
  breakdown: TaxBreakdown;
  showSubtotal?: boolean;
  className?: string;
  compact?: boolean;
}

/**
 * Reusable component for displaying tax breakdown
 * Can be used in estimates, invoices, or any other tax display
 */
export function TaxBreakdownComponent({
  breakdown,
  showSubtotal = true,
  className = '',
  compact = false,
}: TaxBreakdownProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (compact) {
    return (
      <div className={className}>
        {showSubtotal && (
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(breakdown.subtotal)}</span>
          </div>
        )}

        {breakdown.breakdown.map((line) => (
          <div key={line.name} className="flex justify-between text-sm text-slate-600 mb-2">
            <span>{line.name}</span>
            <span className="font-medium">{formatCurrency(line.amount)}</span>
          </div>
        ))}

        <div className="flex justify-between text-base font-bold text-slate-900 mt-3 pt-3 border-t border-slate-200">
          <span>Total</span>
          <span>{formatCurrency(breakdown.total)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-lg p-6 border ${isDark ? 'border-slate-700' : 'border-slate-200'} ${className}`}>
      <h3 className={`text-sm font-semibold uppercase mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        Tax Breakdown ({breakdown.taxRate.province})
      </h3>

      <div className="space-y-3">
        {showSubtotal && (
          <div className="flex justify-between text-sm">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Subtotal</span>
            <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
              {formatCurrency(breakdown.subtotal)}
            </span>
          </div>
        )}

        {breakdown.breakdown.map((line) => (
          <div key={line.name} className="flex justify-between text-sm">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{line.name}</span>
            <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
              {formatCurrency(line.amount)}
            </span>
          </div>
        ))}

        <div className={`flex justify-between text-lg font-bold pt-3 border-t ${isDark ? 'border-slate-700 text-white' : 'border-slate-200 text-slate-900'}`}>
          <span>Total</span>
          <span>{formatCurrency(breakdown.total)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal inline tax display (e.g., for lists)
 */
export function TaxBreakdownInline({
  breakdown,
}: {
  breakdown: TaxBreakdown;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      <div className="flex justify-between mb-1">
        <span>Subtotal:</span>
        <span className="font-medium">{formatCurrency(breakdown.subtotal)}</span>
      </div>
      {breakdown.breakdown.map((line) => (
        <div key={line.name} className="flex justify-between mb-1">
          <span>{line.name}:</span>
          <span className="font-medium">{formatCurrency(line.amount)}</span>
        </div>
      ))}
      <div className={`flex justify-between font-bold mt-2 pt-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <span>Total:</span>
        <span>{formatCurrency(breakdown.total)}</span>
      </div>
    </div>
  );
}
