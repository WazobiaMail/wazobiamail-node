/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestOptions } from '../http.js';
import { SmtpAccessResponse, UpdateSmtpAccessRequest } from '../types/index.js';

export class SmtpAccessResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Reads the current account's SMTP access configuration and eligibility state.
   */
  public async get(options?: RequestOptions): Promise<SmtpAccessResponse> {
    return this.http.get<SmtpAccessResponse>('/sending/smtp-access', options);
  }

  /**
   * Enables or disables SMTP relay access for the account.
   */
  public async update(request: UpdateSmtpAccessRequest, options?: RequestOptions): Promise<SmtpAccessResponse> {
    return this.http.put<SmtpAccessResponse>('/sending/smtp-access', request, options);
  }
}
