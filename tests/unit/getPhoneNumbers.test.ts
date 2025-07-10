import { describe, expect, test } from 'vitest';

import getPhoneNumbers from '@/lib/details/getPhoneNumbers';

describe('getPhoneNumbers', () => {
  const baseLocation = {
    id: '1',
    address: 'Test Address',
    distance: 0,
    name: 'Test Name',
    latitude: 0,
    longitude: 0,
  };

  const makeLoc = (telephone) => ({
    locationType: 'RECYCLE' as const,
    source: 'wrap' as const,
    materials: [],
    telephone,
  });

  test('returns an empty array if no locations', () => {
    const location = {
      ...baseLocation,
      locations: [],
    };
    expect(getPhoneNumbers(location)).toEqual([]);
  });

  test('returns a single phone number if one exists', () => {
    const location = {
      ...baseLocation,
      locations: [makeLoc('01234 567890')],
    };
    expect(getPhoneNumbers(location)).toEqual(['01234567890']);
  });

  test('returns multiple phone numbers, cleaned and unique', () => {
    const location = {
      ...baseLocation,
      locations: [
        makeLoc('01234 567890'),
        makeLoc('+44 1234 567890'),
        makeLoc('01234 567890'), // duplicate
        makeLoc(null),
        makeLoc(undefined),
        makeLoc(''),
      ],
    };
    expect(getPhoneNumbers(location)).toEqual(['01234567890', '+441234567890']);
  });

  test('removes all non-numeric and non-plus characters', () => {
    const location = {
      ...baseLocation,
      locations: [makeLoc('(01234) 567-890'), makeLoc('+44 (0) 1234-567-890')],
    };
    expect(getPhoneNumbers(location)).toEqual([
      '01234567890',
      '+4401234567890',
    ]);
  });

  test('handles missing locations property gracefully', () => {
    const location = { ...baseLocation };
    // @ts-expect-error purposely omitting locations
    expect(() => getPhoneNumbers(location)).toThrow();
  });
});
