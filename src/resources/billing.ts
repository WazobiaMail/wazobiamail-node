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
  InvoiceListResponse,
  SubscriptionResponse,
  CurrencyResponse,
} from '../types/index.js';

export class BillingResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Lists customer billing invoices.
   */
  public async listInvoices(options?: RequestOptions): Promise<InvoiceListResponse> {
    return this.http.get<InvoiceListResponse>('/billing/invoices', options);
  }

  /**
   * Downloads a generated invoice PDF as an ArrayBuffer.
   */
  public async downloadInvoice(invoiceId: string, options?: RequestOptions): Promise<ArrayBuffer> {
    return this.http.getBinary(`/billing/invoices/${encodeURIComponent(invoiceId)}/download`, options);
  }

  /**
   * Retrieves the current account's active subscription.
   */
  public async getCurrentSubscription(product?: string, options?: RequestOptions): Promise<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>('/subscriptions/current', {
      ...options,
      params: product ? { product, ...options?.params } : options?.params,
    });
  }

  /**
   * Detects the user's localized billing currency (NGN or USD).
   */
  public async detectCurrency(currency?: string, options?: RequestOptions): Promise<CurrencyResponse> {
    return this.http.get<CurrencyResponse>('/payments/currency', {
      ...options,
      params: currency ? { currency, ...options?.params } : options?.params,
    });
  }
}
