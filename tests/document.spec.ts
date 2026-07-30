import { expect, test } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const landingPageUrl = pathToFileURL(
  fileURLToPath(new URL('../index.html', import.meta.url)),
).href;

test('every same-document fragment link names an existing target', async ({
  page,
}) => {
  await page.goto(landingPageUrl);

  const missingTargets = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links
      .map((link) => link.getAttribute('href'))
      .filter((href): href is string => href !== null && href.length > 1)
      .filter((href) => document.getElementById(decodeURIComponent(href.slice(1))) === null),
  );

  expect(missingTargets).toEqual([]);
});
