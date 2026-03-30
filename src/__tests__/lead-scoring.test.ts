import { describe, it, expect, beforeEach } from 'vitest';
import { qualifyLead, qualifyLeads } from '@/lib/lead-scoring';
import type { Contact, Deal, Activity, LeadQualificationInput } from '@/lib/lead-scoring';

describe('Lead Scoring System', () => {
  let hotLeadContact: Contact;
  let coldLeadContact: Contact;
  let highValueDeal: Deal;
  let lowValueDeal: Deal;
  let recentActivity: Activity;
  let oldActivity: Activity;

  beforeEach(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

    hotLeadContact = {
      id: 'hot-lead-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      address: '123 Main St',
      createdAt: oneHourAgo,
    };

    coldLeadContact = {
      id: 'cold-lead-1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      createdAt: tenDaysAgo,
    };

    highValueDeal = {
      id: 'deal-1',
      contactId: 'hot-lead-1',
      value: 15000,
      status: 'booked',
    };

    lowValueDeal = {
      id: 'deal-2',
      contactId: 'cold-lead-1',
      value: 500,
      status: 'new_lead',
    };

    recentActivity = {
      id: 'activity-1',
      contactId: 'hot-lead-1',
      type: 'meeting',
      createdAt: now,
    };

    oldActivity = {
      id: 'activity-2',
      contactId: 'cold-lead-1',
      type: 'email',
      createdAt: tenDaysAgo,
    };
  });

  describe('Hot Lead Scoring', () => {
    it('should score a high-quality lead significantly', () => {
      const input: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [highValueDeal],
        activities: [recentActivity],
        source: 'referral',
      };

      const result = qualifyLead(input);

      expect(result.score).toBeGreaterThan(60);
      expect(result.grade).toBe('B');
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for leads', () => {
      const input: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [highValueDeal],
        activities: [recentActivity],
        source: 'referral',
      };

      const result = qualifyLead(input);

      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Cold Lead Scoring', () => {
    it('should score a low-quality lead lower', () => {
      const input: LeadQualificationInput = {
        contact: coldLeadContact,
        deals: [lowValueDeal],
        activities: [oldActivity],
        source: 'neighborhood',
      };

      const result = qualifyLead(input);

      expect(result.score).toBeLessThan(50);
      expect(['C', 'D', 'F']).toContain(result.grade);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for all leads', () => {
      const input: LeadQualificationInput = {
        contact: coldLeadContact,
        deals: [lowValueDeal],
        activities: [oldActivity],
        source: 'neighborhood',
      };

      const result = qualifyLead(input);

      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Scoring Factors', () => {
    it('should calculate response speed factor correctly', () => {
      const input: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [],
        activities: [recentActivity],
      };

      const result = qualifyLead(input);
      const responseSpeedFactor = result.factors.find((f) => f.name === 'Response Speed');

      expect(responseSpeedFactor).toBeDefined();
      expect(responseSpeedFactor?.points).toBeGreaterThan(0);
      expect(responseSpeedFactor?.maxPoints).toBe(20);
    });

    it('should calculate engagement factor independently', () => {
      const multipleActivities = [
        { id: 'a1', contactId: 'hot-lead-1', type: 'call' as const, createdAt: new Date() },
        { id: 'a2', contactId: 'hot-lead-1', type: 'email' as const, createdAt: new Date() },
        { id: 'a3', contactId: 'hot-lead-1', type: 'meeting' as const, createdAt: new Date() },
      ];

      const input: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [],
        activities: multipleActivities,
      };

      const result = qualifyLead(input);
      const engagementFactor = result.factors.find((f) => f.name === 'Engagement');

      expect(engagementFactor).toBeDefined();
      expect(engagementFactor?.points).toBeGreaterThan(0);
      expect(engagementFactor?.maxPoints).toBe(20);
    });

    it('should calculate deal value factor correctly', () => {
      const input: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [highValueDeal],
        activities: [],
      };

      const result = qualifyLead(input);
      const dealValueFactor = result.factors.find((f) => f.name === 'Deal Value');

      expect(dealValueFactor).toBeDefined();
      expect(dealValueFactor?.points).toBe(15);
      expect(dealValueFactor?.maxPoints).toBe(15);
    });

    it('should score source quality factor correctly', () => {
      const sources = ['referral', 'existing_customer', 'google_lsa', 'seo', 'gbp', 'neighborhood'];

      for (const source of sources) {
        const input: LeadQualificationInput = {
          contact: { ...hotLeadContact, id: `contact-${source}` },
          deals: [],
          activities: [],
          source: source as any,
        };

        const result = qualifyLead(input);
        const sourceQualityFactor = result.factors.find((f) => f.name === 'Source Quality');

        expect(sourceQualityFactor).toBeDefined();
        expect(sourceQualityFactor?.points).toBeGreaterThan(0);
        expect(sourceQualityFactor?.maxPoints).toBe(15);
      }
    });

    it('should calculate all factors independently', () => {
      const input: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [highValueDeal],
        activities: [recentActivity],
        source: 'referral',
      };

      const result = qualifyLead(input);

      expect(result.factors.length).toBe(7);
      expect(result.factors.map((f) => f.name)).toEqual([
        'Response Speed',
        'Engagement',
        'Deal Value',
        'Source Quality',
        'Recency',
        'Completeness',
        'Pipeline Stage',
      ]);
    });
  });

  describe('Grade Mapping', () => {
    it('should assign grades correctly based on score', () => {
      const input: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [{ ...highValueDeal, value: 20000 }],
        activities: [recentActivity],
        source: 'referral',
      };

      const result = qualifyLead(input);

      expect(['A', 'B', 'C']).toContain(result.grade);
    });

    it('should give higher scores with more engagement', () => {
      const lowEngagement: LeadQualificationInput = {
        contact: { ...coldLeadContact, id: 'contact-b' },
        deals: [],
        activities: [],
        source: 'neighborhood',
      };

      const highEngagement: LeadQualificationInput = {
        contact: { ...hotLeadContact, id: 'contact-a' },
        deals: [{ ...highValueDeal, contactId: 'contact-a' }],
        activities: [recentActivity],
        source: 'referral',
      };

      const lowResult = qualifyLead(lowEngagement);
      const highResult = qualifyLead(highEngagement);

      expect(highResult.score).toBeGreaterThan(lowResult.score);
    });

    it('should map grades consistently', () => {
      const input: LeadQualificationInput = {
        contact: {
          id: 'contact-f',
          name: 'Unknown',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        deals: [],
        activities: [],
      };

      const result = qualifyLead(input);

      expect(['A', 'B', 'C', 'D', 'F']).toContain(result.grade);
    });

    it('should have appropriate labels for grades', () => {
      const input1: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [highValueDeal],
        activities: [recentActivity],
        source: 'referral',
      };

      const result1 = qualifyLead(input1);

      expect(result1.label).toBeDefined();
      expect(typeof result1.label).toBe('string');
      expect(result1.label.length).toBeGreaterThan(0);
    });
  });

  describe('Batch Lead Qualification', () => {
    it('should qualify multiple leads', () => {
      const contacts: Contact[] = [hotLeadContact, coldLeadContact];
      const deals: Deal[] = [highValueDeal, lowValueDeal];
      const activities: Activity[] = [recentActivity, oldActivity];

      const results = qualifyLeads(contacts, deals, activities);

      expect(results.size).toBe(2);
      expect(results.has('hot-lead-1')).toBe(true);
      expect(results.has('cold-lead-1')).toBe(true);
    });

    it('should return different scores for each lead in batch', () => {
      const contacts: Contact[] = [hotLeadContact, coldLeadContact];
      const deals: Deal[] = [highValueDeal, lowValueDeal];
      const activities: Activity[] = [recentActivity, oldActivity];

      const results = qualifyLeads(contacts, deals, activities);

      const hotResult = results.get('hot-lead-1');
      const coldResult = results.get('cold-lead-1');

      expect(hotResult).toBeDefined();
      expect(coldResult).toBeDefined();
      expect(hotResult!.score).toBeGreaterThan(coldResult!.score);
    });
  });

  describe('Edge Cases', () => {
    it('should handle contact with no activities', () => {
      const input: LeadQualificationInput = {
        contact: { id: 'new-contact', name: 'New Lead', createdAt: new Date() },
        deals: [],
        activities: [],
      };

      const result = qualifyLead(input);

      expect(result.score).toBeDefined();
      expect(result.factors.length).toBe(7);
    });

    it('should handle contact with no deals', () => {
      const input: LeadQualificationInput = {
        contact: hotLeadContact,
        deals: [],
        activities: [recentActivity],
      };

      const result = qualifyLead(input);

      expect(result.score).toBeDefined();
      const dealValueFactor = result.factors.find((f) => f.name === 'Deal Value');
      expect(dealValueFactor?.points).toBe(0);
    });

    it('should handle contact with minimal information', () => {
      const input: LeadQualificationInput = {
        contact: {
          id: 'minimal-contact',
          name: 'Minimal',
          createdAt: new Date(),
        },
        deals: [],
        activities: [],
      };

      const result = qualifyLead(input);

      expect(result.score).toBeDefined();
      const completeFactor = result.factors.find((f) => f.name === 'Completeness');
      expect(completeFactor?.points).toBe(0);
    });
  });
});
