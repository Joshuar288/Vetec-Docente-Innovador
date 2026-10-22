const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup({ platform = 'android', result = { type: 'cancel' }, exchangeError, expoGo = false, configured = true } = {}) {
  let exchanges = 0; let options; let destination;
  const cloud = configured ? { auth: {
    signInWithOAuth: async (input) => { options = input; return { data: { url: 'https://example.supabase.co/auth/v1/authorize' } }; },
    exchangeCodeForSession: async () => { exchanges++; return { data: { session: { user: { id: 'google-user' } } }, error: exchangeError }; },
  } } : null;
  const context = vm.createContext({ Platform: { OS: platform }, Constants: { appOwnership: expoGo ? 'expo' : null },
    makeRedirectUri: () => 'mi-vetec://auth/callback', WebBrowser: { openAuthSessionAsync: async () => result }, cloud, URL,
    window: { location: { origin: 'https://aulamix.example', assign: (url) => { destination = url; } } },
  });
  const source = fs.readFileSync('utils/googleAuth.js', 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export /g, '');
  vm.runInContext(source + '\nthis.api = { continueWithGoogle, completeGoogleSignIn };', context);
  return { api: context.api, exchanges: () => exchanges, options: () => options, destination: () => destination };
}
test('browser and callback exchange the same Google code only once', async () => {
  const s = setup({ result: { type: 'success', url: 'mi-vetec://auth/callback?code=single-use-code' } });
  await s.api.continueWithGoogle(); await s.api.completeGoogleSignIn('single-use-code');
  assert.equal(s.exchanges(), 1);
  assert.equal(s.options().provider, 'google');
  assert.equal(s.options().options.redirectTo, 'mi-vetec://auth/callback');
});
test('cancellation does not create a session', async () => {
  const s = setup(); assert.equal((await s.api.continueWithGoogle()).cancelled, true); assert.equal(s.exchanges(), 0);
});
test('rejects wrong callback destinations, missing codes and denied consent', async () => {
  for (const url of ['other://auth/callback?code=x', 'mi-vetec://wrong/callback?code=x', 'mi-vetec://auth/callback', 'mi-vetec://auth/callback?error=access_denied']) {
    const s = setup({ result: { type: 'success', url } });
    await assert.rejects(s.api.continueWithGoogle()); assert.equal(s.exchanges(), 0);
  }
});
test('web redirects to Google and returns to the same origin', async () => {
  const s = setup({ platform: 'web' }); await s.api.continueWithGoogle();
  assert.equal(s.options().options.redirectTo, 'https://aulamix.example/auth/callback');
  assert.equal(s.destination(), 'https://example.supabase.co/auth/v1/authorize');
});
test('missing configuration, Expo Go and failed exchanges return errors', async () => {
  await assert.rejects(setup({ configured: false }).api.continueWithGoogle(), /configura Supabase/);
  await assert.rejects(setup({ expoGo: true }).api.continueWithGoogle(), /Expo Go/);
  const s = setup({ exchangeError: new Error('invalid verifier'), result: { type: 'success', url: 'mi-vetec://auth/callback?code=bad-code' } });
  await assert.rejects(s.api.continueWithGoogle(), /invalid verifier/);
});
