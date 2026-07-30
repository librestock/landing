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

test('release boundary text has AA contrast over the real hero background', async ({
  page,
}) => {
  const worstCaseBackgrounds = {
    light: [245, 245, 245],
    dark: [12, 10, 9],
  } as const;

  for (const theme of ['light', 'dark'] as const) {
    await page.goto(landingPageUrl);
    await page.evaluate((selectedTheme) => {
      document.body.style.transition = 'none';
      document.documentElement.setAttribute('data-theme', selectedTheme);
    }, theme);

    const contrastRatio = await page.locator('.hero-boundary').evaluate(
      (element, background) => {
        const foreground = getComputedStyle(element).color
          .match(/\d+(?:\.\d+)?/g)
          ?.slice(0, 3)
          .map(Number);

        if (foreground?.length !== 3) {
          throw new Error('Expected the release boundary to have an RGB foreground');
        }

        const luminance = (rgb: readonly number[]) => {
          const [red, green, blue] = rgb.map((channel) => {
            const normalized = channel / 255;
            return normalized <= 0.04045
              ? normalized / 12.92
              : ((normalized + 0.055) / 1.055) ** 2.4;
          });

          return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
        };

        const foregroundLuminance = luminance(foreground);
        const backgroundLuminance = luminance(background);
        const lighter = Math.max(foregroundLuminance, backgroundLuminance);
        const darker = Math.min(foregroundLuminance, backgroundLuminance);

        return (lighter + 0.05) / (darker + 0.05);
      },
      worstCaseBackgrounds[theme],
    );

    expect(contrastRatio, `${theme} theme`).toBeGreaterThanOrEqual(4.5);
  }
});
