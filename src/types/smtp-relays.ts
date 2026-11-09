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
  name: string;
  host: string;
  port: number;
  username: string;
  tlsMode: 'starttls' | 'tls' | 'none' | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSmtpRelayRequest {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  tlsMode?: 'starttls' | 'tls' | 'none' | string;
}

export interface UpdateSmtpRelayRequest {
  name?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  tlsMode?: 'starttls' | 'tls' | 'none' | string;
  isActive?: boolean;
}

export type SmtpRelayListResponse = WazobiaApiResponse<SmtpRelayRecord[]>;
export type SmtpRelayResponse = WazobiaApiResponse<SmtpRelayRecord>;
