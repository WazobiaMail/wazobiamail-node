/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface SmtpAccessData {
  enabled: boolean;
  eligible: boolean;
  status: string;
}

export interface UpdateSmtpAccessRequest {
  enabled: boolean;
}

export type SmtpAccessResponse = WazobiaApiResponse<SmtpAccessData>;
