/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface SupportUpload {
  filename: string;
  /** Base64-encoded file bytes (max 5 MiB per file, 10 MiB per message). */
  data: string;
}

export interface CreateSupportTicketRequest {
  subject: string;
  message: string;
  /** Optional; resolved from GET /auth/me when omitted. */
  name?: string;
  /** Optional; resolved from GET /auth/me when omitted. */
  email?: string;
  priority?: 'low' | 'medium' | 'high' | string;
  category?: string;
  domain?: string;
  attachments?: SupportUpload[];
}

export interface SupportTicketData {
  id: string;
  ticketId: string;
}

export type SupportTicketResponse = WazobiaApiResponse<SupportTicketData>;
