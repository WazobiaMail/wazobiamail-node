/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  scope: 'general' | 'domain' | string;
  domainId?: string;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateApiKeyRequest {
  name: string;
  scope?: 'general' | 'domain' | string;
  domainId?: string;
  expiresAt?: string;
}

export interface CreatedApiKeyData extends ApiKeyRecord {
  /**
   * The complete secret API key string (`wzbm_...`).
   * This is only returned once upon creation or rotation.
   */
  apiKey: string;
}

export type ApiKeyListResponse = WazobiaApiResponse<{ items: ApiKeyRecord[] }>;
export type CreateApiKeyResponse = WazobiaApiResponse<{ apiKey: CreatedApiKeyData }>;
