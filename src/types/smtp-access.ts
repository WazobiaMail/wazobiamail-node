/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface SmtpAccessConnection {
  host: string;
  port: number;
  security: string;
  usernames: string[];
}

export interface SmtpAccessData {
  paid: boolean;
  eligible: boolean;
  enabled: boolean;
  persona?: string | null;
  configured: boolean;
  connection?: SmtpAccessConnection | null;
}

export interface UpdateSmtpAccessRequest {
  enabled: boolean;
}

export type SmtpAccessResponse = WazobiaApiResponse<SmtpAccessData>;
export type UpdateSmtpAccessResponse = WazobiaApiResponse<{ enabled: boolean }>;
