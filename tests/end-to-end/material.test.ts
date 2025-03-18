import { expect } from '@playwright/test';
import { t } from 'i18next';
import { test } from 'vitest';

import {
  LOCAL_AUTHORITY_ENDPOINT,
  LocalAuthorityResponse,
} from '../mocks/localAuthority';
import { LOCATIONS_ENDPOINT, LocationsResponse } from '../mocks/locations';
import describeEndToEndTest from '../utils/describeEndToEndTest';
import { PROPERTY_TYPE_EN } from '@/types/locatorApi';

describeEndToEndTest('Material page', () => {
  test('Single scheme + location options', async ({ page, widget }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const recyclableText = page.getByText(t('material.hero.yes')).first();
    const homeText = page
      .getByText(
        t('material.recycleAtHome.oneProperty.collection', { count: 1 }),
      )
      .first();
    const locationsText = page
      .getByText(t('material.nearbyPlaces.places.title'))
      .first();

    await widget.evaluate((node) =>
      node.setAttribute(
        'path',
        '/EX32 7RB/material?materials=43&search=Plastic milk bottles',
      ),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(recyclableText).toBeVisible();
    await expect(homeText).toBeVisible();
    await expect(locationsText).toBeVisible();
  });

  test('Some home recycling options', async ({ page, widget }) => {
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

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const recyclableText = page.getByText(t('material.hero.yes')).first();
    const schemeOneText = page
      .getByText(PROPERTY_TYPE_EN.NARROW_ACCESS)
      .first();
    const somePropertiesText = page.getByText('some properties').first();
    const locationsText = page
      .getByText(t('material.nearbyPlaces.places.title'))
      .first();

    await expect(recyclableText).not.toBeVisible();
    await widget.evaluate((node) =>
      node.setAttribute(
        'path',
        '/EX32 7RB/material?materials=43&search=Plastic milk bottles',
      ),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(recyclableText).toBeVisible();
    await expect(somePropertiesText).toBeVisible();
    await expect(schemeOneText).toBeVisible();
    await expect(locationsText).toBeVisible();
  });

  test('All home recycling options', async ({ page, widget }) => {
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
                    id: 43,
                    name: 'Plastic milk bottles',
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

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const recyclableText = page.getByText(t('material.hero.yes')).first();
    const schemeOneText = page
      .getByText(PROPERTY_TYPE_EN.NARROW_ACCESS)
      .first();
    const somePropertiesText = page.getByText('all properties').first();
    const locationsText = page
      .getByText(t('material.nearbyPlaces.places.title'))
      .first();

    await expect(recyclableText).not.toBeVisible();
    await widget.evaluate((node) =>
      node.setAttribute(
        'path',
        '/EX32 7RB/material?materials=43&search=Plastic milk bottles',
      ),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(recyclableText).toBeVisible();
    await expect(somePropertiesText).toBeVisible();
    await expect(schemeOneText).toBeVisible();
    await expect(locationsText).toBeVisible();
  });

  test('No home recycling', async ({ page, widget }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const recyclableText = page.getByText(t('material.hero.yes')).first();
    const homeText = page
      .getByText(t('material.recycleAtHome.noProperties.content'))
      .first();
    const locationsText = page
      .getByText(t('material.nearbyPlaces.places.title'))
      .first();

    await expect(recyclableText).not.toBeVisible();
    await widget.evaluate((node) =>
      node.setAttribute(
        'path',
        '/EX32 7RB/material?materials=79&search=Car batteries',
      ),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(recyclableText).toBeVisible();
    await expect(homeText).toBeVisible();
    await expect(locationsText).toBeVisible();
  });

  test('Not recyclable', async ({ page, widget }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: { items: [] } });
    });

    const recyclableText = page.getByText(t('material.hero.no')).first();
    const notRecyclableTitle = page
      .getByText(t('material.notRecyclable.title'))
      .first();
    const notRecyclableContent = page
      .getByText(t('material.notRecyclable.content'))
      .first();

    await expect(recyclableText).not.toBeVisible();
    await widget.evaluate((node) =>
      node.setAttribute(
        'path',
        '/EX32 7RB/material?materials=122&search=Toilet roll wrapping',
      ),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await page.waitForRequest(LOCATIONS_ENDPOINT);
    await expect(recyclableText).toBeVisible();
    await expect(notRecyclableTitle).toBeVisible();
    await expect(notRecyclableContent).toBeVisible();
  });
});
