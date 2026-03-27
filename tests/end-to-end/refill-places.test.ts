import {
  REFILL_LOCATIONS_ENDPOINT,
  RefillLocationsResponse,
  RefillLocationsFilteredResponse,
  RefillLocationsEmptyResponse,
  RefillLocationsWithBrandsResponse,
} from '../mocks/refillLocations';

import { test, expect } from './fixtures';

test.describe('Refill places', () => {
  test('All filter is active by default', async ({ page, widget, i18n }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const allFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.all') })
      .first();
    const foodFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.Food') })
      .first();

    await expect(allFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(foodFilter).not.toHaveAttribute('aria-pressed', 'true');
  });

  test('Places list displays with heading', async ({ page, widget, i18n }) => {
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
    const placeName = widget
      .getByText(RefillLocationsResponse.items[0].name)
      .first();

    await expect(heading).toBeVisible();
    await expect(placeName).toBeVisible();
  });

  test('Header shows "Places to refill" title', async ({
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

    const headerTitle = widget.getByText(i18n.t('refill.places.title')).first();

    await expect(headerTitle).toBeVisible();
  });

  test('Filter pills render', async ({ page, widget, i18n }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const allFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.all') })
      .first();
    const foodFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.Food') })
      .first();
    const cleaningFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.Cleaning') })
      .first();
    const careFilter = widget
      .getByRole('button', {
        name: i18n.t('refill.filters.Personal Care'),
      })
      .first();

    await expect(allFilter).toBeVisible();
    await expect(foodFilter).toBeVisible();
    await expect(cleaningFilter).toBeVisible();
    await expect(careFilter).toBeVisible();
  });

  test('Clicking a filter updates results', async ({ page, widget, i18n }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      const url = new URL(route.request().url());
      const categories = url.searchParams.get('categories');

      if (categories === 'Food') {
        route.fulfill({ json: RefillLocationsFilteredResponse });
      } else {
        route.fulfill({ json: RefillLocationsResponse });
      }
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const heading3 = widget
      .getByText(i18n.t('refill.places.count', { count: 3 }))
      .first();

    await expect(heading3).toBeVisible();

    const foodFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.Food') })
      .first();
    await foodFilter.click();

    const alert = widget.locator('evg-alert[variant="positive-light"]').first();
    await expect(alert).toBeVisible();
  });

  test('Positive alert appears when filtered with results', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      const url = new URL(route.request().url());
      const categories = url.searchParams.get('categories');

      if (categories === 'Food') {
        route.fulfill({ json: RefillLocationsFilteredResponse });
      } else {
        route.fulfill({ json: RefillLocationsResponse });
      }
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const foodFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.Food') })
      .first();
    await foodFilter.click();

    const alert = widget.locator('evg-alert[variant="positive-light"]').first();

    await expect(alert).toBeVisible();
  });

  test('Negative alert appears when filtered with no results', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      const url = new URL(route.request().url());
      const categories = url.searchParams.get('categories');

      if (categories === 'Personal Care') {
        route.fulfill({ json: RefillLocationsEmptyResponse });
      } else {
        route.fulfill({ json: RefillLocationsResponse });
      }
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const careFilter = widget
      .getByRole('button', {
        name: i18n.t('refill.filters.Personal Care'),
      })
      .first();
    await careFilter.click();

    const alert = widget.locator('evg-alert[variant="negative-light"]').first();

    await expect(alert).toBeVisible();
  });

  test('Clear filters resets to all results', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      const url = new URL(route.request().url());
      const categories = url.searchParams.get('categories');

      if (categories === 'Food') {
        route.fulfill({ json: RefillLocationsFilteredResponse });
      } else {
        route.fulfill({ json: RefillLocationsResponse });
      }
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const foodFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.Food') })
      .first();
    await foodFilter.click();

    const alert = widget.locator('evg-alert[variant="positive-light"]').first();
    await expect(alert).toBeVisible();

    const clearButton = widget
      .getByRole('button', { name: i18n.t('refill.filters.clearFilters') })
      .first();
    await clearButton.click();

    await expect(alert).not.toBeVisible();
  });

  test('Brand logos appear when known brands are present', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsWithBrandsResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const brandsCard = widget.locator('locator-refill-brands').first();
    await expect(brandsCard).toBeVisible();

    const title = widget.getByText(i18n.t('refill.brands.title')).first();
    await expect(title).toBeVisible();

    const ecover = brandsCard.getByAltText('Ecover');
    const faithInNature = brandsCard.getByAltText('Faith in Nature');
    await expect(ecover).toBeVisible();
    await expect(faithInNature).toBeVisible();
  });

  test('Category filter is hidden when no refill places exist', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsEmptyResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const alert = widget.locator('evg-alert').first();
    await expect(alert).toBeVisible();

    const allFilter = widget
      .getByRole('button', { name: i18n.t('refill.filters.all') })
      .first();
    await expect(allFilter).not.toBeVisible();
  });

  test('Place cards show category icons', async ({ page, widget }) => {
    await page.route(REFILL_LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: RefillLocationsResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/places'),
    );

    await page.waitForRequest(REFILL_LOCATIONS_ENDPOINT);

    const placeName = widget
      .getByText(RefillLocationsResponse.items[0].name)
      .first();
    await expect(placeName).toBeVisible();

    const categoryIcons = widget.locator(
      'locator-place-summary .refill-categories locator-icon',
    );
    await expect(categoryIcons.first()).toBeVisible();
  });
});
