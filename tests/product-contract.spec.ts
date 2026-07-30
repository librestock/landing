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
    'An invite-only hosted inventory workspace for products, stock lots, locations, and validated stock operations.',
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
  await expect(page.locator('#access')).toContainText(
    'Stocket is preparing a small Design Partner release. Request consideration for an invitation after release approval.',
  );
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

test('dashboard mockup uses only the three approved operation types', async ({
  page,
}) => {
  await page.goto(landingPageUrl);

  const operationSummaries = await page
    .locator('.dash-move-text > div:first-child')
    .allTextContents();

  expect(operationSummaries).toEqual([
    'Adjusted Organic Tomatoes +24',
    'Corrected Coffee Beans −2',
    'Transferred Dry Goods × 12',
    'Adjusted Bordeaux 2019 +6',
  ]);
  await expect(page.locator('.dash-movements li').last()).toContainText(
    'OP-1039 · Opening balance · Cellar · 2 h ago',
  );
});

test('scope link resolves to the authoritative hosted v1 boundary', async ({
  page,
}) => {
  await page.goto(landingPageUrl);

  const scopeLink = page
    .getByRole('link', { name: 'Scope & limitations' })
    .first();

  await expect(scopeLink).toHaveAttribute('href', 'scope-and-limitations.html');
  await scopeLink.click();

  await expect(page).toHaveURL(/\/scope-and-limitations\.html$/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Hosted inventory v1 scope & limitations',
    }),
  ).toBeVisible();
  await expect(page.getByText('Contract revision: hosted-inventory-v1.0.0')).toBeVisible();
  await expect(page.getByText('Release approval: pending evidence')).toBeVisible();

  const includedCapabilities = await page
    .locator('[data-scope="included"] li')
    .allTextContents();

  expect(includedCapabilities).toEqual([
    'Products and categories',
    'Locations with nested storage areas',
    'Exact lot-level inventory balances',
    'Adjustments, transfers, and compensating corrections',
    'Human-reviewed assisted Smart Import',
    'Tenant users, roles, settings, and audit views',
  ]);

  await expect(page.locator('[data-scope="excluded"]')).toContainText(
    'Orders, clients, suppliers, purchasing, fulfillment, reporting, notifications, billing, public API or MCP access, mobile, remote desktop, offline or PWA behavior, German localization, and high availability are not included.',
  );
});
