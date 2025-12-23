import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { Location } from '@/types/locatorApi';

/**
 * Fetches individual place/location details
 */
export function usePlace(
  placeName: string | undefined,
  placePostcode: string | undefined,
) {
  const fetchPlace = () => {
    return LocatorApi.getInstance().get<Location>(
      `location/${placeName}/${placePostcode}`,
    );
  };

  return useData<Location>(placeName && placePostcode ? fetchPlace : null, [
    placeName,
    placePostcode,
  ]);
}
