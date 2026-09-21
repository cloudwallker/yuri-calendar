import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-21T01:00:00Z') });
});

test('all 366 dates and responsive layout', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('.day-button')).toHaveCount(366);
  await expect(page.locator('.month-card')).toHaveCount(12);
  await expect(page.getByRole('button', { name: '2月29日', exact: true })).toBeVisible();
  await expect(page.locator('.day-button').first()).toHaveAttribute('data-date', '01-01');
  await expect(page.locator('.day-button').last()).toHaveAttribute('data-date', '12-31');
  expect(await page.locator('.calendar-grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(testInfo.project.name === 'mobile' ? 1 : 3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '.local/' + testInfo.project.name + '-calendar.png', fullPage: testInfo.project.name === 'desktop' });
  if (testInfo.project.name === 'mobile') {
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('date dialog keyboard close reload and focus', async ({ page }, testInfo) => {
  await page.goto('./');
  const leapDay = page.getByRole('button', { name: '2月29日', exact: true });
  await leapDay.click();
  await expect(page).toHaveURL(/#02-29$/);
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#dialog-title')).toHaveText('2月29日');
  await expect(page.locator('#empty-title')).toHaveText('这一天的故事，等待收录');
  await page.screenshot({ path: '.local/' + testInfo.project.name + '-dialog.png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(leapDay).toBeFocused();
  expect(new URL(page.url()).hash).toBe('');
  await page.goto('./#12-31');
  await expect(page.locator('#dialog-title')).toHaveText('12月31日');
  await page.reload();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#dialog-title')).toHaveText('12月31日');
  await page.getByRole('button', { name: '关闭日期详情' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(new URL(page.url()).hash).toBe('');
});

test('back and forward sync dates and invalid links stay closed', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '1月1日', exact: true }).click();
  await page.evaluate(() => { location.hash = '02-29'; });
  await expect(page.locator('#dialog-title')).toHaveText('2月29日');
  await page.goBack();
  await expect(page.locator('#dialog-title')).toHaveText('1月1日');
  await page.goBack();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.goForward();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#dialog-title')).toHaveText('1月1日');
  await page.goto('./#02-30');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('body')).not.toHaveClass(/dialog-open/);
});

test('month jump and today update at midnight', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '跳到12月' }).click();
  await expect(page.locator('#month-12')).toBeInViewport();
  await expect(page.getByRole('button', { name: '跳到12月' })).toHaveAttribute('aria-current', 'true');
  await page.getByRole('button', { name: '回到今天，9月21日，北京时间' }).click();
  await expect(page.locator('[data-date="09-21"]')).toBeInViewport();
  await expect(page.locator('[data-date="09-21"]')).toBeFocused();
  await expect(page.locator('.day-button[aria-current="date"]')).toHaveCount(1);
  await page.clock.setSystemTime(new Date('2026-09-21T16:00:00Z'));
  await page.clock.runFor(60_000);
  await expect(page.locator('[data-date="09-22"]')).toHaveAttribute('aria-current', 'date');
  await expect(page.locator('[data-date="09-21"]')).not.toHaveAttribute('aria-current', 'date');
  await expect(page.locator('[data-date="09-21"]')).toHaveAttribute('aria-label', '9月21日');
});

test('closing repeated dates does not trap browser history', async ({ page }) => {
  await page.goto('./?before=1');
  await page.goto('./');
  for (const key of ['01-01', '01-02']) {
    await page.locator('[data-date="' + key + '"]').click();
    await page.getByRole('button', { name: '关闭日期详情' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    expect(new URL(page.url()).hash).toBe('');
  }
  await page.goBack();
  await expect(page).toHaveURL(/\?before=1$/);
});

test('closing a direct date link returns focus to a visible date', async ({ page }) => {
  await page.goto('./#12-31');
  await page.getByRole('button', { name: '关闭日期详情' }).click();
  await expect(page.locator('[data-date="12-31"]')).toBeFocused();
  await expect(page.locator('[data-date="12-31"]')).toBeInViewport();
});
