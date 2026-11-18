import { describe, expect, test } from 'vitest';

import getLogoScale from '@/lib/getLogoScale';

describe('getLogoScale', () => {
  test('returns 1 for a square logo', () => {
    expect(getLogoScale(225, 225)).toBe(1);
  });

  test('returns the square root of the aspect ratio', () => {
    expect(getLogoScale(400, 100)).toBe(2);
    expect(getLogoScale(100, 400)).toBe(0.5);
  });

  test('returns null when a dimension is unknown', () => {
    expect(getLogoScale(0, 100)).toBeNull();
    expect(getLogoScale(100, 0)).toBeNull();
  });
});
