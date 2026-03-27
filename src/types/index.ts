export type PipelineStage =
  | 'new_lead'
  | 'contacted'
  | 'estimate_scheduled'
  | 'estimate_sent'
  | 'booked'
  | 'in_progress'
  | 'completed'
  | 'invoiced';

export type LeadSourceRing = 'ring_1' | 'ring_2' | 'ring_3';

export type LeadSource =
  // Ring 1: High-quality, existing relationships
  | 'existing_customer'
  | 'reactivation'
  | 'cross_sell'
  // Ring 2: Mid-quality, community
  | 'referral'
  | 'review'
  | 'neighborhood'
  // Ring 3: Lower-cost acquisition
  | 'google_lsa'
  | 'seo'
  | 'gbp';

export type ContactType = 'customer' | 'lead';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'estimate' | 'payment';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: ContactType;
  source: LeadSource;
  notes: string;
  createdAt: number;
}

export interface Deal {
  id: string;
  contactId: string;
  title: string;
  value: number;
  stage: PipelineStage;
  source: LeadSource;
  assignedTo: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface Activity {
  id: string;
  dealId?: string;
  contactId?: string;
  type: ActivityType;
  description: string;
  createdAt: number;
}

export function getLeadSourceRing(source: LeadSource): LeadSourceRing {
  const ring1: LeadSource[] = ['existing_customer', 'reactivation', 'cross_sell'];
  const ring2: LeadSource[] = ['referral', 'review', 'neighborhood'];
  const ring3: LeadSource[] = ['google_lsa', 'seo', 'gbp'];

  if (ring1.includes(source)) return 'ring_1';
  if (ring2.includes(source)) return 'ring_2';
  return 'ring_3';
}
