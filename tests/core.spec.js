import { test, expect } from '@playwright/test';
test('landing has real people and functioning directory discovery', async ({ page }, testInfo) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /Your next role starts with someone/ })).toBeVisible();
  await page.getByRole('button', { name: 'Find Pau Sum in the network' }).click();
  await expect(page.getByRole('textbox', { name: 'Search the network' })).toHaveValue('Pau Sum');
  await expect(page.getByRole('status')).toHaveText('1 person in this view');
  await expect(page.getByRole('link', { name: "View Pau Sum's LinkedIn profile" })).toBeVisible();
});
test('search, filtering, reset and full directory navigation work', async ({ page }, testInfo) => {
  await page.goto('./');
  const search = page.getByRole('textbox', { name: 'Search the network' });
  await search.fill('no-result-xyz');
  await expect(page.getByRole('heading', { name: 'No match, yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset this view' }).click();
  await expect(page.getByRole('status')).toHaveText('5 people in this view');
  await expect(page.getByRole('button', { name: 'Engineering', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'AI', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('2 people in this view');
  await expect(page.getByRole('link', { name: "View Pau Sum's LinkedIn profile" })).toHaveCount(0);
  await page.getByRole('button', { name: 'Systems', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('2 people in this view');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('systems-desktop.png'), fullPage: true });
  await page.getByRole('link', { name: 'Open full directory' }).click();
  await expect(page.getByRole('heading', { name: 'Meet the network.' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search candidates' }).fill('FreeBSD');
  await expect(page.getByRole('heading', { name: 'Pau Sum' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Alex Chen' })).toHaveCount(0);
});
test('mobile keeps portrait proof, menu state, and no horizontal overflow', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Find Pau Sum in the network' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true });
  const menu = page.getByRole('button', { name: 'Toggle menu' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});
test('application link goes to an actual intake form, not a fake signup', async ({ page }, testInfo) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Introduce yourself', exact: false }).first().click();
  await expect(page).toHaveURL(/\/apply$/);
  await expect(page.getByText('About You', { exact: true })).toBeVisible();
});
