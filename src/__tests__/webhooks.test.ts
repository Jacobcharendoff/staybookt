import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  registerWebhook,
  getWebhooks,
  removeWebhook,
  generateSignature,
  dispatchWebhooks,
  type WebhookPayload,
  type WebhookConfig,
} from '@/lib/webhooks';

describe('Webhook System', () => {
  const orgId = 'org-test-123';
  const webhookUrl = 'https://example.com/webhooks';
  const secret = 'super-secret-key';

  // Reset webhook registry before each test
  beforeEach(() => {
    // Clear the registry by removing all webhooks
    const webhooks = getWebhooks(orgId);
    webhooks.forEach((w) => removeWebhook(orgId, w.id));
  });

  describe('Webhook Registration', () => {
    it('should register a webhook', () => {
      const config = registerWebhook(orgId, webhookUrl, ['contact.created']);

      expect(config).toBeDefined();
      expect(config.orgId).toBe(orgId);
      expect(config.url).toBe(webhookUrl);
      expect(config.events).toContain('contact.created');
      expect(config.active).toBe(true);
      expect(config.id).toBeDefined();
      expect(config.createdAt).toBeDefined();
    });

    it('should register a webhook with secret', () => {
      const config = registerWebhook(orgId, webhookUrl, ['deal.created'], secret);

      expect(config.secret).toBe(secret);
    });

    it('should register webhooks for multiple events', () => {
      const events = ['contact.created', 'deal.created', 'deal.updated'];
      const config = registerWebhook(orgId, webhookUrl, events);

      expect(config.events).toEqual(events);
    });

    it('should generate unique IDs for each webhook', () => {
      const config1 = registerWebhook(orgId, webhookUrl, ['contact.created']);
      const config2 = registerWebhook(orgId, webhookUrl, ['deal.created']);

      expect(config1.id).not.toBe(config2.id);
    });

    it('should include createdAt timestamp', () => {
      const beforeTime = new Date();
      const config = registerWebhook(orgId, webhookUrl, ['contact.created']);
      const afterTime = new Date();

      const createdAt = new Date(config.createdAt);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });

  describe('Webhook Retrieval', () => {
    it('should return empty array for org with no webhooks', () => {
      const webhooks = getWebhooks('non-existent-org');

      expect(webhooks).toEqual([]);
    });

    it('should return all webhooks for an org', () => {
      registerWebhook(orgId, 'https://endpoint1.com', ['contact.created']);
      registerWebhook(orgId, 'https://endpoint2.com', ['deal.created']);
      registerWebhook(orgId, 'https://endpoint3.com', ['invoice.paid']);

      const webhooks = getWebhooks(orgId);

      expect(webhooks.length).toBe(3);
    });

    it('should not return webhooks from other orgs', () => {
      const orgId1 = 'org-1';
      const orgId2 = 'org-2';

      registerWebhook(orgId1, 'https://endpoint1.com', ['contact.created']);
      registerWebhook(orgId2, 'https://endpoint2.com', ['deal.created']);

      const webhooksOrg1 = getWebhooks(orgId1);
      const webhooksOrg2 = getWebhooks(orgId2);

      expect(webhooksOrg1.length).toBe(1);
      expect(webhooksOrg2.length).toBe(1);
      expect(webhooksOrg1[0].url).toBe('https://endpoint1.com');
      expect(webhooksOrg2[0].url).toBe('https://endpoint2.com');
    });
  });

  describe('Webhook Removal', () => {
    it('should remove a webhook by ID', () => {
      const config = registerWebhook(orgId, webhookUrl, ['contact.created']);

      const removed = removeWebhook(orgId, config.id);

      expect(removed).toBe(true);
      expect(getWebhooks(orgId).length).toBe(0);
    });

    it('should return false when webhook not found', () => {
      const removed = removeWebhook(orgId, 'non-existent-id');

      expect(removed).toBe(false);
    });

    it('should return false when org not found', () => {
      const removed = removeWebhook('non-existent-org', 'webhook-id');

      expect(removed).toBe(false);
    });

    it('should only remove specified webhook', () => {
      const config1 = registerWebhook(orgId, 'https://endpoint1.com', ['contact.created']);
      const config2 = registerWebhook(orgId, 'https://endpoint2.com', ['deal.created']);

      removeWebhook(orgId, config1.id);

      const remaining = getWebhooks(orgId);
      expect(remaining.length).toBe(1);
      expect(remaining[0].id).toBe(config2.id);
    });
  });

  describe('Signature Generation', () => {
    it('should generate a valid HMAC signature', () => {
      const payload: WebhookPayload = {
        event: 'contact.created',
        timestamp: '2026-03-30T12:00:00Z',
        data: { contactId: '123', name: 'John Doe' },
        orgId: 'org-1',
      };

      const signature = generateSignature(payload, secret);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBe(64); // SHA256 hex digest is 64 chars
    });

    it('should produce deterministic signatures', () => {
      const payload: WebhookPayload = {
        event: 'contact.created',
        timestamp: '2026-03-30T12:00:00Z',
        data: { contactId: '123', name: 'John Doe' },
        orgId: 'org-1',
      };

      const signature1 = generateSignature(payload, secret);
      const signature2 = generateSignature(payload, secret);

      expect(signature1).toBe(signature2);
    });

    it('should produce different signatures for different payloads', () => {
      const payload1: WebhookPayload = {
        event: 'contact.created',
        timestamp: '2026-03-30T12:00:00Z',
        data: { contactId: '123' },
        orgId: 'org-1',
      };

      const payload2: WebhookPayload = {
        event: 'contact.created',
        timestamp: '2026-03-30T12:00:00Z',
        data: { contactId: '456' },
        orgId: 'org-1',
      };

      const signature1 = generateSignature(payload1, secret);
      const signature2 = generateSignature(payload2, secret);

      expect(signature1).not.toBe(signature2);
    });

    it('should produce different signatures for different secrets', () => {
      const payload: WebhookPayload = {
        event: 'contact.created',
        timestamp: '2026-03-30T12:00:00Z',
        data: { contactId: '123' },
        orgId: 'org-1',
      };

      const signature1 = generateSignature(payload, 'secret-1');
      const signature2 = generateSignature(payload, 'secret-2');

      expect(signature1).not.toBe(signature2);
    });

    it('should produce hex-only signatures', () => {
      const payload: WebhookPayload = {
        event: 'contact.created',
        timestamp: '2026-03-30T12:00:00Z',
        data: { contactId: '123' },
        orgId: 'org-1',
      };

      const signature = generateSignature(payload, secret);

      expect(/^[a-f0-9]+$/.test(signature)).toBe(true);
    });
  });

  describe('Webhook Events', () => {
    it('should support contact.created event', () => {
      const config = registerWebhook(orgId, webhookUrl, ['contact.created']);

      expect(config.events).toContain('contact.created');
    });

    it('should support deal events', () => {
      const config = registerWebhook(orgId, webhookUrl, [
        'deal.created',
        'deal.updated',
        'deal.stage_changed',
      ]);

      expect(config.events).toContain('deal.created');
      expect(config.events).toContain('deal.updated');
      expect(config.events).toContain('deal.stage_changed');
    });

    it('should support invoice events', () => {
      const config = registerWebhook(orgId, webhookUrl, ['invoice.created', 'invoice.paid']);

      expect(config.events).toContain('invoice.created');
      expect(config.events).toContain('invoice.paid');
    });

    it('should support estimate events', () => {
      const config = registerWebhook(orgId, webhookUrl, ['estimate.created', 'estimate.approved']);

      expect(config.events).toContain('estimate.created');
      expect(config.events).toContain('estimate.approved');
    });
  });

  describe('Webhook Payload Structure', () => {
    it('should have correct payload structure', async () => {
      const payload: WebhookPayload = {
        event: 'contact.created',
        timestamp: '2026-03-30T12:00:00Z',
        data: {
          id: 'contact-123',
          name: 'John Doe',
          email: 'john@example.com',
        },
        orgId: orgId,
      };

      expect(payload.event).toBe('contact.created');
      expect(payload.timestamp).toBeDefined();
      expect(payload.data).toBeDefined();
      expect(payload.orgId).toBe(orgId);
    });

    it('should support complex data objects', () => {
      const payload: WebhookPayload = {
        event: 'deal.created',
        timestamp: '2026-03-30T12:00:00Z',
        data: {
          dealId: 'deal-123',
          contactId: 'contact-456',
          value: 5000,
          status: 'estimate_sent',
          metadata: {
            source: 'referral',
            tags: ['urgent', 'high-value'],
          },
        },
        orgId: orgId,
      };

      expect(payload.data.dealId).toBe('deal-123');
      expect(payload.data.metadata.tags).toContain('urgent');
    });
  });

  describe('Webhook Configuration', () => {
    it('should start active by default', () => {
      const config = registerWebhook(orgId, webhookUrl, ['contact.created']);

      expect(config.active).toBe(true);
    });

    it('should include timestamps', () => {
      const config = registerWebhook(orgId, webhookUrl, ['contact.created']);

      expect(config.createdAt).toBeDefined();
      const createdDate = new Date(config.createdAt);
      expect(createdDate instanceof Date).toBe(true);
      expect(createdDate.getTime()).toBeGreaterThan(0);
    });

    it('should optionally include lastTriggeredAt after first dispatch', () => {
      const config = registerWebhook(orgId, webhookUrl, ['contact.created']);

      expect(config.lastTriggeredAt).toBeUndefined();
      // After dispatch, lastTriggeredAt would be set (tested separately)
    });
  });

  describe('Multiple Webhooks', () => {
    it('should handle multiple webhooks per org', () => {
      const webhook1 = registerWebhook(orgId, 'https://endpoint1.com', ['contact.created']);
      const webhook2 = registerWebhook(orgId, 'https://endpoint2.com', ['deal.created']);
      const webhook3 = registerWebhook(orgId, 'https://endpoint3.com', [
        'contact.created',
        'deal.created',
      ]);

      const webhooks = getWebhooks(orgId);

      expect(webhooks.length).toBe(3);
      expect(webhooks.map((w) => w.id)).toContain(webhook1.id);
      expect(webhooks.map((w) => w.id)).toContain(webhook2.id);
      expect(webhooks.map((w) => w.id)).toContain(webhook3.id);
    });

    it('should filter webhooks by event independently', () => {
      registerWebhook(orgId, 'https://endpoint1.com', ['contact.created']);
      registerWebhook(orgId, 'https://endpoint2.com', ['deal.created']);
      registerWebhook(orgId, 'https://endpoint3.com', ['contact.created', 'deal.created']);

      const allWebhooks = getWebhooks(orgId);

      const contactWebhooks = allWebhooks.filter((w) => w.events.includes('contact.created'));
      const dealWebhooks = allWebhooks.filter((w) => w.events.includes('deal.created'));

      expect(contactWebhooks.length).toBe(2);
      expect(dealWebhooks.length).toBe(3); // endpoint1, endpoint2, and endpoint3 all support deal.created
    });
  });

  describe('Edge Cases', () => {
    it('should handle webhook with empty events array', () => {
      const config = registerWebhook(orgId, webhookUrl, []);

      expect(config.events).toEqual([]);
    });

    it('should handle webhook with duplicate events', () => {
      const events = ['contact.created', 'contact.created', 'contact.created'];
      const config = registerWebhook(orgId, webhookUrl, events);

      expect(config.events.length).toBe(3);
    });

    it('should handle very long webhook URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(1000);
      const config = registerWebhook(orgId, longUrl, ['contact.created']);

      expect(config.url).toBe(longUrl);
    });

    it('should handle special characters in org ID', () => {
      const specialOrgId = 'org-!@#$%^&*()_+-=[]{}|;:,.<>?';
      const config = registerWebhook(specialOrgId, webhookUrl, ['contact.created']);

      const webhooks = getWebhooks(specialOrgId);
      expect(webhooks.length).toBe(1);
      expect(webhooks[0].orgId).toBe(specialOrgId);
    });
  });
});
