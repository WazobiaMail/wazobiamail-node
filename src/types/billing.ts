/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse, Pagination } from './common.js';

export interface InvoiceRecord {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | string;
  purpose: string;
  metadata?: Record<string, unknown>;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export type InvoiceListResponse = WazobiaApiResponse<{
  items: InvoiceRecord[];
  pagination?: Pagination;
}>;

export interface UnitsSummary {
  includedAllowance: number;
  includedUsed: number;
  includedRemaining: number;
  purchasedBalance: number;
  unlimited: boolean;
  canBuyCredits: boolean;
}

export type UnitsSummaryResponse = WazobiaApiResponse<UnitsSummary>;

export interface UnitLedgerEntry {
  id: string;
  delta: number;
  balanceAfter: number;
  reason: string;
  reference?: string;
  createdAt: string;
}

export interface LedgerQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export type UnitLedgerResponse = WazobiaApiResponse<{
  items: UnitLedgerEntry[];
  pagination: Pagination;
}>;

export interface UnitPack {
  id: string;
  name: string;
  description?: string;
  units: number;
  priceNgnMinor: number;
  priceUsdMinor: number;
  isActive: boolean;
  sortOrder: number;
}

export type UnitPacksResponse = WazobiaApiResponse<{ items: UnitPack[] }>;

export interface PurchaseUnitsRequest {
  packId: string;
  currency: string;
}

export interface PurchaseUnitsData {
  invoice?: InvoiceRecord;
  invoiceId?: string;
  paymentUrl?: string;
}

export type PurchaseUnitsResponse = WazobiaApiResponse<PurchaseUnitsData>;

export interface SubscriptionPlanSummary {
  id: string;
  name: string;
  usdPrice?: number;
  nairaPrice?: number;
  monthlyQuota?: number;
}

export interface SubscriptionRecord {
  id: string;
  accountId: number;
  planId: string;
  status: string;
  startDate: string;
  endDate?: string | null;
  autoRenew: boolean;
  billingInterval: string;
  plan?: SubscriptionPlanSummary;
}

export type SubscriptionResponse = WazobiaApiResponse<{
  subscription: SubscriptionRecord | null;
}>;

export interface CurrencyData {
  currency: 'NGN' | 'USD' | string;
  countryCode?: string;
}

export type CurrencyResponse = WazobiaApiResponse<CurrencyData>;
