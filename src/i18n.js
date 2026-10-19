const messages = {
  en: {
    languageLabel: 'Interface language', eyebrow: 'A little structure. A big head start.', titlePrefix: 'Build your',
    intro: 'Start with a name and a deadline. Give your next idea a place to grow.',
    formTitle: 'Your hackathon', formCaption: 'Let’s make it happen', nameLabel: 'Hackathon name',
    namePlaceholder: 'e.g. Build With AI: Basics', dateLabel: 'Deadline', startButton: 'Start preparing',
    browserNote: 'Saved in this browser. Ready when you are.', bottomNote: 'One project. A clear starting point.',
    footer: 'A little focus for your next big idea.', overviewEyebrow: 'Your next launch', overviewIntro: 'Your preparation, in one place.',
    progressLabel: 'Preparation progress', progressCount: '{done} of {total} tasks completed',
    savedCaption: 'Saved in this browser', sessionCaption: 'Available in this open session',
    nameRequired: 'Give your hackathon a name.', dateRequired: 'Choose a deadline.', dateInvalid: 'Choose a valid calendar date.',
    storageUnavailable: 'Changes are visible here, but this browser could not save them. They may be lost when you close the page.',
    storageInvalid: 'Your saved data could not be read. It has not been overwritten. New changes in this session will not be saved.',
    created: 'Hackathon created. Your preparation is ready to begin.',
    tasksHeading: 'Your next steps', tasksCaption: 'Small steps, real progress.', taskName: 'Task name', assignee: 'Assignee', optional: 'optional',
    taskPlaceholder: 'e.g. Record the demo video', assigneePlaceholder: 'A name, or leave it for later', addTask: 'Add task',
    noTasks: 'No tasks yet', noTasksHint: 'Add your first small step above. You’ve got this.', unassigned: 'Unassigned',
    newsHeading: 'News & useful links', newsCaption: 'Keep the important things close.', newsTitle: 'News title', newsLink: 'Link',
    newsPlaceholder: 'e.g. Submission requirements', urlPlaceholder: 'https://…', addNews: 'Add news', noNews: 'No updates yet', noNewsHint: 'Save an important update and its source above.', opensNewTab: 'opens in a new tab',
    taskTitleRequired: 'Give this task a name.', newsTitleRequired: 'Add a title for this update.', urlInvalid: 'Enter a full website link starting with https:// or http://.',
    taskAdded: 'Task added.', newsAdded: 'News added.', completionUpdated: 'Task and preparation progress updated.'
  },
  ru: {
    languageLabel: 'Язык интерфейса', eyebrow: 'Немного порядка. Уверенный старт.', titlePrefix: 'Создай свой',
    intro: 'Начни с названия и дедлайна. Дай своей следующей идее место для роста.',
    formTitle: 'Твой хакатон', formCaption: 'От идеи к делу', nameLabel: 'Название хакатона',
    namePlaceholder: 'Например, Build With AI: Basics', dateLabel: 'Дедлайн', startButton: 'Начать подготовку',
    browserNote: 'Сохранится в этом браузере. Возвращайся, когда удобно.', bottomNote: 'Один проект. Понятная точка старта.',
    footer: 'Немного внимания твоей следующей большой идее.', overviewEyebrow: 'Твой следующий старт', overviewIntro: 'Твоя подготовка — в одном месте.',
    progressLabel: 'Прогресс подготовки', progressCount: 'Выполнено задач: {done} из {total}',
    savedCaption: 'Сохранено в этом браузере', sessionCaption: 'Доступно в этом открытии страницы',
    nameRequired: 'Введи название хакатона.', dateRequired: 'Выбери дедлайн.', dateInvalid: 'Выбери существующую календарную дату.',
    storageUnavailable: 'Изменения видны на странице, но браузер не смог их сохранить. После закрытия страницы они могут пропасть.',
    storageInvalid: 'Не удалось прочитать сохранённые данные. Они не перезаписаны. Новые изменения в этом открытии не сохранятся.',
    created: 'Хакатон создан. Можно начинать подготовку.',
    tasksHeading: 'Твои следующие шаги', tasksCaption: 'Маленькие шаги, заметный прогресс.', taskName: 'Название задачи', assignee: 'Ответственный', optional: 'необязательно',
    taskPlaceholder: 'Например, записать демовидео', assigneePlaceholder: 'Имя — или назначь позже', addTask: 'Добавить задачу',
    noTasks: 'Пока нет задач', noTasksHint: 'Добавь первый небольшой шаг в форме выше. Всё получится.', unassigned: 'Не назначен',
    newsHeading: 'Новости и полезные ссылки', newsCaption: 'Самое важное — под рукой.', newsTitle: 'Заголовок новости', newsLink: 'Ссылка',
    newsPlaceholder: 'Например, требования к заявке', urlPlaceholder: 'https://…', addNews: 'Добавить новость', noNews: 'Пока нет новостей', noNewsHint: 'Сохрани важное обновление и ссылку на источник в форме выше.', opensNewTab: 'откроется в новой вкладке',
    taskTitleRequired: 'Введи название задачи.', newsTitleRequired: 'Введи заголовок новости.', urlInvalid: 'Введи полную ссылку на сайт, начиная с https:// или http://.',
    taskAdded: 'Задача добавлена.', newsAdded: 'Новость добавлена.', completionUpdated: 'Задача и прогресс подготовки обновлены.'
  }
};

export function preferredLanguage(browserLanguage = '') { return browserLanguage.toLowerCase().startsWith('ru') ? 'ru' : 'en'; }
export function translate(language, key, values = {}) {
  let text = messages[language]?.[key] ?? messages.en[key] ?? key;
  for (const [name, value] of Object.entries(values)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
}
