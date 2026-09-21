const MONTH_LENGTHS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const MONTH_ENGLISH = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const pad = number => String(number).padStart(2, '0');

export function buildCalendar() {
  let ordinal = 0;
  return MONTH_LENGTHS.map((length, index) => ({
    month: index + 1,
    name: MONTH_NAMES[index],
    english: MONTH_ENGLISH[index],
    days: Array.from({ length }, (_, dayIndex) => ({
      key: `${pad(index + 1)}-${pad(dayIndex + 1)}`,
      day: dayIndex + 1,
      ordinal: ++ordinal,
    })),
  }));
}

export function parseDateKey(key) {
  if (typeof key !== 'string' || !/^\d{2}-\d{2}$/.test(key)) return null;
  const [month, day] = key.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > MONTH_LENGTHS[month - 1]) return null;
  return { month, day, ordinal: MONTH_LENGTHS.slice(0, month - 1).reduce((sum, length) => sum + length, day) };
}

export function parseDateHash(hash) {
  if (typeof hash !== 'string' || !hash.startsWith('#')) return null;
  const key = hash.slice(1);
  return parseDateKey(key) ? key : null;
}

export function todayKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  return `${parts.find(part => part.type === 'month').value}-${parts.find(part => part.type === 'day').value}`;
}
