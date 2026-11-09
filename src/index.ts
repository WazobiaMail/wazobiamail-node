/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

export { WazobiaMail, Wazobia } from './client.js';
export type {
  WazobiaClientOptions,
  ResolvedClientConfig,
} from './config.js';
export {
  DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT_MS,
  SDK_VERSION,
} from './config.js';
export { HttpClient } from './http.js';
export type { RequestOptions } from './http.js';

export {
  WazobiaError,
  WazobiaApiError,
  WazobiaAuthenticationError,
  WazobiaForbiddenError,
  WazobiaNotFoundError,
  WazobiaValidationError,
  WazobiaRateLimitError,
  WazobiaTimeoutError,
} from './errors.js';
export * from './resources/index.js';
export * from './types/index.js';

import { WazobiaMail } from './client.js';
export default WazobiaMail;
