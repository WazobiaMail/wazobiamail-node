/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface AccountStatusPlan {
  id: string;
  name: string;
  status: string;
  billingInterval: string;
  startDate?: string | null;
  endDate?: string | null;
  autoRenew: boolean;
}

export interface AccountStatusUnits {
  monthlyAllocation: number;
  subscriptionUsed: number;
  subscriptionRemaining: number;
  purchasedBalance: number;
  totalRemaining: number;
  unlimited: boolean;
}

export interface AccountStatusData {
  plan: AccountStatusPlan;
  units: AccountStatusUnits;
}

export type AccountStatusResponse = WazobiaApiResponse<AccountStatusData>;
