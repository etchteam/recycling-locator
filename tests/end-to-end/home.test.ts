import {
  LOCAL_AUTHORITY_ENDPOINT,
  LocalAuthorityResponse,
} from '../mocks/localAuthority';
import { LOCATIONS_ENDPOINT, LocationsResponse } from '../mocks/locations';
import { MATERIALS_ENDPOINT, ValidMaterialResponse } from '../mocks/materials';
import { PROPERTY_TYPE_EN } from '@/types/locatorApi';

import { test, expect } from './fixtures';

const bulkyWasteCollection = {
  id: '1',
  name: 'Bulky waste service',
  cost: 20,
  maxItems: 5,
  notes: 'Book at least 2 weeks in advance',
};

const bulkyWasteUri = 'https://example.gov.uk/bulky-waste';

test.describe('Home recycling', () => {
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

    const narrowAccessSchemeText = widget
      .getByText(PROPERTY_TYPE_EN.NARROW_ACCESS)
      .first();
    const kerbsideSchemeText = widget
      .getByText(PROPERTY_TYPE_EN.KERBSIDE)
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await expect(narrowAccessSchemeText).toBeVisible();
    await expect(kerbsideSchemeText).toBeVisible();
  });

  test('Recycling centre locations list', async ({ page, widget, i18n }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const recyclingCentreTab = widget
      .getByRole('link', { name: i18n.t('homeRecycling.nav.hwrc') })
      .first();
    const recyclingCentresCount = widget
      .getByText(
        i18n.t('homeRecycling.hwrc.content', {
          // There's 1 recycling centre in the mocked locations response
          count: 1,
        }),
      )
      .first();
    const locationsCount = widget
      .getByText(
        i18n.t(`homeRecycling.hwrc.nearbyPlaces.content`, {
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

  test('Contact details', async ({ page, widget, i18n }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    const contactTab = widget
      .getByRole('link', { name: i18n.t('homeRecycling.nav.contact') })
      .first();
    const phoneNumber = widget
      .getByText(LocalAuthorityResponse.enquiryNumber)
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    contactTab.click();
    await expect(phoneNumber).toBeVisible();
  });

  test('Collection details', async ({ page, widget, i18n }) => {
    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: LocalAuthorityResponse });
    });

    await page.route(MATERIALS_ENDPOINT, (route) => {
      route.fulfill({ json: [ValidMaterialResponse] });
    });

    await page.route(LOCATIONS_ENDPOINT, (route) => {
      route.fulfill({ json: LocationsResponse });
    });

    const kerbsideSchemeText = widget
      .getByText(PROPERTY_TYPE_EN.KERBSIDE)
      .first();
    const kerbsideSchemeLink = widget
      .getByRole('link', { name: PROPERTY_TYPE_EN.KERBSIDE })
      .first();
    const collectionPageTitle = widget
      .getByText(i18n.t('homeRecycling.collection.title'))
      .first();
    const input = widget
      .getByPlaceholder(i18n.t('components.materialSearchInput.placeholder'))
      .first();
    const negativeSearchText = widget.getByText(
      i18n.t('homeRecycling.collection.search.negative', {
        count: 0,
      }),
    );
    const positiveSearchText = widget.getByText(
      i18n.t('homeRecycling.collection.search.positive', {
        count: 1,
      }),
    );

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await expect(kerbsideSchemeText).toBeVisible();
    kerbsideSchemeLink.click();
    await expect(collectionPageTitle).toBeVisible();
    await expect(input).toBeVisible();
    await input.fill('Plastic milk bottles');
    await input.press('Enter');
    await expect(negativeSearchText).not.toBeVisible();
    await expect(positiveSearchText).toBeVisible();
  });

  test('Bulky collection card with available service', async ({
    page,
    widget,
    i18n,
  }) => {
    const mockedLaResponse = {
      ...LocalAuthorityResponse,
      bulkyWasteUri,
      bulkyWaste: [bulkyWasteCollection],
    };

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: mockedLaResponse });
    });

    const cardTitle = widget
      .getByText(i18n.t('homeRecycling.bulkyCollection.title'))
      .first();
    const cta = widget
      .getByRole('link', {
        name: i18n.t('homeRecycling.bulkyCollection.cta'),
      })
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await expect(cardTitle).toBeVisible();
    await expect(cta).toBeVisible();
  });

  test('Bulky collection card with no available service', async ({
    page,
    widget,
    i18n,
  }) => {
    const mockedLaResponse = {
      ...LocalAuthorityResponse,
      bulkyWasteUri,
      bulkyWaste: [],
    };

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: mockedLaResponse });
    });

    const noCollectionText = widget
      .getByText(
        i18n.t('homeRecycling.bulkyCollection.descriptionNoCollection'),
      )
      .first();
    const ctaText = widget
      .getByText(i18n.t('homeRecycling.bulkyCollection.ctaNoCollection'))
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await expect(noCollectionText).toBeVisible();
    await expect(ctaText).toBeVisible();
  });

  test('Bulky collection card links to bulky collection page', async ({
    page,
    widget,
    i18n,
  }) => {
    const mockedLaResponse = {
      ...LocalAuthorityResponse,
      bulkyWasteUri,
      bulkyWaste: [bulkyWasteCollection],
    };

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: mockedLaResponse });
    });

    const cta = widget
      .getByRole('link', {
        name: i18n.t('homeRecycling.bulkyCollection.cta'),
      })
      .first();
    const pageHeading = widget
      .getByText(i18n.t('homeRecycling.bulkyCollection.heading'))
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await cta.click();
    await expect(pageHeading).toBeVisible();
  });

  test('Bulky collection page shows service details', async ({
    page,
    widget,
    i18n,
  }) => {
    const mockedLaResponse = {
      ...LocalAuthorityResponse,
      bulkyWasteUri,
      bulkyWaste: [bulkyWasteCollection],
    };

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: mockedLaResponse });
    });

    const serviceDetailsHeading = widget
      .getByText(i18n.t('homeRecycling.bulkyCollection.serviceDetails'))
      .first();
    const cost = widget
      .getByText(
        i18n.t('homeRecycling.bulkyCollection.cost', {
          cost: bulkyWasteCollection.cost,
        }),
      )
      .first();
    const maxItems = widget
      .getByText(
        i18n.t('homeRecycling.bulkyCollection.maxItems', {
          count: bulkyWasteCollection.maxItems,
        }),
      )
      .first();
    const notes = widget.getByText(bulkyWasteCollection.notes).first();
    const councilLink = widget
      .getByRole('link', { name: new RegExp(LocalAuthorityResponse.name) })
      .first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home/bulky-collection'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await expect(serviceDetailsHeading).toBeVisible();
    await expect(cost).toBeVisible();
    await expect(maxItems).toBeVisible();
    await expect(notes).toBeVisible();
    await expect(councilLink).toBeVisible();
  });

  test('Bulky collection page shows individual names for multiple services', async ({
    page,
    widget,
  }) => {
    const mockedLaResponse = {
      ...LocalAuthorityResponse,
      bulkyWasteUri,
      bulkyWaste: [
        { ...bulkyWasteCollection, id: '1', name: 'Standard service' },
        { ...bulkyWasteCollection, id: '2', name: 'Premium service' },
      ],
    };

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: mockedLaResponse });
    });

    const firstName = widget.getByText('Standard service').first();
    const secondName = widget.getByText('Premium service').first();

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/home/bulky-collection'),
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await expect(firstName).toBeVisible();
    await expect(secondName).toBeVisible();
  });

  test('Collections nav shows bulky waste option when available', async ({
    page,
    widget,
    i18n,
  }) => {
    const mockedLaResponse = {
      ...LocalAuthorityResponse,
      bulkyWasteUri,
      bulkyWaste: [bulkyWasteCollection],
    };

    await page.route(LOCAL_AUTHORITY_ENDPOINT, (route) => {
      route.fulfill({ json: mockedLaResponse });
    });

    const navSummary = widget.locator('locator-context-header summary').first();
    const bulkyWasteNavLink = widget
      .getByRole('link', {
        name: i18n.t('homeRecycling.bulkyCollection.title'),
      })
      .first();

    const kerbsidePath = `/EX32 7RB/home/collection?propertyType=${encodeURIComponent(PROPERTY_TYPE_EN.KERBSIDE)}`;
    await widget.evaluate(
      (node, path) => node.setAttribute('path', path),
      kerbsidePath,
    );
    await page.waitForRequest(LOCAL_AUTHORITY_ENDPOINT);
    await navSummary.click();
    await expect(bulkyWasteNavLink).toBeVisible();
  });
});
