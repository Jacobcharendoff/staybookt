import crypto from 'crypto';

const PORTAL_SECRET = process.env.PORTAL_SECRET || 'staybookt-portal-default';

/**
 * Generate a portal token for a customer
 * Token = SHA256 hash of contactId:orgId:PORTAL_SECRET, first 32 chars
 */
export function generatePortalToken(contactId: string, orgId: string): string {
  const hash = crypto.createHash('sha256').update(`${contactId}:${orgId}:${PORTAL_SECRET}`).digest('hex');
  return hash.slice(0, 32);
}

/**
 * Validate a portal token
 */
export function validatePortalToken(token: string, contactId: string, orgId: string): boolean {
  const expectedToken = generatePortalToken(contactId, orgId);
  return token === expectedToken;
}

/**
 * Generate a full portal URL
 */
export function generatePortalUrl(contactId: string, orgId: string, baseUrl: string = 'https://staybookt-pied.vercel.app'): string {
  const token = generatePortalToken(contactId, orgId);
  return `${baseUrl}/portal/${token}`;
}
