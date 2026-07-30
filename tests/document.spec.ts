import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';

const landingPageUrl = pathToFileURL(
  fileURLToPath(new URL('../index.html', import.meta.url)),
).href;

const scopePageUrl = pathToFileURL(
  fileURLToPath(new URL('../scope-and-limitations.html', import.meta.url)),
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

for (const [pageName, publicPageUrl] of [
  ['landing page', landingPageUrl],
  ['scope page', scopePageUrl],
] as const) {
  test(`${pageName} has no automated WCAG 2.2 AA violations`, async ({
    page,
  }) => {
    await page.goto(publicPageUrl);

    const results = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22a',
        'wcag22aa',
      ])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
