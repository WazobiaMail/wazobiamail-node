/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestOptions } from '../http.js';
import {
  ApiKeyListResponse,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  SuccessResponse,
} from '../types/index.js';

export class ApiKeysResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Lists all scoped sending API keys for the account.
   */
  public async list(options?: RequestOptions): Promise<ApiKeyListResponse> {
    return this.http.get<ApiKeyListResponse>('/sending/api-keys', options);
  }

  /**
   * Creates a new scoped sending API key.
   * Note: The secret API key string (`apiKey`) is only returned once in the response.
   */
  public async create(request: CreateApiKeyRequest, options?: RequestOptions): Promise<CreateApiKeyResponse> {
    return this.http.post<CreateApiKeyResponse>('/sending/api-keys', request, options);
  }

  /**
   * Regenerates a sending API key secret, revoking the previous one.
   */
  public async regenerate(keyId: string, options?: RequestOptions): Promise<CreateApiKeyResponse> {
    return this.http.post<CreateApiKeyResponse>(
      `/sending/api-keys/${encodeURIComponent(keyId)}/regenerate`,
      {},
      options
    );
  }

  /**
   * Permanently revokes a sending API key.
   */
  public async revoke(keyId: string, options?: RequestOptions): Promise<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `/sending/api-keys/${encodeURIComponent(keyId)}/revoke`,
      {},
      options
    );
  }
}
