import { expect, test } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const landingPageUrl = pathToFileURL(
  fileURLToPath(new URL('../index.html', import.meta.url)),
).href;

test('landing page states the supported Design Partner release boundary', async ({
  page,
}) => {
  await page.goto(landingPageUrl);

  await expect(page).toHaveTitle(
    'Stocket — Hosted inventory for Design Partners',
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'An invite-only hosted inventory workspace for products, stock lots, locations, and human-reviewed stock operations.',
  );
  await expect(
    page.getByRole('heading', { level: 1, name: 'Inventory changes you can explain' }),
  ).toBeVisible();
  await expect(page.getByText('Private Design Partner release')).toBeVisible();
  await expect(
    page.getByText(
      'Hosted desktop web · Online only · English and French · Free during the Design Partner phase',
    ),
  ).toBeVisible();
});

test('landing page advertises only the supported hosted inventory capabilities', async ({
  page,
}) => {
  await page.goto(landingPageUrl);

  const capabilityHeadings = await page
    .locator('#features .feature-card h3')
    .allTextContents();

  expect(capabilityHeadings).toEqual([
    'Products & categories',
    'Locations & areas',
    'Lot-level balances',
    'Stock operations',
    'Tenant administration',
    'Assisted Smart Import',
  ]);

  const visibleCopy = await page.locator('body').innerText();

  expect(visibleCopy).not.toMatch(
    /orders|suppliers|clients|purchase orders|dispatch|in-transit|multi-currency|custom metadata|pick, pack|every unit|stays in sync|reorder/i,
  );
});
