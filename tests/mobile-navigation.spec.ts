import { expect, test } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const landingPageUrl = pathToFileURL(
  fileURLToPath(new URL('../index.html', import.meta.url)),
).href;

test('mobile navigation exposes state and remains keyboard usable', async ({
  page,
}) => {
  await page.goto(landingPageUrl);

  const toggle = page.getByRole('button', { name: /navigation menu/ });
  const menu = page.locator('#primary-navigation-menu');
  const firstLink = menu.getByRole('link', { name: 'Features' });

  await expect(toggle).toHaveAttribute('aria-controls', 'primary-navigation-menu');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(menu).toBeHidden();

  await toggle.focus();
  await page.keyboard.press('Enter');

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close navigation menu');
  await expect(menu).toBeVisible();
  await expect(firstLink).toBeFocused();

  await page.keyboard.press('Enter');

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
  await expect(page.locator('#features h2')).toBeFocused();

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(firstLink).toBeFocused();

  await page.keyboard.press('Escape');

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('desktop navigation does not overlap at the responsive breakpoint', async ({
  page,
}) => {
  await page.setViewportSize({ width: 769, height: 844 });
  await page.goto(landingPageUrl);

  const logoBox = await page.locator('.header .logo').boundingBox();
  const firstLinkBox = await page
    .locator('#primary-navigation-menu')
    .getByRole('link', { name: 'Features' })
    .boundingBox();

  expect(logoBox).not.toBeNull();
  expect(firstLinkBox).not.toBeNull();

  if (logoBox === null || firstLinkBox === null) {
    throw new Error('desktop navigation must be visible at 769px');
  }

  expect(logoBox.x + logoBox.width + 8).toBeLessThanOrEqual(firstLinkBox.x);
});
