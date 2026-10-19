import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStorage, STORAGE_KEY } from '../src/storage.js';
import { createHackathon, initialData } from '../src/model.js';

function memoryStorage(entries = []) {
  const values = new Map(entries);
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('an empty browser is a first visit without an error', () => {
  assert.deepEqual(createStorage(() => memoryStorage()).load(), { status: 'empty', data: null });
});

test('a fresh storage instance restores the whole preparation and language', () => {
  const browser = memoryStorage([['another-app', 'keep me']]);
  const data = createHackathon(initialData('ru'), { name: 'Build With AI', deadline: '2026-10-26' }).data;
  data.tasks.push({ id: 't1', title: 'Record video', assignee: 'Alex', completed: true });
  data.news.push({ id: 'n1', title: 'Official details', url: 'https://devpost.com/' });
  assert.deepEqual(createStorage(() => browser).save(data), { status: 'ok' });
  assert.deepEqual(createStorage(() => browser).load(), { status: 'ok', data });
  assert.equal(browser.values.get('another-app'), 'keep me');
});

test('a language choice can be saved before creating a hackathon', () => {
  const browser = memoryStorage();
  createStorage(() => browser).save(initialData('ru'));
  assert.equal(createStorage(() => browser).load().data.language, 'ru');
  assert.equal(createStorage(() => browser).load().data.hackathon, null);
});

test('corrupt JSON and unknown schemas are not overwritten', () => {
  for (const raw of ['{broken', JSON.stringify({ ...initialData(), version: 2 }), 'null']) {
    const browser = memoryStorage([[STORAGE_KEY, raw]]);
    const storage = createStorage(() => browser);
    assert.equal(storage.load().status, 'invalid');
    assert.equal(storage.save(initialData()).status, 'invalid');
    assert.equal(browser.values.get(STORAGE_KEY), raw);
  }
});

test('unavailable access and quota failures do not mutate the live data', () => {
  const data = initialData('ru');
  const before = structuredClone(data);
  const inaccessible = createStorage(() => { throw new Error('Access denied'); });
  assert.equal(inaccessible.load().status, 'unavailable');
  assert.equal(inaccessible.save(data).status, 'unavailable');
  const quotaFailure = createStorage(() => ({ setItem() { throw new Error('Quota exceeded'); } }));
  assert.equal(quotaFailure.save(data).status, 'unavailable');
  assert.deepEqual(data, before);
});

test('a later change may save successfully after a temporary failure', () => {
  const browser = memoryStorage();
  let unavailable = true;
  const storage = createStorage(() => { if (unavailable) throw new Error('Unavailable'); return browser; });
  assert.equal(storage.load().status, 'unavailable');
  assert.equal(storage.save(initialData()).status, 'unavailable');
  unavailable = false;
  assert.equal(storage.save(initialData()).status, 'ok');
  assert.equal(storage.load().status, 'ok');
});
