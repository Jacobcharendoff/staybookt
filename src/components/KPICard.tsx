'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  suffix?: string;
}

export function KPICard({
  label,
  value,
  trend,
  icon,
  suffix = '',
}: KPICardProps) {
  const isPositive = trend ? trend >= 0 : false;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900">
            {value}
            {suffix && <span className="text-lg text-slate-500">{suffix}</span>}
          </h3>
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {Math.abs(trend)}% from last month
          </span>
        </div>
      )}
    </div>
  );
}
