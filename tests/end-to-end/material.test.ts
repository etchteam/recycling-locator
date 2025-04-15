import {
  LOCAL_AUTHORITY_ENDPOINT,
  LocalAuthorityResponse,
} from '../mocks/localAuthority';
import { LOCATIONS_ENDPOINT, LocationsResponse } from '../mocks/locations';
import { PROPERTY_TYPE_EN } from '@/types/locatorApi';

import { test, expect } from './fixtures';

test.describe('Material page', () => {
  test('Single scheme + location options', async ({ page, widget, i18n }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const recyclableText = widget
      .getByText(i18n.t('material.hero.yes'))
      .first();
    const homeText = widget
      .getByText(
        i18n.t('material.recycleAtHome.oneProperty.collection', { count: 1 }),
      )
      .first();
    const locationsText = widget
      .getByText(i18n.t('material.nearbyPlaces.places.title'))
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

  test('Some home recycling options', async ({ page, widget, i18n }) => {
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

    const recyclableText = widget
      .getByText(i18n.t('material.hero.yes'))
      .first();
    const schemeOneText = widget
      .getByText(PROPERTY_TYPE_EN.NARROW_ACCESS)
      .first();
    const somePropertiesText = widget.getByText('some properties').first();
    const locationsText = widget
      .getByText(i18n.t('material.nearbyPlaces.places.title'))
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

  test('All home recycling options', async ({ page, widget, i18n }) => {
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

    const recyclableText = widget
      .getByText(i18n.t('material.hero.yes'))
      .first();
    const schemeOneText = widget
      .getByText(PROPERTY_TYPE_EN.NARROW_ACCESS)
      .first();
    const somePropertiesText = widget
      .getByText(PROPERTY_TYPE_EN.ALL.toLowerCase())
      .first();
    const locationsText = widget
      .getByText(i18n.t('material.nearbyPlaces.places.title'))
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

  test('No home recycling', async ({ page, widget, i18n }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const recyclableText = widget
      .getByText(i18n.t('material.hero.yes'))
      .first();
    const homeText = widget
      .getByText(i18n.t('material.recycleAtHome.noProperties.content'))
      .first();
    const locationsText = widget
      .getByText(i18n.t('material.nearbyPlaces.places.title'))
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

  test('Not recyclable', async ({ page, widget, i18n }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: { items: [] } });
    });

    const recyclableText = widget.getByText(i18n.t('material.hero.no')).first();
    const notRecyclableTitle = widget
      .getByText(i18n.t('material.notRecyclable.title'))
      .first();
    const notRecyclableContent = widget
      .getByText(i18n.t('material.notRecyclable.content'))
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
