# WazobiaMail TypeScript & Node.js SDK

Official TypeScript and Node.js SDK for the [WazobiaMail](https://wazobiamail.com) API. Deliver transactional emails, manage verified custom domains, provision hosted mailboxes, and automate enterprise headless inboxes with zero runtime dependencies and 100% complete TypeScript types.

[![npm version](https://img.shields.io/npm/v/wazobiamail.svg)](https://www.npmjs.com/package/wazobiamail)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)

---

## Features

- 🔑 **Ergonomic API Key Authentication** — Direct key initialization or automatic fallback to `process.env.WAZOBIA_API_KEY` / `process.env.WAZOBIAMAIL_API_KEY`.
- ⚡ **Zero Production Dependencies** — Built entirely on standard native `fetch`, `FormData`, and `Blob`. Compatible with Node.js 18+, Bun, Deno, and Edge environments (Cloudflare Workers, Vercel Edge).
- 📦 **Dual Module Formats** — Seamless dual distribution for both ECMAScript Modules (`import`) and CommonJS (`require`).
- 🛡️ **100% Strict TypeScript** — Fully typed requests, responses, errors, and pagination interfaces matching the canonical WazobiaMail OpenAPI contracts.
- 📬 **Full Platform Surface** — Send transactional emails, check spam deliverability scores, manage sending domains and DNS, configure Cloudflare DNS, provision mailboxes, query enterprise inboxes, manage API keys, and download billing invoices.

---

## Installation

```bash
# npm
npm install wazobiamail

# bun
bun add wazobiamail

# pnpm
pnpm add wazobiamail

# yarn
yarn add wazobiamail
```

---

## Authentication & API Keys

WazobiaMail authenticates API requests using customer API keys prefixed with `wzbm_`. The key is automatically injected into the `X-API-Key` HTTP header.

### 1. Initialize with an explicit API key

```typescript
import { WazobiaMail } from 'wazobiamail';

const client = new WazobiaMail('wzbm_live_your_api_key_here');
```

### 2. Initialize from environment variables

Set `WAZOBIA_API_KEY` or `WAZOBIAMAIL_API_KEY` in your environment:

```bash
export WAZOBIA_API_KEY="wzbm_live_your_api_key_here"
```

Then initialize without arguments:

```typescript
import { WazobiaMail } from 'wazobiamail';

const client = new WazobiaMail();
```

### 3. Custom options (Base URL, Timeout, Custom Fetch)

```typescript
import { WazobiaMail } from 'wazobiamail';

const client = new WazobiaMail({
  apiKey: 'wzbm_live_your_api_key_here',
  baseUrl: 'https://app.wazobiamail.com/api/v1', // default
  timeout: 15_000, // 15 seconds
  headers: {
    'X-Custom-Client': 'my-saas-platform',
  },
});
```

> **Security Note:** The SDK implements safe inspection routines (`inspect` / `toJSON`). API keys are never exposed in log outputs or serialized errors.

---

## Quick Start: Sending Transactional Emails

Send transactional emails with HTML, text, attachments, CC/BCC, and reply-to:

```typescript
import { WazobiaMail } from 'wazobiamail';

const client = new WazobiaMail();

// High-level shortcut: client.send()
const response = await client.send({
  from: 'Acme Store <orders@mail.yourdomain.com>',
  to: 'customer@example.com',
  subject: 'Your order has shipped! 📦',
  html: '<h1>Order Confirmation</h1><p>Thank you for your order.</p>',
  text: 'Thank you for your order.',
  replyTo: 'support@yourdomain.com',
});

console.log('Message Queued! Tracking ID:', response.data.result.trackingId);
```

### Preventing duplicates with Idempotency Keys

```typescript
const response = await client.send(
  {
    to: 'customer@example.com',
    subject: 'Monthly Receipt',
    html: '<p>Invoice attached</p>',
  },
  { idempotencyKey: 'invoice_2026_11_order_99812' }
);
```

### Adding URL Attachments

```typescript
const response = await client.messages.send({
  from: 'Billing <billing@mail.yourdomain.com>',
  to: 'client@example.com',
  subject: 'Invoice #1042',
  html: '<p>Please find your invoice attached.</p>',
  attachments: [
    {
      url: 'https://cdn.yourdomain.com/invoices/1042.pdf',
      fileName: 'invoice-1042.pdf',
    },
  ],
});
```

---

## Deliverability & Spam Pre-flight Inspection

Analyze drafts before broadcasting to verify SpamAssassin penalty scores and deliverability:

```typescript
const report = await client.messages.spamCheck({
  subject: 'Claim your reward now!',
  htmlBody: '<p>Click here to win a free prize.</p>',
});

console.log('Deliverability Score (0-100):', report.data.deliverabilityScore);
console.log('Spam Score:', report.data.score); // e.g. 4.2
console.log('Findings:', report.data.findings);
console.log('Recommendations:', report.data.recommendations);
```

---

## Sending Domains & DNS Management

Programmatically manage email sending domains and check DNS records:

```typescript
// 1. Register a new sending domain
const domain = await client.domains.create({
  domain: 'mail.yourdomain.com',
  mailMode: 'hosted', // 'hosted' or 'sending_only'
});

console.log('Domain ID:', domain.data.id);

// 2. Fetch required DNS records (SPF, DKIM, MX, DMARC)
const dns = await client.domains.getDnsRecords(domain.data.id);
for (const record of dns.data.records) {
  console.log(`${record.recordType} ${record.name} -> ${record.value}`);
}

// 3. Trigger verification check
const check = await client.domains.verify(domain.data.id, { force: true });
console.log('Verified:', check.data.verified);

// 4. One-click Cloudflare DNS Sync
await client.domains.cloudflare.sync({ domainId: domain.data.id });
```

---

## Hosted Mailboxes & Enterprise Headless Inbox

Provision mailboxes for teams or query incoming customer mail programmatically:

```typescript
// 1. Create a hosted mailbox
const mailbox = await client.mailboxes.create({
  domainId: 'domain_id_here',
  localPart: 'support',
  displayName: 'Support Team',
});

console.log('Mailbox email:', mailbox.data.mailbox.email);
console.log('Generated SMTP/IMAP Password:', mailbox.data.credential?.password);

// 2. Query enterprise headless inbox messages (Enterprise Plan required)
const inbox = await client.mailboxes.messages.list(mailbox.data.mailbox.id, {
  unreadOnly: true,
  limit: 20,
});

for (const msg of inbox.data.items) {
  console.log(`[${msg.id}] From: ${msg.from} | Subject: ${msg.subject}`);
}

// 3. Read full message body and attachments
const detail = await client.mailboxes.messages.get(mailbox.data.mailbox.id, inbox.data.items[0].id);
console.log('HTML Body:', detail.data.htmlBody);
console.log('Attachments:', detail.data.attachments);

// 4. Delete processed message
await client.mailboxes.messages.delete(mailbox.data.mailbox.id, inbox.data.items[0].id);
```

---

## Scoped Sending API Keys & SMTP Relays

```typescript
// Create a restricted sending API key (isolated to email sending)
const key = await client.apiKeys.create({
  name: 'Store Checkout Sender',
  scope: 'general',
});

console.log('New Scoped Secret:', key.data.apiKey);

// Rotate key
const rotated = await client.apiKeys.regenerate(key.data.id);
console.log('Rotated Secret:', rotated.data.apiKey);
```

---

## Billing, Invoices & Email Credits

```typescript
// Check credit balance
const units = await client.units.getSummary();
console.log('Available email credits:', units.data.balance);

// List invoices
const invoices = await client.billing.listInvoices();

// Download invoice PDF
const pdfBuffer = await client.billing.downloadInvoice(invoices.data.items[0].id);
// In Node.js: fs.writeFileSync('invoice.pdf', Buffer.from(pdfBuffer))
```

---

## Error Handling

All SDK errors inherit from `WazobiaError`. Non-2xx API responses throw `WazobiaApiError` (or a specialized subclass) with HTTP status codes, error codes, and field validation dictionaries:

```typescript
import {
  WazobiaMail,
  WazobiaAuthenticationError,
  WazobiaForbiddenError,
  WazobiaValidationError,
  WazobiaRateLimitError,
  WazobiaNotFoundError,
} from 'wazobiamail';

const client = new WazobiaMail();

try {
  await client.send({
    from: 'invalid-email',
    to: 'customer@example.com',
    subject: 'Hello',
  });
} catch (error) {
  if (error instanceof WazobiaValidationError) {
    console.error('Validation failed (HTTP 422):', error.errors);
    // e.g. { from: "Invalid email address format" }
  } else if (error instanceof WazobiaAuthenticationError) {
    console.error('Invalid or expired API key (HTTP 401)');
  } else if (error instanceof WazobiaForbiddenError) {
    console.error('Feature requires plan upgrade (HTTP 403):', error.code);
  } else if (error instanceof WazobiaRateLimitError) {
    console.error(`Rate limited (HTTP 429). Retry in ${error.retryAfter}s`);
  } else if (error instanceof WazobiaNotFoundError) {
    console.error('Resource not found (HTTP 404)');
  } else {
    console.error('API Error:', error);
  }
}
```

---

## CommonJS Usage

For legacy CommonJS projects, import using `require`:

```javascript
const { WazobiaMail } = require('wazobiamail');

const client = new WazobiaMail(process.env.WAZOBIA_API_KEY);

client.send({
  from: 'Acme <sales@domain.com>',
  to: 'buyer@example.com',
  subject: 'Order Processed',
  html: '<p>Thank you!</p>',
}).then(res => {
  console.log('Queued:', res.data.result.trackingId);
});
```

---

## License

MIT License &copy; 2026 [Bonifade Technologies](https://bonifade.com) / Bowofade Oyerinde ([@oyenet1](https://github.com/oyenet1)).
