import { expect } from '@playwright/test';
import { t } from 'i18next';
import { test } from 'vitest';

import {
  LOCAL_AUTHORITY_ENDPOINT,
  LocalAuthorityResponse,
} from '../mocks/localAuthority';
import { LOCATIONS_ENDPOINT, LocationsResponse } from '../mocks/locations';
import { MATERIALS_ENDPOINT, ValidMaterialsResponse } from '../mocks/materials';
import describeEndToEndTest from '../utils/describeEndToEndTest';
import { PROPERTY_TYPE_EN } from '@/types/locatorApi';

describeEndToEndTest('Home recycling', () => {
  test('Collection tab scheme list', async ({ page, widget }) => {
    const mockedLaResponse = {
      ...LocalAuthorityResponse,
      properties: {
        ...LocalAuthorityResponse.properties,
        [PROPERTY_TYPE_EN.NARROW_ACCESS]: [
          {
            name: 'Fake scheme',
            type: 'Dry',
            containers: [
              {
                name: 'Box',
                displayName: 'Box (35 to 60L)',
                bodyColour: '#4f4f4f',
                lidColour: '#4f4f4f',
                notes: ['containers can be black or green.'],
                materials: [
                  {
                    id: 1000,
                    name: 'Fake material',
                    popular: false,
                    category: {
                      id: 7,
                      name: 'Plastic bottles',
                      popular: false,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: mockedLaResponse });
    });

    const narrowAccessSchemeText = page
      .getByText(PROPERTY_TYPE_EN.NARROW_ACCESS)
      .first();
    const kerbsideSchemeText = page
      .getByText(PROPERTY_TYPE_EN.KERBSIDE)
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await expect(narrowAccessSchemeText).toBeVisible();
    await expect(kerbsideSchemeText).toBeVisible();
  });

  test('Recycling centre locations list', async ({ page, widget }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const recyclingCentreTab = page
      .getByRole('link', { name: t('homeRecycling.nav.hwrc') })
      .first();
    const recyclingCentresCount = page
      .getByText(
        t('homeRecycling.hwrc.content', {
          // There's 1 recycling centre in the mocked locations response
          count: 1,
        }),
      )
      .first();
    const locationsCount = page
      .getByText(
        t(`homeRecycling.hwrc.nearbyPlaces.content`, {
          count: LocationsResponse.items.length,
        }),
      )
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    recyclingCentreTab.click();
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(recyclingCentresCount).toBeVisible();
    await expect(locationsCount).toBeVisible();
  });

  test('Contact details', async ({ page, widget }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    const contactTab = page
      .getByRole('link', { name: t('homeRecycling.nav.contact') })
      .first();
    const phoneNumber = page
      .getByText(LocalAuthorityResponse.enquiryNumber)
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    contactTab.click();
    await expect(phoneNumber).toBeVisible();
  });

  test('Collection details', async ({ page, widget }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(MATERIALS_ENDPOINT, (route) => {
      route.fulfill({ json: ValidMaterialsResponse });
    });

    const kerbsideSchemeText = page
      .getByText(PROPERTY_TYPE_EN.KERBSIDE)
      .first();
    const kerbsideSchemeLink = page
      .locator('a', { has: kerbsideSchemeText })
      .first();
    const collectionPageTitle = page
      .getByText(t('homeRecycling.collection.title'))
      .first();
    const input = page
      .getByPlaceholder(t('components.materialSearchInput.placeholder'))
      .first();
    const negativeSearchText = page.getByText(
      t('homeRecycling.collection.search.negative', {
        count: 0,
      }),
    );
    const positiveSearchText = page.getByText(
      t('homeRecycling.collection.search.positive', {
        count: 1,
      }),
    );

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    kerbsideSchemeLink.click();
    await expect(collectionPageTitle).toBeVisible();
    await expect(input).toBeVisible();
    await input.fill('Not a material m8');
    await input.press('Enter');
    await expect(positiveSearchText).not.toBeVisible();
    await input.fill('Plastic milk bottles');
    await input.press('Enter');
    await expect(negativeSearchText).not.toBeVisible();
    await expect(positiveSearchText).toBeVisible();
  });
});
