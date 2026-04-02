import { GEOCODE_ENDPOINT, PostcodeGeocodeResponse } from '../mocks/geocode';
import {
  REFILL_LOCATION_ENDPOINT,
  RefillLocationResponse,
  RefillLocationMultiResponse,
} from '../mocks/refillLocation';

import { test, expect } from './fixtures';

test.describe('Refill place detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(REFILL_LOCATION_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationResponse });
    });

    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });
  });

  test('Place detail page shows location name', async ({ page, widget }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const placeName = widget.getByText(RefillLocationResponse.name).first();
    await expect(placeName).toBeVisible();
  });

  test('Place detail page shows product category chips', async ({
    page,
    widget,
    i18n,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const foodChip = widget
      .getByText(i18n.t('refill.category.mixed-food'))
      .first();
    const cleaningChip = widget
      .getByText(i18n.t('refill.category.cleaning'))
      .first();

    await expect(foodChip).toBeVisible();
    await expect(cleaningChip).toBeVisible();
  });

  test('Category chips link to filtered places page', async ({
    page,
    widget,
    i18n,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const foodChipLink = widget
      .locator('evg-chip a')
      .filter({ hasText: i18n.t('refill.category.mixed-food') })
      .first();

    await expect(foodChipLink).toHaveAttribute(
      'href',
      /\/EX32 7RB\/refill\/places\?categories=Food/,
    );
  });

  test('Place detail page shows address', async ({ page, widget }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const address = widget
      .getByText(RefillLocationResponse.address, { exact: false })
      .first();
    await expect(address).toBeVisible();
  });

  test('Place detail page shows phone as clickable link', async ({
    page,
    widget,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const phoneLink = widget.locator('a[href^="tel:"]').first();
    await expect(phoneLink).toBeVisible();
  });

  test('Place detail page shows disclaimer text', async ({
    page,
    widget,
    i18n,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const disclaimer = widget
      .getByText(i18n.t('refill.place.disclaimer'))
      .first();
    await expect(disclaimer).toBeVisible();
  });

  test('Website links open in new tab with utm_source', async ({
    page,
    widget,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const websiteLink = widget
      .locator('a[href*="utm_source=wrap-recycling-locator"]')
      .first();
    await expect(websiteLink).toBeVisible();
    await expect(websiteLink).toHaveAttribute('target', '_blank');
    await expect(websiteLink).toHaveAttribute('rel', /noopener noreferrer/);
  });

  test('Supplier website chip links open in new tab', async ({
    page,
    widget,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const supplierLink = widget.locator('evg-chip a[target="_blank"]').first();
    await expect(supplierLink).toBeVisible();
    await expect(supplierLink).toHaveAttribute('rel', /noopener noreferrer/);
  });

  test('Place detail has back link to places list', async ({
    page,
    widget,
    i18n,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    const backLink = widget
      .getByRole('link', { name: i18n.t('actions.back') })
      .first();
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute(
      'href',
      /\/EX32 7RB\/refill\/places/,
    );
  });
});

test.describe('Refill place detail with multiple locations (first-wins logic)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(REFILL_LOCATION_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationMultiResponse });
    });

    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });
  });

  test('Shows phone from first location that has one', async ({
    page,
    widget,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    // First sub-location telephone should be shown
    const phoneLink = widget
      .locator(`a[href="tel:${RefillLocationMultiResponse.locations[0].telephone}"]`)
      .first();
    await expect(phoneLink).toBeVisible();

    // Third sub-location telephone should NOT appear
    const thirdPhoneLink = widget.locator(
      `a[href="tel:${RefillLocationMultiResponse.locations[2].telephone}"]`,
    );
    await expect(thirdPhoneLink).not.toBeVisible();
  });

  test('Shows website from first location that has one', async ({
    page,
    widget,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    // Second sub-location website should be shown (first doesn't have one)
    const websiteLink = widget
      .locator('a[href*="utm_source=wrap-recycling-locator"]')
      .first();
    await expect(websiteLink).toBeVisible();
    await expect(websiteLink).toHaveAttribute(
      'href',
      new RegExp(
        RefillLocationMultiResponse.locations[1].website!.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&',
        ),
      ),
    );

    // Third sub-location website should NOT appear
    const thirdWebsiteLink = widget.locator(
      `a[href*="${RefillLocationMultiResponse.locations[2].website}"]`,
    );
    await expect(thirdWebsiteLink).not.toBeVisible();
  });

  test('Shows notes from first location that has them', async ({
    page,
    widget,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places/1001'),
    );

    await page.waitForRequest(REFILL_LOCATION_ENDPOINT);

    // Second sub-location notes should be shown (first doesn't have any)
    const secondNotes = widget
      .getByText(RefillLocationMultiResponse.locations[1].notes!)
      .first();
    await expect(secondNotes).toBeVisible();

    // Third sub-location notes should NOT appear
    const thirdNotes = widget.getByText(
      RefillLocationMultiResponse.locations[2].notes!,
    );
    await expect(thirdNotes).not.toBeVisible();
  });
});
