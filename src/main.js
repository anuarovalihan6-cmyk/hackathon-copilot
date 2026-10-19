import { initialData, createHackathon } from './model.js';
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

document.getElementById('hackathon-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const result = createHackathon(data, { name: form.get('name'), deadline: form.get('deadline') });
  if (!result.ok) {
    ui.showErrors(data.language, result.errors);
    ui.focusFirstError(result.errors);
    return;
  }
  data = result.data;
  ui.showErrors(data.language);
  saveAndRender();
  ui.focusOverview();
  ui.announce(data.language, 'created');
});

document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', () => {
    data = { ...data, language: button.dataset.language };
    saveAndRender();
  });
});

ui.render(data, storageStatus);
