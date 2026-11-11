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
                amount: 5000,
                currency: 'NGN',
                status: 'paid',
                purpose: 'subscription',
                metadata: {},
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
    expect(res.data.items[0].purpose).toBe('subscription');
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
            includedAllowance: 50000,
            includedUsed: 25000,
            includedRemaining: 25000,
            purchasedBalance: 0,
            unlimited: false,
            canBuyCredits: true,
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const summary = await client.units.getSummary();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/units/summary');
    expect(summary.data.includedRemaining).toBe(25000);
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
            limits: {
              accountId: 1,
              planId: 'enterprise',
              sendRateLimitPerMinute: 1000,
              mailboxOpsPerMinute: 300,
              mailboxLimit: 200,
              baseMailboxLimit: 200,
              additionalMailboxLimit: 0,
              customDomainSendingEnabled: true,
              domainLimit: 50,
              receivingEnabled: true,
              mailboxStorageGb: 100,
            },
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const limits = await client.plans.getEffectiveLimits();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/plans/effective');
    expect(limits.data.limits.receivingEnabled).toBe(true);
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
            plan: {
              id: 'enterprise',
              name: 'Enterprise',
              status: 'active',
              billingInterval: 'monthly',
              autoRenew: true,
            },
            units: {
              monthlyAllocation: 1000000,
              subscriptionUsed: 0,
              subscriptionRemaining: 1000000,
              purchasedBalance: 0,
              totalRemaining: 1000000,
              unlimited: false,
            },
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const status = await client.status.get();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/status');
    expect(status.data.plan.status).toBe('active');
  });

  it('submits a customer support ticket', async () => {
    let capturedUrl = '';
    let capturedBody: any;
    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = input.toString();
      if (capturedUrl.endsWith('/auth/me')) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Current account',
            data: { name: 'Ada Admin', email: 'admin@acme.com' },
          })
        );
      }
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Ticket created',
          data: { id: 'tkt_1', ticketId: 'TKT-10024' },
        }),
        { status: 201 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.support.createTicket({
      subject: 'Inquiry regarding custom DKIM',
      message: 'Need help setting up custom 2048-bit DKIM selector.',
    });

    expect(capturedBody.name).toBe('Ada Admin');
    expect(capturedBody.email).toBe('admin@acme.com');
    expect(capturedBody.subject).toBe('Inquiry regarding custom DKIM');
    expect(capturedBody.category).toBe('general');
    expect(res.data.ticketId).toBe('TKT-10024');
  });
});
