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
  CreateSupportTicketRequest,
  SupportTicketResponse,
  WazobiaApiResponse,
} from '../types/index.js';

interface CurrentAccountData {
  name?: string | null;
  username?: string | null;
  email?: string | null;
}

export class SupportResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Opens a customer support ticket.
   *
   * The API requires a name and email. When they are omitted, the SDK reads
   * them from `GET /auth/me` so authenticated callers only supply the ticket
   * content.
   */
  public async createTicket(
    request: CreateSupportTicketRequest,
    options?: RequestOptions
  ): Promise<SupportTicketResponse> {
    let name = request.name;
    let email = request.email;

    if (!name || !email) {
      const me = await this.http.get<WazobiaApiResponse<CurrentAccountData>>('/auth/me', options);
      name = name || me.data?.name || me.data?.username || me.data?.email || undefined;
      email = email || me.data?.email || undefined;
    }

    if (!name || !email) {
      throw new Error(
        'A support ticket needs a name and email. Pass them explicitly when using an unauthenticated client.'
      );
    }

    return this.http.post<SupportTicketResponse>(
      '/support',
      {
        name,
        email,
        subject: request.subject,
        message: request.message,
        category: request.category ?? 'general',
        priority: request.priority ?? 'normal',
        ...(request.domain ? { domain: request.domain } : {}),
      },
      options
    );
  }
}
