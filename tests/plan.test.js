import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialData, createHackathon, addTask, addNews, setTaskCompleted, updateTask, removeTask,
  addStarterPlan, starterPlanCount, nextPreparationStep, daysUntilDeadline, preparationProgress, isSnapshot, taskDisplayTitle } from '../src/model.js';
import { deadlineLabel } from '../src/i18n.js';

const base = language => createHackathon(initialData(language), { name: 'Demo', deadline: '2026-10-26' }).data;
const date = (year, month, day, hour = 12) => {
  const value = new Date(0);
  value.setFullYear(year, month - 1, day);
  value.setHours(hour, 0, 0, 0);
  return value;
};

test('starter plan appends six usable tasks without changing existing records or the original data', () => {
  let data = addTask(base('ru'), { title: 'My task', assignee: 'Alex' }, 'manual').data;
  data = setTaskCompleted(data, 'manual', true);
  data = addNews(data, { title: 'Rules', url: 'https://example.com/' }, 'news').data;
  const result = addStarterPlan(data);
  assert.equal(result.tasks.length, 7);
  assert.deepEqual(result.tasks[0], data.tasks[0]);
  assert.deepEqual(result.news, data.news);
  assert.equal(data.tasks.length, 1);
  assert.equal(result.tasks[1].title, 'Уточнить идею');
  assert.ok(result.tasks.slice(1).every(task => task.assignee === '' && task.completed === false));
  assert.equal(isSnapshot(result), true);
  assert.equal(preparationProgress(result.tasks).percent, 14);
  assert.deepEqual(addStarterPlan(initialData()), initialData());
});

test('saved starter identity prevents duplicates after edits, completion and a language change', () => {
  let data = addStarterPlan(base('en'));
  const first = data.tasks[0].id;
  data = updateTask(data, first, { title: 'Our own idea step', assignee: 'Alex' }).data;
  data = setTaskCompleted(data, first, true);
  data = JSON.parse(JSON.stringify({ ...data, language: 'ru' }));
  const again = addStarterPlan(data);
  assert.deepEqual(again, data);
  assert.equal(again.tasks.length, 6);
  assert.equal(again.tasks[0].title, 'Our own idea step');
  assert.equal(again.tasks[1].title, 'Build the MVP');
  assert.equal(starterPlanCount(again.tasks), 6);
  assert.equal(isSnapshot(again), true);
});

test('restoring a missing starter step is explicit and keeps the other five edits and marks', () => {
  let data = addStarterPlan(base('en'));
  const removed = data.tasks[2].id;
  data = setTaskCompleted(data, data.tasks[0].id, true);
  data = removeTask(data, removed);
  assert.equal(starterPlanCount(data.tasks), 5);
  const restored = addStarterPlan({ ...data, language: 'ru' });
  assert.deepEqual(restored.tasks.slice(0, 5), data.tasks);
  assert.equal(restored.tasks.at(-1).id, removed);
  assert.equal(restored.tasks.at(-1).title, 'Проверить приложение');
  assert.equal(restored.tasks[0].completed, true);
  assert.equal(addStarterPlan(restored).tasks.length, 6);
});

test('existing Russian starter tasks display in English after switching and reopening without changing saved task data', () => {
  let data = addStarterPlan(base('ru'));
  data = setTaskCompleted(data, data.tasks[1].id, true);
  data = updateTask(data, data.tasks[0].id, { title: data.tasks[0].title, assignee: 'Alex' }).data;
  const before = JSON.stringify(data.tasks);
  const restored = JSON.parse(JSON.stringify({ ...data, language: 'en' }));
  assert.deepEqual(restored.tasks.map(task => taskDisplayTitle(task, restored.language)), [
    'Clarify the idea', 'Build the MVP', 'Test the app', 'Prepare the GitHub repository', 'Record the demo video', 'Submit the project'
  ]);
  assert.equal(taskDisplayTitle(nextPreparationStep(restored.tasks).task, 'en'), 'Clarify the idea');
  assert.equal(taskDisplayTitle(restored.tasks[0], 'ru'), 'Уточнить идею');
  assert.equal(JSON.stringify(restored.tasks), before);
  assert.equal(starterPlanCount(addStarterPlan(restored).tasks), 6);
});

test('English starter titles translate to Russian while manual and renamed tasks retain their exact text', () => {
  let data = addStarterPlan(base('en'));
  assert.equal(taskDisplayTitle(data.tasks[0], 'ru'), 'Уточнить идею');
  data = updateTask(data, data.tasks[0].id, { title: 'подготовить видео', assignee: 'Анна' }).data;
  assert.equal(taskDisplayTitle(data.tasks[0], 'en'), 'подготовить видео');
  assert.equal(data.tasks[0].assignee, 'Анна');
  const manual = { id: 'manual', title: 'Уточнить идею', assignee: '', completed: false };
  assert.equal(taskDisplayTitle(manual, 'en'), 'Уточнить идею');
  // Saving only an assignee from the English editor keeps the task translatable.
  const assigned = updateTask(data, data.tasks[1].id, { title: taskDisplayTitle(data.tasks[1], 'en'), assignee: 'Alex' }).data;
  assert.equal(taskDisplayTitle(assigned.tasks[1], 'ru'), 'Собрать MVP');
  assert.equal(isSnapshot(assigned), true);
});

test('next step follows actual list order, edits, deletion, completion and reopening a completed step', () => {
  assert.equal(nextPreparationStep([]), null);
  let data = addStarterPlan(base('ru'));
  const first = data.tasks[0].id;
  assert.equal(nextPreparationStep(data.tasks).hintKey, 'planIdeaHint');
  data = updateTask(data, first, { title: 'A different action' }).data;
  assert.equal(nextPreparationStep(data.tasks).hintKey, 'customTaskHint');
  data = setTaskCompleted(data, first, true);
  assert.equal(nextPreparationStep(data.tasks).hintKey, 'planMvpHint');
  data = removeTask(data, data.tasks[1].id);
  assert.equal(nextPreparationStep(data.tasks).hintKey, 'planTestHint');
  data = { ...data, tasks: data.tasks.map(task => ({ ...task, completed: true })) };
  assert.equal(nextPreparationStep(data.tasks), null);
  data = setTaskCompleted(data, first, false);
  assert.equal(nextPreparationStep(data.tasks).task.id, first);
  assert.equal(nextPreparationStep([{ id: 'manual', title: 'Mine', completed: false }]).hintKey, 'customTaskHint');
});

test('countdown uses local calendar days across midnight, month/year boundaries, leap years and DST dates', () => {
  assert.equal(daysUntilDeadline('2026-10-26', date(2026, 10, 19, 23)), 7);
  assert.equal(daysUntilDeadline('2026-10-26', date(2026, 10, 26, 23)), 0);
  assert.equal(daysUntilDeadline('2026-10-26', date(2026, 10, 27, 0)), -1);
  assert.equal(daysUntilDeadline('2027-01-01', date(2026, 12, 31)), 1);
  assert.equal(daysUntilDeadline('2028-03-01', date(2028, 2, 28)), 2);
  assert.equal(daysUntilDeadline('2100-03-01', date(2100, 2, 28)), 1);
  assert.equal(daysUntilDeadline('2026-03-09', date(2026, 3, 8)), 1);
  assert.equal(daysUntilDeadline('2026-11-02', date(2026, 11, 1)), 1);
  assert.equal(daysUntilDeadline('0001-01-02', date(1, 1, 1)), 1);
  assert.equal(daysUntilDeadline('invalid', date(2026, 1, 1)), null);
});

test('countdown labels handle Russian plural forms, today and elapsed dates in both languages', () => {
  assert.equal(deadlineLabel('ru', 1), '1 день до дедлайна');
  assert.equal(deadlineLabel('ru', 2), '2 дня до дедлайна');
  assert.equal(deadlineLabel('ru', 5), '5 дней до дедлайна');
  assert.equal(deadlineLabel('ru', 21), '21 день до дедлайна');
  assert.equal(deadlineLabel('ru', 11), '11 дней до дедлайна');
  assert.equal(deadlineLabel('ru', 0), 'Дедлайн сегодня');
  assert.equal(deadlineLabel('ru', -3), 'Выбранная дата прошла 3 дня назад');
  assert.equal(deadlineLabel('en', 1), '1 day until the deadline');
  assert.equal(deadlineLabel('en', 2), '2 days until the deadline');
  assert.equal(deadlineLabel('en', 0), 'Deadline is today');
  assert.equal(deadlineLabel('en', -1), '1 day past the selected date');
});
