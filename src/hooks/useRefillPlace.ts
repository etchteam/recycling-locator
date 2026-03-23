import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { Location } from '@/types/locatorApi';

/**
 * Fetches individual refill location details
 */
export function useRefillPlace(id: string | undefined) {
  const fetchPlace = () => {
    return LocatorApi.getInstance().get<Location>(`refill-location/${id}`);
  };

  return useData<Location>(id ? fetchPlace : null, [id]);
}
