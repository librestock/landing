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

  await page.keyboard.press('Escape');

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
});
