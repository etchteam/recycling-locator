import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { Location } from '@/types/locatorApi';

/**
 * Fetches individual refill location details
 */
export function useRefillPlace(
  placeName: string | undefined,
  placePostcode: string | undefined,
) {
  const fetchPlace = () => {
    return LocatorApi.getInstance().get<Location>(
      `refill-location/${placeName}/${placePostcode}`,
    );
  };

  return useData<Location>(placeName && placePostcode ? fetchPlace : null, [
    placeName,
    placePostcode,
  ]);
}
