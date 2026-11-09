/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { describe, it, expect } from 'bun:test';
import {
  WazobiaMail,
  WazobiaApiError,
  WazobiaAuthenticationError,
  WazobiaForbiddenError,
  WazobiaNotFoundError,
  WazobiaValidationError,
  WazobiaRateLimitError,
  WazobiaTimeoutError,
} from '../src/index.js';

describe('Error Hierarchy & Exception Handling', () => {
  it('throws WazobiaAuthenticationError on HTTP 401', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: 401,
          message: 'Invalid API key or token has expired',
        }),
        { status: 401 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_bad', fetch: mockFetch as any });

    try {
      await client.domains.list();
      expect().fail('Should have thrown WazobiaAuthenticationError');
    } catch (err) {
      expect(err).toBeInstanceOf(WazobiaAuthenticationError);
      expect((err as WazobiaAuthenticationError).statusCode).toBe(401);
      expect((err as WazobiaAuthenticationError).message).toContain('Invalid API key');
    }
  });

  it('throws WazobiaForbiddenError on HTTP 403 with plan upgrade notice', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: 403,
          code: 'plan_upgrade_required',
          message: 'Enterprise inbox requires an active Enterprise subscription.',
        }),
        { status: 403 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_starter', fetch: mockFetch as any });

    try {
      await client.mailboxes.messages.list('mbx_1');
      expect().fail('Should have thrown WazobiaForbiddenError');
    } catch (err) {
      expect(err).toBeInstanceOf(WazobiaForbiddenError);
      expect((err as WazobiaForbiddenError).statusCode).toBe(403);
      expect((err as WazobiaForbiddenError).code).toBe('plan_upgrade_required');
      expect((err as WazobiaForbiddenError).message).toContain('Enterprise subscription');
    }
  });

  it('throws WazobiaNotFoundError on HTTP 404', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: 404,
          message: 'Mailbox not found',
        }),
        { status: 404 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });

    try {
      await client.mailboxes.get('nonexistent');
      expect().fail('Should have thrown WazobiaNotFoundError');
    } catch (err) {
      expect(err).toBeInstanceOf(WazobiaNotFoundError);
      expect((err as WazobiaNotFoundError).statusCode).toBe(404);
    }
  });

  it('throws WazobiaValidationError on HTTP 422 with parsed field error mapping', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: 422,
          message: 'Please check the details you entered and try again.',
          errors: {
            domain: 'Domain already registered by another account',
            mailMode: 'Invalid mail mode',
          },
        }),
        { status: 422 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });

    try {
      await client.domains.create({ domain: 'taken.com' });
      expect().fail('Should have thrown WazobiaValidationError');
    } catch (err) {
      expect(err).toBeInstanceOf(WazobiaValidationError);
      const valErr = err as WazobiaValidationError;
      expect(valErr.statusCode).toBe(422);
      expect(valErr.errors?.domain).toBe('Domain already registered by another account');
      expect(valErr.errors?.mailMode).toBe('Invalid mail mode');
    }
  });

  it('throws WazobiaRateLimitError on HTTP 429 and parses Retry-After header', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: 429,
          message: 'Rate limit exceeded: maximum 100 requests per minute',
        }),
        {
          status: 429,
          headers: { 'Retry-After': '60' },
        }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });

    try {
      await client.messages.send({ to: 'a@b.com', subject: 'hi' });
      expect().fail('Should have thrown WazobiaRateLimitError');
    } catch (err) {
      expect(err).toBeInstanceOf(WazobiaRateLimitError);
      const rateErr = err as WazobiaRateLimitError;
      expect(rateErr.statusCode).toBe(429);
      expect(rateErr.retryAfter).toBe(60);
    }
  });

  it('throws WazobiaApiError on HTTP 500 server errors', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          statusCode: 500,
          message: 'Something went wrong on our side. Please try again shortly.',
        }),
        { status: 500 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });

    try {
      await client.status.get();
      expect().fail('Should have thrown WazobiaApiError');
    } catch (err) {
      expect(err).toBeInstanceOf(WazobiaApiError);
      expect((err as WazobiaApiError).statusCode).toBe(500);
    }
  });

  it('throws WazobiaTimeoutError when request exceeds configured timeout', async () => {
    const slowFetch = async (_url: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const err = new Error('The operation was aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    };

    const client = new WazobiaMail({
      apiKey: 'wzbm_mock',
      timeout: 50, // 50ms
      fetch: slowFetch as any,
    });

    try {
      await client.status.get();
      expect().fail('Should have timed out');
    } catch (err) {
      expect(err).toBeInstanceOf(WazobiaTimeoutError);
      expect((err as WazobiaTimeoutError).timeoutMs).toBe(50);
    }
  });
});
