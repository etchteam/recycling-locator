import { describe, expect, test } from 'vitest';

import {
  isRefillPromoCategory,
  REFILL_PROMO_CATEGORIES,
  REFILL_PROMO_CATEGORY_IDS,
} from '@/lib/refillPromoCategories';

describe('REFILL_PROMO_CATEGORIES', () => {
  test('every category has an id and name', () => {
    for (const category of REFILL_PROMO_CATEGORIES) {
      expect(category.id).toBeTruthy();
      expect(category.name).toBeTruthy();
    }
  });
});

describe('REFILL_PROMO_CATEGORY_IDS', () => {
  test('contains the id of every category', () => {
    expect(REFILL_PROMO_CATEGORY_IDS).toEqual([
      '4',
      '7',
      '8',
      '15',
      '16',
      '17',
    ]);
  });
});

describe('isRefillPromoCategory', () => {
  test('returns true for valid category ids as strings', () => {
    expect(isRefillPromoCategory('4')).toBe(true);
    expect(isRefillPromoCategory('7')).toBe(true);
    expect(isRefillPromoCategory('17')).toBe(true);
  });

  test('returns true for valid category ids as numbers', () => {
    expect(isRefillPromoCategory(4)).toBe(true);
    expect(isRefillPromoCategory(15)).toBe(true);
  });

  test('returns false for unknown category ids', () => {
    expect(isRefillPromoCategory('1')).toBe(false);
    expect(isRefillPromoCategory(999)).toBe(false);
    expect(isRefillPromoCategory('')).toBe(false);
  });

  test('returns false for null and undefined', () => {
    expect(isRefillPromoCategory(null)).toBe(false);
    expect(isRefillPromoCategory(undefined)).toBe(false);
  });
});
