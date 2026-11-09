/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestOptions } from '../http.js';
import { PlansResponse, EffectiveLimitsResponse } from '../types/index.js';

export class PlansResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Lists all public subscription plans and pricing.
   */
  public async list(options?: RequestOptions): Promise<PlansResponse> {
    return this.http.get<PlansResponse>('/plans', options);
  }

  /**
   * Resolves effective sending, domain, and mailbox limits for the authenticated account.
   */
  public async getEffectiveLimits(options?: RequestOptions): Promise<EffectiveLimitsResponse> {
    return this.http.get<EffectiveLimitsResponse>('/plans/effective', options);
  }
}
