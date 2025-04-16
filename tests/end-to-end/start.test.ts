import {
  GEOCODE_ENDPOINT,
  GuernseyGeocodeResponse,
  PostcodeGeocodeResponse,
} from '../mocks/geocode';
import {
  LOCAL_AUTHORITY_ENDPOINT,
  LocalAuthorityResponse,
} from '../mocks/localAuthority';
import { LOCATIONS_ENDPOINT, LocationsResponse } from '../mocks/locations';
import {
  MATERIALS_ENDPOINT,
  MATERIAL_ENDPOINT,
  ValidMaterialResponse,
} from '../mocks/materials';
import {
  InvalidPostcodeResponse,
  POSTCODE_ENDPOINT,
  ValidPostcodeResponse,
} from '../mocks/postcode';

import { test, expect } from './fixtures';

test.describe('Start page', () => {
  test('Address outside mainland England', async ({ page, i18n, widget }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: GuernseyGeocodeResponse });
    });

    const input = widget.locator('input[type="text"]').first();
    const notInUk = widget
      .getByText(i18n.t('notFound.title.notInTheUK'))
      .first();
    await expect(input).toBeVisible();
    await expect(notInUk).not.toBeVisible();
    await input.fill('Guernsey');
    await input.press('Enter');
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await expect(notInUk).toBeVisible();
  });

  test('Valid postcode entry (skips lat lng check)', async ({
    page,
    widget,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const input = widget.locator('input[type="text"]').first();
    const postcode = widget.getByText('EX32 7RB').first();
    const city = widget.getByText('Barnstaple').first();

    await expect(input).toBeVisible();
    await expect(postcode).not.toBeVisible();
    await expect(city).not.toBeVisible();
    await input.fill('EX32 7RB');
    await input.press('Enter');
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(postcode).toBeVisible();
    await expect(city).toBeVisible();
  });

  test('Valid location entry', async ({ page, widget }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: ValidPostcodeResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const input = widget.locator('input[type="text"]').first();
    const postcode = widget.getByText('EX32 7RB').first();
    const city = widget.getByText('Barnstaple').first();
    await expect(input).toBeVisible();
    await expect(postcode).not.toBeVisible();
    await expect(city).not.toBeVisible();
    await input.fill('Barnstaple');
    await input.press('Enter');
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await page.waitForRequest(POSTCODE_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(postcode).toBeVisible();
    await expect(city).toBeVisible();
  });

  test('Invalid location entry', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: InvalidPostcodeResponse });
    });

    const input = widget.locator('input[type="text"]').first();
    const postcode = widget.getByText('EX32 7RB').first();
    const city = widget.getByText('Barnstaple').first();
    const notFoundPageTitle = widget
      .getByText(i18n.t('notFound.title.default'))
      .first();
    await expect(input).toBeVisible();
    await expect(postcode).not.toBeVisible();
    await expect(city).not.toBeVisible();
    await expect(notFoundPageTitle).not.toBeVisible();
    await input.fill('Barnstaple');
    await input.press('Enter');
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await page.waitForRequest(POSTCODE_ENDPOINT);
    await expect(notFoundPageTitle).toBeVisible();
  });

  test('Home recycling start', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: ValidPostcodeResponse });
    });

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    const input = widget.locator('input[type="text"]').first();
    const homeStartPageTitle = widget
      .getByText(i18n.t('start.homeRecycling.title'))
      .first();
    const localAuthority = widget
      .getByText(LocalAuthorityResponse.name)
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/home-recycling'),
    );
    await expect(homeStartPageTitle).toBeVisible();
    await expect(input).toBeVisible();
    await expect(localAuthority).not.toBeVisible();
    await input.fill('Barnstaple');
    await input.press('Enter');
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await expect(localAuthority).toBeVisible();
  });

  test('Material start', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: ValidPostcodeResponse });
    });

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(MATERIALS_ENDPOINT, (route) => {
      route.fulfill({ json: [ValidMaterialResponse] });
    });

    await page.route(MATERIAL_ENDPOINT, (route) => {
      route.fulfill({ json: ValidMaterialResponse });
    });

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const input = widget.locator('input[type="text"]').first();
    const materialStartPageTitle = widget
      .getByText('Plastic drinks bottles')
      .first();
    const recyclableText = widget
      .getByText(i18n.t('material.hero.yes'))
      .first();

    await widget.evaluate((node) =>
      node.setAttribute(
        'path',
        `/material?materials=44&search=Plastic drinks bottles`,
      ),
    );
    await expect(materialStartPageTitle).toBeVisible();
    await expect(input).toBeVisible();
    await expect(recyclableText).not.toBeVisible();
    await input.fill('Barnstaple');
    await input.press('Enter');
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await page.waitForRequest(MATERIAL_ENDPOINT);
    await expect(recyclableText).toBeVisible();
  });
});
