import { pgTable, uuid, text, timestamp, numeric, boolean, pgEnum, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==================== ENUMS ====================

export const pipelineStageEnum = pgEnum('pipeline_stage', [
  'new_lead',
  'contacted',
  'estimate_scheduled',
  'estimate_sent',
  'booked',
  'in_progress',
  'completed',
  'invoiced',
]);

export const leadSourceEnum = pgEnum('lead_source', [
  'existing_customer',
  'reactivation',
  'cross_sell',
  'referral',
  'review',
  'neighborhood',
  'google_lsa',
  'seo',
  'gbp',
]);

export const contactTypeEnum = pgEnum('contact_type', ['customer', 'lead']);

export const activityTypeEnum = pgEnum('activity_type', [
  'call',
  'email',
  'meeting',
  'note',
  'estimate',
  'payment',
  'sms',
  'status_change',
]);

export const userRoleEnum = pgEnum('user_role', ['owner', 'admin', 'manager', 'technician']);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'sent',
  'viewed',
  'paid',
  'overdue',
  'cancelled',
]);

export const estimateStatusEnum = pgEnum('estimate_status', [
  'draft',
  'sent',
  'viewed',
  'approved',
  'rejected',
  'expired',
]);

export const jobPriorityEnum = pgEnum('job_priority', ['low', 'normal', 'high', 'emergency']);

// ==================== TABLES ====================

// Organizations (multi-tenant)
export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  industry: text('industry').default('general'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  logo: text('logo'),
  website: text('website'),
  timezone: text('timezone').default('America/Denver'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users (team members)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').unique(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  avatar: text('avatar'),
  role: userRoleEnum('role').default('technician').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Contacts (customers & leads)
export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
  type: contactTypeEnum('type').default('lead').notNull(),
  source: leadSourceEnum('source').default('seo').notNull(),
  tags: text('tags').array(),
  notes: text('notes'),
  propertyType: text('property_type'), // residential, commercial
  serviceArea: text('service_area'),
  preferredContact: text('preferred_contact').default('phone'), // phone, email, sms
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Deals (pipeline items)
export const deals = pgTable('deals', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  assignedToId: uuid('assigned_to_id').references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  value: numeric('value', { precision: 12, scale: 2 }).default('0'),
  stage: pipelineStageEnum('stage').default('new_lead').notNull(),
  source: leadSourceEnum('source').default('seo').notNull(),
  priority: jobPriorityEnum('priority').default('normal').notNull(),
  scheduledDate: timestamp('scheduled_date'),
  scheduledTimeStart: text('scheduled_time_start'), // "09:00"
  scheduledTimeEnd: text('scheduled_time_end'),     // "11:00"
  completedAt: timestamp('completed_at'),
  notes: text('notes'),
  tags: text('tags').array(),
  serviceType: text('service_type'), // plumbing, hvac, electrical, etc.
  jobAddress: text('job_address'),
  stageChangedAt: timestamp('stage_changed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Activities (timeline events)
export const activities = pgTable('activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  dealId: uuid('deal_id').references(() => deals.id),
  contactId: uuid('contact_id').references(() => contacts.id),
  userId: uuid('user_id').references(() => users.id),
  type: activityTypeEnum('type').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Estimates
export const estimates = pgTable('estimates', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  dealId: uuid('deal_id').references(() => deals.id),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  createdById: uuid('created_by_id').references(() => users.id),
  estimateNumber: text('estimate_number').notNull(),
  status: estimateStatusEnum('status').default('draft').notNull(),
  lineItems: jsonb('line_items').default([]).notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).default('0'),
  taxRate: numeric('tax_rate', { precision: 5, scale: 4 }).default('0'),
  taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0'),
  total: numeric('total', { precision: 12, scale: 2 }).default('0'),
  notes: text('notes'),
  validUntil: timestamp('valid_until'),
  approvedAt: timestamp('approved_at'),
  sentAt: timestamp('sent_at'),
  signatureUrl: text('signature_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Invoices
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  dealId: uuid('deal_id').references(() => deals.id),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  estimateId: uuid('estimate_id').references(() => estimates.id),
  createdById: uuid('created_by_id').references(() => users.id),
  invoiceNumber: text('invoice_number').notNull(),
  status: invoiceStatusEnum('status').default('draft').notNull(),
  lineItems: jsonb('line_items').default([]).notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).default('0'),
  taxRate: numeric('tax_rate', { precision: 5, scale: 4 }).default('0'),
  taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0'),
  total: numeric('total', { precision: 12, scale: 2 }).default('0'),
  amountPaid: numeric('amount_paid', { precision: 12, scale: 2 }).default('0'),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  paymentMethod: text('payment_method'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  notes: text('notes'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== RELATIONS ====================

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  contacts: many(contacts),
  deals: many(deals),
  activities: many(activities),
  estimates: many(estimates),
  invoices: many(invoices),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, { fields: [users.orgId], references: [organizations.id] }),
  assignedDeals: many(deals),
  activities: many(activities),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  organization: one(organizations, { fields: [contacts.orgId], references: [organizations.id] }),
  deals: many(deals),
  activities: many(activities),
  estimates: many(estimates),
  invoices: many(invoices),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  organization: one(organizations, { fields: [deals.orgId], references: [organizations.id] }),
  contact: one(contacts, { fields: [deals.contactId], references: [contacts.id] }),
  assignedTo: one(users, { fields: [deals.assignedToId], references: [users.id] }),
  activities: many(activities),
  estimates: many(estimates),
  invoices: many(invoices),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  organization: one(organizations, { fields: [activities.orgId], references: [organizations.id] }),
  deal: one(deals, { fields: [activities.dealId], references: [deals.id] }),
  contact: one(contacts, { fields: [activities.contactId], references: [contacts.id] }),
  user: one(users, { fields: [activities.userId], references: [users.id] }),
}));

export const estimatesRelations = relations(estimates, ({ one }) => ({
  organization: one(organizations, { fields: [estimates.orgId], references: [organizations.id] }),
  deal: one(deals, { fields: [estimates.dealId], references: [deals.id] }),
  contact: one(contacts, { fields: [estimates.contactId], references: [contacts.id] }),
  createdBy: one(users, { fields: [estimates.createdById], references: [users.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  organization: one(organizations, { fields: [invoices.orgId], references: [organizations.id] }),
  deal: one(deals, { fields: [invoices.dealId], references: [deals.id] }),
  contact: one(contacts, { fields: [invoices.contactId], references: [contacts.id] }),
  estimate: one(estimates, { fields: [invoices.estimateId], references: [estimates.id] }),
  createdBy: one(users, { fields: [invoices.createdById], references: [users.id] }),
}));
