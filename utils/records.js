import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { cloud } from './cloud';

const KEY = 'aulamix.records.v1';
let owner = null;
let queue = Promise.resolve();
let syncing = null;
const listeners = new Set();
export const subscribeRecords = (listener) => { listeners.add(listener); return () => listeners.delete(listener); };
const emit = () => listeners.forEach((listener) => listener());
export const setRecordOwner = (id) => { owner = id || null; emit(); };
const read = async () => JSON.parse(await AsyncStorage.getItem(KEY) || '[]');
const mutate = (update) => {
  const task = queue.then(async () => {
    const records = await update(await read());
    await AsyncStorage.setItem(KEY, JSON.stringify(records));
    emit();
    return records;
  });
  queue = task.catch(() => {});
  return task;
};
export async function listRecords() {
  const id = owner;
  if (!id) return [];
  await queue;
  const records = await read();
  if (owner !== id) return [];
  return records.filter((r) => r.userId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function saveRecord(payload, { expectedUserId = owner } = {}) {
  const id = owner;
  if (!id) {
    if (expectedUserId) throw new Error('La cuenta cambió. Revisa la sesión antes de guardar.');
    return { saved: false };
  }
  if (expectedUserId !== id) throw new Error('La cuenta cambió. Revisa la sesión antes de guardar.');
  const record = { id: Crypto.randomUUID(), userId: id, createdAt: new Date().toISOString(), payload, synced: false };
  await mutate((records) => {
    if (owner !== id) throw new Error('La cuenta cambió. Revisa la sesión antes de guardar.');
    // Reprinting the same snapshot must not create duplicate history entries.
    const exists = records.some((r) => r.userId === id && JSON.stringify(r.payload) === JSON.stringify(payload));
    return exists ? records : [...records, record];
  });
  void syncRecords();
  return { saved: true };
}
export function syncRecords() {
  if (syncing) return syncing;
  syncing = performSync().catch((error) => ({ error: error.message || 'No se pudo conectar. Se reintentará automáticamente.' }))
    .finally(() => { syncing = null; });
  return syncing;
}
async function performSync() {
  const id = owner;
  if (!cloud || !id) return {};
  const { data: { session }, error: authError } = await cloud.auth.getSession();
  if (authError) throw authError;
  if (session?.user.id !== id) throw new Error('Inicia sesión nuevamente para sincronizar esta cuenta.');
  await queue;
  const pending = (await read()).filter((r) => r.userId === id && !r.synced);
  if (owner !== id) return {};
  if (pending.length) {
    const { error } = await cloud.from('records').upsert(pending.map((r) => ({
      id: r.id, user_id: id, created_at: r.createdAt, payload: r.payload,
    })), { onConflict: 'id', ignoreDuplicates: true });
    if (error) throw error;
    const sent = new Set(pending.map((r) => r.id));
    await mutate((records) => records.map((r) => r.userId === id && sent.has(r.id) ? { ...r, synced: true } : r));
  }
  // Paginate so accounts with more than the server's row limit restore completely.
  for (let offset = 0; ; offset += 500) {
    if (owner !== id) return {};
    const { data, error } = await cloud.from('records').select('*').eq('user_id', id)
      .order('id').range(offset, offset + 499);
    if (error) throw error;
    await mutate((records) => {
      const known = new Set(records.map((r) => r.id));
      return [...records, ...data.filter((r) => !known.has(r.id)).map((r) => ({
        id: r.id, userId: id, createdAt: r.created_at, payload: r.payload, synced: true,
      }))];
    });
    if (data.length < 500) break;
  }
  return {};
}
