/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface CreateSupportTicketRequest {
  subject: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | string;
  category?: string;
}

export interface SupportTicketData {
  id: string;
  ticketNumber: string;
  status: string;
  subject: string;
  createdAt: string;
}

export type SupportTicketResponse = WazobiaApiResponse<SupportTicketData>;
