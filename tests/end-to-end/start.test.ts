import { expect } from '@playwright/test';
import { t } from 'i18next';
import { test } from 'vitest';

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
import { MATERIALS_ENDPOINT, ValidMaterialsResponse } from '../mocks/materials';
import {
  POSTCODE_ENDPOINT,
  InvalidPostcodeResponse,
  ValidPostcodeResponse,
} from '../mocks/postcode';
import describeEndToEndTest from '../utils/describeEndToEndTest';

describeEndToEndTest('Start page', () => {
  test('Address outside mainland England', async ({ page }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: GuernseyGeocodeResponse });
    });

    const input = page.locator('input[type="text"]').first();
    const notInUk = page.getByText(t('notFound.title.notInTheUK')).first();
    await expect(input).toBeVisible();
    await expect(notInUk).not.toBeVisible();
    await input.fill('Guernsey');
    await input.press('Enter');
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await expect(notInUk).toBeVisible();
  });

  test('Valid postcode entry (skips lat lng check)', async ({ page }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const input = page.locator('input[type="text"]').first();
    const postcode = page.getByText('EX32 7RB').first();
    const city = page.getByText('Barnstaple').first();

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

  test('Valid location entry', async ({ page }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: ValidPostcodeResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const input = page.locator('input[type="text"]').first();
    const postcode = page.getByText('EX32 7RB').first();
    const city = page.getByText('Barnstaple').first();
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

  test('Invalid location entry', async ({ page }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: InvalidPostcodeResponse });
    });

    const input = page.locator('input[type="text"]').first();
    const postcode = page.getByText('EX32 7RB').first();
    const city = page.getByText('Barnstaple').first();
    const notFoundPageTitle = page
      .getByText(t('notFound.title.default'))
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

  test('Home recycling start', async ({ page, widget }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: ValidPostcodeResponse });
    });

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    const input = page.locator('input[type="text"]').first();
    const homeStartPageTitle = page
      .getByText(t('start.homeRecycling.title'))
      .first();
    const localAuthority = page.getByText(LocalAuthorityResponse.name).first();

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

  test('Material start', async ({ page, widget }) => {
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
      route.fulfill({ json: ValidMaterialsResponse });
    });

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const input = page.locator('input[type="text"]').first();
    const materialStartPageTitle = page
      .getByText('Plastic drinks bottles')
      .first();
    const recyclableText = page.getByText(t('material.hero.yes')).first();

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
    await expect(recyclableText).toBeVisible();
  });
});
