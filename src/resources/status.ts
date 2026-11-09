/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestOptions } from '../http.js';
import { AccountStatusResponse } from '../types/index.js';

export class StatusResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves account health, subscription tier, and service availability status.
   */
  public async get(options?: RequestOptions): Promise<AccountStatusResponse> {
    return this.http.get<AccountStatusResponse>('/status', options);
  }
}
