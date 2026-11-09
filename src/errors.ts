/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

/**
 * Base error class for all WazobiaMail SDK errors.
 */
export class WazobiaError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'WazobiaError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an API call returns a non-2xx status code.
 */
export class WazobiaApiError extends WazobiaError {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly errors?: Record<string, string>;
  public readonly rawBody?: unknown;

  constructor(
    message: string,
    statusCode: number,
    options?: {
      code?: string;
      errors?: Record<string, string>;
      rawBody?: unknown;
      cause?: unknown;
    }
  ) {
    super(message, { cause: options?.cause });
    this.name = 'WazobiaApiError';
    this.statusCode = statusCode;
    this.code = options?.code;
    this.errors = options?.errors;
    this.rawBody = options?.rawBody;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when API key authentication fails (HTTP 401)
 * or when client initialization fails due to a missing/invalid API key.
 */
export class WazobiaAuthenticationError extends WazobiaApiError {
  constructor(message = 'Invalid or missing API key', statusCode = 401, options?: { code?: string; rawBody?: unknown }) {
    super(message, statusCode, options);
    this.name = 'WazobiaAuthenticationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an action is forbidden (HTTP 403), e.g. feature requires plan upgrade.
 */
export class WazobiaForbiddenError extends WazobiaApiError {
  constructor(message = 'Access forbidden for this account or plan tier', options?: { code?: string; rawBody?: unknown }) {
    super(message, 403, options);
    this.name = 'WazobiaForbiddenError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a requested resource is not found (HTTP 404).
 */
export class WazobiaNotFoundError extends WazobiaApiError {
  constructor(message = 'The requested resource was not found', options?: { code?: string; rawBody?: unknown }) {
    super(message, 404, options);
    this.name = 'WazobiaNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when request payload fails validation (HTTP 422 or 400).
 */
export class WazobiaValidationError extends WazobiaApiError {
  constructor(
    message = 'Validation failed',
    statusCode = 422,
    options?: { code?: string; errors?: Record<string, string>; rawBody?: unknown }
  ) {
    super(message, statusCode, options);
    this.name = 'WazobiaValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when request limits are exceeded (HTTP 429).
 */
export class WazobiaRateLimitError extends WazobiaApiError {
  public readonly retryAfter?: number;

  constructor(
    message = 'Too many requests, rate limit exceeded',
    options?: { retryAfter?: number; code?: string; rawBody?: unknown }
  ) {
    super(message, 429, options);
    this.name = 'WazobiaRateLimitError';
    this.retryAfter = options?.retryAfter;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a request exceeds the configured client timeout.
 */
export class WazobiaTimeoutError extends WazobiaError {
  public readonly timeoutMs: number;

  constructor(message: string, timeoutMs: number) {
    super(message);
    this.name = 'WazobiaTimeoutError';
    this.timeoutMs = timeoutMs;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
