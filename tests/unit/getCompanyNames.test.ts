import { describe, expect, test } from 'vitest';

import getCompanyNames from '@/lib/getCompanyNames';
import { Location, LocationsResponse } from '@/types/locatorApi';

const makeLocation = (companyNames: (string | undefined)[]): Location => ({
  id: '1',
  address: '123 Main St',
  distance: 1.5,
  name: 'Test Place',
  latitude: 51.5,
  longitude: -0.1,
  locations: companyNames.map((name) => ({
    locationType: 'REFILL',
    source: 'wrap',
    materials: [],
    ...(name ? { company: { name, refillCategories: [] } } : {}),
  })),
});

const makeLocationsResponse = (
  locations: Location[],
): LocationsResponse => ({
  items: locations,
  meta: { latitude: 51.5, longitude: -0.1, radius: 25 },
  pagination: { page: 1, total: locations.length },
});

describe('getCompanyNames', () => {
  test('returns company names from a LocationsResponse', () => {
    const response = makeLocationsResponse([
      makeLocation(['Bio-D']),
      makeLocation(['Ecover']),
    ]);

    expect(getCompanyNames(response)).toEqual(['Bio-D', 'Ecover']);
  });

  test('returns company names from a single Location', () => {
    const location = makeLocation(['Bio-D', 'Suma']);

    expect(getCompanyNames(location)).toEqual(['Bio-D', 'Suma']);
  });

  test('deduplicates company names', () => {
    const response = makeLocationsResponse([
      makeLocation(['Bio-D', 'Ecover']),
      makeLocation(['Ecover', 'Suma']),
    ]);

    expect(getCompanyNames(response)).toEqual(['Bio-D', 'Ecover', 'Suma']);
  });

  test('returns empty array when no companies exist', () => {
    const response = makeLocationsResponse([makeLocation([])]);

    expect(getCompanyNames(response)).toEqual([]);
  });

  test('handles locations with missing company field', () => {
    const response = makeLocationsResponse([
      makeLocation([undefined, 'Bio-D', undefined]),
    ]);

    expect(getCompanyNames(response)).toEqual(['Bio-D']);
  });
});
