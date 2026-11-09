/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

import { describe, it, expect } from 'bun:test';
import { resolve } from 'path';

describe('Built Bundle Imports (Dual ESM & CommonJS Verification)', () => {
  it('imports the built ESM module cleanly', async () => {
    const esmPath = resolve(__dirname, '../dist/index.js');
    const esmModule = await import(esmPath);

    expect(esmModule.WazobiaMail).toBeDefined();
    expect(esmModule.Wazobia).toBeDefined();
    expect(esmModule.WazobiaApiError).toBeDefined();
    expect(esmModule.WazobiaAuthenticationError).toBeDefined();

    const client = new esmModule.WazobiaMail('wzbm_live_esm_test');
    expect(client).toBeInstanceOf(esmModule.WazobiaMail);
  });

  it('requires the built CommonJS module cleanly', () => {
    const cjsPath = resolve(__dirname, '../dist/index.cjs');
    // Using require via createRequire
    const { createRequire } = require('module');
    const customRequire = createRequire(import.meta.url);
    const cjsModule = customRequire(cjsPath);

    expect(cjsModule.WazobiaMail).toBeDefined();
    expect(cjsModule.Wazobia).toBeDefined();
    expect(cjsModule.WazobiaApiError).toBeDefined();
    expect(cjsModule.WazobiaAuthenticationError).toBeDefined();

    const client = new cjsModule.WazobiaMail('wzbm_live_cjs_test');
    expect(client).toBeInstanceOf(cjsModule.WazobiaMail);
  });
});
