import { expect, test } from '@playwright/test';

test('renders the starter diagram and downloads every format', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop preview scenario');
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();
  await expect(page.locator('.diagram svg')).toBeVisible();
  const sourceDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Source' }).click();
  expect((await sourceDownload).suggestedFilename()).toBe('diagram.mmd');
  const svgDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'SVG' }).click();
  expect((await svgDownload).suggestedFilename()).toBe('diagram.svg');
  const pngDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'PNG' }).click();
  expect((await pngDownload).suggestedFilename()).toBe('diagram.png');
});

test('keeps the last valid preview when source has an error', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop preview scenario');
  await page.goto('/');
  await expect(page.locator('.diagram svg')).toBeVisible();
  await page.getByLabel('Mermaid diagram source').click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('not valid Mermaid syntax >>>');
  await expect(page.getByRole('alert')).toContainText('Can’t render this diagram');
  await expect(page.locator('.diagram svg')).toBeVisible();
});

test('loads from the service-worker cache while offline', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop PWA scenario');
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Mermaid source' })).toBeVisible();
  await context.setOffline(false);
});

test('uses tabs on a phone-sized display', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only scenario');
  await page.goto('/');
  await page.getByRole('tab', { name: 'Preview' }).click();
  await expect(page.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();
});
