import { initialData, createHackathon, addTask, addNews, setTaskCompleted } from './model.js';
import { createStorage } from './storage.js';
import { preferredLanguage } from './i18n.js';
import { createUI } from './ui.js';

const storage = createStorage();
const loaded = storage.load();
let data = loaded.data ?? initialData(preferredLanguage(navigator.language));
let storageStatus = loaded.status;
const ui = createUI(document);

function saveAndRender() {
  storageStatus = storage.save(data).status;
  ui.render(data, storageStatus);
}

function bindForm(id,operation,announcement) {
  const form=document.getElementById(id);
  form.addEventListener('input',event=>ui.clearFieldError(id,event.target.name,data.language));
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const result=operation(data,Object.fromEntries(new FormData(form)));
    if(!result.ok) { ui.showErrors(id,data.language,result.errors); ui.focusFirstError(id,result.errors); return; }
    data=result.data; form.reset(); ui.showErrors(id,data.language); saveAndRender();
    if(id==='hackathon-form') ui.focusOverview(); else form.elements.namedItem('title').focus();
    ui.announce(data.language,announcement);
  });
}
bindForm('hackathon-form',createHackathon,'created');
bindForm('task-form',addTask,'taskAdded');
bindForm('news-form',addNews,'newsAdded');

document.getElementById('task-list').addEventListener('change',event=>{
  if(!event.target.matches('[data-task-toggle]')) return;
  data=setTaskCompleted(data,event.target.dataset.taskToggle,event.target.checked);
  saveAndRender(); ui.announce(data.language,'completionUpdated');
});

document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', () => {
    data = { ...data, language: button.dataset.language };
    saveAndRender();
  });
});

ui.render(data, storageStatus);
