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
  EmptyMaterialsResponse,
  MATERIALS_ENDPOINT,
  POPULAR_MATERIALS_ENDPOINT,
  PopularMaterialsResponse,
  ValidMaterialsResponse,
} from '../mocks/materials';

import { test, expect } from './fixtures';

test.describe('Postcode page', () => {
  test('Load route with invalid postcode', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: GuernseyGeocodeResponse });
    });

    const notInUk = widget
      .getByText(i18n.t('notFound.title.notInTheUK'))
      .first();

    await expect(notInUk).not.toBeVisible();
    await widget.evaluate((node) => node.setAttribute('path', '/EX32 7RB'));
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await expect(notInUk).toBeVisible();
  });

  test('Start route with invalid postcode', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: GuernseyGeocodeResponse });
    });

    const notInUk = widget
      .getByText(i18n.t('notFound.title.notInTheUK'))
      .first();

    await expect(notInUk).not.toBeVisible();
    await widget.evaluate((node) => node.setAttribute('path', '/GU375EY'));
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await expect(notInUk).toBeVisible();
  });

  test('Invalid material search', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(MATERIALS_ENDPOINT, (route) => {
      route.fulfill({ json: EmptyMaterialsResponse });
    });

    await page.route(POPULAR_MATERIALS_ENDPOINT, (route) => {
      route.fulfill({ json: PopularMaterialsResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const material = 'Not a material';
    const input = widget.locator('input').first();
    const notFound = widget
      .getByText(i18n.t('material.search.notFound'))
      .first();

    await widget.evaluate((node) => node.setAttribute('path', '/EX32 7RB'));
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await expect(input).toBeVisible();
    await expect(notFound).not.toBeVisible();
    await input.fill(material);
    await input.press('Enter');
    await expect(notFound).toBeVisible();
  });

  test('Valid material search', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(MATERIALS_ENDPOINT, (route) => {
      route.fulfill({ json: ValidMaterialsResponse });
    });

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const material = 'Plastic milk bottles';
    const input = widget.locator('input').first();
    const materialText = widget.getByText(material).first();
    const recyclableText = widget
      .getByText(i18n.t('material.hero.yes'))
      .first();
    const materialSearchPageTitle = widget
      .getByText(i18n.t('postcode.title'))
      .first();
    const materialPageTitle = widget
      .getByText(i18n.t('material.title'))
      .first();

    await widget.evaluate((node) => node.setAttribute('path', '/EX32 7RB'));
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await expect(input).toBeVisible();
    await expect(materialText).not.toBeVisible();
    await expect(recyclableText).not.toBeVisible();
    await expect(materialSearchPageTitle).toBeVisible();
    await input.fill(material);
    await input.press('Enter');
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(materialText).toBeVisible();
    await expect(recyclableText).toBeVisible();
    await expect(materialPageTitle).toBeVisible();
  });
});
