import * as Sentry from '@sentry/nextjs';

/**
 * Capture API errors and send to Sentry if configured
 * @param error The error object
 * @param context Additional context information to attach to the error
 */
export function captureApiError(error: unknown, context?: Record<string, any>) {
  console.error('[API Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
}

/**
 * Capture validation errors and send to Sentry if configured
 * @param error The validation error
 * @param context Additional context information
 */
export function captureValidationError(error: unknown, context?: Record<string, any>) {
  console.warn('[Validation Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'validation' },
      extra: context
    });
  }
}

/**
 * Capture authentication errors and send to Sentry if configured
 * @param error The authentication error
 * @param context Additional context information
 */
export function captureAuthError(error: unknown, context?: Record<string, any>) {
  console.error('[Auth Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'authentication' },
      extra: context
    });
  }
}

/**
 * Capture database errors and send to Sentry if configured
 * @param error The database error
 * @param context Additional context information
 */
export function captureDatabaseError(error: unknown, context?: Record<string, any>) {
  console.error('[Database Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'database' },
      extra: context
    });
  }
}

/**
 * Capture payment/stripe errors and send to Sentry if configured
 * @param error The payment error
 * @param context Additional context information
 */
export function capturePaymentError(error: unknown, context?: Record<string, any>) {
  console.error('[Payment Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'payment' },
      extra: context
    });
  }
}

/**
 * Capture webhook delivery errors and send to Sentry if configured
 * @param error The webhook error
 * @param context Additional context information
 */
export function captureWebhookError(error: unknown, context?: Record<string, any>) {
  console.error('[Webhook Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'webhook' },
      extra: context
    });
  }
}

/**
 * Create a formatted error response for API endpoints
 * @param message The error message
 * @param status HTTP status code
 * @returns Formatted error response object
 */
export function createErrorResponse(message: string, status: number = 500) {
  return {
    data: null,
    error: message,
    meta: {
      code: `ERROR_${status}`,
    },
  };
}

/**
 * Extract useful context from an error object
 * @param error The error object
 * @returns Extracted context object
 */
export function extractErrorContext(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }

  if (typeof error === 'object' && error !== null) {
    return {
      ...error,
    };
  }

  return {
    error: String(error),
  };
}
