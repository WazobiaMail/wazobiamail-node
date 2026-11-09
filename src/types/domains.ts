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
  recordType: 'TXT' | 'MX' | 'CNAME' | 'A' | 'AAAA' | string;
  name: string;
  value: string;
  priority?: number;
  ttl?: number;
  status: 'valid' | 'pending' | 'failed' | string;
}

export interface SendingDomain {
  id: string;
  domain: string;
  isDefault: boolean;
  verified: boolean;
  status: string;
  mailMode?: 'hosted' | 'sending_only' | string;
  useRootDomain?: boolean;
  sendingSubdomain?: string;
  dnsRecords?: DnsRecord[];
  createdAt: string;
  updatedAt: string;
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

export type DomainListResponse = WazobiaApiResponse<SendingDomain[]>;
export type DomainResponse = WazobiaApiResponse<SendingDomain>;

export interface DnsRecordsData {
  domain: string;
  records: DnsRecord[];
}

export type DnsRecordsResponse = WazobiaApiResponse<DnsRecordsData>;

export interface VerifyDomainData {
  verified: boolean;
  records: DnsRecord[];
  domain: SendingDomain;
}

export type VerifyDomainResponse = WazobiaApiResponse<VerifyDomainData>;

export interface CloudflareStatusData {
  connected: boolean;
  zoneId?: string;
  domain?: string;
}

export type CloudflareStatusResponse = WazobiaApiResponse<CloudflareStatusData>;

export interface CloudflareConnectData {
  authUrl: string;
}

export type CloudflareConnectResponse = WazobiaApiResponse<CloudflareConnectData>;

export interface CloudflareSyncRequest {
  domainId: string;
}

export interface CloudflareSyncData {
  synced: boolean;
  recordsCount: number;
}

export type CloudflareSyncResponse = WazobiaApiResponse<CloudflareSyncData>;

export interface DnsProviderData {
  provider: string;
  detected: boolean;
  nameservers?: string[];
}

export type DnsProviderResponse = WazobiaApiResponse<DnsProviderData>;
