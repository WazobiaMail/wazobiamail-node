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

describe('Domains & DNS Management', () => {
  it('lists sending domains via GET /sending/domains', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Domains retrieved',
          data: [
            {
              id: 'dom_123',
              domain: 'example.com',
              isDefault: true,
              verified: true,
              status: 'active',
              createdAt: '2026-11-01T00:00:00Z',
              updatedAt: '2026-11-01T00:00:00Z',
            },
          ],
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.domains.list();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/sending/domains');
    expect(res.data.length).toBe(1);
    expect(res.data[0].domain).toBe('example.com');
  });

  it('creates a new domain with custom configuration', async () => {
    let capturedMethod = '';
    let capturedBody: any;

    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedMethod = init?.method || '';
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Domain created',
          data: {
            id: 'dom_new_1',
            domain: capturedBody.domain,
            isDefault: false,
            verified: false,
            status: 'pending',
            createdAt: '2026-11-09T00:00:00Z',
            updatedAt: '2026-11-09T00:00:00Z',
          },
        }),
        { status: 201 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.domains.create({
      domain: 'updates.brand.com',
      mailMode: 'hosted',
      sendingSubdomain: 'mta',
    });

    expect(capturedMethod).toBe('POST');
    expect(capturedBody.domain).toBe('updates.brand.com');
    expect(res.data.id).toBe('dom_new_1');
  });

  it('fetches required DNS records for domain verification', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'DNS records loaded',
          data: {
            domain: 'brand.com',
            records: [
              { recordType: 'TXT', name: 'brand.com', value: 'v=spf1 include:_spf.wazobiamail.com ~all', status: 'valid' },
              { recordType: 'CNAME', name: 'wzbm._domainkey.brand.com', value: 'dkim.wazobiamail.com', status: 'valid' },
            ],
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.domains.getDnsRecords('dom_123');

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/sending/domains/dom_123/dns-records');
    expect(res.data.records.length).toBe(2);
    expect(res.data.records[0].recordType).toBe('TXT');
  });

  it('triggers domain DNS verification check', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Verification complete',
          data: {
            verified: true,
            records: [],
            domain: { id: 'dom_123', domain: 'brand.com', verified: true },
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.domains.verify('dom_123', { force: true });

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/sending/domains/dom_123/verify');
    expect(res.data.verified).toBe(true);
  });

  it('supports Cloudflare DNS integration sub-resource', async () => {
    let capturedUrls: string[] = [];
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrls.push(input.toString());
      return new Response(
        JSON.stringify({
          success: true,
          message: 'ok',
          data: { connected: true, synced: true, recordsCount: 4 },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    await client.domains.cloudflare.getStatus();
    await client.domains.cloudflare.sync({ domainId: 'dom_123' });
    await client.domains.cloudflare.disconnect();

    expect(capturedUrls[0]).toContain('/sending/domains/cloudflare/status');
    expect(capturedUrls[1]).toContain('/sending/domains/cloudflare/sync');
    expect(capturedUrls[2]).toContain('/sending/domains/cloudflare/disconnect');
  });
});
