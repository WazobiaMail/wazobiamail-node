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
  MailboxListResponse,
  MailboxResponse,
  CreateMailboxRequest,
  CreateMailboxResponse,
  UpdateMailboxRequest,
  MailboxStorageResponse,
  MailboxConnectionResponse,
  CreateCredentialsResponse,
  RotateCredentialsResponse,
  ListMailboxMessagesParams,
  MailboxMessagesListResponse,
  MailboxMessageDetailResponse,
  SuccessResponse,
} from '../types/index.js';

export class MailboxMessagesSubResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Lists received emails in a hosted mailbox inbox (Enterprise plan required).
   */
  public async list(
    mailboxId: string,
    params?: ListMailboxMessagesParams,
    options?: RequestOptions
  ): Promise<MailboxMessagesListResponse> {
    return this.http.get<MailboxMessagesListResponse>(
      `/mailboxes/${encodeURIComponent(mailboxId)}/messages`,
      {
        ...options,
        params: { ...params, ...options?.params },
      }
    );
  }

  /**
   * Reads full message details including headers, HTML/text body, and attachment metadata.
   */
  public async get(
    mailboxId: string,
    messageId: string,
    options?: RequestOptions
  ): Promise<MailboxMessageDetailResponse> {
    return this.http.get<MailboxMessageDetailResponse>(
      `/mailboxes/${encodeURIComponent(mailboxId)}/messages/${encodeURIComponent(messageId)}`,
      options
    );
  }

  /**
   * Permanently deletes a message from the mailbox inbox.
   */
  public async delete(
    mailboxId: string,
    messageId: string,
    options?: RequestOptions
  ): Promise<SuccessResponse> {
    return this.http.delete<SuccessResponse>(
      `/mailboxes/${encodeURIComponent(mailboxId)}/messages/${encodeURIComponent(messageId)}`,
      options
    );
  }
}

export class MailboxesResource {
  public readonly messages: MailboxMessagesSubResource;

  constructor(private readonly http: HttpClient) {
    this.messages = new MailboxMessagesSubResource(http);
  }

  /**
   * Lists all hosted mailboxes for the account.
   */
  public async list(options?: RequestOptions): Promise<MailboxListResponse> {
    return this.http.get<MailboxListResponse>('/mailboxes', options);
  }

  /**
   * Reads a single hosted mailbox by its ID.
   */
  public async get(id: string, options?: RequestOptions): Promise<MailboxResponse> {
    return this.http.get<MailboxResponse>(`/mailboxes/${encodeURIComponent(id)}`, options);
  }

  /**
   * Provisions a new hosted email mailbox on a verified domain.
   */
  public async create(request: CreateMailboxRequest, options?: RequestOptions): Promise<CreateMailboxResponse> {
    return this.http.post<CreateMailboxResponse>('/mailboxes', request, options);
  }

  /**
   * Updates mailbox display name or password.
   */
  public async update(
    id: string,
    request: UpdateMailboxRequest,
    options?: RequestOptions
  ): Promise<MailboxResponse> {
    return this.http.patch<MailboxResponse>(`/mailboxes/${encodeURIComponent(id)}`, request, options);
  }

  /**
   * Deletes a hosted mailbox and associated mail storage.
   */
  public async delete(id: string, options?: RequestOptions): Promise<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`/mailboxes/${encodeURIComponent(id)}`, options);
  }

  /**
   * Reads aggregate and per-account mailbox storage usage.
   */
  public async getStorage(options?: RequestOptions): Promise<MailboxStorageResponse> {
    return this.http.get<MailboxStorageResponse>('/mailboxes/storage', options);
  }

  /**
   * Retrieves IMAP, SMTP, and Webmail connection settings for email clients (Outlook, Apple Mail, Thunderbird).
   */
  public async getConnectionSettings(id: string, options?: RequestOptions): Promise<MailboxConnectionResponse> {
    return this.http.get<MailboxConnectionResponse>(`/mailboxes/${encodeURIComponent(id)}/connection`, options);
  }

  /**
   * Issues new SMTP/IMAP credentials for a hosted mailbox.
   */
  public async createCredentials(
    id: string,
    password?: string,
    options?: RequestOptions
  ): Promise<CreateCredentialsResponse> {
    return this.http.post<CreateCredentialsResponse>(
      `/mailboxes/${encodeURIComponent(id)}/credentials`,
      password ? { password } : {},
      options
    );
  }

  /**
   * Rotates mailbox credentials with a newly generated or provided password.
   */
  public async rotateCredentials(
    id: string,
    password?: string,
    options?: RequestOptions
  ): Promise<RotateCredentialsResponse> {
    return this.http.post<RotateCredentialsResponse>(
      `/mailboxes/${encodeURIComponent(id)}/credentials/rotate`,
      password ? { password } : {},
      options
    );
  }
}
