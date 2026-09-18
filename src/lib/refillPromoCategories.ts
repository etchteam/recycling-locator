/**
 * Material categories (locator_material_categories) for which the refill
 * promo card is relevant to show alongside search results.
 */
export const REFILL_PROMO_CATEGORIES = [
  { id: '4', name: 'Glass' },
  { id: '7', name: 'Plastic bottles' },
  { id: '8', name: 'Plastic packaging' },
  { id: '15', name: 'Food waste' },
  { id: '16', name: 'Plastic bags and wrapping' },
  { id: '17', name: 'Beauty and grooming' },
] as const;

export const REFILL_PROMO_CATEGORY_IDS: string[] = REFILL_PROMO_CATEGORIES.map(
  (category) => category.id,
);

export function isRefillPromoCategory(
  categoryId?: string | number | null,
): boolean {
  return (
    categoryId != null && REFILL_PROMO_CATEGORY_IDS.includes(String(categoryId))
  );
}
