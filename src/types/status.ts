/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface AccountStatusData {
  status: string;
  accountId: string;
  planId: string;
  planTier: string;
  email: string;
  verified: boolean;
  createdAt: string;
}

export type AccountStatusResponse = WazobiaApiResponse<AccountStatusData>;
