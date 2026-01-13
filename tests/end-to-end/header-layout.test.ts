import { GEOCODE_ENDPOINT, PostcodeGeocodeResponse } from '../mocks/geocode';
import {
  LOCAL_AUTHORITY_ENDPOINT,
  LocalAuthorityResponse,
} from '../mocks/localAuthority';
import { LOCATIONS_ENDPOINT, LocationsResponse } from '../mocks/locations';
import { MATERIAL_ENDPOINT, ValidMaterialResponse } from '../mocks/materials';

import { test, expect } from './fixtures';

test.describe('Header layouts', () => {
  test.describe('HeaderWithBackButton - contextual back navigation', () => {
    test('Back button returns to previous page', async ({
      page,
      widget,
      i18n,
    }) => {
      await page.route(GEOCODE_ENDPOINT, (route) => {
        route.fulfill({ json: PostcodeGeocodeResponse });
      });

      await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
        route.fulfill({ json: LocalAuthorityResponse });
      });

      await page.route(LOCATIONS_ENDPOINT, (route) => {
        route.fulfill({ json: LocationsResponse });
      });

      // Navigate to postcode page first
      await widget.evaluate((node) => node.setAttribute('path', '/EX32 7RB'));
      await page.waitForRequest(GEOCODE_ENDPOINT);

      // Then navigate to places page via "Recycle at nearby places" option
      const placesLink = widget.getByRole('link', {
        name: i18n.t('postcode.options.nearest.title'),
      });
      await expect(placesLink).toBeVisible();
      await placesLink.click();

      // Wait for places page content
      const placeName = widget.getByText(LocationsResponse.items[0].name);
      await expect(placeName.first()).toBeVisible();

      // Navigate to a place detail page
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
      await page.route(GEOCODE_ENDPOINT, (route) => {
        route.fulfill({ json: PostcodeGeocodeResponse });
      });

      await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
        route.fulfill({ json: LocalAuthorityResponse });
      });

      await page.route(LOCATIONS_ENDPOINT, (route) => {
        route.fulfill({ json: LocationsResponse });
      });

      await page.route(MATERIAL_ENDPOINT, (route) => {
        route.fulfill({ json: ValidMaterialResponse });
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
    test('Menu button opens and closes menu', async ({
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

      // Verify menu content is visible - use the actual menu link text
      const menuHomeLink = widget.getByRole('link', {
        name: i18n.t('components.menu.homeRecycling'),
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

      // Verify search page is visible by checking for search input
      const searchInput = widget
        .getByPlaceholder(i18n.t('components.materialSearchInput.placeholder'))
        .first();
      await expect(searchInput).toBeVisible();

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
