import { buildCalendar, parseDateKey, parseDateHash, todayKey } from './calendar.js';

const grid = document.querySelector('#calendar-grid');
const navigation = document.querySelector('#month-navigation');
const dialog = document.querySelector('#date-dialog');
const todayButton = document.querySelector('#today-button');
const dateButtons = new Map();
const monthButtons = new Map();
let selectedKey = null;
let lastTodayKey = null;
let dialogReturnTarget = null;

for (const month of buildCalendar()) {
  const jump = document.createElement('button');
  jump.type = 'button';
  jump.className = 'month-jump';
  jump.textContent = `${month.month}月`;
  jump.setAttribute('aria-label', `跳到${month.month}月`);
  jump.addEventListener('click', () => goToMonth(month.month));
  navigation.append(jump);
  monthButtons.set(month.month, jump);

  const card = document.createElement('section');
  card.className = 'month-card';
  card.id = `month-${month.month}`;
  card.setAttribute('aria-labelledby', `month-title-${month.month}`);
  const heading = document.createElement('div');
  heading.className = 'month-card-heading';
  const names = document.createElement('div');
  const title = document.createElement('h3');
  title.id = `month-title-${month.month}`;
  title.textContent = month.name;
  const english = document.createElement('span');
  english.className = 'month-english';
  english.textContent = month.english;
  names.append(title, english);
  const number = document.createElement('span');
  number.className = 'month-number';
  number.setAttribute('aria-hidden', 'true');
  number.textContent = String(month.month).padStart(2, '0');
  heading.append(names, number);

  const days = document.createElement('div');
  days.className = 'month-days';
  for (const day of month.days) {
    const button = document.createElement('button');
    button.className = 'day-button';
    button.type = 'button';
    button.textContent = String(day.day).padStart(2, '0');
    button.dataset.date = day.key;
    button.setAttribute('aria-label', `${month.month}月${day.day}日`);
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'date-dialog');
    button.addEventListener('click', () => {
      dialogReturnTarget = button;
      if (location.hash !== `#${day.key}`) history.pushState({ calendarDialogEntry: true }, '', `#${day.key}`);
      syncSelection();
    });
    days.append(button);
    dateButtons.set(day.key, button);
  }
  const foot = document.createElement('div');
  foot.className = 'month-card-footer';
  const count = document.createElement('span');
  count.textContent = `${month.days.length} 个日子`;
  const note = document.createElement('span');
  note.textContent = month.month === 2 ? '也留住闰年的那一天' : '等待故事落笔';
  foot.append(count, note);
  card.append(heading, days, foot);
  grid.append(card);
}

function markMonth(month) {
  for (const [number, button] of monthButtons) {
    if (number === month) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  }
}

function goToMonth(month) {
  markMonth(month);
  document.querySelector(`#month-${month}`).scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function refreshToday() {
  const key = todayKey();
  if (key === lastTodayKey) return;
  if (lastTodayKey) dateButtons.get(lastTodayKey)?.removeAttribute('aria-current');
  const today = parseDateKey(key);
  const button = dateButtons.get(key);
  button.setAttribute('aria-current', 'date');
  button.setAttribute('aria-label', `${today.month}月${today.day}日，今天`);
  if (lastTodayKey) {
    const previous = parseDateKey(lastTodayKey);
    dateButtons.get(lastTodayKey)?.setAttribute('aria-label', `${previous.month}月${previous.day}日`);
  }
  document.querySelector('#today-label').textContent = `${today.month}月${today.day}日 · 回到今天`;
  todayButton.setAttribute('aria-label', `回到今天，${today.month}月${today.day}日，北京时间`);
  lastTodayKey = key;
}

function syncSelection() {
  const key = parseDateHash(location.hash);
  if (selectedKey) dateButtons.get(selectedKey)?.classList.remove('is-selected');
  selectedKey = key;
  if (!key) {
    if (dialog.open) {
      dialog.close();
      document.body.classList.remove('dialog-open');
      if (dialogReturnTarget) {
        const bounds = dialogReturnTarget.getBoundingClientRect();
        if (bounds.top < 120 || bounds.bottom > innerHeight) {
          dialogReturnTarget.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
        dialogReturnTarget.focus({ preventScroll: true });
      }
    }
    return;
  }
  const date = parseDateKey(key);
  const button = dateButtons.get(key);
  button.classList.add('is-selected');
  dialogReturnTarget = button;
  document.querySelector('#dialog-title').textContent = `${date.month}月${date.day}日`;
  document.querySelector('#dialog-ordinal').textContent = `DAY ${String(date.ordinal).padStart(3, '0')} / 366`;
  if (!dialog.open) {
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
}

function closeDate() {
  if (parseDateHash(location.hash) && history.state?.calendarDialogEntry) {
    history.back();
    return;
  }
  if (parseDateHash(location.hash)) history.replaceState(null, '', `${location.pathname}${location.search}`);
  syncSelection();
}

document.querySelector('#dialog-close').addEventListener('click', closeDate);
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeDate();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDate();
});
todayButton.addEventListener('click', () => {
  refreshToday();
  goToMonth(parseDateKey(lastTodayKey).month);
  dateButtons.get(lastTodayKey).focus({ preventScroll: true });
});
window.addEventListener('hashchange', syncSelection);
window.addEventListener('popstate', syncSelection);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshToday(); });
setInterval(refreshToday, 60_000);

refreshToday();
if (!location.hash) history.replaceState(null, '', `#${lastTodayKey}`);
const initialDateKey = parseDateHash(location.hash);
if (initialDateKey) {
  const month = parseDateKey(initialDateKey).month;
  markMonth(month);
  document.querySelector(`#month-${month}`).scrollIntoView({ behavior: 'instant', block: 'start' });
} else {
  markMonth(1);
}
syncSelection();
