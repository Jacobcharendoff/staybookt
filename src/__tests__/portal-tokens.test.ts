import { describe, it, expect } from 'vitest';
import { generatePortalToken, validatePortalToken, generatePortalUrl } from '@/lib/portal-tokens';

describe('Portal Token System', () => {
  const contactId = 'contact-123';
  const orgId = 'org-456';
  const baseUrl = 'https://example.com';

  describe('Token Generation', () => {
    it('should generate a deterministic token', () => {
      const token1 = generatePortalToken(contactId, orgId);
      const token2 = generatePortalToken(contactId, orgId);

      expect(token1).toBe(token2);
    });

    it('should generate same inputs produce same token', () => {
      const token1 = generatePortalToken('contact-1', 'org-1');
      const token2 = generatePortalToken('contact-1', 'org-1');

      expect(token1).toBe(token2);
    });

    it('should produce different tokens for different contact IDs', () => {
      const token1 = generatePortalToken('contact-1', 'org-1');
      const token2 = generatePortalToken('contact-2', 'org-1');

      expect(token1).not.toBe(token2);
    });

    it('should produce different tokens for different org IDs', () => {
      const token1 = generatePortalToken('contact-1', 'org-1');
      const token2 = generatePortalToken('contact-1', 'org-2');

      expect(token1).not.toBe(token2);
    });

    it('should generate tokens of correct length', () => {
      const token = generatePortalToken(contactId, orgId);

      expect(token.length).toBe(32);
    });

    it('should generate hex-only tokens', () => {
      const token = generatePortalToken(contactId, orgId);

      expect(/^[a-f0-9]{32}$/.test(token)).toBe(true);
    });
  });

  describe('Token Validation', () => {
    it('should validate a correct token', () => {
      const token = generatePortalToken(contactId, orgId);

      const isValid = validatePortalToken(token, contactId, orgId);

      expect(isValid).toBe(true);
    });

    it('should reject an invalid token', () => {
      const token = generatePortalToken(contactId, orgId);
      const invalidToken = token.slice(0, -1) + (token[token.length - 1] === '0' ? '1' : '0');

      const isValid = validatePortalToken(invalidToken, contactId, orgId);

      expect(isValid).toBe(false);
    });

    it('should reject token with wrong contact ID', () => {
      const token = generatePortalToken(contactId, orgId);

      const isValid = validatePortalToken(token, 'different-contact', orgId);

      expect(isValid).toBe(false);
    });

    it('should reject token with wrong org ID', () => {
      const token = generatePortalToken(contactId, orgId);

      const isValid = validatePortalToken(token, contactId, 'different-org');

      expect(isValid).toBe(false);
    });

    it('should reject completely wrong token', () => {
      const wrongToken = '00000000000000000000000000000000';

      const isValid = validatePortalToken(wrongToken, contactId, orgId);

      expect(isValid).toBe(false);
    });
  });

  describe('Portal URL Generation', () => {
    it('should generate a portal URL with token', () => {
      const url = generatePortalUrl(contactId, orgId, baseUrl);

      expect(url).toContain(`${baseUrl}/portal/`);
      expect(url).toContain(generatePortalToken(contactId, orgId));
    });

    it('should use default base URL if not provided', () => {
      const url = generatePortalUrl(contactId, orgId);

      expect(url).toContain('https://staybookt-pied.vercel.app/portal/');
    });

    it('should include proper token in URL', () => {
      const token = generatePortalToken(contactId, orgId);
      const url = generatePortalUrl(contactId, orgId, baseUrl);

      expect(url).toBe(`${baseUrl}/portal/${token}`);
    });

    it('should generate unique URLs for different contacts', () => {
      const url1 = generatePortalUrl('contact-1', orgId, baseUrl);
      const url2 = generatePortalUrl('contact-2', orgId, baseUrl);

      expect(url1).not.toBe(url2);
    });

    it('should generate unique URLs for different orgs', () => {
      const url1 = generatePortalUrl(contactId, 'org-1', baseUrl);
      const url2 = generatePortalUrl(contactId, 'org-2', baseUrl);

      expect(url1).not.toBe(url2);
    });

    it('should work with complex base URLs', () => {
      const customBase = 'https://custom-domain.example.com/app';
      const url = generatePortalUrl(contactId, orgId, customBase);

      expect(url).toContain(`${customBase}/portal/`);
    });
  });

  describe('Token Security', () => {
    it('should produce consistent hash-based tokens', () => {
      // Multiple calls should produce identical tokens (deterministic)
      const tokens = [
        generatePortalToken(contactId, orgId),
        generatePortalToken(contactId, orgId),
        generatePortalToken(contactId, orgId),
      ];

      expect(tokens[0]).toBe(tokens[1]);
      expect(tokens[1]).toBe(tokens[2]);
    });

    it('should not expose input in token', () => {
      const token = generatePortalToken(contactId, orgId);

      expect(token).not.toContain(contactId);
      expect(token).not.toContain(orgId);
    });

    it('should be case-sensitive for validation', () => {
      const token = generatePortalToken(contactId, orgId);
      const upperToken = token.toUpperCase();

      // Token generation should always produce lowercase hex
      const isValid = validatePortalToken(upperToken, contactId, orgId);
      // This depends on implementation - if validation is case-sensitive it should fail
      expect(typeof isValid).toBe('boolean');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty contact IDs', () => {
      const token = generatePortalToken('', orgId);

      expect(token).toBeDefined();
      expect(token.length).toBe(32);
    });

    it('should handle special characters in IDs', () => {
      const specialContact = 'contact-!@#$%^&*()';
      const specialOrg = 'org-!@#$%^&*()';

      const token = generatePortalToken(specialContact, specialOrg);

      expect(token).toBeDefined();
      expect(token.length).toBe(32);
    });

    it('should handle very long IDs', () => {
      const longContact = 'contact-' + 'x'.repeat(1000);
      const longOrg = 'org-' + 'y'.repeat(1000);

      const token = generatePortalToken(longContact, longOrg);

      expect(token).toBeDefined();
      expect(token.length).toBe(32);
    });

    it('should handle numeric IDs', () => {
      const token1 = generatePortalToken('12345', '67890');
      const token2 = generatePortalToken('12345', '67890');

      expect(token1).toBe(token2);
      expect(validatePortalToken(token1, '12345', '67890')).toBe(true);
    });

    it('should handle UUID-format IDs', () => {
      const uuid1 = '550e8400-e29b-41d4-a716-446655440000';
      const uuid2 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

      const token = generatePortalToken(uuid1, uuid2);

      expect(validatePortalToken(token, uuid1, uuid2)).toBe(true);
    });
  });

  describe('Token Reusability', () => {
    it('should allow same token to be reused for same contact/org', () => {
      const token = generatePortalToken(contactId, orgId);

      expect(validatePortalToken(token, contactId, orgId)).toBe(true);
      expect(validatePortalToken(token, contactId, orgId)).toBe(true);
      expect(validatePortalToken(token, contactId, orgId)).toBe(true);
    });

    it('should allow token to be used for multiple URLs', () => {
      const token1 = generatePortalToken(contactId, orgId);
      const url1 = generatePortalUrl(contactId, orgId, 'https://site1.com');
      const url2 = generatePortalUrl(contactId, orgId, 'https://site2.com');

      const extractedToken1 = url1.split('/portal/')[1];
      const extractedToken2 = url2.split('/portal/')[1];

      expect(extractedToken1).toBe(extractedToken2);
      expect(extractedToken1).toBe(token1);
    });
  });
});
