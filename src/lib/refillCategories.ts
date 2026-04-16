export const REFILL_CATEGORIES = [
  { key: 'Food', param: 'Food', slug: 'mixed-food' },
  { key: 'Cleaning', param: 'Cleaning', slug: 'cleaning' },
  { key: 'Personal Care', param: 'Personal Care', slug: 'personal-care' },
] as const;

export const VALID_CATEGORY_PARAMS = REFILL_CATEGORIES.map((c) => c.param);

export function isValidCategory(
  value: string | null,
): value is (typeof VALID_CATEGORY_PARAMS)[number] {
  return value !== null && VALID_CATEGORY_PARAMS.includes(value as never);
}
