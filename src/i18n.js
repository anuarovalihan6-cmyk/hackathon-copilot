const messages = {
  en: {
    guideLabel: 'Preparation guide', planEyebrow: 'A clear way forward', planHeading: 'From idea to submission',
    planDescription: 'Six ready-to-use tasks, from shaping your idea to sending your entry. Your existing work stays.',
    planRestoreDescription: 'Restore missing starter tasks. Your edits, assignees and completed steps stay.',
    planReadyDescription: 'Your plan is in the task list. Adapt it, assign people and take it one step at a time.',
    addStarterPlan: 'Add starter plan', restoreStarterPlan: 'Restore missing steps', starterPlanAdded: 'Plan added ✓',
    planAddedMessage: 'Missing starter tasks added. Existing work kept. Preparation progress updated.',
    nextStepLabel: 'Your next step', goToTask: 'Go to task ↗',
    nextEmptyTitle: 'Every launch starts somewhere.', nextEmptyHint: 'Add the starter plan, or write your own first task below.',
    nextDoneTitle: 'Your task list is complete.', nextDoneHint: 'Well done. Check the hackathon requirements and confirm your entry was actually submitted.',
    customTaskHint: 'Take one small action on this task. Assign a person if needed, then tick it off when it is done.',
    planIdea: 'Clarify the idea', planIdeaHint: 'Write who your app helps, the problem it solves and one essential action it should do well.',
    planMvp: 'Build the MVP', planMvpHint: 'Make one complete journey work, from the first input to a useful result. Save extra features for later.',
    planTest: 'Test the app', planTestHint: 'Try the main journey, empty inputs and a narrow screen. Reload and check that your data stays.',
    planGithub: 'Prepare the GitHub repository', planGithubHint: 'Include your code, a clear README and the planning documents. Check for private files before publishing.',
    planVideo: 'Record the demo video', planVideoHint: 'Show your main journey from start to finish. Check the hackathon rules for the video length.',
    planSubmit: 'Submit the project', planSubmitHint: 'Review the entry fields, repository and video links, then submit on the hackathon website before the deadline.',
    daysLeft_one: '{count} day until the deadline', daysLeft_other: '{count} days until the deadline',
    daysPast_one: '{count} day past the selected date', daysPast_other: '{count} days past the selected date',
    deadlineToday: 'Deadline is today', deadlineCalendarNote: 'Based on your selected date, without a specific submission time.',
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
    taskAdded: 'Task added.', newsAdded: 'News added.', completionUpdated: 'Task and preparation progress updated.',
    edit: 'Edit', delete: 'Delete', saveChanges: 'Save changes', cancel: 'Cancel', editHackathon: 'Edit hackathon', editTask: 'Edit task', editNews: 'Edit news', deleteTask: 'Delete task', deleteNews: 'Delete news',
    taskUpdated: 'Task updated.', newsUpdated: 'News updated.', hackathonUpdated: 'Hackathon updated.', taskDeleted: 'Task deleted. Preparation progress updated.', newsDeleted: 'News deleted.'
  },
  ru: {
    guideLabel: 'Помощник по подготовке', planEyebrow: 'Понятный путь вперёд', planHeading: 'От идеи к заявке',
    planDescription: 'Шесть готовых задач: от идеи до отправки заявки. Всё, что ты уже добавил, сохранится.',
    planRestoreDescription: 'Добавятся только отсутствующие шаги. Твои исправления, ответственные и отметки останутся.',
    planReadyDescription: 'План уже в списке задач. Подстрой его под себя, назначь людей и двигайся шаг за шагом.',
    addStarterPlan: 'Добавить стартовый план', restoreStarterPlan: 'Восстановить шаги', starterPlanAdded: 'План добавлен ✓',
    planAddedMessage: 'Отсутствующие шаги плана добавлены. Прежние записи сохранены. Прогресс пересчитан.',
    nextStepLabel: 'Следующий шаг', goToTask: 'К задаче ↗',
    nextEmptyTitle: 'У каждого старта есть первый шаг.', nextEmptyHint: 'Добавь готовый план или напиши свою первую задачу ниже.',
    nextDoneTitle: 'Все задачи выполнены.', nextDoneHint: 'Отлично! Проверь требования хакатона и убедись, что заявка действительно отправлена.',
    customTaskHint: 'Выбери одно небольшое действие по этой задаче. При необходимости назначь человека, а после выполнения поставь отметку.',
    planIdea: 'Уточнить идею', planIdeaHint: 'Запиши, кому помогает приложение, какую проблему решает и какое одно главное действие должно работать.',
    planMvp: 'Собрать MVP', planMvpHint: 'Сделай один полный путь: от первого ввода до полезного результата. Дополнительные функции оставь на потом.',
    planTest: 'Проверить приложение', planTestHint: 'Пройди основной сценарий, попробуй пустые поля и узкий экран. Обнови страницу и проверь сохранение данных.',
    planGithub: 'Подготовить GitHub', planGithubHint: 'Добавь код, понятный README и документы планирования. Перед публикацией проверь, нет ли личных файлов.',
    planVideo: 'Записать демовидео', planVideoHint: 'Покажи основной сценарий от начала до конца. Проверь ограничение длительности видео в правилах хакатона.',
    planSubmit: 'Отправить заявку', planSubmitHint: 'Проверь поля заявки, ссылки на репозиторий и видео, затем отправь проект на сайте хакатона до дедлайна.',
    daysLeft_one: '{count} день до дедлайна', daysLeft_few: '{count} дня до дедлайна', daysLeft_many: '{count} дней до дедлайна', daysLeft_other: '{count} дня до дедлайна',
    daysPast_one: 'Выбранная дата прошла {count} день назад', daysPast_few: 'Выбранная дата прошла {count} дня назад', daysPast_many: 'Выбранная дата прошла {count} дней назад', daysPast_other: 'Выбранная дата прошла {count} дня назад',
    deadlineToday: 'Дедлайн сегодня', deadlineCalendarNote: 'По выбранной календарной дате, без точного времени подачи.',
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
    taskAdded: 'Задача добавлена.', newsAdded: 'Новость добавлена.', completionUpdated: 'Задача и прогресс подготовки обновлены.',
    edit: 'Изменить', delete: 'Удалить', saveChanges: 'Сохранить изменения', cancel: 'Отмена', editHackathon: 'Изменить хакатон', editTask: 'Изменить задачу', editNews: 'Изменить новость', deleteTask: 'Удалить задачу', deleteNews: 'Удалить новость',
    taskUpdated: 'Задача обновлена.', newsUpdated: 'Новость обновлена.', hackathonUpdated: 'Хакатон обновлён.', taskDeleted: 'Задача удалена. Прогресс подготовки обновлён.', newsDeleted: 'Новость удалена.'
  }
};

export function preferredLanguage(browserLanguage = '') { return browserLanguage.toLowerCase().startsWith('ru') ? 'ru' : 'en'; }
export function deadlineLabel(language, days) {
  if (days === 0) return translate(language, 'deadlineToday');
  const count = Math.abs(days);
  const plural = new Intl.PluralRules(language === 'ru' ? 'ru' : 'en').select(count);
  return translate(language, `${days > 0 ? 'daysLeft' : 'daysPast'}_${plural}`, { count });
}
export function translate(language, key, values = {}) {
  let text = messages[language]?.[key] ?? messages.en[key] ?? key;
  for (const [name, value] of Object.entries(values)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
}
