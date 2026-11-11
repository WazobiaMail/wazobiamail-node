/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface DnsRecord {
  id?: string;
  recordType: 'TXT' | 'MX' | 'CNAME' | 'A' | 'AAAA' | string;
  host?: string;
  name?: string;
  value: string;
  priority?: number;
  ttl?: number;
  status: 'valid' | 'pending' | 'failed' | string;
  lastCheckedAt?: string | null;
}

export interface SendingDomain {
  id: string;
  accountId?: number;
  domain: string;
  requestedDomain?: string | null;
  verificationStatus: 'verified' | 'pending' | 'failed' | string;
  isDefault: boolean;
  domainRole?: 'primary' | 'sending' | string;
  parentDomainId?: string | null;
  createDefaultInboxes?: boolean;
  mailMode?: 'hosted' | 'sending_only' | string;
  createdAt: string;
  updatedAt?: string;
  /** Legacy convenience flags; prefer verificationStatus. */
  verified?: boolean;
  status?: string;
}

export interface CreateDomainRequest {
  /**
   * Domain name to register (e.g. `mail.example.com` or `example.com`).
   */
  domain: string;
  isDefault?: boolean;
  useRootDomain?: boolean;
  hostInboxesOnMainDomain?: boolean;
  sendingSubdomain?: string;
  mailMode?: 'hosted' | 'sending_only';
}

export interface UpdateDomainRequest {
  domain?: string;
  isDefault?: boolean;
  useRootDomain?: boolean;
  mailMode?: 'hosted' | 'sending_only';
}

export interface VerifyDomainRequest {
  force?: boolean;
}

export type DomainListResponse = WazobiaApiResponse<{ items: SendingDomain[] }>;
export type DomainResponse = WazobiaApiResponse<{ domain: SendingDomain }>;

export interface DomainDnsPayload {
  provisioning: boolean;
  domainId: string;
  domain: string;
  verificationStatus: string;
  records: DnsRecord[];
  copyBlock: string;
}

export type DnsRecordsResponse = WazobiaApiResponse<{ domain: DomainDnsPayload }>;

export interface DomainVerificationCheck {
  recordType: string;
  host: string;
  expectedValue: string;
  matched: boolean;
  observedValues: string[];
}

export interface DomainVerificationData {
  domainId: string;
  domain: string;
  verificationStatus: string;
  verifiedCount: number;
  pendingCount: number;
  checks: DomainVerificationCheck[];
}

export type VerifyDomainResponse = WazobiaApiResponse<{ verification: DomainVerificationData }>;

export interface CloudflareStatusData {
  connected: boolean;
  zoneId?: string;
  domain?: string;
}

export type CloudflareStatusResponse = WazobiaApiResponse<CloudflareStatusData>;

export interface CloudflareConnectData {
  authorizationUrl: string;
  authUrl?: string;
}

export type CloudflareConnectResponse = WazobiaApiResponse<CloudflareConnectData>;

export interface CloudflareSyncRequest {
  domainId: string;
}

export interface CloudflareSyncData {
  zone?: string;
  added?: number;
  updated?: number;
  records?: number;
  verificationStatus?: string;
  receivingReady?: boolean;
  dmarcReady?: boolean;
  verifiedCount?: number;
  pendingCount?: number;
  note?: string;
}

export type CloudflareSyncResponse = WazobiaApiResponse<CloudflareSyncData & Record<string, unknown>>;

export interface DnsProviderData {
  provider: string;
  detected: boolean;
  nameservers?: string[];
}

export type DnsProviderResponse = WazobiaApiResponse<DnsProviderData>;
