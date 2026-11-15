/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaAuthenticationError, WazobiaValidationError } from './errors.js';

export const DEFAULT_BASE_URL = 'https://app.wazobiamail.com/api/v1';
export const DEFAULT_TIMEOUT_MS = 30_000;
export const SDK_VERSION = '0.1.1';
export const DEFAULT_USER_AGENT = `wazobiamail-node/${SDK_VERSION}`;

export type FetchFunction = typeof globalThis.fetch;

export interface WazobiaClientOptions {
  /**
   * WazobiaMail API key (`wzbm_...`).
   * If omitted, falls back to `process.env.WAZOBIA_API_KEY` or `process.env.WAZOBIAMAIL_API_KEY`.
   */
  apiKey?: string;

  /**
   * Base URL for the WazobiaMail REST API.
   * Defaults to `https://app.wazobiamail.com/api/v1` or `process.env.WAZOBIA_BASE_URL`.
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds.
   * Defaults to 30,000 (30 seconds).
   */
  timeout?: number;

  /**
   * Optional custom fetch implementation (useful for mocks, proxies, or specific runtimes).
   */
  fetch?: FetchFunction;

  /**
   * Header authorization strategy.
   * - `'header'`: Sends `X-API-Key: <key>` (standard WazobiaMail key header).
   * - `'bearer'`: Sends `Authorization: Bearer <key>`.
   * - `'both'`: Sends both `X-API-Key` and `Authorization: Bearer`.
   * Defaults to `'header'`.
   */
  authScheme?: 'header' | 'bearer' | 'both';

  /**
   * Custom HTTP headers to merge into every outgoing request.
   */
  headers?: Record<string, string>;
}

export interface ResolvedClientConfig {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly timeout: number;
  readonly fetch: FetchFunction;
  readonly authScheme: 'header' | 'bearer' | 'both';
  readonly headers: Record<string, string>;
}

/**
 * Safely resolves environment variables in Node.js, Bun, Deno, or edge runtimes.
 */
function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env && typeof process.env[key] === 'string') {
    return process.env[key];
  }
  return undefined;
}

/**
 * Validates and resolves the client configuration options.
 */
export function resolveConfig(options?: string | WazobiaClientOptions): ResolvedClientConfig {
  let rawApiKey: string | undefined;
  let customBaseUrl: string | undefined;
  let customTimeout: number | undefined;
  let customFetch: FetchFunction | undefined;
  let customAuthScheme: 'header' | 'bearer' | 'both' = 'header';
  let customHeaders: Record<string, string> = {};

  if (typeof options === 'string') {
    rawApiKey = options;
  } else if (options && typeof options === 'object') {
    rawApiKey = options.apiKey;
    customBaseUrl = options.baseUrl;
    customTimeout = options.timeout;
    customFetch = options.fetch;
    if (options.authScheme) {
      customAuthScheme = options.authScheme;
    }
    if (options.headers) {
      customHeaders = { ...options.headers };
    }
  }

  // Fallback to environment variables if key is not passed
  if (!rawApiKey) {
    rawApiKey = getEnv('WAZOBIA_API_KEY') || getEnv('WAZOBIAMAIL_API_KEY');
  }

  if (!rawApiKey || typeof rawApiKey !== 'string' || rawApiKey.trim() === '') {
    throw new WazobiaAuthenticationError(
      'Missing WazobiaMail API key. Pass an apiKey to the constructor `new WazobiaMail("wzbm_...")` ' +
      'or set the `WAZOBIA_API_KEY` (or `WAZOBIAMAIL_API_KEY`) environment variable.'
    );
  }

  const apiKey = rawApiKey.trim();
  if (/[\r\n\0]/.test(apiKey)) {
    throw new WazobiaValidationError('WazobiaMail API key contains illegal control characters.', 400);
  }

  for (const [headerName, headerVal] of Object.entries(customHeaders)) {
    if (/[\r\n\0:]/.test(headerName) || /[\r\n\0]/.test(String(headerVal))) {
      throw new WazobiaValidationError(`Custom header "${headerName}" contains illegal control characters.`, 400);
    }
  }

  // Resolve base URL
  let baseUrl = (customBaseUrl || getEnv('WAZOBIA_BASE_URL') || DEFAULT_BASE_URL).trim();
  if (/[\r\n\0]/.test(baseUrl) || (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://'))) {
    throw new WazobiaValidationError('baseUrl must use http:// or https:// without control characters.', 400);
  }
  baseUrl = baseUrl.replace(/\/+$/, ''); // Strip trailing slashes

  // Resolve fetch
  const resolvedFetch = customFetch || (typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined);
  if (!resolvedFetch) {
    throw new Error(
      'No fetch implementation available. Ensure you are running Node.js 18+ or provide a custom fetch in options.'
    );
  }

  const timeout = typeof customTimeout === 'number' && customTimeout > 0 ? customTimeout : DEFAULT_TIMEOUT_MS;

  return {
    apiKey,
    baseUrl,
    timeout,
    fetch: resolvedFetch,
    authScheme: customAuthScheme,
    headers: customHeaders,
  };
}

/**
 * Returns a masked representation of an API key for safe logging (e.g. `wzbm_...3a9f`).
 */
export function maskApiKey(key: string): string {
  if (key.length <= 8) {
    return '***';
  }
  const prefix = key.slice(0, 5);
  const suffix = key.slice(-4);
  return `${prefix}...${suffix}`;
}
