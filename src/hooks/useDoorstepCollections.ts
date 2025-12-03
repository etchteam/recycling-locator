import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { usePostcode } from '@/lib/PostcodeContext';
import { captureException } from '@/lib/sentry';
import { DoorstepCollection } from '@/types/locatorApi';

/**
 * Fetches doorstep collection data for a material
 * Only supports single material lookups
 */
export function useDoorstepCollections(materialId: string | null) {
  const { postcode } = usePostcode();

  const fetchDoorstepCollections = async () => {
    try {
      return await LocatorApi.getInstance().get<DoorstepCollection[]>(
        `doorstep-collections/${postcode}/${materialId}`,
      );
    } catch (error) {
      captureException(error, {
        hook: 'useDoorstepCollections',
        postcode,
        materialId,
      });
      return [];
    }
  };

  // Only fetch if we have a single material ID (no commas)
  const shouldFetch = postcode && materialId && !materialId.includes(',');

  return useData<DoorstepCollection[]>(
    shouldFetch ? fetchDoorstepCollections : null,
    [postcode, materialId],
  );
}
