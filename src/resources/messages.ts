/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestOptions } from '../http.js';
import {
  SendMessageRequest,
  SendMessageResponse,
  SendMessageContent,
  AttachmentUploadResponse,
  FileAttachment,
  SpamCheckRequest,
  SpamCheckResponse,
  ListTrackingMessagesParams,
  TrackingMessagesResponse,
  TrackingMessageDetailResponse,
} from '../types/index.js';

export class MessagesResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a transactional email message.
   *
   * @example
   * ```typescript
   * const response = await client.messages.send({
   *   from: 'Acme Store <hello@mail.example.com>',
   *   to: 'customer@example.com',
   *   subject: 'Your order has shipped!',
   *   html: '<p>Thank you for shopping with us.</p>',
   * });
   * console.log(response.data.result.trackingId);
   * ```
   */
  public async send(request: SendMessageRequest, options?: RequestOptions): Promise<SendMessageResponse> {
    const payload = this.normalizeSendPayload(request);
    return this.http.post<SendMessageResponse>('/sending/messages', payload, options);
  }

  /**
   * Performs pre-flight deliverability and spam analysis on an email draft.
   */
  public async spamCheck(request: SpamCheckRequest, options?: RequestOptions): Promise<SpamCheckResponse> {
    return this.http.post<SpamCheckResponse>('/sending/spam-check', request, options);
  }

  /**
   * Uploads an attachment to the secure CDN for inclusion in email messages.
   */
  public async uploadAttachment(
    file: Blob | Uint8Array | string | FileAttachment,
    fileName?: string,
    options?: RequestOptions
  ): Promise<AttachmentUploadResponse> {
    const formData = new FormData();

    if (file && typeof file === 'object' && 'content' in file) {
      const fileAttachment = file as FileAttachment;
      const blob = fileAttachment.content instanceof Blob
        ? fileAttachment.content
        : new Blob([fileAttachment.content as any], { type: fileAttachment.contentType || 'application/octet-stream' });
      formData.append('file', blob, fileAttachment.fileName);
    } else if (file instanceof Blob) {
      formData.append('file', file, fileName || 'attachment.dat');
    } else if (typeof file === 'string' || file instanceof Uint8Array) {
      const blob = new Blob([file as any], { type: 'application/octet-stream' });
      formData.append('file', blob, fileName || 'attachment.dat');
    } else {
      throw new Error('Invalid file format provided for attachment upload.');
    }

    return this.http.postMultipart<AttachmentUploadResponse>('/sending/attachments/upload', formData, options);
  }

  /**
   * Sends an email with embedded direct binary/multipart attachments.
   */
  public async sendWithAttachments(
    request: SendMessageRequest,
    attachments: FileAttachment[],
    options?: RequestOptions
  ): Promise<SendMessageResponse> {
    const payload = this.normalizeSendPayload(request);
    const formData = new FormData();

    formData.append('message', JSON.stringify(payload));

    for (const attachment of attachments) {
      const blob = attachment.content instanceof Blob
        ? attachment.content
        : new Blob([attachment.content as any], { type: attachment.contentType || 'application/octet-stream' });
      formData.append('attachments', blob, attachment.fileName);
    }

    return this.http.postMultipart<SendMessageResponse>('/sending/messages/with-attachments', formData, options);
  }

  /**
   * Lists tracked outgoing messages along with open and click counters.
   */
  public async listTracked(
    params?: ListTrackingMessagesParams,
    options?: RequestOptions
  ): Promise<TrackingMessagesResponse> {
    return this.http.get<TrackingMessagesResponse>('/sending/tracking/messages', {
      ...options,
      params: { ...params, ...options?.params },
    });
  }

  /**
   * Retrieves full delivery events (opens, clicks, timestamps) for a tracked message.
   */
  public async getTracked(
    trackingId: string,
    options?: RequestOptions
  ): Promise<TrackingMessageDetailResponse> {
    return this.http.get<TrackingMessageDetailResponse>(
      `/sending/tracking/messages/${encodeURIComponent(trackingId)}`,
      options
    );
  }

  /**
   * Normalizes ergonomic shorthand inputs into the canonical API contract.
   */
  private normalizeSendPayload(request: SendMessageRequest): Record<string, unknown> {
    // Determine recipients
    let to: string[] = [];
    if (Array.isArray(request.to)) {
      to = [...request.to];
    } else if (typeof request.to === 'string') {
      to = [request.to];
    } else if (Array.isArray(request.recipients)) {
      to = [...request.recipients];
    } else if (typeof request.recipients === 'string') {
      to = [request.recipients];
    }

    let cc: string[] = [];
    if (Array.isArray(request.cc)) {
      cc = [...request.cc];
    } else if (typeof request.cc === 'string') {
      cc = [request.cc];
    }

    let bcc: string[] = [];
    if (Array.isArray(request.bcc)) {
      bcc = [...request.bcc];
    } else if (typeof request.bcc === 'string') {
      bcc = [request.bcc];
    }

    // Determine content
    const content: SendMessageContent = {
      subject: request.content?.subject || request.subject || '',
      from: request.content?.from || request.from,
      htmlBody: request.content?.htmlBody || request.content?.html_body || request.html || request.htmlBody,
      textBody: request.content?.textBody || request.content?.text_body || request.text || request.textBody,
      replyTo: request.content?.replyTo || request.content?.reply_to || request.replyTo,
    };

    const payload: Record<string, unknown> = {
      to,
      cc,
      bcc,
      content,
    };

    if (request.envelopeSender || request.envelope_sender) {
      payload.envelopeSender = request.envelopeSender || request.envelope_sender;
    }

    if (request.attachments && request.attachments.length > 0) {
      payload.attachments = request.attachments;
    }

    return payload;
  }
}
