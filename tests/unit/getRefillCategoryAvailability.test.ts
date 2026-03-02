import { expect, test } from 'vitest';

import getRefillCategoryAvailability from '@/lib/getRefillCategoryAvailability';

const makeItem = (
  id: string,
  name: string,
  address: string,
  refillCategories: { id: string; name: string }[],
) => ({
  id,
  distance: 1.5,
  name,
  address,
  latitude: 51.0704574,
  longitude: -4.0402859,
  locations: [
    {
      collectionDetails: null,
      locationType: 'REFILL' as const,
      materials: [],
      notes: null,
      openingHours: null,
      providesCollection: false,
      source: 'wrap' as const,
      telephone: '01271 324294',
      website: null,
      company: {
        id: '271',
        name: 'Ecover',
        refillCategories,
      },
    },
  ],
});

const orchardsFarmShop = makeItem(
  '5707',
  'Orchards Farm Shop',
  'Barnstaple, EX32 9DD',
  [{ id: '2', name: 'Cleaning' }],
);

const nourish = makeItem(
  '6067',
  'Nourish',
  'Exeter Road, Braunton, EX33 2JL',
  [{ id: '3', name: 'Personal Care' }],
);

const refillStation = makeItem(
  '7012',
  'The Refill Station',
  'High Street, Barnstaple, EX32 8PY',
  [{ id: '4', name: 'Food' }],
);

const refillStore = makeItem(
  '7012',
  'The Refill Store',
  'Main Street, Barnstaple, EX33 8PY',
  [{ id: '4', name: 'Food' }],
);

test('returns false for an empty items array', () => {
  expect(getRefillCategoryAvailability([])).toBe(false);
});

test('returns false when no categories are present', () => {
  const emptyCategories = makeItem(
    '5707',
    'Orchards Farm Shop',
    'Barnstaple, EX32 9DD',
    [],
  );
  expect(getRefillCategoryAvailability([emptyCategories])).toBe(false);
  expect(getRefillCategoryAvailability([emptyCategories, orchardsFarmShop])).toBe(false);
});

test('returns false when only one required category is present', () => {
  expect(getRefillCategoryAvailability([orchardsFarmShop])).toBe(false);
  expect(getRefillCategoryAvailability([nourish])).toBe(false);
  expect(getRefillCategoryAvailability([refillStation])).toBe(false);
  expect(getRefillCategoryAvailability([refillStation, refillStore])).toBe(false);
});

test('returns true when two required categories are present across multiple items', () => {
  expect(
    getRefillCategoryAvailability([orchardsFarmShop, nourish]),
  ).toBe(true);
  expect(
    getRefillCategoryAvailability([orchardsFarmShop, refillStation]),
  ).toBe(true);
  expect(
    getRefillCategoryAvailability([nourish, refillStation]),
  ).toBe(true);
});


test('returns true when two required categories are in a single item', () => {
  const allCategories = makeItem(
    '5707',
    'Orchards Farm Shop',
    'Barnstaple, EX32 9DD',
    [
      { id: '2', name: 'Cleaning' },
      { id: '3', name: 'Personal Care' },
    ],
  );
  expect(getRefillCategoryAvailability([allCategories])).toBe(true);
});

test('handles locations without a company gracefully', () => {
  const withNoCompany = {
    id: '6067',
    distance: 4.87629,
    name: 'Nourish',
    address: 'Exeter Road, Braunton, EX33 2JL',
    latitude: 51.1030337,
    longitude: -4.1577501,
    locations: [
      {
        collectionDetails: null,
        locationType: 'REFILL' as const,
        materials: [],
        notes: null,
        openingHours: null,
        providesCollection: false,
        source: 'wrap' as const,
        telephone: '01271 812006',
        website: 'https://www.nourishstores.com/',
        company: undefined,
      },
    ],
  };
  expect(
    getRefillCategoryAvailability([withNoCompany, orchardsFarmShop, nourish, refillStation]),
  ).toBe(true);
});

test('ignores extra categories beyond the three required ones', () => {
  const extraCategories = makeItem(
    '5707',
    'Orchards Farm Shop',
    'Barnstaple, EX32 9DD',
    [
      { id: '1', name: 'Beverages' },
      { id: '2', name: 'Cleaning' },
      { id: '3', name: 'Personal Care' },
      { id: '4', name: 'Food' },
      { id: '5', name: 'Other' },
    ],
  );
  expect(getRefillCategoryAvailability([extraCategories])).toBe(true);
});
