/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface PlanRecord {
  id: string;
  name: string;
  usdPrice: number;
  nairaPrice: number;
  yearlyUsdPrice?: number | null;
  yearlyNairaPrice?: number | null;
  intervalPrices?: Record<string, unknown>;
  hourlyQuota: number;
  dailyQuota: number;
  monthlyQuota: number;
  sendRateLimitPerMinute: number;
  dataRetentionDays: number;
  features: Record<string, unknown>;
  limits: Record<string, unknown>;
  overageUsdPer1000: number;
  dedicatedIpAddonUsd: number;
  status: string;
}

export type PlansResponse = WazobiaApiResponse<{
  items: PlanRecord[];
  pagination: import('./common.js').Pagination;
}>;

export interface EffectiveLimits {
  accountId: number;
  planId: string;
  sendRateLimitPerMinute: number;
  mailboxOpsPerMinute: number;
  mailboxLimit: number;
  baseMailboxLimit: number;
  additionalMailboxLimit: number;
  customDomainSendingEnabled: boolean;
  domainLimit: number;
  receivingEnabled: boolean;
  mailboxStorageGb: number;
}

export type EffectiveLimitsResponse = WazobiaApiResponse<{ limits: EffectiveLimits }>;
