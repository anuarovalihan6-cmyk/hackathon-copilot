import { translate } from './i18n.js';

export const STARTER_PLAN = [
  { id: 'starter-plan:idea', titleKey: 'planIdea', hintKey: 'planIdeaHint' },
  { id: 'starter-plan:mvp', titleKey: 'planMvp', hintKey: 'planMvpHint' },
  { id: 'starter-plan:test', titleKey: 'planTest', hintKey: 'planTestHint' },
  { id: 'starter-plan:github', titleKey: 'planGithub', hintKey: 'planGithubHint' },
  { id: 'starter-plan:video', titleKey: 'planVideo', hintKey: 'planVideoHint' },
  { id: 'starter-plan:submit', titleKey: 'planSubmit', hintKey: 'planSubmitHint' }
];

export function starterPlanCount(tasks) {
  return STARTER_PLAN.filter(step => tasks.some(task => task.id === step.id)).length;
}

export function addStarterPlan(data) {
  if (!data.hackathon) return data;
  const missing = STARTER_PLAN.filter(step => !data.tasks.some(task => task.id === step.id));
  if (!missing.length) return data;
  return { ...data, tasks: [...data.tasks, ...missing.map(step => ({
    id: step.id, title: translate(data.language, step.titleKey), assignee: '', completed: false
  }))] };
}

function starterStepForTask(task) {
  return STARTER_PLAN.find(item => item.id === task.id &&
    ['en', 'ru'].some(language => task.title === translate(language, item.titleKey)));
}

export function taskDisplayTitle(task, language) {
  const step = starterStepForTask(task);
  return step ? translate(language, step.titleKey) : task.title;
}

export function nextPreparationStep(tasks) {
  const task = tasks.find(item => !item.completed);
  if (!task) return null;
  const step = starterStepForTask(task);
  return { task, hintKey: step?.hintKey ?? 'customTaskHint' };
}

export function daysUntilDeadline(deadline, now = new Date()) {
  if (!isCalendarDate(deadline)) return null;
  const midnight = (year, month, day) => {
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime();
  };
  const [year, month, day] = deadline.split('-').map(Number);
  return Math.round((midnight(year, month, day) - midnight(now.getFullYear(), now.getMonth() + 1, now.getDate())) / 86_400_000);
}

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

export function addTask(data, { title, assignee = '' }, id = crypto.randomUUID()) {
  if (!nonempty(title)) return { ok: false, errors: { title: 'taskTitleRequired' } };
  const task = { id, title: title.trim(), assignee: String(assignee).trim(), completed: false };
  return { ok: true, data: { ...data, tasks: [...data.tasks, task] } };
}

export function setTaskCompleted(data, id, completed) {
  if (typeof completed !== 'boolean') return data;
  return { ...data, tasks: data.tasks.map(task => task.id === id ? { ...task, completed } : task) };
}

export function addNews(data, { title, url }, id = crypto.randomUUID()) {
  const errors = {};
  if (!nonempty(title)) errors.title = 'newsTitleRequired';
  if (!isWebUrl(url)) errors.url = 'urlInvalid';
  if (Object.keys(errors).length) return { ok: false, errors };
  const item = { id, title: title.trim(), url: new URL(url).href };
  return { ok: true, data: { ...data, news: [...data.news, item] } };
}

export function updateTask(data,id,{title,assignee=''}) {
  if(!nonempty(title)) return {ok:false,errors:{title:'taskTitleRequired'}};
  return {ok:true,data:{...data,tasks:data.tasks.map(task=>task.id===id ? {...task,title:title.trim(),assignee:String(assignee).trim()} : task)}};
}

export function updateNews(data,id,{title,url}) {
  const errors={};
  if(!nonempty(title)) errors.title='newsTitleRequired';
  if(!isWebUrl(url)) errors.url='urlInvalid';
  if(Object.keys(errors).length) return {ok:false,errors};
  return {ok:true,data:{...data,news:data.news.map(item=>item.id===id ? {...item,title:title.trim(),url:new URL(url).href} : item)}};
}

export function removeTask(data,id) { return {...data,tasks:data.tasks.filter(task=>task.id!==id)}; }
export function removeNews(data,id) { return {...data,news:data.news.filter(item=>item.id!==id)}; }
