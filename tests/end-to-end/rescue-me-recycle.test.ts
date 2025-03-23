import { expect } from '@playwright/test';
import { test } from 'vitest';

import { GEOCODE_ENDPOINT, PostcodeGeocodeResponse } from '../mocks/geocode';
import { LOCATIONS_ENDPOINT, LocationsResponse } from '../mocks/locations';
import describeEndToEndTest from '../utils/describeEndToEndTest';
import i18n from '@/lib/i18n';

describeEndToEndTest('Rescue me recycle promo', () => {
  test('Promo displays on English postcode page', async ({ page, widget }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const promoElement = page
      .locator('locator-rescue-me-recycle-promo')
      .first();
    const promoLink = page.locator('locator-rescue-me-recycle-promo a').first();

    await widget.evaluate((node) => node.setAttribute('path', '/EX32 7RB'));
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);

    await expect(promoElement).toBeVisible();

    // Verify the correct link path
    const href = await promoLink.getAttribute('href');
    expect(href).toBe('/EX32 7RB/rescue-me-recycle');
  });

  test('Promo does not display on Welsh language version', async ({
    page,
    widget,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    // Set the language to Welsh
    await widget.evaluate((node) => {
      node.setAttribute('path', '/EX32 7RB');
      node.setAttribute('lang', 'cy');
    });

    i18n.changeLanguage('cy');

    await page.waitForRequest(GEOCODE_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);

    const promoElement = page
      .locator('locator-rescue-me-recycle-promo')
      .first();

    // Expect the promo not to be visible in Welsh locale
    await expect(promoElement).not.toBeVisible();
  });
});
