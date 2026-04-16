import { GEOCODE_ENDPOINT, PostcodeGeocodeResponse } from '../mocks/geocode';
import {
  REFILL_LOCATIONS_ENDPOINT,
  RefillLocationsResponse,
} from '../mocks/refillLocations';

import { test, expect } from './fixtures';

test.describe('Refill 404 (start level)', () => {
  test('Shows refill logo and location form on /refill/unknown', async ({
    widget,
    i18n,
  }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/refill/unknown'),
    );

    const title = widget.getByText(i18n.t('notFound.title.default')).first();
    const input = widget.locator('input[type="text"]').first();

    await expect(title).toBeVisible();
    await expect(input).toBeVisible();
  });

  test('Has purple theme on /refill/unknown', async ({ widget }) => {
    await widget.evaluate((node) =>
      node.setAttribute('path', '/refill/unknown'),
    );

    const purpleTheme = widget.locator('.theme-preset-purple').first();
    await expect(purpleTheme).toBeVisible();
  });
});

test.describe('Refill 404 (postcode level)', () => {
  test('Shows not found title with refill and recycling options', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/unknown'),
    );

    const title = widget.getByText(i18n.t('notFound.title.default')).first();
    const refillLink = widget.getByText(i18n.t('refill.explore.title')).first();
    const recyclingLink = widget
      .getByText(i18n.t('refill.explore.recyclingOptions.title'))
      .first();
    const orSeparator = widget.getByText(i18n.t('common.or')).first();

    await expect(title).toBeVisible();
    await expect(refillLink).toBeVisible();
    await expect(recyclingLink).toBeVisible();
    await expect(orSeparator).toBeVisible();
  });

  test('Refill option links to /:postcode/refill', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/unknown'),
    );

    const refillLink = widget
      .locator('a')
      .filter({ hasText: i18n.t('refill.explore.title') })
      .first();

    await expect(refillLink).toBeVisible();
    await expect(refillLink).toHaveAttribute('href', /\/EX32 7RB\/refill/);
  });
});

test.describe('Recycling 404 (postcode level)', () => {
  test('Shows not found title with recycling and refill options', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/unknown'),
    );

    const title = widget.getByText(i18n.t('notFound.title.default')).first();
    const recyclingLink = widget
      .getByText(i18n.t('refill.explore.recyclingOptions.title'))
      .first();
    const refillLink = widget.getByText(i18n.t('refill.explore.title')).first();
    const orSeparator = widget.getByText(i18n.t('common.or')).first();

    await expect(title).toBeVisible();
    await expect(recyclingLink).toBeVisible();
    await expect(refillLink).toBeVisible();
    await expect(orSeparator).toBeVisible();
  });

  test('Recycling option links to /:postcode', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/unknown'),
    );

    const recyclingLink = widget
      .locator('a')
      .filter({ hasText: i18n.t('refill.explore.recyclingOptions.title') })
      .first();

    await expect(recyclingLink).toBeVisible();
    await expect(recyclingLink).toHaveAttribute('href', /\/EX32 7RB$/);
  });

  test('Refill option links to /:postcode/refill', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/unknown'),
    );

    const refillLink = widget
      .locator('a')
      .filter({ hasText: i18n.t('refill.explore.title') })
      .first();

    await expect(refillLink).toBeVisible();
    await expect(refillLink).toHaveAttribute('href', /\/EX32 7RB\/refill/);
  });
});
