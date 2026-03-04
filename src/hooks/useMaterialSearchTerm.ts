import { useSearchParams } from 'wouter-preact';

import { useCategory } from '@/hooks/useCategory';
import { useMaterial } from '@/hooks/useMaterial';

/**
 * Fetches material or category data based on URL search params and derives
 * the search term to display.
 *
 * The material/category name takes precedence over the URL search param,
 * but falls back to the search param for cases where no material/category
 * is specified (e.g., empty results pages).
 */
export function useMaterialSearchTerm() {
  const [searchParams] = useSearchParams();
  const materialsParam = searchParams.get('materials');
  const categoryId = searchParams.get('category');
  const urlSearchTerm = searchParams.get('search');

  // Multiple materials can be passed as comma-separated values (e.g., "1,2,3")
  // We use the first material ID for display purposes
  const materialId = materialsParam?.split(',')[0] ?? null;
  const material = useMaterial(materialId);
  const category = useCategory(categoryId);

  const loading = material?.loading || category?.loading;
  const searchTerm =
    material?.data?.name ?? category?.data?.name ?? urlSearchTerm;

  return { searchTerm, loading, material, category };
}
