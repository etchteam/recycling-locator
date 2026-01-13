import {
  LOCAL_AUTHORITY_ENDPOINT,
  LocalAuthorityResponse,
} from '../mocks/localAuthority';
import { LOCATIONS_ENDPOINT, LocationsResponse } from '../mocks/locations';

import { test, expect } from './fixtures';

test.describe('Header layouts', () => {
  test.describe('HeaderWithBackButton - contextual back navigation', () => {
    test('Back button returns to previous page', async ({
      page,
      widget,
      i18n,
    }) => {
      await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
        route.fulfill({ json: LocalAuthorityResponse });
      });

      await page.route(LOCATIONS_ENDPOINT, (route) => {
        route.fulfill({ json: LocationsResponse });
      });

      // Navigate to postcode page first
      await widget.evaluate((node) => node.setAttribute('path', '/EX32 7RB'));

      // Then navigate to places page
      const placesLink = widget.getByRole('link', {
        name: i18n.t('postcode.places.title'),
      });
      await expect(placesLink).toBeVisible();
      await placesLink.click();

      // Then navigate to a place detail page
      await page.waitForRequest(LOCATIONS_ENDPOINT);
      const placeName = widget.getByText(LocationsResponse.items[0].name);
      await expect(placeName.first()).toBeVisible();
      await placeName.first().click();

      // Verify we're on the place page
      const placeTitle = widget.getByRole('heading', {
        name: LocationsResponse.items[0].name,
      });
      await expect(placeTitle.first()).toBeVisible();

      // Click back button - should return to places page
      const backButton = widget
        .getByRole('link', { name: i18n.t('actions.back') })
        .first();
      await backButton.click();

      // Verify we're back on the places page
      const placesTitle = widget.getByRole('heading', {
        name: i18n.t('places.title'),
      });
      await expect(placesTitle.first()).toBeVisible();
    });

    test('Back button uses fallback when no history', async ({
      page,
      widget,
      i18n,
    }) => {
      await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
        route.fulfill({ json: LocalAuthorityResponse });
      });

      await page.route(LOCATIONS_ENDPOINT, (route) => {
        route.fulfill({ json: LocationsResponse });
      });

      // Navigate directly to material page (no prior history)
      await widget.evaluate((node) =>
        node.setAttribute(
          'path',
          '/EX32 7RB/material?materials=43&search=Plastic',
        ),
      );

      // Click back button - should use fallback (postcode page)
      const backButton = widget
        .getByRole('link', { name: i18n.t('actions.back') })
        .first();
      await expect(backButton).toBeVisible();
      await backButton.click();

      // Verify we're on the postcode page (fallback)
      const postcodeTitle = widget.getByRole('heading', {
        name: i18n.t('postcode.title'),
      });
      await expect(postcodeTitle.first()).toBeVisible();
    });
  });

  test.describe('HeaderWithMenu - menu toggle', () => {
    test('Menu button opens and closes menu', async ({ page, widget, i18n }) => {
      await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
        route.fulfill({ json: LocalAuthorityResponse });
      });

      await page.route(LOCATIONS_ENDPOINT, (route) => {
        route.fulfill({ json: LocationsResponse });
      });

      // Navigate to places page which uses HeaderWithMenu
      await widget.evaluate((node) =>
        node.setAttribute('path', '/EX32 7RB/places'),
      );

      await page.waitForRequest(LOCATIONS_ENDPOINT);

      // Verify places content is visible
      const placesCount = widget
        .getByText(i18n.t('places.count', { count: 1 }))
        .first();
      await expect(placesCount).toBeVisible();

      // Open menu
      const menuButton = widget
        .getByRole('button', { name: i18n.t('actions.menu') })
        .first();
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      // Verify menu content is visible
      const menuHomeLink = widget.getByRole('link', {
        name: i18n.t('menu.home.title'),
      });
      await expect(menuHomeLink.first()).toBeVisible();

      // Places content should be hidden when menu is open
      await expect(placesCount).not.toBeVisible();

      // Close menu
      const closeButton = widget
        .getByRole('button', { name: i18n.t('actions.close') })
        .first();
      await closeButton.click();

      // Verify places content is visible again
      await expect(placesCount).toBeVisible();
    });
  });

  test.describe('HeaderWithCloseButton - close link', () => {
    test('Close button navigates to target', async ({ page, widget, i18n }) => {
      await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
        route.fulfill({ json: LocalAuthorityResponse });
      });

      await page.route(LOCATIONS_ENDPOINT, (route) => {
        route.fulfill({ json: LocationsResponse });
      });

      // Navigate to places page first
      await widget.evaluate((node) =>
        node.setAttribute('path', '/EX32 7RB/places'),
      );

      await page.waitForRequest(LOCATIONS_ENDPOINT);

      // Open search page which uses HeaderWithCloseButton
      const searchLink = widget
        .getByRole('link', { name: i18n.t('places.searchPlaceholder') })
        .first();
      await expect(searchLink).toBeVisible();
      await searchLink.click();

      // Verify search page is visible
      const searchTitle = widget.getByRole('heading', {
        name: i18n.t('search.title'),
      });
      await expect(searchTitle.first()).toBeVisible();

      // Click close button - should return to places
      const closeButton = widget
        .getByRole('link', { name: i18n.t('actions.close') })
        .first();
      await closeButton.click();

      // Verify we're back on places page
      const placesTitle = widget.getByRole('heading', {
        name: i18n.t('places.title'),
      });
      await expect(placesTitle.first()).toBeVisible();
    });
  });
});
