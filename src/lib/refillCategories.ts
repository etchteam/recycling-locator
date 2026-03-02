export const REFILL_CATEGORIES = [
  { key: 'all', icon: 'refill-all', param: null, slug: null },
  { key: 'Food', icon: 'refill-food', param: 'Food', slug: 'mixed-food' },
  {
    key: 'Cleaning',
    icon: 'refill-cleaning',
    param: 'Cleaning',
    slug: 'cleaning',
  },
  {
    key: 'Personal Care',
    icon: 'refill-care',
    param: 'Personal Care',
    slug: 'personal-care',
  },
] as const;

export const VALID_CATEGORY_PARAMS = REFILL_CATEGORIES.filter(
  (c): c is (typeof REFILL_CATEGORIES)[number] & { param: string } =>
    c.param !== null,
).map((c) => c.param);

export function isValidCategory(
  value: string | null,
): value is (typeof VALID_CATEGORY_PARAMS)[number] {
  return value !== null && VALID_CATEGORY_PARAMS.includes(value as never);
}
