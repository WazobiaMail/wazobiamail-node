/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { WazobiaApiResponse } from './common.js';

export interface UrlAttachment {
  /**
   * Public HTTPS URL where the file can be downloaded.
   */
  url: string;
  /**
   * Filename shown to email recipients (e.g. `invoice.pdf`).
   */
  fileName: string;
}

export interface FileAttachment {
  /**
   * Binary or string content of the attachment.
   */
  content: Blob | Uint8Array | string;
  /**
   * Filename with extension (e.g. `document.pdf`).
   */
  fileName: string;
  /**
   * MIME content type (e.g. `application/pdf`).
   */
  contentType?: string;
}

export interface SendMessageContent {
  /**
   * Email subject line.
   */
  subject: string;
  /**
   * Sender identity (e.g. `Acme Store <hello@example.com>` or `hello@example.com`).
   */
  from?: string;
  /**
   * Plain-text body of the email.
   */
  textBody?: string;
  text_body?: string;
  /**
   * HTML body of the email.
   */
  htmlBody?: string;
  html_body?: string;
  /**
   * Reply-To address (e.g. `Support <support@example.com>`).
   */
  replyTo?: string;
  reply_to?: string;
}

export interface SendMessageRequest {
  /**
   * Primary recipient email addresses.
   */
  to?: string | string[];
  recipients?: string | string[];
  /**
   * Carbon copy recipients.
   */
  cc?: string | string[];
  /**
   * Blind carbon copy recipients.
   */
  bcc?: string | string[];
  /**
   * Optional custom envelope bounce sender address.
   */
  envelopeSender?: string;
  envelope_sender?: string;
  /**
   * Explicit content structure.
   */
  content?: SendMessageContent;
  /**
   * Ergonomic shorthand for content.subject.
   */
  subject?: string;
  /**
   * Ergonomic shorthand for content.from.
   */
  from?: string;
  /**
   * Ergonomic shorthand for content.htmlBody.
   */
  html?: string;
  htmlBody?: string;
  /**
   * Ergonomic shorthand for content.textBody.
   */
  text?: string;
  textBody?: string;
  /**
   * Ergonomic shorthand for content.replyTo.
   */
  replyTo?: string;
  /**
   * URL attachments (maximum 10, combined size <= 5MB).
   */
  attachments?: UrlAttachment[];
}

export interface SendMessageResult {
  status: 'queued' | string;
  trackingId: string;
  recipients: number;
}

export type SendMessageResponse = WazobiaApiResponse<{
  result: SendMessageResult;
}>;

export interface AttachmentUploadResult {
  url: string;
  fileName: string;
  sizeBytes: number;
  contentType?: string;
}

export type AttachmentUploadResponse = WazobiaApiResponse<AttachmentUploadResult>;

export interface SpamRuleFinding {
  rule: string;
  score: number;
  description: string;
}

export interface SpamCheckRequest {
  subject: string;
  htmlBody?: string;
  textBody?: string;
}

export interface SpamCheckData {
  score: number;
  threshold: number;
  deliverabilityScore: number;
  findings: SpamRuleFinding[];
  recommendations: string[];
}

export type SpamCheckResponse = WazobiaApiResponse<SpamCheckData>;

export interface TrackingMessageSummary {
  trackingId: string;
  subject: string;
  from: string;
  recipientsCount: number;
  opensCount: number;
  clicksCount: number;
  status: string;
  sentAt: string;
}

export interface TrackingEvent {
  id: string;
  eventType: 'open' | 'click' | 'delivery' | 'bounce' | string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  url?: string;
}

export interface TrackingMessageDetail extends TrackingMessageSummary {
  events: TrackingEvent[];
}

export interface ListTrackingMessagesParams {
  limit?: number;
  offset?: number;
  status?: string;
}

export type TrackingMessagesResponse = WazobiaApiResponse<{
  items: TrackingMessageSummary[];
  total: number;
}>;

export type TrackingMessageDetailResponse = WazobiaApiResponse<TrackingMessageDetail>;
