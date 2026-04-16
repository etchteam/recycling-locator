import { GEOCODE_ENDPOINT, PostcodeGeocodeResponse } from '../mocks/geocode';
import {
  REFILL_LOCATIONS_ENDPOINT,
  RefillLocationsResponse,
  RefillLocationsEmptyResponse,
} from '../mocks/refillLocations';

import { test, expect } from './fixtures';

test.describe('Refill start page', () => {
  test('Refill start page renders with postcode input', async ({
    widget,
    i18n,
  }) => {
    await widget.evaluate((node) => node.setAttribute('path', '/refill'));

    const title = widget.getByText(i18n.t('refill.start.title')).first();
    const input = widget.locator('input[type="text"]').first();
    const submitButton = widget.locator('button[type="submit"]').first();

    await expect(title).toBeVisible();
    await expect(input).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('Entering a valid postcode navigates to refill landing', async ({
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

    await widget.evaluate((node) => node.setAttribute('path', '/refill'));

    const input = widget.locator('input[type="text"]').first();
    await expect(input).toBeVisible();
    await input.fill('EX32 7RB');
    await input.press('Enter');
    await page.waitForRequest(GEOCODE_ENDPOINT);

    const exploreTitle = widget
      .getByText(i18n.t('refill.explore.title'))
      .first();
    await expect(exploreTitle).toBeVisible();

    const postcode = widget.getByText('EX32 7RB').first();
    const city = widget.getByText('Barnstaple').first();
    await expect(postcode).toBeVisible();
    await expect(city).toBeVisible();
  });
});

test.describe('Refill landing page', () => {
  test('Landing page shows nearest locations link', async ({
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
      node.setAttribute('path', '/EX32 7RB/refill'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const nearestLink = widget
      .getByText(i18n.t('refill.explore.nearestLocations.title'))
      .first();
    await expect(nearestLink).toBeVisible();
  });

  test('Nearest locations link points to places page', async ({
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
      node.setAttribute('path', '/EX32 7RB/refill'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const nearestLink = widget
      .locator('a')
      .filter({
        hasText: i18n.t('refill.explore.nearestLocations.title'),
      })
      .first();
    await expect(nearestLink).toBeVisible();
    await expect(nearestLink).toHaveAttribute(
      'href',
      /\/EX32 7RB\/refill\/places/,
    );
  });

  test('Category card links point to filtered places page', async ({
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
      node.setAttribute('path', '/EX32 7RB/refill'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const foodCardLink = widget
      .locator('locator-category-card a')
      .filter({ hasText: i18n.t('refill.category.mixed-food') })
      .first();
    await expect(foodCardLink).toBeVisible();
    await expect(foodCardLink).toHaveAttribute(
      'href',
      /\/EX32 7RB\/refill\/places\?categories=Food/,
    );
  });

  test('Recycling options link is visible', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const recyclingLink = widget
      .getByText(i18n.t('refill.explore.recyclingOptions.title'))
      .first();
    await expect(recyclingLink).toBeVisible();
  });
});

test.describe('Refill empty state on landing page', () => {
  test('Empty state shows no places message', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsEmptyResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const noPlacesTitle = widget
      .getByText(i18n.t('refill.explore.noPlaces.title'))
      .first();
    const noPlacesDescription = widget
      .getByText(i18n.t('refill.explore.noPlaces.description'))
      .first();

    await expect(noPlacesTitle).toBeVisible();
    await expect(noPlacesDescription).toBeVisible();
  });

  test('Empty state shows alternative options', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsEmptyResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const stillHaveOptions = widget
      .getByText(i18n.t('refill.explore.stillHaveOptions'))
      .first();
    const recyclingLink = widget
      .getByText(i18n.t('refill.explore.recyclingOptions.title'))
      .first();

    await expect(stillHaveOptions).toBeVisible();
    await expect(recyclingLink).toBeVisible();
  });
});

test.describe('Refill back navigation', () => {
  test('Refill places page has back link to refill landing', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const heading = widget
      .getByText(i18n.t('refill.places.count', { count: 3 }))
      .first();
    await expect(heading).toBeVisible();

    const backLink = widget
      .getByRole('link', { name: i18n.t('actions.back') })
      .first();
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', /\/EX32 7RB\/refill/);
  });
});
