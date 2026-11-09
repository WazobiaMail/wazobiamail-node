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
  slug: string;
  monthlyPriceNgn: number;
  monthlyPriceUsd: number;
  yearlyPriceNgn?: number;
  yearlyPriceUsd?: number;
  features: string[];
  maxDomains: number;
  maxMailboxes: number;
  mailboxStorageGb: number;
  sendingQuotaHourly: number;
  sendingQuotaDaily: number;
}

export type PlansResponse = WazobiaApiResponse<PlanRecord[]>;

export interface EffectiveLimits {
  planId: string;
  planName: string;
  canSend: boolean;
  canReceive: boolean;
  domainsLimit: number;
  mailboxesLimit: number;
  hourlySendLimit: number;
  dailySendLimit: number;
  storageQuotaBytes: number;
  enterpriseInboxAllowed: boolean;
}

export type EffectiveLimitsResponse = WazobiaApiResponse<EffectiveLimits>;
