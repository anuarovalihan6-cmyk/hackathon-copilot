export function initialData(language = 'en') {
  return { version: 1, language: language === 'ru' ? 'ru' : 'en', hackathon: null, tasks: [], news: [] };
}

export function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

function nonempty(value) { return typeof value === 'string' && value.trim().length > 0; }

export function isWebUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname); }
  catch { return false; }
}

export function isSnapshot(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  if (data.version !== 1 || !['en', 'ru'].includes(data.language)) return false;
  if (!Array.isArray(data.tasks) || !Array.isArray(data.news)) return false;
  if (data.hackathon !== null && (!data.hackathon || !nonempty(data.hackathon.name) || !isCalendarDate(data.hackathon.deadline))) return false;
  if (data.hackathon === null && (data.tasks.length || data.news.length)) return false;
  const tasksValid = data.tasks.every(task => task && nonempty(task.id) && nonempty(task.title) && typeof task.assignee === 'string' && typeof task.completed === 'boolean');
  const newsValid = data.news.every(item => item && nonempty(item.id) && nonempty(item.title) && isWebUrl(item.url));
  return tasksValid && newsValid && new Set(data.tasks.map(task => task.id)).size === data.tasks.length && new Set(data.news.map(item => item.id)).size === data.news.length;
}

export function createHackathon(data, { name, deadline }) {
  const errors = {};
  if (!nonempty(name)) errors.name = 'nameRequired';
  if (!deadline) errors.deadline = 'dateRequired';
  else if (!isCalendarDate(deadline)) errors.deadline = 'dateInvalid';
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { ...data, hackathon: { name: name.trim(), deadline } } };
}

export function preparationProgress(tasks) {
  const total = tasks.length;
  const done = tasks.filter(task => task.completed).length;
  return { total, done, percent: total ? Math.floor(done * 100 / total) : 0 };
}
