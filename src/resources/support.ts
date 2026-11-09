/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestOptions } from '../http.js';
import { CreateSupportTicketRequest, SupportTicketResponse } from '../types/index.js';

export class SupportResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Opens a customer support ticket.
   */
  public async createTicket(
    request: CreateSupportTicketRequest,
    options?: RequestOptions
  ): Promise<SupportTicketResponse> {
    return this.http.post<SupportTicketResponse>('/support', request, options);
  }
}
