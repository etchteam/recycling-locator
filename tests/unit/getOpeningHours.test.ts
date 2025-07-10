import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

import getOpeningHours from '@/lib/details/getOpeningHours';
import { Location } from '@/types/locatorApi';

// Type for the actual opening hours structure used by the function
interface OpeningHoursStructure {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

// Helper to create location with proper typing
function createLocationWithOpeningHours(
  openingHours?: OpeningHoursStructure,
): Location {
  return {
    id: '1',
    address: 'Test Address',
    distance: 0,
    name: 'Test Location',
    latitude: 0,
    longitude: 0,
    locations: [
      {
        locationType: 'RECYCLE',
        source: 'wrap',
        materials: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        openingHours: openingHours as any, // Type assertion to work around string vs object mismatch
      },
    ],
  };
}

// Mock date-fns-tz to control timezone
vi.mock('date-fns-tz', () => ({
  toZonedTime: vi.fn((date: Date) => date),
}));

describe('getOpeningHours', () => {
  const baseLocation: Omit<Location, 'locations'> = {
    id: '1',
    address: 'Test Address',
    distance: 0,
    name: 'Test Location',
    latitude: 0,
    longitude: 0,
  };

  beforeEach(() => {
    // Mock a fixed date - Tuesday, 2024-07-09 at 10:30 AM local time
    vi.useFakeTimers();
    const baseTime = new Date('2024-07-09T00:00:00.000Z');
    baseTime.setHours(10, 30, 0, 0); // 10:30 AM local time
    vi.setSystemTime(baseTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns empty array when location has no locations', () => {
    const location: Location = {
      ...baseLocation,
      locations: [],
    };

    expect(getOpeningHours(location)).toEqual([]);
  });

  test('returns empty array when no opening hours provided', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        {
          locationType: 'RECYCLE',
          source: 'wrap',
          materials: [],
        },
      ],
    };

    expect(getOpeningHours(location)).toEqual([]);
  });

  test('formats basic opening hours correctly', () => {
    const location = createLocationWithOpeningHours({
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
    });

    const result = getOpeningHours(location);

    // Should start with Tuesday (today) and show open status
    expect(result[0]).toBe('Tuesday: 09:00 - 17:00 (open now)');
    expect(result).toContain('Monday: 09:00 - 17:00');
    expect(result).toContain('Wednesday: 09:00 - 17:00');
    expect(result).toContain('Thursday: 09:00 - 17:00');
    expect(result).toContain('Friday: 09:00 - 17:00');
    expect(result).toContain('Saturday: Closed');
    expect(result).toContain('Sunday: Closed');
  });

  test('shows closed status when current time is outside opening hours', () => {
    // Set time to 6:00 AM (well before opening) in local timezone
    const earlyMorning = new Date('2024-07-09T00:00:00.000Z');
    earlyMorning.setHours(6, 0, 0, 0); // 6:00 AM local time
    vi.setSystemTime(earlyMorning);

    const location = createLocationWithOpeningHours({
      tuesday: { open: '09:00', close: '17:00' },
    });

    const result = getOpeningHours(location);
    expect(result[0]).toBe('Tuesday: 09:00 - 17:00 (closed now)');
  });

  test('shows closed status when current time is after closing hours', () => {
    // Set time to 6:00 PM (after closing at 5:00 PM) in local timezone
    const evening = new Date('2024-07-09T00:00:00.000Z');
    evening.setHours(18, 0, 0, 0); // 6:00 PM local time
    vi.setSystemTime(evening);

    const location = createLocationWithOpeningHours({
      tuesday: { open: '09:00', close: '17:00' },
    });

    const result = getOpeningHours(location);
    expect(result[0]).toBe('Tuesday: 09:00 - 17:00 (closed now)');
  });

  test('handles 24-hour opening correctly', () => {
    const location = createLocationWithOpeningHours({
      tuesday: { open: '00:00', close: '00:00' },
    });

    const result = getOpeningHours(location);
    // 24-hour opening doesn't show (open now) status
    expect(result[0]).toBe('Tuesday: Open 24 hours');
  });

  test('sorts days starting from today', () => {
    const location = createLocationWithOpeningHours({
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '11:00', close: '15:00' },
    });

    const result = getOpeningHours(location);

    // Should start with Tuesday (today), then Wednesday, Thursday, etc.
    expect(result[0]).toMatch(/^Tuesday:/);
    expect(result[1]).toMatch(/^Wednesday:/);
    expect(result[2]).toMatch(/^Thursday:/);
    expect(result[3]).toMatch(/^Friday:/);
    expect(result[4]).toMatch(/^Saturday:/);
    expect(result[5]).toMatch(/^Sunday:/);
    expect(result[6]).toMatch(/^Monday:/);
  });

  test('handles multiple locations with opening hours', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        {
          locationType: 'RECYCLE',
          source: 'wrap',
          materials: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          openingHours: { tuesday: { open: '09:00', close: '17:00' } } as any,
        },
        {
          locationType: 'HWRC',
          source: 'valpak',
          materials: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          openingHours: {
            tuesday: { open: '08:00', close: '18:00' },
            wednesday: { open: '08:00', close: '18:00' },
          } as any,
        },
      ],
    };

    const result = getOpeningHours(location);

    // Should combine opening hours from all locations
    expect(result).toContain('Tuesday: 08:00 - 18:00 (open now)');
    expect(result).toContain('Wednesday: 08:00 - 18:00');
  });

  test('filters out locations without opening hours', () => {
    const location: Location = {
      ...baseLocation,
      locations: [
        {
          locationType: 'RECYCLE',
          source: 'wrap',
          materials: [],
          // No openingHours
        },
        {
          locationType: 'HWRC',
          source: 'valpak',
          materials: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          openingHours: { tuesday: { open: '09:00', close: '17:00' } } as any,
        },
      ],
    };

    const result = getOpeningHours(location);
    expect(result).toHaveLength(7); // All 7 days
    expect(result[0]).toBe('Tuesday: 09:00 - 17:00 (open now)');
  });

  test('handles missing days as closed', () => {
    const location = createLocationWithOpeningHours({
      monday: { open: '09:00', close: '17:00' },
      // Tuesday missing
      wednesday: { open: '09:00', close: '17:00' },
    });

    const result = getOpeningHours(location);
    expect(result[0]).toBe('Tuesday: Closed');
    expect(result).toContain('Monday: 09:00 - 17:00');
    expect(result).toContain('Wednesday: 09:00 - 17:00');
  });

  test('handles boundary times at exactly opening time', () => {
    // Set time to exactly 9:00 AM (opening time) in local timezone
    const localOpenTime = new Date('2024-07-09T00:00:00.000Z');
    localOpenTime.setHours(9, 0, 0, 0); // 9:00 AM local time
    vi.setSystemTime(localOpenTime);

    const location = createLocationWithOpeningHours({
      tuesday: { open: '09:00', close: '17:00' },
    });

    const result = getOpeningHours(location);
    expect(result[0]).toBe('Tuesday: 09:00 - 17:00 (open now)');
  });

  test('handles boundary times at exactly closing time', () => {
    // Set time to exactly 5:00 PM (closing time) in local timezone
    // This ensures the test works consistently across different CI environments
    const localCloseTime = new Date('2024-07-09T00:00:00.000Z');
    localCloseTime.setHours(17, 0, 0, 0); // 5:00 PM local time
    vi.setSystemTime(localCloseTime);

    const location = createLocationWithOpeningHours({
      tuesday: { open: '09:00', close: '17:00' },
    });

    const result = getOpeningHours(location);
    // At exactly closing time, the place is considered closed
    expect(result[0]).toBe('Tuesday: 09:00 - 17:00 (closed now)');
  });

  test('handles different day formats correctly', () => {
    const location = createLocationWithOpeningHours({
      // Testing lowercase keys as used in the implementation
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '11:00', close: '15:00' },
    });

    const result = getOpeningHours(location);
    expect(result).toHaveLength(7);
    expect(result.every((day) => day.includes(':'))).toBe(true);
  });
});
