import { translate, deadlineLabel } from './i18n.js';
import { preparationProgress, starterPlanCount, STARTER_PLAN, nextPreparationStep, daysUntilDeadline } from './model.js';

export function createUI(document) {
  const find = id => document.getElementById(id);
  const errorsByForm = new Map();
  const taskRows = new Map();
  const newsRows = new Map();
  let lastAnnouncement = null;
  const hackathonRow={editButton:find('edit-hackathon'),editor:null};
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

  function actions(kind,id) {
    const el=make('div','row-actions'); const edit=make('button','text-button'); const remove=make('button','text-button delete-button');
    for(const [button,action] of [[edit,'edit'],[remove,'delete']]) {button.type='button'; button.dataset.action=action; button.dataset.kind=kind; button.dataset.id=id;}
    el.append(edit,remove); return {el,edit,remove};
  }

  function updateActions(row,kind,title,t) {
    row.actions.edit.textContent=t('edit'); row.actions.remove.textContent=t('delete');
    row.actions.edit.setAttribute('aria-label',`${t(kind==='task'?'editTask':'editNews')} — ${title}`);
    row.actions.remove.setAttribute('aria-label',`${t(kind==='task'?'deleteTask':'deleteNews')} — ${title}`);
  }

  function rowFor(kind,id) {return kind==='hackathon'?hackathonRow : kind==='task'?taskRows.get(id):newsRows.get(id);}

  function endEdit(kind,id,focus=true) {
    const row=rowFor(kind,id);
    if(!row) return;
    if(row.editor) {errorsByForm.delete(row.editor.id);row.editor.remove();row.editor=null;}
    if(focus) (row.editButton ?? row.actions.edit).focus();
  }

  function beginEdit(kind,id,record,language) {
    const row=rowFor(kind,id); if(!row || !record) return;
    if(row.editor) {row.editor.querySelector('input').focus();return;}
    const t=key=>translate(language,key);
    const form=make('form','record-editor'); form.noValidate=true;form.id=`edit-${kind}-${id}`;form.dataset.editorKind=kind;form.dataset.recordId=id;
    const labelKey=kind==='task'?'editTask':kind==='news'?'editNews':'editHackathon';form.dataset.i18nAria=labelKey;form.setAttribute('aria-label',t(labelKey));
    const fields=kind==='task'?[['title','taskName','text'],['assignee','assignee','text']]:kind==='news'?[['title','newsTitle','text'],['url','newsLink','url']]:[['name','nameLabel','text'],['deadline','dateLabel','date']];
    const grid=make('div','fields');
    for(const [name,key,type] of fields) {
      const field=make('div','field');const label=make('label');const input=make('input');const error=make('p','field-error');
      input.id=`${form.id}-${name}`; input.name=name;input.type=type;input.value=record[name];input.autocomplete='off';input.required=name!=='assignee';
      if(type==='date') input.max='9999-12-31';
      label.htmlFor=input.id;label.dataset.i18n=key;label.textContent=t(key);error.id=`${input.id}-error`;error.hidden=true;input.setAttribute('aria-describedby',error.id);
      field.append(label,input,error);grid.append(field);
    }
    const footer=make('div','editor-actions');const save=make('button','primary-button compact-button');save.type='submit';save.dataset.i18n='saveChanges';save.textContent=t('saveChanges');
    const cancel=make('button','secondary-button');cancel.type='button';cancel.dataset.action='cancel';cancel.dataset.kind=kind;cancel.dataset.id=id;cancel.dataset.i18n='cancel';cancel.textContent=t('cancel');
    footer.append(save,cancel);form.append(grid,footer);(kind==='hackathon'?find('hackathon-editor-slot'):row.el).append(form);row.editor=form;form.querySelector('input').focus();
  }

  function renderTasks(data,t) {
    const ids=new Set(data.tasks.map(task=>task.id));
    for(const [id,row] of taskRows) if(!ids.has(id)) {if(row.editor) errorsByForm.delete(row.editor.id);row.el.remove();taskRows.delete(id);}
    for(const task of data.tasks) {
      let row=taskRows.get(task.id);
      if(!row) {
        const el=make('li','task-row record-row');
        const checkbox=make('input','task-checkbox'); checkbox.type='checkbox'; checkbox.id=`task-${task.id}`; checkbox.dataset.taskToggle=task.id;
        const body=make('div','record-body'); const title=make('label','task-title'); title.htmlFor=checkbox.id;
        const assignee=make('span','assignee'); body.append(title,assignee); el.append(checkbox,body); find('task-list').append(el);
        const rowActions=actions('task',task.id);el.append(rowActions.el);
        row={el,checkbox,title,assignee,actions:rowActions,editor:null}; taskRows.set(task.id,row);
      }
      row.title.textContent=task.title; row.assignee.textContent=task.assignee || t('unassigned');
      row.assignee.classList.toggle('is-unassigned',!task.assignee); row.checkbox.checked=task.completed; row.el.classList.toggle('is-complete',task.completed);
      updateActions(row,'task',task.title,t);
    }
    find('tasks-empty').hidden=data.tasks.length>0; find('task-count').textContent=String(data.tasks.length);
  }

  function renderNews(data,t) {
    const ids=new Set(data.news.map(item=>item.id));
    for(const [id,row] of newsRows) if(!ids.has(id)) {if(row.editor) errorsByForm.delete(row.editor.id);row.el.remove();newsRows.delete(id);}
    for(const item of data.news) {
      let row=newsRows.get(item.id);
      if(!row) {
        const el=make('li','news-row record-row'); const icon=make('span','news-symbol'); icon.textContent='↗'; icon.setAttribute('aria-hidden','true');
        const body=make('div','record-body'); const link=make('a','news-link'); link.target='_blank'; link.rel='noopener noreferrer';
        const source=make('span','news-source'); body.append(link,source); el.append(icon,body); find('news-list').append(el);
        const rowActions=actions('news',item.id);el.append(rowActions.el);
        row={el,link,source,actions:rowActions,editor:null}; newsRows.set(item.id,row);
      }
      row.link.textContent=item.title; row.link.href=item.url; row.link.setAttribute('aria-label',`${item.title} — ${t('opensNewTab')}`); row.source.textContent=new URL(item.url).hostname;
      updateActions(row,'news',item.title,t);
    }
    find('news-empty').hidden=data.news.length>0; find('news-count').textContent=String(data.news.length);
  }

  function renderGuide(data, t) {
    const count = starterPlanCount(data.tasks);
    const ready = count === STARTER_PLAN.length;
    find('add-starter-plan').disabled = ready;
    find('add-starter-plan').textContent = t(ready ? 'starterPlanAdded' : count ? 'restoreStarterPlan' : 'addStarterPlan');
    find('plan-description').textContent = t(ready ? 'planReadyDescription' : count ? 'planRestoreDescription' : 'planDescription');
    const next = nextPreparationStep(data.tasks);
    find('next-step-title').textContent = next ? next.task.title : t(data.tasks.length ? 'nextDoneTitle' : 'nextEmptyTitle');
    find('next-step-hint').textContent = t(next ? next.hintKey : data.tasks.length ? 'nextDoneHint' : 'nextEmptyHint');
    find('go-to-task').hidden = !next;
  }

  function renderCountdown(data) {
    if (!data.hackathon) return;
    const days = daysUntilDeadline(data.hackathon.deadline);
    find('deadline-countdown').textContent = deadlineLabel(data.language, days);
    find('deadline-countdown').title = translate(data.language, 'deadlineCalendarNote');
    find('deadline-countdown').classList.toggle('is-past', days < 0);
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
        renderTasks(data,t); renderNews(data,t); renderGuide(data,t); renderCountdown(data);
      }
      for(const [formId,errors] of errorsByForm) showErrors(formId,data.language,errors);
    },
    showErrors,
    beginEdit,endEdit,
    renderCountdown,
    focusGuide() { find('next-step-title').focus(); },
    focusTask(id) {
      const checkbox = taskRows.get(id)?.checkbox;
      if (!checkbox) return;
      const reduceMotion = document.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches;
      checkbox.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'instant' : 'smooth' });
      checkbox.focus({ preventScroll: true });
    },
    focusEditButton(kind,id) {const row=rowFor(kind,id);(row?.editButton ?? row?.actions.edit)?.focus();},
    focusList(kind) {const list=find(kind==='task'?'task-list':'news-list');(list.querySelector('input,a,button') ?? find(kind==='task'?'task-title':'news-title')).focus();},
    clearFieldError(formId,name,language) { const errors={...errorsByForm.get(formId)}; delete errors[name]; showErrors(formId,language,errors); },
    focusFirstError(formId,errors) { find(formId).elements.namedItem(Object.keys(errors)[0])?.focus(); },
    announce(language, key) { lastAnnouncement=key; find('action-message').textContent = translate(language, key); },
    focusOverview() { find('hackathon-title').focus(); }
  };
}
