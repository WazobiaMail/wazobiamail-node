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

describe('Billing, Units & Plans', () => {
  it('lists customer billing invoices', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Invoices listed',
          data: {
            items: [
              {
                id: 'inv_101',
                invoiceNumber: 'INV-2026-0001',
                amount: 5000,
                currency: 'NGN',
                status: 'paid',
                product: 'Starter Plan',
                createdAt: '2026-11-01T00:00:00Z',
              },
            ],
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.billing.listInvoices();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/billing/invoices');
    expect(res.data.items[0].invoiceNumber).toBe('INV-2026-0001');
  });

  it('downloads invoice PDF as binary ArrayBuffer', async () => {
    let capturedUrl = '';
    let capturedHeaders: Record<string, string> = {};

    const pdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46]).buffer; // %PDF

    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = input.toString();
      capturedHeaders = (init?.headers as Record<string, string>) || {};
      return new Response(pdfBuffer, {
        headers: { 'Content-Type': 'application/pdf' },
      });
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const buffer = await client.billing.downloadInvoice('inv_101');

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/billing/invoices/inv_101/download');
    expect(capturedHeaders['Accept']).toContain('application/pdf');
    expect(buffer.byteLength).toBe(4);
  });

  it('queries email credit unit balance and ledger history', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Units balance',
          data: {
            balance: 25000,
            lifetimePurchased: 50000,
            lifetimeUsed: 25000,
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const summary = await client.units.getSummary();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/units/summary');
    expect(summary.data.balance).toBe(25000);
  });

  it('queries subscription plans and effective limits', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Effective limits',
          data: {
            planId: 'plan_ent',
            planName: 'Enterprise',
            canSend: true,
            canReceive: true,
            domainsLimit: 50,
            mailboxesLimit: 200,
            hourlySendLimit: 100000,
            dailySendLimit: 1000000,
            storageQuotaBytes: 107374182400,
            enterpriseInboxAllowed: true,
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const limits = await client.plans.getEffectiveLimits();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/plans/effective');
    expect(limits.data.enterpriseInboxAllowed).toBe(true);
  });

  it('checks account status via client.status.get()', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Status ok',
          data: {
            status: 'active',
            accountId: 'acc_1',
            planId: 'enterprise',
            planTier: 'Enterprise',
            email: 'admin@acme.com',
            verified: true,
            createdAt: '2026-11-01T00:00:00Z',
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const status = await client.status.get();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/status');
    expect(status.data.status).toBe('active');
  });

  it('submits a customer support ticket', async () => {
    let capturedBody: any;
    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Ticket created',
          data: {
            id: 'tkt_1',
            ticketNumber: 'TKT-10024',
            status: 'open',
            subject: capturedBody.subject,
            createdAt: '2026-11-09T00:00:00Z',
          },
        }),
        { status: 201 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.support.createTicket({
      subject: 'Inquiry regarding custom DKIM',
      message: 'Need help setting up custom 2048-bit DKIM selector.',
    });

    expect(capturedBody.subject).toBe('Inquiry regarding custom DKIM');
    expect(res.data.ticketNumber).toBe('TKT-10024');
  });
});
