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
  DomainListResponse,
  DomainResponse,
  CreateDomainRequest,
  UpdateDomainRequest,
  DnsRecordsResponse,
  VerifyDomainRequest,
  VerifyDomainResponse,
  DnsProviderResponse,
  CloudflareStatusResponse,
  CloudflareConnectResponse,
  CloudflareSyncRequest,
  CloudflareSyncResponse,
  SuccessResponse,
} from '../types/index.js';

export class CloudflareSubResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Reads Cloudflare DNS connection status.
   */
  public async getStatus(options?: RequestOptions): Promise<CloudflareStatusResponse> {
    return this.http.get<CloudflareStatusResponse>('/sending/domains/cloudflare/status', options);
  }

  /**
   * Starts Cloudflare OAuth connection and returns the auth URL.
   */
  public async connect(options?: RequestOptions): Promise<CloudflareConnectResponse> {
    return this.http.get<CloudflareConnectResponse>('/sending/domains/cloudflare/connect', options);
  }

  /**
   * Automatically synchronizes DNS records directly to the customer's Cloudflare zone.
   */
  public async sync(request: CloudflareSyncRequest, options?: RequestOptions): Promise<CloudflareSyncResponse> {
    return this.http.post<CloudflareSyncResponse>('/sending/domains/cloudflare/sync', request, options);
  }

  /**
   * Disconnects the linked Cloudflare DNS integration.
   */
  public async disconnect(options?: RequestOptions): Promise<SuccessResponse> {
    return this.http.delete<SuccessResponse>('/sending/domains/cloudflare/disconnect', options);
  }
}

export class DomainsResource {
  public readonly cloudflare: CloudflareSubResource;

  constructor(private readonly http: HttpClient) {
    this.cloudflare = new CloudflareSubResource(http);
  }

  /**
   * Lists all registered sending domains.
   */
  public async list(options?: RequestOptions): Promise<DomainListResponse> {
    return this.http.get<DomainListResponse>('/sending/domains', options);
  }

  /**
   * Reads a single sending domain by its ID.
   */
  public async get(domainId: string, options?: RequestOptions): Promise<DomainResponse> {
    return this.http.get<DomainResponse>(`/sending/domains/${encodeURIComponent(domainId)}`, options);
  }

  /**
   * Registers a new sending domain for email delivery.
   */
  public async create(request: CreateDomainRequest, options?: RequestOptions): Promise<DomainResponse> {
    return this.http.post<DomainResponse>('/sending/domains', request, options);
  }

  /**
   * Updates an existing sending domain's settings.
   */
  public async update(
    domainId: string,
    request: UpdateDomainRequest,
    options?: RequestOptions
  ): Promise<DomainResponse> {
    return this.http.patch<DomainResponse>(`/sending/domains/${encodeURIComponent(domainId)}`, request, options);
  }

  /**
   * Deletes a sending domain.
   */
  public async delete(domainId: string, options?: RequestOptions): Promise<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`/sending/domains/${encodeURIComponent(domainId)}`, options);
  }

  /**
   * Retrieves required DNS records (SPF, DKIM, DMARC, MX) for domain setup.
   */
  public async getDnsRecords(domainId: string, options?: RequestOptions): Promise<DnsRecordsResponse> {
    return this.http.get<DnsRecordsResponse>(
      `/sending/domains/${encodeURIComponent(domainId)}/dns-records`,
      options
    );
  }

  /**
   * Triggers DNS verification for SPF, DKIM, and MX records.
   */
  public async verify(
    domainId: string,
    request?: VerifyDomainRequest,
    options?: RequestOptions
  ): Promise<VerifyDomainResponse> {
    return this.http.post<VerifyDomainResponse>(
      `/sending/domains/${encodeURIComponent(domainId)}/verify`,
      request || {},
      options
    );
  }

  /**
   * Inspects nameservers and detects DNS provider setup.
   */
  public async getDnsProvider(domain?: string, options?: RequestOptions): Promise<DnsProviderResponse> {
    return this.http.get<DnsProviderResponse>('/sending/domains/dns-provider', {
      ...options,
      params: domain ? { domain, ...options?.params } : options?.params,
    });
  }
}
