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
  it('creates a hosted mailbox', async () => {
    let capturedBody: any;
    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Your mailbox is ready.',
          data: {
            id: 'mbx_123',
            domainId: capturedBody.domainId,
            address: `${capturedBody.localPart}@brand.com`,
            localPart: capturedBody.localPart,
            displayName: capturedBody.displayName,
            status: 'active',
            isPlatformSubdomain: false,
            autoProvisioned: false,
            role: 'general',
            createdAt: '2026-11-09T00:00:00Z',
            updatedAt: '2026-11-09T00:00:00Z',
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
    expect(res.data.address).toBe('support@brand.com');
    expect(res.data.role).toBe('general');
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
            mailboxes: [],
            customers: [{ accountId: 1, usedBytes: 524288000, allocatedBytes: 10737418240, mailboxes: 3 }],
            domains: [],
            measurement: 'logical mailbox bytes',
            plan: {
              mailboxLimit: 50,
              baseMailboxLimit: 50,
              additionalMailboxLimit: 0,
              mailboxesUsed: 3,
              mailboxRemaining: 47,
              storageTotalBytes: 10737418240,
              storageAllocatedBytes: 3221225472,
            },
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.mailboxes.getStorage();

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/mailboxes/storage');
    expect(res.data.plan.mailboxesUsed).toBe(3);
    expect(res.data.customers.length).toBe(1);
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
                threadId: 'thread_1',
                subject: 'Customer Inquiry #1024',
                preview: 'Need help with invoice',
                from: [{ name: 'Alice', email: 'alice@client.com' }],
                to: [{ name: 'Support', email: 'support@brand.com' }],
                receivedAt: '2026-11-09T00:00:00Z',
                isUnread: true,
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
    expect(res.data.items[0].isUnread).toBe(true);
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
            threadId: 'thread_1',
            subject: 'Customer Inquiry #1024',
            preview: 'Need help with invoice',
            from: [{ name: 'Alice', email: 'alice@client.com' }],
            to: [{ name: 'Support', email: 'support@brand.com' }],
            cc: [],
            bcc: [],
            replyTo: [],
            receivedAt: '2026-11-09T00:00:00Z',
            isUnread: false,
            hasAttachments: true,
            sizeBytes: 15420,
            htmlBody: '<p>Need help with invoice</p>',
            textBody: 'Need help with invoice',
            attachments: [
              { blobId: 'blob_1', name: 'receipt.pdf', type: 'application/pdf', sizeBytes: 14000 },
            ],
          },
        })
      );
    };

    const client = new WazobiaMail({ apiKey: 'wzbm_mock', fetch: mockFetch as any });
    const res = await client.mailboxes.messages.get('mbx_123', 'msg_001');

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/mailboxes/mbx_123/messages/msg_001');
    expect(res.data.attachments[0].name).toBe('receipt.pdf');
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
