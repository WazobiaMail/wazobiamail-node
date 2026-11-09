/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { describe, it, expect } from 'bun:test';
import { WazobiaMail } from '../src/index.js';

describe('API Keys, Relays & SMTP Access', () => {
  it('creates and regenerates scoped sending API keys', async () => {
    let capturedUrls: string[] = [];
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrls.push(input.toString());
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Key created',
          data: {
            id: 'key_123',
            name: 'Transactional Key',
            keyPrefix: 'wzbm_live',
            scope: 'general',
            apiKey: 'wzbm_live_newlygeneratedsecret',
            createdAt: '2026-11-09T00:00:00Z',
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const createRes = await client.apiKeys.create({ name: 'Transactional Key' });
    expect(createRes.data.apiKey).toBe('wzbm_live_newlygeneratedsecret');

    const regenRes = await client.apiKeys.regenerate('key_123');
    expect(regenRes.data.apiKey).toBe('wzbm_live_newlygeneratedsecret');

    expect(capturedUrls[0]).toContain('/sending/api-keys');
    expect(capturedUrls[1]).toContain('/sending/api-keys/key_123/regenerate');
  });

  it('manages SMTP relays CRUD', async () => {
    let lastMethod = '';
    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      lastMethod = init?.method || 'GET';
      return new Response(
        JSON.stringify({
          success: true,
          message: 'ok',
          data: {
            id: 'relay_1',
            name: 'Primary Relay',
            host: 'smtp.sendgrid.net',
            port: 587,
            username: 'apikey',
            tlsMode: 'starttls',
            isActive: true,
            createdAt: '2026-11-09T00:00:00Z',
            updatedAt: '2026-11-09T00:00:00Z',
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    await client.smtpRelays.list();
    expect(lastMethod).toBe('GET');

    await client.smtpRelays.create({
      name: 'Primary Relay',
      host: 'smtp.sendgrid.net',
      port: 587,
      username: 'apikey',
      password: 'password123',
    });
    expect(lastMethod).toBe('POST');

    await client.smtpRelays.delete('relay_1');
    expect(lastMethod).toBe('DELETE');
  });

  it('reads and updates SMTP access preferences', async () => {
    let capturedBody: any;
    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.body) {
        capturedBody = JSON.parse(init.body as string);
      }
      return new Response(
        JSON.stringify({
          success: true,
          message: 'SMTP access updated',
          data: { enabled: true, eligible: true, status: 'active' },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const getRes = await client.smtpAccess.get();
    expect(getRes.data.eligible).toBe(true);

    const putRes = await client.smtpAccess.update({ enabled: true });
    expect(capturedBody.enabled).toBe(true);
    expect(putRes.data.enabled).toBe(true);
  });
});
