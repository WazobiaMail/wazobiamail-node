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

describe('Mailboxes & Enterprise Headless Inbox', () => {
  it('creates a hosted mailbox and receives credentials', async () => {
    let capturedBody: any;
    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Mailbox provisioned',
          data: {
            mailbox: {
              id: 'mbx_123',
              domainId: capturedBody.domainId,
              email: `${capturedBody.localPart}@brand.com`,
              localPart: capturedBody.localPart,
              displayName: capturedBody.displayName,
              storageUsageBytes: 0,
              status: 'active',
              createdAt: '2026-11-09T00:00:00Z',
              updatedAt: '2026-11-09T00:00:00Z',
            },
            credential: {
              id: 'cred_1',
              username: `${capturedBody.localPart}@brand.com`,
              password: 'GeneratedSecurePassword123!',
              createdAt: '2026-11-09T00:00:00Z',
            },
          },
        }),
        { status: 201 }
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.mailboxes.create({
      domainId: 'dom_123',
      localPart: 'support',
      displayName: 'Customer Support',
    });

    expect(capturedBody.localPart).toBe('support');
    expect(res.data.mailbox.email).toBe('support@brand.com');
    expect(res.data.credential?.password).toBe('GeneratedSecurePassword123!');
  });

  it('queries storage usage metrics via GET /mailboxes/storage', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Storage metrics',
          data: {
            totalBytes: 524288000,
            quotaBytes: 10737418240,
            percentUsed: 4.88,
            mailboxesCount: 3,
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.mailboxes.getStorage();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/mailboxes/storage');
    expect(res.data.mailboxesCount).toBe(3);
    expect(res.data.percentUsed).toBe(4.88);
  });

  it('queries enterprise inbox messages with pagination and unread filter', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Inbox messages loaded',
          data: {
            items: [
              {
                id: 'msg_001',
                messageId: '<id@remote.com>',
                subject: 'Customer Inquiry #1024',
                from: { name: 'Alice', email: 'alice@client.com' },
                to: ['support@brand.com'],
                date: '2026-11-09T00:00:00Z',
                isRead: false,
                hasAttachments: true,
                sizeBytes: 15420,
              },
            ],
            total: 1,
            page: 1,
            limit: 25,
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.mailboxes.messages.list('mbx_123', { unreadOnly: true, limit: 25 });

    expect(capturedUrl).toContain('/mailboxes/mbx_123/messages?');
    expect(capturedUrl).toContain('unreadOnly=true');
    expect(capturedUrl).toContain('limit=25');
    expect(res.data.items[0].subject).toBe('Customer Inquiry #1024');
  });

  it('retrieves detailed enterprise inbox message body and attachments', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Message details',
          data: {
            id: 'msg_001',
            messageId: '<id@remote.com>',
            subject: 'Customer Inquiry #1024',
            from: 'Alice <alice@client.com>',
            to: ['support@brand.com'],
            date: '2026-11-09T00:00:00Z',
            isRead: true,
            hasAttachments: true,
            sizeBytes: 15420,
            htmlBody: '<p>Need help with invoice</p>',
            textBody: 'Need help with invoice',
            headers: { 'x-priority': '1' },
            attachments: [
              { id: 'att_1', fileName: 'receipt.pdf', contentType: 'application/pdf', sizeBytes: 14000 },
            ],
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.mailboxes.messages.get('mbx_123', 'msg_001');

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/mailboxes/mbx_123/messages/msg_001');
    expect(res.data.attachments[0].fileName).toBe('receipt.pdf');
    expect(res.data.htmlBody).toBe('<p>Need help with invoice</p>');
  });

  it('deletes an inbox message via DELETE /mailboxes/{id}/messages/{msg_id}', async () => {
    let capturedMethod = '';
    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedMethod = init?.method || '';
      return new Response(JSON.stringify({ success: true, message: 'Message deleted' }));
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.mailboxes.messages.delete('mbx_123', 'msg_001');

    expect(capturedMethod).toBe('DELETE');
    expect(res.success).toBe(true);
  });
});
