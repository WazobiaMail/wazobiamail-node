/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface Mailbox {
  id: string;
  domainId: string;
  address: string;
  localPart: string;
  displayName?: string | null;
  status: string;
  isPlatformSubdomain?: boolean;
  autoProvisioned?: boolean;
  role?: 'general' | 'admin' | string;
  createdAt: string;
  updatedAt: string;
}

export interface MailboxCredential {
  id: string;
  mailboxId: string;
  username: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
}

export interface CreateMailboxRequest {
  domainId: string;
  localPart: string;
  displayName?: string;
  password?: string;
  quotaMb?: number;
  role?: 'general' | 'admin' | string;
  status?: 'active' | 'suspended' | string;
}

export interface UpdateMailboxRequest {
  displayName?: string;
  password?: string;
}

/** The create endpoint returns the provisioned mailbox record. */
export type CreateMailboxData = Mailbox;

export interface CreatedMailboxCredential {
  credential: MailboxCredential;
  /** Plaintext password, returned only once. */
  password: string;
}

export type CreateCredentialsData = {
  credential: CreatedMailboxCredential;
};

export interface SmtpClientSettings {
  host: string;
  port: number;
  implicitTlsPort?: number;
  security: string;
  accessEnabled?: boolean;
  configured?: boolean;
  enabled?: boolean;
}

export interface MailboxConnectionSettings {
  mailboxId: string;
  domainId: string;
  username: string;
  status: string;
  smtp: SmtpClientSettings;
  imap: { host: string; port: number; security: string };
  pop3: { host: string; port: number; security: string };
  authentication: string;
  passwordHint?: string;
}

export interface MailboxStoragePlan {
  mailboxLimit: number;
  baseMailboxLimit: number;
  additionalMailboxLimit: number;
  mailboxesUsed: number;
  mailboxRemaining: number | null;
  storageTotalBytes: number | null;
  storageAllocatedBytes: number;
  [key: string]: unknown;
}

export interface MailboxStorageUsage {
  mailboxes: Array<Record<string, unknown>>;
  customers: Array<Record<string, unknown>>;
  domains: Array<Record<string, unknown>>;
  measurement: string;
  plan: MailboxStoragePlan;
}

export interface EmailAddress {
  name?: string | null;
  email: string;
}

export interface AttachmentMetadata {
  id?: string;
  blobId?: string;
  name?: string;
  fileName?: string;
  type?: string;
  contentType?: string;
  sizeBytes: number;
}

export interface MailboxMessageSummary {
  id: string;
  threadId?: string | null;
  subject: string | null;
  preview?: string | null;
  from: EmailAddress[];
  to: EmailAddress[];
  receivedAt: string | null;
  isUnread: boolean;
  hasAttachments: boolean;
  sizeBytes: number;
}

export interface MailboxMessageDetail extends MailboxMessageSummary {
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  replyTo?: EmailAddress[];
  htmlBody?: string | null;
  textBody?: string | null;
  attachments: AttachmentMetadata[];
}

export interface ListMailboxMessagesParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  search?: string;
}

export type MailboxListResponse = WazobiaApiResponse<Mailbox[]>;
export type MailboxResponse = WazobiaApiResponse<Mailbox>;
export type CreateMailboxResponse = WazobiaApiResponse<Mailbox>;
export type MailboxStorageResponse = WazobiaApiResponse<MailboxStorageUsage>;
export type MailboxConnectionResponse = WazobiaApiResponse<MailboxConnectionSettings>;
export type CreateCredentialsResponse = WazobiaApiResponse<CreateCredentialsData>;
export type RotateCredentialsResponse = WazobiaApiResponse<CreateCredentialsData>;

export type MailboxMessagesListResponse = WazobiaApiResponse<{
  items: MailboxMessageSummary[];
  total: number;
  page: number;
  limit: number;
}>;

export type MailboxMessageDetailResponse = WazobiaApiResponse<MailboxMessageDetail>;
