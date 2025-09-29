import { test, expect } from '@playwright/test';

test('the QR code generation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('test');
  await expect(page.locator('img')).toBeVisible();
  await page.getByRole('link', { name: 'Print' }).click();
  await expect(page.locator('img')).toBeVisible();
});
