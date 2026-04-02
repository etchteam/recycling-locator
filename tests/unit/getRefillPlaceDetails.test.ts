import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

import getRefillPlaceDetails from '@/lib/details/getRefillPlaceDetails';
import { Location } from '@/types/locatorApi';

// Mock date-fns-tz to control timezone
vi.mock('date-fns-tz', () => ({
  toZonedTime: vi.fn((date: Date) => date),
}));

const baseLocation: Omit<Location, 'locations'> = {
  id: '1',
  address: 'Test Address',
  distance: 0,
  name: 'Test Location',
  latitude: 0,
  longitude: 0,
};

const makeLoc = (overrides: Partial<Location['locations'][0]> = {}) => ({
  locationType: 'REFILL' as const,
  source: 'wrap' as const,
  materials: [],
  ...overrides,
});

describe('getRefillPlaceDetails', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Tuesday 2024-07-09 at 10:30 AM local time
    const baseTime = new Date('2024-07-09T00:00:00.000Z');
    baseTime.setHours(10, 30, 0, 0);
    vi.setSystemTime(baseTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns undefined phone/website, empty opening hours, and empty notes when locations array is empty', () => {
    const location: Location = { ...baseLocation, locations: [] };
    const result = getRefillPlaceDetails(location);

    expect(result.phoneNumber).toBeUndefined();
    expect(result.website).toBeUndefined();
    expect(result.openingHours).toEqual({ today: '', days: [] });
    expect(result.notes).toEqual([]);
  });

  test('returns undefined phone when no locations have a telephone', () => {
    const location: Location = {
      ...baseLocation,
      locations: [makeLoc(), makeLoc()],
    };
    expect(getRefillPlaceDetails(location).phoneNumber).toBeUndefined();
  });

  test('first-wins for phone: skips locs without phone, returns first that has one', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        makeLoc({ telephone: undefined }),
        makeLoc({ telephone: '01234 567890' }),
        makeLoc({ telephone: '09876 543210' }),
      ],
    };
    expect(getRefillPlaceDetails(location).phoneNumber).toBe('01234567890');
  });

  test('first-wins for website: skips locs without website, returns first that has one', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        makeLoc({ website: undefined }),
        makeLoc({ website: 'https://first.com' }),
        makeLoc({ website: 'https://second.com' }),
      ],
    };
    const result = getRefillPlaceDetails(location);
    expect(result.website).toEqual({
      url: 'https://first.com',
      text: 'first.com',
    });
  });

  test('first-wins for notes: returns only the first non-blank note', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        makeLoc({ notes: undefined }),
        makeLoc({ notes: 'First valid note' }),
        makeLoc({ notes: 'Second valid note' }),
      ],
    };
    expect(getRefillPlaceDetails(location).notes).toEqual(['First valid note']);
  });

  test('first-wins for opening hours: uses first sub-location that has opening hours', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        makeLoc({ openingHours: undefined }),
        makeLoc({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          openingHours: { tuesday: { open: '09:00', close: '17:00' } } as any,
        }),
        makeLoc({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          openingHours: { tuesday: { open: '08:00', close: '20:00' } } as any,
        }),
      ],
    };
    const result = getRefillPlaceDetails(location);
    expect(result.openingHours.today).toBe('09:00 - 17:00 (open now)');
  });

  test('each detail can come from a different sub-location', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        makeLoc({ telephone: '01234 567890' }),
        makeLoc({ website: 'https://example.com' }),
        makeLoc({ notes: 'A helpful note' }),
        makeLoc({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          openingHours: { tuesday: { open: '10:00', close: '18:00' } } as any,
        }),
      ],
    };
    const result = getRefillPlaceDetails(location);
    expect(result.phoneNumber).toBe('01234567890');
    expect(result.website).toEqual({
      url: 'https://example.com',
      text: 'example.com',
    });
    expect(result.notes).toEqual(['A helpful note']);
    expect(result.openingHours.today).toBe('10:00 - 18:00 (open now)');
  });

  test('What3words conversion still works in notes', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        makeLoc({ notes: 'Find us at ///filled.count.soap' }),
      ],
    };
    expect(getRefillPlaceDetails(location).notes).toEqual([
      'Find us at https://what3words.com/filled.count.soap',
    ]);
  });

  test('skips blank/whitespace-only notes', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        makeLoc({ notes: '' }),
        makeLoc({ notes: '   ' }),
        makeLoc({ notes: 'Real note' }),
      ],
    };
    expect(getRefillPlaceDetails(location).notes).toEqual(['Real note']);
  });

  test('returns undefined website when all locations have no website', () => {
    const location: Location = {
      ...baseLocation,
      locations: [makeLoc(), makeLoc()],
    };
    expect(getRefillPlaceDetails(location).website).toBeUndefined();
  });

  test('returns empty notes array when no notes exist', () => {
    const location: Location = {
      ...baseLocation,
      locations: [makeLoc(), makeLoc()],
    };
    expect(getRefillPlaceDetails(location).notes).toEqual([]);
  });

  test('returns empty opening hours when no sub-location has opening hours', () => {
    const location: Location = {
      ...baseLocation,
      locations: [makeLoc(), makeLoc()],
    };
    expect(getRefillPlaceDetails(location).openingHours).toEqual({
      today: '',
      days: [],
    });
  });
});
