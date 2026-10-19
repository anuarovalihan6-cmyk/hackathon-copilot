import { translate } from './i18n.js';
import { preparationProgress } from './model.js';

export function createUI(document) {
  const find = id => document.getElementById(id);
  const errorsByForm = new Map();
  const taskRows = new Map();
  const newsRows = new Map();
  let lastAnnouncement = null;
  const make = (tag, className) => { const node=document.createElement(tag); if(className) node.className=className; return node; };

  function showErrors(formId, language, errors = {}) {
    errorsByForm.set(formId, errors);
    for (const input of find(formId).querySelectorAll('input[aria-describedby]')) {
      const key=errors[input.name];
      input.setAttribute('aria-invalid',String(Boolean(key)));
      const message=find(input.getAttribute('aria-describedby'));
      message.textContent=key ? translate(language,key) : ''; message.hidden=!key;
    }
  }

  function renderTasks(data,t) {
    const ids=new Set(data.tasks.map(task=>task.id));
    for(const [id,row] of taskRows) if(!ids.has(id)) { row.el.remove(); taskRows.delete(id); }
    for(const task of data.tasks) {
      let row=taskRows.get(task.id);
      if(!row) {
        const el=make('li','task-row record-row');
        const checkbox=make('input','task-checkbox'); checkbox.type='checkbox'; checkbox.id=`task-${task.id}`; checkbox.dataset.taskToggle=task.id;
        const body=make('div','record-body'); const title=make('label','task-title'); title.htmlFor=checkbox.id;
        const assignee=make('span','assignee'); body.append(title,assignee); el.append(checkbox,body); find('task-list').append(el);
        row={el,checkbox,title,assignee}; taskRows.set(task.id,row);
      }
      row.title.textContent=task.title; row.assignee.textContent=task.assignee || t('unassigned');
      row.assignee.classList.toggle('is-unassigned',!task.assignee); row.checkbox.checked=task.completed; row.el.classList.toggle('is-complete',task.completed);
    }
    find('tasks-empty').hidden=data.tasks.length>0; find('task-count').textContent=String(data.tasks.length);
  }

  function renderNews(data,t) {
    const ids=new Set(data.news.map(item=>item.id));
    for(const [id,row] of newsRows) if(!ids.has(id)) { row.el.remove(); newsRows.delete(id); }
    for(const item of data.news) {
      let row=newsRows.get(item.id);
      if(!row) {
        const el=make('li','news-row record-row'); const icon=make('span','news-symbol'); icon.textContent='↗'; icon.setAttribute('aria-hidden','true');
        const body=make('div','record-body'); const link=make('a','news-link'); link.target='_blank'; link.rel='noopener noreferrer';
        const source=make('span','news-source'); body.append(link,source); el.append(icon,body); find('news-list').append(el);
        row={el,link,source}; newsRows.set(item.id,row);
      }
      row.link.textContent=item.title; row.link.href=item.url; row.link.setAttribute('aria-label',`${item.title} — ${t('opensNewTab')}`); row.source.textContent=new URL(item.url).hostname;
    }
    find('news-empty').hidden=data.news.length>0; find('news-count').textContent=String(data.news.length);
  }

  return {
    render(data, storageStatus) {
      const t = (key, values) => translate(data.language, key, values);
      if(document.documentElement.lang!==data.language && lastAnnouncement) find('action-message').textContent=t(lastAnnouncement);
      document.documentElement.lang = data.language;
      document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
      document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
      document.querySelectorAll('[data-language]').forEach(el => { el.setAttribute('aria-pressed', String(el.dataset.language === data.language)); });
      find('setup').hidden = Boolean(data.hackathon);
      find('overview').hidden = !data.hackathon;
      const storageError = ['unavailable', 'invalid-data'].includes(storageStatus) ? 'storageUnavailable' : storageStatus === 'invalid' ? 'storageInvalid' : null;
      find('storage-message').hidden = !storageError;
      find('storage-message').textContent = storageError ? t(storageError) : '';
      document.querySelector('.form-note [data-i18n]').textContent = t(storageError ? 'sessionCaption' : 'browserNote');
      find('saved-caption').textContent = t(storageError ? 'sessionCaption' : 'savedCaption');
      if (data.hackathon) {
        find('hackathon-title').textContent = data.hackathon.name;
        find('deadline-value').dateTime = data.hackathon.deadline;
        const date = new Date(`${data.hackathon.deadline}T12:00:00Z`);
        find('deadline-value').textContent = new Intl.DateTimeFormat(data.language === 'ru' ? 'ru-RU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
        const progress = preparationProgress(data.tasks);
        find('progress-value').textContent = `${progress.percent}%`;
        find('progress-count').textContent = t('progressCount', progress);
        find('progress-track').setAttribute('aria-valuenow', String(progress.percent));
        find('progress-track').querySelector('.progress-fill').style.transform = `scaleX(${progress.total ? progress.done / progress.total : 0})`;
        renderTasks(data,t); renderNews(data,t);
      }
      for(const [formId,errors] of errorsByForm) showErrors(formId,data.language,errors);
    },
    showErrors,
    clearFieldError(formId,name,language) { const errors={...errorsByForm.get(formId)}; delete errors[name]; showErrors(formId,language,errors); },
    focusFirstError(formId,errors) { find(formId).elements.namedItem(Object.keys(errors)[0])?.focus(); },
    announce(language, key) { lastAnnouncement=key; find('action-message').textContent = translate(language, key); },
    focusOverview() { find('hackathon-title').focus(); }
  };
}
