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
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | string;
  product: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export type InvoiceListResponse = WazobiaApiResponse<{
  items: InvoiceRecord[];
  pagination?: Pagination;
}>;

export interface UnitsSummary {
  balance: number;
  lifetimePurchased: number;
  lifetimeUsed: number;
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
  units: number;
  priceNgn: number;
  priceUsd: number;
}

export type UnitPacksResponse = WazobiaApiResponse<UnitPack[]>;

export interface PurchaseUnitsRequest {
  packId: string;
  currency: string;
}

export interface PurchaseUnitsData {
  invoiceId: string;
  paymentUrl?: string;
}

export type PurchaseUnitsResponse = WazobiaApiResponse<PurchaseUnitsData>;

export interface SubscriptionRecord {
  id: string;
  planId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  currency: string;
}

export type SubscriptionResponse = WazobiaApiResponse<SubscriptionRecord | null>;

export interface CurrencyData {
  currency: 'NGN' | 'USD' | string;
  countryCode?: string;
}

export type CurrencyResponse = WazobiaApiResponse<CurrencyData>;
