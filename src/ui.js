import { translate } from './i18n.js';
import { preparationProgress } from './model.js';

export function createUI(document) {
  const find = id => document.getElementById(id);
  let currentErrors = {};

  function showErrors(language, errors = {}) {
    currentErrors = errors;
    for (const [field, inputId, errorId] of [['name', 'hackathon-name', 'name-error'], ['deadline', 'hackathon-deadline', 'deadline-error']]) {
      const key = errors[field];
      find(inputId).setAttribute('aria-invalid', String(Boolean(key)));
      find(errorId).textContent = key ? translate(language, key) : '';
      find(errorId).hidden = !key;
    }
  }

  return {
    render(data, storageStatus) {
      const t = (key, values) => translate(data.language, key, values);
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
      }
      showErrors(data.language, currentErrors);
    },
    showErrors,
    focusFirstError(errors) { find(errors.name ? 'hackathon-name' : 'hackathon-deadline').focus(); },
    announce(language, key) { find('action-message').textContent = translate(language, key); },
    focusOverview() { find('hackathon-title').focus(); }
  };
}
