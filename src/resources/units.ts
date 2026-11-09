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
  UnitsSummaryResponse,
  LedgerQueryParams,
  UnitLedgerResponse,
  UnitPacksResponse,
  PurchaseUnitsRequest,
  PurchaseUnitsResponse,
} from '../types/index.js';

export class UnitsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves the current email unit/credits balance.
   */
  public async getSummary(options?: RequestOptions): Promise<UnitsSummaryResponse> {
    return this.http.get<UnitsSummaryResponse>('/units/summary', options);
  }

  /**
   * Lists the ledger history of unit purchases, usage, and refunds.
   */
  public async getLedger(params?: LedgerQueryParams, options?: RequestOptions): Promise<UnitLedgerResponse> {
    return this.http.get<UnitLedgerResponse>('/units/ledger', {
      ...options,
      params: { ...params, ...options?.params },
    });
  }

  /**
   * Lists available email unit credit purchase packs.
   */
  public async getPacks(options?: RequestOptions): Promise<UnitPacksResponse> {
    return this.http.get<UnitPacksResponse>('/units/packs', options);
  }

  /**
   * Purchases an email credit pack and generates an invoice.
   */
  public async purchase(request: PurchaseUnitsRequest, options?: RequestOptions): Promise<PurchaseUnitsResponse> {
    return this.http.post<PurchaseUnitsResponse>('/units/purchases', request, options);
  }
}
