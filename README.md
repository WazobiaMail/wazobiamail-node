# WazobiaMail TypeScript & Node.js SDK

**Start free with 3,000 emails/month.** WazobiaMail is a Resend alternative for transactional email through an API or SMTP, with sending domains, hosted mailboxes and deliverability tools.

Official TypeScript and Node.js SDK for the [WazobiaMail](https://wazobiamail.com) API. Deliver transactional emails, manage verified custom domains, provision hosted mailboxes, and automate enterprise headless inboxes with zero runtime dependencies and 100% complete TypeScript types.

[![npm version](https://img.shields.io/npm/v/wazobiamail.svg)](https://www.npmjs.com/package/wazobiamail)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![Documentation](https://img.shields.io/badge/Docs-docs.wazobiamail.com-blueviolet.svg)](https://docs.wazobiamail.com)

> 📚 **Official Platform Documentation**: Visit [docs.wazobiamail.com](https://docs.wazobiamail.com) for exhaustive API references, architecture guides, DNS setup walkthroughs, and webhook configurations.

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
console.log('Rules:', report.data.rules);
console.log('Summary:', report.data.summary);
```

---

## Delivery Tracking, Stats, Read Receipts & Click Receipts

WazobiaMail provides built-in, granular observability for every transactional email dispatched.

### 1. Read Receipts (Open Tracking)
Every HTML email sent through WazobiaMail can automatically include an invisible, privacy-compliant 1x1 tracking pixel. When the recipient opens the email in their client (Apple Mail, Gmail, Outlook, etc.):
- An `email.opened` event is recorded.
- Captures the exact timestamp, recipient IP geolocation, device type, and client user-agent.
- Tracks unique opens vs. total open counts to accurately measure audience engagement.
- Queryable via `client.messages.getTracked(trackingId)` or streamed via real-time Webhooks.

### 2. Click Receipts (Link Tracking)
Links in your email content can be rewritten using your verified tracking domain (`email.mail.yourdomain.com` or `trk.wazobiamail.com`):
- When a recipient clicks any link, a `link.clicked` receipt is created with microsecond precision.
- Records the original destination URL, recipient email, click timestamp, and click count.
- Enables fraud detection, user engagement scoring, and automated lifecycle triggers.

### 3. Delivery Lifecycle & Timeline
Every message transitions through well-defined lifecycle states:
`queued` ➔ `sent` ➔ `delivered` ➔ `opened` ➔ `clicked` ➔ `bounced` / `complained`

```typescript
// Query tracking details and full receipt timeline
const tracking = await client.messages.getTracked('trk_abc123456');

const detail = tracking.data;
console.log('Status:', detail.message.status); // 'delivered', 'opened', 'bounced'
console.log('Last Delivery Event:', detail.message.lastDeliveryEventAt);
console.log('Opens Count (Read Receipts):', detail.message.openCount);
console.log('Clicks Count (Click Receipts):', detail.message.clickCount);

// Inspect granular event stream
for (const event of detail.events) {
  console.log(`[${event.occurredAt}] ${event.eventType} - Recipient: ${event.recipientEmail ?? ''}`);
  if (event.clickUrl) {
    console.log(`Clicked URL: ${event.clickUrl}`);
  }
}
```

### 4. Aggregated Delivery Stats & Metrics
Query delivery rates, open rates, click-through rates (CTR), and bounce classifications across your account or filtered by sending domain and date ranges:

```typescript
const stats = await client.messages.listTracked({
  status: 'delivered',
  limit: 100,
});

console.log('Total tracked messages:', stats.data.summary.messages);
for (const msg of stats.data.messages) {
  console.log(`${msg.trackingId}: ${msg.subject} -> ${msg.status} (${msg.openCount} opens, ${msg.clickCount} clicks)`);
}
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

console.log('Domain ID:', domain.data.domain.id);

// 2. Fetch required DNS records (SPF, DKIM, MX, DMARC)
const dns = await client.domains.getDnsRecords(domain.data.domain.id);
for (const record of dns.data.domain.records) {
  console.log(`${record.recordType} ${record.name} -> ${record.value}`);
}

// 3. Trigger verification check
const check = await client.domains.verify(domain.data.domain.id, { force: true });
console.log('Verification status:', check.data.verification.verificationStatus);

// 4. One-click Cloudflare DNS Sync
await client.domains.cloudflare.sync({ domainId: domain.data.domain.id });
```

---

### 🌐 Subdomain vs. Apex / Root Domain Architecture & Edge Cases

When configuring custom domains for transactional sending, choosing between a **subdomain** (e.g. `mail.yourdomain.com` or `send.yourdomain.com`) and an **apex/root domain** (`yourdomain.com`) is a critical architectural decision.

#### 1. Why Using a Subdomain is Recommended (Root Domain NOT Used)

In production environments, **we strongly recommend using a dedicated sending subdomain** rather than your root/apex domain:

- **Preserve Existing Business Email (Google Workspace / Microsoft 365):**
  If your root domain (`yourdomain.com`) already receives corporate email via Google Workspace or Microsoft 365, adding MX records pointing to WazobiaMail at the root apex `@` will **break your existing company email inbox routing**. Using `mail.yourdomain.com` isolates transactional email routing completely.
- **Isolate Sender Reputation:**
  Transactional emails (password resets, invoices, OTP codes) have high engagement and deliverability requirements. Sending from a subdomain (`mail.yourdomain.com`) ensures that any accidental marketing spam complaints won't degrade your corporate employee email deliverability.
- **Avoid SPF 10-Lookup Limit Exhaustion (RFC 7208):**
  SPF records have a strict limit of 10 DNS lookups. Root domains often accumulate multiple SaaS providers (Google, Zendesk, Salesforce, HubSpot). A dedicated subdomain gives WazobiaMail its own clean, independent SPF record without lookup count contention.

#### 2. DNS Hostnames When Root Domain is NOT Used

When verifying a subdomain like `mail.yourdomain.com`, ensure you configure your DNS provider (Cloudflare, Route53, Namecheap, GoDaddy) with the correct hostnames:

| Record Type | Host / Name (if domain is `mail.yourdomain.com`) | Target / Value | Notes |
| :--- | :--- | :--- | :--- |
| **TXT (SPF)** | `mail` (or `mail.yourdomain.com`) | `v=spf1 include:_spf.wazobiamail.com ~all` | **Do NOT** place on `@` root |
| **TXT (DKIM)** | `wzbm._domainkey.mail` | `k=rsa; p=MIGfMA0GCSqGSIb3...` | Selector is scoped to the subdomain |
| **MX (Hosted)**| `mail` (priority 10 / 20) | `mx1.wazobiamail.com` / `mx2.wazobiamail.com` | Only required if receiving mail or hosted inboxes |
| **CNAME (Tracking)** | `email.mail` | `trk.wazobiamail.com` | Used for custom branded click/open tracking |
| **TXT (DMARC)** | `_dmarc.mail` (or fallback to `_dmarc`) | `v=DMARC1; p=reject; rua=mailto:dmarc@...` | Resolvers fall back to apex `_dmarc` if omitted |

#### 3. Critical Edge Cases & Troubleshooting

##### ⚠️ Edge Case 1: `UnverifiedSenderDomain` (HTTP 422 / 403)
- If you verified `mail.yourdomain.com` in WazobiaMail, your `from` address **must** match that subdomain:
  - ✅ **Valid**: `from: 'Acme <billing@mail.yourdomain.com>'`
  - ❌ **Invalid**: `from: 'Acme <billing@yourdomain.com>'` (Fails because apex `yourdomain.com` is unverified)
- Attempting to send from an unverified parent domain will be rejected with an `UnverifiedSenderDomain` error.

##### 💡 Edge Case 2: Reply-To Decoupling (Best Practice)
- You can send from the verified subdomain while routing customer replies to your corporate root domain mailbox:
  ```typescript
  await client.send({
    from: 'Acme Orders <orders@mail.yourdomain.com>', // Verified sending subdomain
    replyTo: 'support@yourdomain.com',               // Your corporate inbox on Google Workspace/Outlook
    to: 'customer@example.com',
    subject: 'Your receipt',
    html: '<p>Thank you for your purchase!</p>',
  });
  ```
- This gives you the deliverability benefits of a dedicated sending subdomain while preserving user-friendly reply handling.

##### ☁️ Edge Case 3: Cloudflare Proxy Status (Grey Cloud vs. Orange Cloud)
- **Problem**: In Cloudflare DNS, leaving the proxy enabled (**Orange Cloud**) for mail or tracking records breaks SMTP traffic, DNS verification, and SSL certificate issuance.
- **Solution**: Always toggle Cloudflare records to **"DNS only" (Grey Cloud / Proxied: Off)** for all WazobiaMail SPF, DKIM, MX, and tracking records. If you use `client.domains.cloudflare.sync()`, this is handled automatically.

##### ⏳ Edge Case 4: Negative DNS Caching (SOA Minimum TTL Delay)
- If you run `client.domains.verify(domainId)` immediately after publishing DNS records before they propagate, recursive resolvers may cache the negative response (`NXDOMAIN` or empty record).
- Subsequent verification checks will continue to fail until the DNS TTL expires (often 5 to 60 minutes).
- **Tip**: Test propagation first with `dig TXT mail.yourdomain.com` or `dig TXT wzbm._domainkey.mail.yourdomain.com +trace` before triggering verification, or pass `{ force: true }`.

##### 🛡️ Edge Case 5: DMARC Subdomain Policy (`sp=`) Inheritance
- If your apex domain (`yourdomain.com`) has a DMARC record with `sp=reject` or `sp=quarantine`:
  - Any subdomain (e.g. `mail.yourdomain.com`) automatically inherits that rejection policy unless it defines its own `_dmarc.mail.yourdomain.com` record.
  - If SPF or DKIM alignment fails on the subdomain, recipient mail servers (Gmail, Yahoo, Outlook) will reject or spam-folder your emails immediately. Ensure both SPF and DKIM pass before sending production traffic.

##### 📬 Edge Case 6: Headless Inboxes & Hosted Mailboxes on Subdomains
- When provisioning hosted mailboxes (`client.mailboxes.create({ domainId, localPart: 'support' })`), the mailbox address is generated under the specific verified domain (e.g. `support@mail.yourdomain.com`).
- Inbound receiving requires the MX records for that exact subdomain to be pointing to WazobiaMail. Do not point the root domain MX to WazobiaMail if you have existing email services there.

##### 🔁 Edge Case 7: Network Timeouts & Idempotency
- If an HTTP request times out due to transient network issues, the email may already have been queued by the API Gateway.
- Always provide an `idempotencyKey` when dispatching critical transactional messages. Retrying with the same key returns the existing tracking receipt without duplicate sending.

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

console.log('Mailbox email:', mailbox.data.address);

// Issue an SMTP/IMAP password separately; the secret is returned only once.
const credential = await client.mailboxes.createCredentials(mailbox.data.id);
console.log('Generated SMTP/IMAP Password:', credential.data.credential.password);

// 2. Query enterprise headless inbox messages (Enterprise Plan required)
const inbox = await client.mailboxes.messages.list(mailbox.data.id, {
  unreadOnly: true,
  limit: 20,
});

for (const msg of inbox.data.items) {
  console.log(`[${msg.id}] From: ${msg.from[0]?.email ?? ''} | Subject: ${msg.subject}`);
}

// 3. Read full message body and attachments
const detail = await client.mailboxes.messages.get(mailbox.data.id, inbox.data.items[0].id);
console.log('HTML Body:', detail.data.htmlBody);
console.log('Attachments:', detail.data.attachments);

// 4. Delete processed message
await client.mailboxes.messages.delete(mailbox.data.id, inbox.data.items[0].id);
```

---

## Scoped Sending API Keys & SMTP Relays

```typescript
// Create a restricted sending API key (isolated to email sending)
const key = await client.apiKeys.create({
  name: 'Store Checkout Sender',
  scope: 'general',
});

console.log('New Scoped Secret:', key.data.apiKey.apiKey);

// Rotate key
const rotated = await client.apiKeys.regenerate(key.data.apiKey.id);
console.log('Rotated Secret:', rotated.data.apiKey.apiKey);
```

---

## Billing, Invoices & Email Credits

```typescript
// Check credit balance
const units = await client.units.getSummary();
console.log('Available email credits:', units.data.includedRemaining + units.data.purchasedBalance);

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

---

## Official WazobiaMail SDKs

WazobiaMail is a **Resend alternative** for transactional email through an **API or SMTP**, with sending domains, hosted mailboxes and deliverability tools. Start free with **3,000 emails/month**.

The SDKs below all use the WazobiaMail API; SMTP/legacy clients that need SMTP submission can use WazobiaMail's SMTP access from the dashboard. Choose the package that matches your stack:

| Platform | Install | Registry | Source |
| --- | --- | --- | --- |
| TypeScript / Node.js | `npm install wazobiamail` | [npm](https://www.npmjs.com/package/wazobiamail) | [GitHub](https://github.com/WazobiaMail/wazobiamail-node) |
| Vue 3 | `npm install wazobiamail-vue wazobiamail` | [npm](https://www.npmjs.com/package/wazobiamail-vue) | [GitHub](https://github.com/WazobiaMail/wazobiamail-vue) |
| Nuxt 3 & 4 | `npm install wazobiamail-nuxt` | [npm](https://www.npmjs.com/package/wazobiamail-nuxt) | [GitHub](https://github.com/WazobiaMail/wazobiamail-nuxt) |
| Python | `pip install wazobiamail` | [PyPI](https://pypi.org/project/wazobiamail/) | [GitHub](https://github.com/WazobiaMail/wazobiamail-python) |
| PHP | `composer require wazobiamail/wazobiamail-php` | [Packagist](https://packagist.org/packages/wazobiamail/wazobiamail-php) | [GitHub](https://github.com/WazobiaMail/wazobiamail-php) |
| Laravel | `composer require wazobiamail/wazobiamail-laravel` | [Packagist](https://packagist.org/packages/wazobiamail/wazobiamail-laravel) | [GitHub](https://github.com/WazobiaMail/wazobiamail-laravel) |
| Rust | `cargo add wazobiamail` | [crates.io](https://crates.io/crates/wazobiamail) | [GitHub](https://github.com/WazobiaMail/wazobiamail-rust) |
| WordPress | Upload the plugin ZIP | [GitHub releases](https://github.com/WazobiaMail/wazobiamail-wordpress/releases) | [GitHub](https://github.com/WazobiaMail/wazobiamail-wordpress) |

### What each package gives you

- **TypeScript / Node.js (`wazobiamail`)** — A zero-production-dependency typed client for Node.js 18+, Bun, Deno and edge runtimes. It ships ESM and CommonJS builds, typed errors, request builders, URL/multipart attachments, and resources for messages, domains, mailboxes, API keys, billing, units, plans, tracking, spam checks and support.
- **Vue 3 (`wazobiamail-vue`)** — A Vue plugin plus reactive composables: `useSendMail` for loading/success/error state, `useMailbox` for paginated headless inboxes with polling and optimistic delete, `useDomains` for domain/DNS workflows, and `useSpamCheck` for pre-flight deliverability checks.
- **Nuxt 3 & 4 (`wazobiamail-nuxt`)** — Keeps `runtimeConfig.wazobiamail.apiKey` on the Nitro server, adds the auto-imported `serverWazobiaClient(event)` helper, and auto-imports the Vue composables. Ideal for Nuxt apps that must not expose an API key to the browser bundle.
- **Python (`wazobiamail`)** — A synchronous, PEP 561-compliant client with **zero runtime dependencies** (standard library only), dataclass models and typed responses. Works in Django (sync views or `sync_to_async`), FastAPI (`def` endpoints or `run_in_threadpool`), Flask, scripts and workers. Includes webhook HMAC verification.
- **PHP (`wazobiamail/wazobiamail-php`)** — A Composer/Guzzle 7 client for PHP 8.1+. It accepts ergonomic flat send payloads or the canonical nested `content` shape, supports URL attachments and automatic multipart upload for inline files, and maps API failures to typed exceptions.
- **Laravel (`wazobiamail/wazobiamail-laravel`)** — Registers a native `wazobiamail` mail driver, service provider and `WazobiaMail` facade for Laravel 10–13. Existing `Mail`, Mailables and notifications keep working; the package also exposes domains, mailboxes and webhook verification.
- **Rust (`wazobiamail`)** — Async, strongly typed and `#![forbid(unsafe_code)]`, built on reqwest/tokio. Includes fluent request builders, typed response models, typed errors, secret masking in `Debug`, and resources for sending, domains, Cloudflare DNS, mailboxes, templates, tracking and billing.
- **WordPress (`wazobiamail-wordpress`)** — Routes every `wp_mail()` call through the WazobiaMail API without changing forms or plugins. It registers the site domain, displays SPF/DKIM/DMARC/MX records, verifies DNS, uploads attachments, and keeps recent delivery receipts in the admin screen.

### Documentation links

- [Official SDK guide and examples](https://docs.wazobiamail.com/docs/guides/sdks)
- [API reference](https://docs.wazobiamail.com/docs/api-reference)
- [Authentication and API keys](https://docs.wazobiamail.com/docs/guides/authentication)
- [Sending domains and DNS](https://docs.wazobiamail.com/docs/guides/domains)
- [Webhooks](https://docs.wazobiamail.com/docs/guides/webhooks)
