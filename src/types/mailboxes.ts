/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse, Pagination } from './common.js';

export interface Mailbox {
  id: string;
  domainId: string;
  email: string;
  localPart: string;
  displayName?: string;
  storageUsageBytes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MailboxCredential {
  id: string;
  username: string;
  password?: string;
  createdAt: string;
}

export interface CreateMailboxRequest {
  domainId: string;
  localPart: string;
  displayName?: string;
  password?: string;
}

export interface UpdateMailboxRequest {
  displayName?: string;
  password?: string;
}

export interface CreateMailboxData {
  mailbox: Mailbox;
  credential?: MailboxCredential;
}

export interface MailboxConnectionSettings {
  imapHost: string;
  imapPort: number;
  imapSecurity: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecurity: string;
  webmailUrl?: string;
}

export interface MailboxStorageUsage {
  totalBytes: number;
  quotaBytes: number;
  percentUsed: number;
  mailboxesCount: number;
}

export interface EmailAddress {
  name?: string;
  email: string;
}

export interface AttachmentMetadata {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface MailboxMessageSummary {
  id: string;
  messageId: string;
  subject: string;
  from: string | EmailAddress;
  to: (string | EmailAddress)[];
  date: string;
  isRead: boolean;
  hasAttachments: boolean;
  sizeBytes: number;
}

export interface MailboxMessageDetail extends MailboxMessageSummary {
  htmlBody?: string;
  textBody?: string;
  headers: Record<string, string>;
  attachments: AttachmentMetadata[];
}

export interface ListMailboxMessagesParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export type MailboxListResponse = WazobiaApiResponse<Mailbox[]>;
export type MailboxResponse = WazobiaApiResponse<Mailbox>;
export type CreateMailboxResponse = WazobiaApiResponse<CreateMailboxData>;
export type MailboxStorageResponse = WazobiaApiResponse<MailboxStorageUsage>;
export type MailboxConnectionResponse = WazobiaApiResponse<MailboxConnectionSettings>;
export type CreateCredentialsResponse = WazobiaApiResponse<MailboxCredential>;
export type RotateCredentialsResponse = WazobiaApiResponse<MailboxCredential>;

export type MailboxMessagesListResponse = WazobiaApiResponse<{
  items: MailboxMessageSummary[];
  pagination?: Pagination;
  total?: number;
  page?: number;
  limit?: number;
}>;

export type MailboxMessageDetailResponse = WazobiaApiResponse<MailboxMessageDetail>;
