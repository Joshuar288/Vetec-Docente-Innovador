const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('utils/accountAccess.js', 'utf8').replace(/export /g, '') + '\nthis.api = { accessMode, validName, normalizeName };', context);
const { accessMode, validName, normalizeName } = context.api;
test('protected platform requires an account with a name or an explicit guest choice', () => {
  assert.equal(accessMode({ ready: false }), 'loading');
  assert.equal(accessMode({ ready: true }), 'login');
  assert.equal(accessMode({ ready: true, guest: true }), 'guest');
  assert.equal(accessMode({ ready: true, user: { id: 'A' } }), 'profile');
  assert.equal(accessMode({ ready: true, guest: true, user: { id: 'A' } }), 'profile');
  assert.equal(accessMode({ ready: true, user: { id: 'A', user_metadata: { app_name: 'Ana' } } }), 'account');
});
test('Google name alone does not bypass explicit profile completion', () => {
  assert.equal(accessMode({ ready: true, user: { id: 'A', user_metadata: { full_name: 'Google Name' } } }), 'profile');
});
test('normalizes name and rejects empty or oversized input', () => {
  assert.equal(normalizeName('  Ana   María  '), 'Ana María');
  for (const name of ['', ' ', 'A', 'a'.repeat(81), null]) assert.equal(validName(name), false);
  assert.equal(validName('Ana María'), true);
});
