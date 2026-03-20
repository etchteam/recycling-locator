import { describe, expect, test } from 'vitest';

import {
  isValidCategory,
  REFILL_CATEGORIES,
  VALID_CATEGORY_PARAMS,
} from '@/lib/refillCategories';

describe('REFILL_CATEGORIES', () => {
  test('every category has a key, param and slug', () => {
    for (const category of REFILL_CATEGORIES) {
      expect(category.key).toBeTruthy();
      expect(category.param).toBeTruthy();
      expect(category.slug).toBeTruthy();
    }
  });
});

describe('VALID_CATEGORY_PARAMS', () => {
  test('contains only non-null params', () => {
    expect(VALID_CATEGORY_PARAMS).toEqual([
      'Food',
      'Cleaning',
      'Personal Care',
    ]);
  });

  test('does not include null', () => {
    expect(VALID_CATEGORY_PARAMS).not.toContain(null);
  });
});

describe('isValidCategory', () => {
  test('returns true for valid categories', () => {
    expect(isValidCategory('Food')).toBe(true);
    expect(isValidCategory('Cleaning')).toBe(true);
    expect(isValidCategory('Personal Care')).toBe(true);
  });

  test('returns false for null', () => {
    expect(isValidCategory(null)).toBe(false);
  });

  test('returns false for unknown strings', () => {
    expect(isValidCategory('food')).toBe(false);
    expect(isValidCategory('mixed-food')).toBe(false);
    expect(isValidCategory('cleaning')).toBe(false);
    expect(isValidCategory('personal-care')).toBe(false);
    expect(isValidCategory('')).toBe(false);
    expect(isValidCategory('Other')).toBe(false);
  });
});
