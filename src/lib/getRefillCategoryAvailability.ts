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

  const requiredCategories = ['cleaning', 'personal care', 'food'];
  const foundCount = requiredCategories.filter((category) =>
    categoryNames.has(category),
  ).length;

  return foundCount >= 2;
}
