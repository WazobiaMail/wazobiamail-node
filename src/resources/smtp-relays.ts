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
  SmtpRelayListResponse,
  SmtpRelayResponse,
  CreateSmtpRelayRequest,
  UpdateSmtpRelayRequest,
  SuccessResponse,
} from '../types/index.js';

export class SmtpRelaysResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Lists customer SMTP relays.
   */
  public async list(options?: RequestOptions): Promise<SmtpRelayListResponse> {
    return this.http.get<SmtpRelayListResponse>('/smtp-relays', options);
  }

  /**
   * Reads an SMTP relay by its ID.
   */
  public async get(id: string, options?: RequestOptions): Promise<SmtpRelayResponse> {
    return this.http.get<SmtpRelayResponse>(`/smtp-relays/${encodeURIComponent(id)}`, options);
  }

  /**
   * Adds a new customer SMTP relay configuration.
   */
  public async create(request: CreateSmtpRelayRequest, options?: RequestOptions): Promise<SmtpRelayResponse> {
    return this.http.post<SmtpRelayResponse>('/smtp-relays', request, options);
  }

  /**
   * Updates an existing SMTP relay.
   */
  public async update(
    id: string,
    request: UpdateSmtpRelayRequest,
    options?: RequestOptions
  ): Promise<SmtpRelayResponse> {
    return this.http.patch<SmtpRelayResponse>(`/smtp-relays/${encodeURIComponent(id)}`, request, options);
  }

  /**
   * Removes an SMTP relay.
   */
  public async delete(id: string, options?: RequestOptions): Promise<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`/smtp-relays/${encodeURIComponent(id)}`, options);
  }
}
