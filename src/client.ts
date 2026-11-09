/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { resolveConfig, WazobiaClientOptions, maskApiKey } from './config.js';
import { HttpClient, RequestOptions } from './http.js';
import {
  MessagesResource,
  DomainsResource,
  MailboxesResource,
  ApiKeysResource,
  SmtpRelaysResource,
  SmtpAccessResource,
  BillingResource,
  UnitsResource,
  PlansResource,
  StatusResource,
  SupportResource,
} from './resources/index.js';
import { SendMessageRequest, SendMessageResponse } from './types/index.js';

export class WazobiaMail {
  private readonly http: HttpClient;

  /**
   * Transactional email sending, attachments, and deliverability spam checking.
   */
  public readonly messages: MessagesResource;

  /**
   * Ergonomic alias for `messages`.
   */
  public readonly emails: MessagesResource;

  /**
   * Sending domains, DNS inspection, verification, and Cloudflare DNS automation.
   */
  public readonly domains: DomainsResource;

  /**
   * Hosted email mailboxes, credentials, storage budgets, and enterprise headless inboxes.
   */
  public readonly mailboxes: MailboxesResource;

  /**
   * Scoped sending API keys and key rotation.
   */
  public readonly apiKeys: ApiKeysResource;

  /**
   * Customer SMTP relay management.
   */
  public readonly smtpRelays: SmtpRelaysResource;

  /**
   * Customer SMTP access activation and eligibility.
   */
  public readonly smtpAccess: SmtpAccessResource;

  /**
   * Invoices, invoice PDF downloads, currency detection, and subscription info.
   */
  public readonly billing: BillingResource;

  /**
   * Email credits, ledger history, packs, and credit top-ups.
   */
  public readonly units: UnitsResource;

  /**
   * Subscription plan tiers and effective account limits.
   */
  public readonly plans: PlansResource;

  /**
   * Account status and service health.
   */
  public readonly status: StatusResource;

  /**
   * Customer support ticket creation.
   */
  public readonly support: SupportResource;

  /**
   * Initializes a new WazobiaMail API client.
   *
   * @param options - API key string or configuration options object.
   *
   * @example
   * ```typescript
   * import { WazobiaMail } from 'wazobiamail';
   *
   * // 1. Direct API key
   * const client = new WazobiaMail('wzbm_live_...');
   *
   * // 2. Configuration options
   * const client = new WazobiaMail({
   *   apiKey: 'wzbm_live_...',
   *   timeout: 10_000,
   * });
   *
   * // 3. Environment variable fallback (WAZOBIA_API_KEY)
   * const client = new WazobiaMail();
   * ```
   */
  constructor(options?: string | WazobiaClientOptions) {
    const config = resolveConfig(options);
    this.http = new HttpClient(config);

    this.messages = new MessagesResource(this.http);
    this.emails = this.messages;
    this.domains = new DomainsResource(this.http);
    this.mailboxes = new MailboxesResource(this.http);
    this.apiKeys = new ApiKeysResource(this.http);
    this.smtpRelays = new SmtpRelaysResource(this.http);
    this.smtpAccess = new SmtpAccessResource(this.http);
    this.billing = new BillingResource(this.http);
    this.units = new UnitsResource(this.http);
    this.plans = new PlansResource(this.http);
    this.status = new StatusResource(this.http);
    this.support = new SupportResource(this.http);
  }

  /**
   * Convenience shortcut for sending an email message.
   *
   * @example
   * ```typescript
   * const response = await client.send({
   *   from: 'Acme <sales@example.com>',
   *   to: 'customer@domain.com',
   *   subject: 'Welcome to Acme!',
   *   html: '<h1>Welcome!</h1>',
   * });
   * ```
   */
  public async send(request: SendMessageRequest, options?: RequestOptions): Promise<SendMessageResponse> {
    return this.messages.send(request, options);
  }

  /**
   * Custom Node.js inspect implementation to prevent leaking API keys in logs.
   */
  public [Symbol.for('nodejs.util.inspect.custom')](): string {
    const config = this.http.getConfig();
    return `WazobiaMail { baseUrl: '${config.baseUrl}', apiKey: '${maskApiKey(config.apiKey)}' }`;
  }

  /**
   * Prevents leaking API keys in JSON.stringify(client).
   */
  public toJSON(): Record<string, unknown> {
    const config = this.http.getConfig();
    return {
      baseUrl: config.baseUrl,
      apiKey: maskApiKey(config.apiKey),
    };
  }
}

/**
 * Convenient alias for `WazobiaMail`.
 */
export const Wazobia = WazobiaMail;
