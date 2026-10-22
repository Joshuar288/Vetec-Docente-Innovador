const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');

function setup() {
  const disk = new Map();
  const remote = new Map();
  let user = 'A';
  let offline = true;
  let loseResponse = false;
  let failDisk = false;
  const cloud = {
    auth: { getSession: async () => ({ data: { session: { user: { id: user } } } }) },
    from: () => ({
      upsert: async (rows) => {
        if (offline) return { error: new Error('offline') };
        for (const row of rows) { assert.equal(row.user_id, user); if (!remote.has(row.id)) remote.set(row.id, row); }
        if (loseResponse) { loseResponse = false; return { error: new Error('lost response') }; }
        return {};
      },
      select: () => ({ eq: (_field, id) => ({ order: () => ({ range: async (start, end) => offline
        ? { error: new Error('offline') }
        : { data: [...remote.values()].filter((r) => r.user_id === id).slice(start, end + 1) } }) }) }),
    }),
  };
  const source = fs.readFileSync('utils/records.js', 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export /g, '');
  const context = vm.createContext({ AsyncStorage: {
    getItem: async (key) => disk.get(key) || null,
    setItem: async (key, value) => { if (failDisk) throw new Error('disk full'); disk.set(key, value); },
  }, Crypto: { randomUUID }, cloud, setTimeout });
  vm.runInContext(source + '\nthis.api = {setRecordOwner,saveRecord,listRecords,syncRecords};', context);
  return { api: context.api, disk, remote, user: (id) => { user = id; context.api.setRecordOwner(id); }, online: () => { offline = false; }, lose: () => { loseResponse = true; }, failDisk: () => { failDisk = true; } };
}
const payload = { title: 'Dosis', rows: [], results: [{ label: 'Resultado', value: '2' }] };

test('offline saves survive restart, sync retries are idempotent and restore from cloud', async () => {
  const s = setup(); s.user('A');
  await Promise.all([s.api.saveRecord(payload), s.api.saveRecord({ ...payload, title: 'Kardex' })]);
  await s.api.syncRecords();
  assert.equal((await s.api.listRecords()).length, 2);
  assert.equal((await s.api.listRecords())[0].synced, false);
  s.online(); s.lose();
  assert.ok((await s.api.syncRecords()).error);
  assert.equal(s.remote.size, 2);
  assert.equal((await s.api.listRecords())[0].synced, false);
  await s.api.syncRecords();
  assert.equal(s.remote.size, 2);
  assert.ok((await s.api.listRecords()).every((r) => r.synced));
  s.disk.clear(); // Simulate reinstall: only server data survives.
  await s.api.syncRecords();
  assert.equal((await s.api.listRecords()).length, 2);
});
test('guest mode never writes to disk or cloud; accounts remain isolated', async () => {
  const s = setup();
  await s.api.saveRecord(payload); await s.api.syncRecords();
  assert.equal(s.disk.size, 0);
  assert.equal(s.remote.size, 0);
  s.user('A');
  assert.equal((await s.api.listRecords()).length, 0);
  await s.api.saveRecord(payload);
  await s.api.saveRecord(payload); await s.api.syncRecords();
  assert.equal((await s.api.listRecords()).length, 1);
  s.user('B'); s.online();
  await s.api.syncRecords();
  assert.equal((await s.api.listRecords()).length, 0);
  assert.equal(s.remote.size, 0);
  s.user('A'); await s.api.syncRecords();
  assert.equal(s.remote.size, 1);
});
test('storage failure rejects saving and never reports success', async () => {
  const s = setup(); s.user('A'); s.failDisk();
  await assert.rejects(s.api.saveRecord(payload), /disk full/);
  assert.equal((await s.api.listRecords()).length, 0);
});

test('guest cannot see legacy guest records or inherit account history', async () => {
  const s = setup(); s.user('A'); await s.api.saveRecord(payload); await s.api.syncRecords();
  s.user(null);
  assert.equal((await s.api.listRecords()).length, 0);
  const before = [...s.disk.values()][0];
  await s.api.saveRecord({ ...payload, title: 'Guest activity' });
  assert.equal([...s.disk.values()][0], before);
  s.user('A');
  assert.equal((await s.api.listRecords()).length, 1);
});
test('restores more than 1000 records using pagination', async () => {
  const s = setup(); s.user('A'); s.online();
  for (let i = 0; i < 1201; i++) s.remote.set(String(i), { id: String(i), user_id: 'A', created_at: new Date().toISOString(), payload });
  await s.api.syncRecords();
  assert.equal((await s.api.listRecords()).length, 1201);
});

test('rejects a save from a screen belonging to a different signed-in user', async () => {
  const s = setup(); s.user('B');
  await assert.rejects(s.api.saveRecord(payload, { expectedUserId: 'A' }), /cuenta cambió/);
  assert.equal((await s.api.listRecords()).length, 0);
  assert.equal(s.remote.size, 0);
});

test('account switch while a save is queued cannot assign it to another account', async () => {
  const s = setup(); s.user('A');
  const saving = s.api.saveRecord(payload, { expectedUserId: 'A' });
  s.user('B');
  await assert.rejects(saving, /cuenta cambió/);
  assert.equal((await s.api.listRecords()).length, 0);
  s.user('A');
  assert.equal((await s.api.listRecords()).length, 0);
});
