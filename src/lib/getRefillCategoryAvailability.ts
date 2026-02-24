import type { Location } from '@/types/locatorApi';

export default function getRefillCategoryAvailability(
  items: Location[] | undefined,
): boolean {
  const categoryNames = new Set(
    items.flatMap((item) =>
      item.locations.flatMap(
        (location) =>
          location.company?.refillCategories.map((category) =>
            category.name.toLowerCase(),
          ) ?? [],
      ),
    ),
  );

  return (
    categoryNames.has('cleaning') &&
    categoryNames.has('personal care') &&
    categoryNames.has('food')
  );
}
