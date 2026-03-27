'use client';

import { getLeadSourceRing, LeadSource } from '@/types';

const SOURCE_LABELS: Record<LeadSource, string> = {
  existing_customer: 'Existing Customer',
  reactivation: 'Reactivation',
  cross_sell: 'Cross-Sell',
  referral: 'Referral',
  review: 'Review',
  neighborhood: 'Neighborhood',
  google_lsa: 'Google LSA',
  seo: 'SEO',
  gbp: 'Google Business',
};

const RING_COLORS = {
  ring_1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ring_2: 'bg-amber-100 text-amber-700 border-amber-200',
  ring_3: 'bg-blue-100 text-blue-700 border-blue-200',
};

interface LeadSourceBadgeProps {
  source: LeadSource;
  variant?: 'compact' | 'full';
}

export function LeadSourceBadge({
  source,
  variant = 'compact',
}: LeadSourceBadgeProps) {
  const ring = getLeadSourceRing(source);
  const colors = RING_COLORS[ring];
  const label = SOURCE_LABELS[source];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors}`}
    >
      {variant === 'full' ? label : `Ring ${ring.split('_')[1]}`}
    </span>
  );
}
