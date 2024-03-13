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

    const input = page.locator('input').first();
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

    const input = page.locator('input').first();
    const postcode = page.getByText('EX32 7RB').first();
    const city = page.getByText('Barnstaple').first();
    const postcodePageTitle = page.getByText(t('postcode.title')).first();
    await expect(input).toBeVisible();
    await expect(postcode).not.toBeVisible();
    await expect(city).not.toBeVisible();
    await expect(postcodePageTitle).not.toBeVisible();
    await input.fill('EX32 7RB');
    await input.press('Enter');
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await expect(postcode).toBeVisible();
    await expect(city).toBeVisible();
    await expect(postcodePageTitle).toBeVisible();
  });

  test('Valid location entry', async ({ page }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: ValidPostcodeResponse });
    });

    const input = page.locator('input').first();
    const postcode = page.getByText('EX32 7RB').first();
    const city = page.getByText('Barnstaple').first();
    const postcodePageTitle = page.getByText(t('postcode.title')).first();
    await expect(input).toBeVisible();
    await expect(postcode).not.toBeVisible();
    await expect(city).not.toBeVisible();
    await expect(postcodePageTitle).not.toBeVisible();
    await input.fill('Barnstaple');
    await input.press('Enter');
    await page.waitForRequest(GEOCODE_ENDPOINT);
    await page.waitForRequest(POSTCODE_ENDPOINT);
    await expect(postcode).toBeVisible();
    await expect(city).toBeVisible();
    await expect(postcodePageTitle).toBeVisible();
  });

  test('Invalid location entry', async ({ page }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(POSTCODE_ENDPOINT, (route) => {
      route.fulfill({ json: InvalidPostcodeResponse });
    });

    const input = page.locator('input').first();
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

    const input = page.locator('input').first();
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
});
