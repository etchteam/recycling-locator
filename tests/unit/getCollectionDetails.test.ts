import { describe, expect, test } from 'vitest';

import getCollectionDetails from '@/lib/details/getCollectionDetails';
import { Location } from '@/types/locatorApi';

const createMockLocation = (
  collectionDetails: (string | undefined)[],
): Location => ({
  id: 'test-location',
  address: 'Test Address',
  distance: 100,
  name: 'Test Location',
  latitude: 51.5074,
  longitude: -0.1278,
  locations: collectionDetails.map((details) => ({
    locationType: 'RECYCLE' as const,
    source: 'valpak' as const,
    materials: [],
    collectionDetails: details,
  })),
});

describe('getCollectionDetails', () => {
  test('Returns empty array when no locations have collection details', () => {
    const location = createMockLocation([undefined, undefined]);
    expect(getCollectionDetails(location)).toEqual([]);
  });

  test('Filters out undefined and empty collection details', () => {
    const location = createMockLocation([
      undefined,
      '',
      '   ',
      'Valid collection details',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      'Valid collection details',
    ]);
  });

  test('Trims whitespace from collection details', () => {
    const location = createMockLocation([
      '  Details with leading spaces',
      'Details with trailing spaces  ',
      '  Details with both  ',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      'Details with leading spaces',
      'Details with trailing spaces',
      'Details with both',
    ]);
  });

  test('Preserves order of collection details', () => {
    const location = createMockLocation([
      'First collection details',
      'Second collection details',
      'Third collection details',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      'First collection details',
      'Second collection details',
      'Third collection details',
    ]);
  });

  test('Handles empty locations array', () => {
    const location: Location = {
      id: 'test-location',
      address: 'Test Address',
      distance: 100,
      name: 'Test Location',
      latitude: 51.5074,
      longitude: -0.1278,
      locations: [],
    };
    expect(getCollectionDetails(location)).toEqual([]);
  });

  test('Handles mixed collection details with various content', () => {
    const location = createMockLocation([
      'Collection every Monday and Thursday',
      '  ',
      undefined,
      'Special instructions: Place bins by 7am',
      '',
      'No collection on bank holidays',
      '  Extra collection during Christmas period  ',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      'Collection every Monday and Thursday',
      'Special instructions: Place bins by 7am',
      'No collection on bank holidays',
      'Extra collection during Christmas period',
    ]);
  });

  test('Handles multiline collection details', () => {
    const location = createMockLocation([
      'Collection Schedule:\nMonday: Bins\nThursday: Recycling',
      'Important:\n- Place bins by 7am\n- Use correct bin colors',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      'Collection Schedule:\nMonday: Bins\nThursday: Recycling',
      'Important:\n- Place bins by 7am\n- Use correct bin colors',
    ]);
  });

  test('Handles special characters in collection details', () => {
    const location = createMockLocation([
      'Collection £5.50 per bin',
      'Contact: info@council.gov.uk',
      'Visit: https://example.com/collections',
      'Call: 01234 567890',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      'Collection £5.50 per bin',
      'Contact: info@council.gov.uk',
      'Visit: https://example.com/collections',
      'Call: 01234 567890',
    ]);
  });

  test('Handles very long collection details', () => {
    const longDetails = 'A'.repeat(1000);
    const location = createMockLocation([longDetails]);
    expect(getCollectionDetails(location)).toEqual([longDetails]);
  });

  test('Handles collection details with only whitespace', () => {
    const location = createMockLocation([
      '   ',
      '\t\t',
      '\n\n',
      '  \t  \n  ',
      'Valid details',
    ]);
    expect(getCollectionDetails(location)).toEqual(['Valid details']);
  });

  test('Handles duplicate collection details', () => {
    const location = createMockLocation([
      'Collection every Monday',
      'Collection every Monday',
      'Different details',
      'Collection every Monday',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      'Collection every Monday',
      'Collection every Monday',
      'Different details',
      'Collection every Monday',
    ]);
  });

  test('Handles collection details with different location types', () => {
    const location: Location = {
      id: 'test-location',
      address: 'Test Address',
      distance: 100,
      name: 'Test Location',
      latitude: 51.5074,
      longitude: -0.1278,
      locations: [
        {
          locationType: 'RECYCLE',
          source: 'valpak',
          materials: [],
          collectionDetails: 'Recycling collection details',
        },
        {
          locationType: 'HWRC',
          source: 'wrap',
          materials: [],
          collectionDetails: 'HWRC collection details',
        },
        {
          locationType: 'RECYCLE',
          source: 'valpak',
          materials: [],
          collectionDetails: undefined,
        },
      ],
    };
    expect(getCollectionDetails(location)).toEqual([
      'Recycling collection details',
      'HWRC collection details',
    ]);
  });

  test('Handles collection details with unicode characters', () => {
    const location = createMockLocation([
      'Collection details with émojis 🗑️♻️',
      'Welsh text: Casglu gwastraff',
      'Special chars: æøå ñüí',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      'Collection details with émojis 🗑️♻️',
      'Welsh text: Casglu gwastraff',
      'Special chars: æøå ñüí',
    ]);
  });

  test('Handles edge case with zero-width characters', () => {
    const location = createMockLocation([
      '\u200B\u200CValid details\u200D\u200E',
      '   \u00A0\u2000\u2001   ',
      'Normal details',
    ]);
    expect(getCollectionDetails(location)).toEqual([
      '\u200B\u200CValid details\u200D\u200E',
      'Normal details',
    ]);
  });
});
