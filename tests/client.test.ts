/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { WazobiaMail, Wazobia } from '../src/index.js';
import { WazobiaAuthenticationError } from '../src/errors.js';

describe('WazobiaMail Client Initialization', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.WAZOBIA_API_KEY;
    delete process.env.WAZOBIAMAIL_API_KEY;
    delete process.env.WAZOBIA_BASE_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('initializes with a direct string API key', () => {
    const client = new WazobiaMail('wzbm_live_1234567890abcdef');
    expect(client).toBeInstanceOf(WazobiaMail);
  });

  it('initializes with an options object containing apiKey', () => {
    const client = new WazobiaMail({
      apiKey: 'wzbm_live_1234567890abcdef',
      timeout: 15_000,
    });
    expect(client).toBeInstanceOf(WazobiaMail);
  });

  it('initializes using WAZOBIA_API_KEY from environment', () => {
    process.env.WAZOBIA_API_KEY = 'wzbm_env_test_key_123';
    const client = new WazobiaMail();
    expect(client).toBeInstanceOf(WazobiaMail);
  });

  it('initializes using WAZOBIAMAIL_API_KEY from environment', () => {
    process.env.WAZOBIAMAIL_API_KEY = 'wzbm_secondary_env_key';
    const client = new WazobiaMail();
    expect(client).toBeInstanceOf(WazobiaMail);
  });

  it('throws WazobiaAuthenticationError when no API key is provided and env vars are unset', () => {
    expect(() => new WazobiaMail()).toThrow(WazobiaAuthenticationError);
  });

  it('throws WazobiaAuthenticationError when API key is empty or whitespace-only', () => {
    expect(() => new WazobiaMail('')).toThrow(WazobiaAuthenticationError);
    expect(() => new WazobiaMail('   ')).toThrow(WazobiaAuthenticationError);
    expect(() => new WazobiaMail({ apiKey: '  ' })).toThrow(WazobiaAuthenticationError);
  });

  it('normalizes base URL by stripping trailing slashes', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(JSON.stringify({ success: true, message: 'ok', data: [] }));
    };

    const client = new WazobiaMail({
      apiKey: 'wzbm_test_key',
      baseUrl: 'https://custom.api.wazobiamail.com/api/v1///',
      fetch: mockFetch as any,
    });

    await client.domains.list();
    expect(capturedUrl).toBe('https://custom.api.wazobiamail.com/api/v1/sending/domains');
  });

  it('exports Wazobia as an exact alias for WazobiaMail', () => {
    expect(Wazobia).toBe(WazobiaMail);
    const client = new Wazobia('wzbm_test_key');
    expect(client).toBeInstanceOf(WazobiaMail);
  });

  it('aliases client.emails to client.messages', () => {
    const client = new WazobiaMail('wzbm_test_key');
    expect(client.emails).toBe(client.messages);
  });

  it('masks the API key in toString, inspect, and toJSON to prevent secret leakage', () => {
    const key = 'wzbm_live_supersecretkey123456';
    const client = new WazobiaMail(key);

    const json = JSON.stringify(client);
    expect(json).not.toContain('supersecretkey');
    expect(json).toContain('wzbm_...3456');

    const inspectStr = (client as any)[Symbol.for('nodejs.util.inspect.custom')]();
    expect(inspectStr).not.toContain('supersecretkey');
    expect(inspectStr).toContain('wzbm_...3456');
  });
});
