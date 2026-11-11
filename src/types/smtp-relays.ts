/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface SmtpRelayRecord {
  id: string;
  accountId: number;
  name: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpSecurity: 'none' | 'starttls' | 'ssl_tls' | string;
  status: 'active' | 'inactive' | string;
  isDefault: boolean;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSmtpRelayRequest {
  name: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpSecurity: 'none' | 'starttls' | 'ssl_tls';
  isDefault?: boolean;
  status?: 'active' | 'inactive';
}

export interface UpdateSmtpRelayRequest {
  name?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpSecurity?: 'none' | 'starttls' | 'ssl_tls';
  isDefault?: boolean;
  status?: 'active' | 'inactive';
}

export type SmtpRelayListResponse = WazobiaApiResponse<{ smtpRelays: SmtpRelayRecord[] }>;
export type SmtpRelayResponse = WazobiaApiResponse<SmtpRelayRecord>;
