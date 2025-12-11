import { describe, expect, test } from 'vitest';

import getWebsites from '@/lib/details/getWebsites';

describe('getWebsites', () => {
  const baseLocation = {
    id: '1',
    address: 'Test Address',
    distance: 0,
    name: 'Test Name',
    latitude: 0,
    longitude: 0,
  };

  const makeLoc = (website) => ({
    locationType: 'RECYCLE' as const,
    source: 'wrap' as const,
    materials: [],
    website,
  });

  test('returns an empty array if no locations', () => {
    const location = {
      ...baseLocation,
      locations: [],
    };
    expect(getWebsites(location)).toEqual(new Map<string, string>());
  });

  test('returns a single website, prepending https if needed', () => {
    const location = {
      ...baseLocation,
      locations: [makeLoc('example.com')],
    };
    expect(getWebsites(location)).toMatchSnapshot();
  });

  test('returns multiple websites, cleaned and unique', () => {
    const location = {
      ...baseLocation,
      locations: [
        makeLoc('example.com'),
        makeLoc('https://example.com'), // duplicate
        makeLoc('http://another.com'),
        makeLoc('https://www.example.com'),
        makeLoc('http://www.another.com'),
        makeLoc(null),
        makeLoc(undefined),
        makeLoc(''),
      ],
    };
    expect(getWebsites(location)).toMatchSnapshot();
  });

  test('trims whitespace and prepends https if missing', () => {
    const location = {
      ...baseLocation,
      locations: [makeLoc('  example.com  '), makeLoc('   https://foo.com  ')],
    };
    expect(getWebsites(location)).toMatchSnapshot();
  });

  test('handles missing locations property gracefully', () => {
    const location = { ...baseLocation };
    // @ts-expect-error purposely omitting locations
    expect(() => getWebsites(location)).toThrow();
  });
});
