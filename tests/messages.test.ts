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

describe('Messages & Email Sending', () => {
  it('sends an email message with normalized payload and headers', async () => {
    let capturedUrl = '';
    let capturedInit: RequestInit | undefined;

    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = input.toString();
      capturedInit = init;
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Message accepted for delivery',
          data: {
            result: {
              status: 'queued',
              trackingId: 'trk_987654321',
              recipients: 1,
            },
          },
        }),
        { status: 200 }
      );
    };

    const client = new WazobiaMail({
      apiKey: 'wzbm_live_mock_key',
      fetch: mockFetch as any,
    });

    const response = await client.messages.send({
      from: 'Acme Store <hello@example.com>',
      to: 'customer@example.com',
      subject: 'Welcome!',
      html: '<p>Welcome to our service</p>',
      text: 'Welcome to our service',
      replyTo: 'support@example.com',
    });

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/sending/messages');
    expect(capturedInit?.method).toBe('POST');

    const headers = capturedInit?.headers as Record<string, string>;
    expect(headers['X-API-Key']).toBe('wzbm_live_mock_key');
    expect(headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(capturedInit?.body as string);
    expect(body.to).toEqual(['customer@example.com']);
    expect(body.content.subject).toBe('Welcome!');
    expect(body.content.from).toBe('Acme Store <hello@example.com>');
    expect(body.content.htmlBody).toBe('<p>Welcome to our service</p>');
    expect(body.content.textBody).toBe('Welcome to our service');
    expect(body.content.replyTo).toBe('support@example.com');

    expect(response.success).toBe(true);
    expect(response.data.result.trackingId).toBe('trk_987654321');
  });

  it('attaches Idempotency-Key header when supplied', async () => {
    let capturedHeaders: Record<string, string> = {};

    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedHeaders = (init?.headers as Record<string, string>) || {};
      return new Response(
        JSON.stringify({
          success: true,
          message: 'ok',
          data: { result: { status: 'queued', trackingId: 'idemp_1', recipients: 1 } },
        })
      );
    };

    const client = new WazobiaMail({
      apiKey: 'wzbm_mock',
      fetch: mockFetch as any,
    });

    await client.send(
      {
        to: 'user@example.com',
        subject: 'Idempotent Send',
        text: 'Hello',
      },
      { idempotencyKey: 'idemp-uuid-9999' }
    );

    expect(capturedHeaders['Idempotency-Key']).toBe('idemp-uuid-9999');
  });

  it('sends spam-check request to /sending/spam-check', async () => {
    let capturedUrl = '';
    let capturedBody: any;

    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = input.toString();
      capturedBody = JSON.parse(init?.body as string);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Spam check complete',
          data: {
            score: 0.5,
            threshold: 5.0,
            deliverabilityScore: 95,
            findings: [{ rule: 'SUBJ_ALL_CAPS', score: 0.5, description: 'Subject in uppercase' }],
            recommendations: ['Avoid all-caps subjects'],
          },
        })
      );
    };

    const client = new WazobiaMail({
      apiKey: 'wzbm_mock',
      fetch: mockFetch as any,
    });

    const response = await client.messages.spamCheck({
      subject: 'Test Subject',
      htmlBody: '<p>Test body</p>',
    });

    expect(capturedUrl).toBe('https://app.wazobiamail.com/api/v1/sending/spam-check');
    expect(capturedBody.subject).toBe('Test Subject');
    expect(response.data.deliverabilityScore).toBe(95);
    expect(response.data.findings.length).toBe(1);
  });

  it('queries tracked messages with filters', async () => {
    let capturedUrl = '';

    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'ok',
          data: {
            items: [
              {
                trackingId: 'trk_1',
                subject: 'Order Confirmation',
                from: 'hello@store.com',
                recipientsCount: 1,
                opensCount: 2,
                clicksCount: 1,
                status: 'delivered',
                sentAt: '2026-11-09T00:00:00Z',
              },
            ],
            total: 1,
          },
        })
      );
    };

    const client = new WazobiaMail({
      apiKey: 'wzbm_mock',
      fetch: mockFetch as any,
    });

    const res = await client.messages.listTracked({ limit: 10, offset: 0, status: 'delivered' });
    expect(capturedUrl).toContain('/sending/tracking/messages?');
    expect(capturedUrl).toContain('limit=10');
    expect(capturedUrl).toContain('status=delivered');
    expect(res.data.items[0].opensCount).toBe(2);
  });
});
