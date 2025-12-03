import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { usePostcode } from '@/lib/PostcodeContext';
import { LocationsResponse } from '@/types/locatorApi';

/**
 * Fetches nearby recycling centres (HWRCs) with extended search radius
 */
export function useRecyclingCentres() {
  const { postcode } = usePostcode();

  const fetchRecyclingCentres = () => {
    return LocatorApi.getInstance().get<LocationsResponse>(
      `locations/${postcode}?limit=120&radius=25`,
    );
  };

  return useData<LocationsResponse>(postcode ? fetchRecyclingCentres : null, [
    postcode,
  ]);
}
