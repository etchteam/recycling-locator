import { describe, expect, test } from 'vitest';

import {
  isValidCategory,
  REFILL_CATEGORIES,
  VALID_CATEGORY_PARAMS,
} from '@/lib/refillCategories';

describe('REFILL_CATEGORIES', () => {
  test('contains the all category with null param and slug', () => {
    const all = REFILL_CATEGORIES.find((c) => c.key === 'all');
    expect(all).toEqual({
      key: 'all',
      icon: 'refill-all',
      param: null,
      slug: null,
    });
  });

  test('every non-all category has a param and slug', () => {
    const filterable = REFILL_CATEGORIES.filter((c) => c.key !== 'all');
    for (const category of filterable) {
      expect(category.param).toBeTruthy();
      expect(category.slug).toBeTruthy();
    }
  });
});

describe('VALID_CATEGORY_PARAMS', () => {
  test('contains only non-null params', () => {
    expect(VALID_CATEGORY_PARAMS).toEqual(['Food', 'Cleaning', 'Personal Care']);
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
