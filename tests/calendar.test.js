import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCalendar, parseDateKey, parseDateHash, todayKey } from '../assets/calendar.js';

test('全年日期连续且唯一，始终保留闰日', () => {
  const calendar = buildCalendar();
  const days = calendar.flatMap(month => month.days);
  assert.equal(calendar.length, 12);
  assert.equal(days.length, 366);
  assert.equal(new Set(days.map(day => day.key)).size, 366);
  assert.deepEqual(calendar.map(month => month.days.length), [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
  assert.deepEqual(days[0], { key: '01-01', day: 1, ordinal: 1 });
  assert.deepEqual(days[59], { key: '02-29', day: 29, ordinal: 60 });
  assert.deepEqual(days[60], { key: '03-01', day: 1, ordinal: 61 });
  assert.deepEqual(days[365], { key: '12-31', day: 31, ordinal: 366 });
});

test('可分享日期接受闰日，拒绝不存在或不规范的日期', () => {
  assert.deepEqual(parseDateKey('02-29'), { month: 2, day: 29, ordinal: 60 });
  assert.deepEqual(parseDateKey('12-31'), { month: 12, day: 31, ordinal: 366 });
  for (const key of ['02-30', '04-31', '00-01', '13-01', '01-00', '1-1', '01-01extra', '', null]) {
    assert.equal(parseDateKey(key), null, String(key));
  }
});

test('解析分享片段时不会把月份导航或畸形编码当作日期', () => {
  assert.equal(parseDateHash('#02-29'), '02-29');
  assert.equal(parseDateHash('#12-31'), '12-31');
  for (const hash of ['', '#', '#month-02', '#02-30', '#%E0%A4%A', '#02-29?x=1']) {
    assert.equal(parseDateHash(hash), null, hash);
  }
});

test('今天使用北京时间，正确跨越 UTC 日期和年份边界', () => {
  assert.equal(todayKey(new Date('2026-09-20T15:59:59Z')), '09-20');
  assert.equal(todayKey(new Date('2026-09-20T16:00:00Z')), '09-21');
  assert.equal(todayKey(new Date('2026-12-31T16:00:00Z')), '01-01');
  assert.equal(todayKey(new Date('2024-02-28T16:00:00Z')), '02-29');
});
