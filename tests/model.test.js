import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialData, isCalendarDate, isSnapshot, createHackathon, isWebUrl } from '../src/model.js';
import { preferredLanguage } from '../src/i18n.js';

test('calendar dates respect leap years, month lengths and calendar boundaries', () => {
  for (const date of ['2026-10-26', '2024-02-29', '2000-02-29', '0001-01-01', '9999-12-31']) assert.equal(isCalendarDate(date), true, date);
  for (const date of ['2026-02-29', '1900-02-29', '2026-04-31', '2026-00-15', '2026-13-01', '2026-01-00', '0000-01-01', '2026-1-01', '', null, '2026-10-26T12:00:00Z']) assert.equal(isCalendarDate(date), false, String(date));
});

test('invalid setup returns field errors and leaves the original data unchanged', () => {
  const before = initialData('ru');
  const result = createHackathon(before, { name: '   ', deadline: '' });
  assert.deepEqual(result, { ok: false, errors: { name: 'nameRequired', deadline: 'dateRequired' } });
  assert.equal(before.hackathon, null);
  assert.equal(createHackathon(before, { name: 'Demo', deadline: '2026-02-30' }).errors.deadline, 'dateInvalid');
});

test('creating a hackathon preserves the date, chosen language and user content', () => {
  const before = initialData('ru');
  const result = createHackathon(before, { name: '  Первый MVP 🚀 <demo>  ', deadline: '2026-10-26' });
  assert.equal(result.ok, true);
  assert.deepEqual(result.data.hackathon, { name: 'Первый MVP 🚀 <demo>', deadline: '2026-10-26' });
  assert.equal(result.data.language, 'ru');
  assert.equal(before.hackathon, null);
  assert.equal(isSnapshot(result.data), true);
});

test('only structurally valid saved preparation is accepted', () => {
  const valid = createHackathon(initialData(), { name: 'Demo', deadline: '2026-10-26' }).data;
  const task = { id: 'a', title: 'Prepare', assignee: '', completed: false };
  assert.equal(isSnapshot(initialData()), true);
  assert.equal(isSnapshot({ ...valid, tasks: [task] }), true);
  for (const invalid of [null, [], {}, { ...valid, version: 2 }, { ...valid, language: 'de' }, { ...valid, tasks: [task, task] }, { ...valid, tasks: [{ ...task, completed: 'yes' }] }, { ...initialData(), tasks: [task] }, { ...valid, news: [{ id: 'n', title: 'Update', url: 'javascript:alert(1)' }] }]) assert.equal(isSnapshot(invalid), false);
});

test('saved news URLs must use an actual http or https address', () => {
  for (const url of ['https://devpost.com/', 'http://example.com/news?item=1']) assert.equal(isWebUrl(url), true);
  for (const url of ['javascript:alert(1)', 'data:text/html,demo', 'file:///demo', 'not a URL', '']) assert.equal(isWebUrl(url), false);
});

test('the primary browser language selects Russian only for ru language tags', () => {
  assert.equal(preferredLanguage('ru-RU'), 'ru');
  assert.equal(preferredLanguage('RU'), 'ru');
  assert.equal(preferredLanguage('en-US'), 'en');
  assert.equal(preferredLanguage('kk-KZ'), 'en');
});
