/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { ResolvedClientConfig, DEFAULT_USER_AGENT, maskApiKey } from './config.js';
import {
  WazobiaApiError,
  WazobiaAuthenticationError,
  WazobiaForbiddenError,
  WazobiaNotFoundError,
  WazobiaValidationError,
  WazobiaRateLimitError,
  WazobiaTimeoutError,
} from './errors.js';

export interface RequestOptions {
  /**
   * Optional idempotency key to prevent duplicate message submission.
   */
  idempotencyKey?: string;

  /**
   * Additional query parameters appended to the URL.
   */
  params?: Record<string, unknown>;

  /**
   * Additional custom headers for this specific request.
   */
  headers?: Record<string, string>;

  /**
   * Override timeout for this specific request in milliseconds.
   */
  timeout?: number;

  /**
   * Optional AbortSignal from the caller.
   */
  signal?: AbortSignal;
}

export class HttpClient {
  constructor(private readonly config: ResolvedClientConfig) {}

  /**
   * Returns a copy of the configuration (with masked API key for logging safety).
   */
  public getConfig(): Omit<ResolvedClientConfig, 'apiKey'> & { apiKey: string } {
    return {
      ...this.config,
      apiKey: maskApiKey(this.config.apiKey),
    };
  }

  public [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `HttpClient { baseUrl: '${this.config.baseUrl}', apiKey: '${maskApiKey(this.config.apiKey)}' }`;
  }

  public async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  public async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  public async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  public async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  public async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  /**
   * Executes a multipart/form-data POST request (for attachments and file uploads).
   */
  public async postMultipart<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers = this.buildHeaders(options, false);

    return this.executeRequest<T>(url, {
      method: 'POST',
      headers,
      body: formData,
    }, options);
  }

  /**
   * Requests a raw binary buffer (e.g. downloading invoice PDFs).
   */
  public async getBinary(path: string, options?: RequestOptions): Promise<ArrayBuffer> {
    const url = this.buildUrl(path, options?.params);
    const headers = this.buildHeaders(options, false);
    delete headers['Accept'];
    headers['Accept'] = 'application/pdf, application/octet-stream, */*';

    const response = await this.executeRaw(url, {
      method: 'GET',
      headers,
    }, options);

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.arrayBuffer();
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const hasBody = body !== undefined && body !== null;
    const headers = this.buildHeaders(options, hasBody);

    const init: RequestInit = {
      method,
      headers,
    };

    if (hasBody) {
      init.body = JSON.stringify(body);
    }

    return this.executeRequest<T>(url, init, options);
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const base = `${this.config.baseUrl}${cleanPath}`;

    if (!params || Object.keys(params).length === 0) {
      return base;
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          for (const item of value) {
            searchParams.append(key, String(item));
          }
        } else {
          searchParams.append(key, String(value));
        }
      }
    }

    const queryString = searchParams.toString();
    return queryString ? `${base}?${queryString}` : base;
  }

  private buildHeaders(options?: RequestOptions, hasJsonBody = false): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': DEFAULT_USER_AGENT,
      'Accept': 'application/json',
      ...this.config.headers,
      ...options?.headers,
    };

    // Standard WazobiaMail authentication header
    if (this.config.authScheme === 'header' || this.config.authScheme === 'both') {
      headers['X-API-Key'] = this.config.apiKey;
    }

    // Bearer token support
    if (this.config.authScheme === 'bearer' || this.config.authScheme === 'both') {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    if (hasJsonBody) {
      headers['Content-Type'] = 'application/json';
    }

    if (options?.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    return headers;
  }

  private async executeRequest<T>(url: string, init: RequestInit, options?: RequestOptions): Promise<T> {
    const response = await this.executeRaw(url, init, options);

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    try {
      const json = await response.json();
      return json as T;
    } catch (parseError) {
      throw new WazobiaApiError(
        `Failed to parse server response as JSON (HTTP ${response.status})`,
        response.status,
        { cause: parseError }
      );
    }
  }

  private async executeRaw(url: string, init: RequestInit, options?: RequestOptions): Promise<Response> {
    const controller = new AbortController();
    const timeoutMs = options?.timeout ?? this.config.timeout;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        controller.abort();
      }, timeoutMs);
    }

    // Link caller's signal if supplied
    if (options?.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await this.config.fetch(url, {
        ...init,
        signal: controller.signal,
      });
      return response;
    } catch (err: unknown) {
      if (controller.signal.aborted) {
        throw new WazobiaTimeoutError(`Request timed out after ${timeoutMs}ms`, timeoutMs);
      }
      throw err;
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let rawBody: unknown;
    let message = `Request failed with status ${response.status}`;
    let code: string | undefined;
    let errors: Record<string, string> | undefined;

    try {
      rawBody = await response.json();
      if (rawBody && typeof rawBody === 'object') {
        const bodyObj = rawBody as Record<string, unknown>;
        if (typeof bodyObj.message === 'string') {
          message = bodyObj.message;
        }
        if (typeof bodyObj.code === 'string') {
          code = bodyObj.code;
        }
        if (bodyObj.errors && typeof bodyObj.errors === 'object') {
          errors = bodyObj.errors as Record<string, string>;
        }
      }
    } catch {
      // Body was not JSON; use default status text if present
      if (response.statusText) {
        message = response.statusText;
      }
    }

    const status = response.status;

    if (status === 401) {
      throw new WazobiaAuthenticationError(message, status, { code, rawBody });
    }

    if (status === 403) {
      throw new WazobiaForbiddenError(message, { code, rawBody });
    }

    if (status === 404) {
      throw new WazobiaNotFoundError(message, { code, rawBody });
    }

    if (status === 422 || (status === 400 && errors)) {
      throw new WazobiaValidationError(message, status, { code, errors, rawBody });
    }

    if (status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      let retryAfter: number | undefined;
      if (retryAfterHeader) {
        const parsed = parseInt(retryAfterHeader, 10);
        if (!isNaN(parsed)) {
          retryAfter = parsed;
        }
      }
      throw new WazobiaRateLimitError(message, { retryAfter, code, rawBody });
    }

    throw new WazobiaApiError(message, status, { code, errors, rawBody });
  }
}
