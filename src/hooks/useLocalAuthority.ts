import { usePostcode } from '@/hooks/PostcodeProvider';
import { useData } from '@/hooks/useData';
import LocatorApi from '@/lib/LocatorApi';
import { LocalAuthority } from '@/types/locatorApi';

/**
 * Fetches local authority data for the current postcode
 */
export function useLocalAuthority() {
  const { postcode } = usePostcode();

  const fetchLocalAuthority = () => {
    return LocatorApi.getInstance().get<LocalAuthority>(
      `local-authority/${postcode}`,
    );
  };

  return useData<LocalAuthority>(postcode ? fetchLocalAuthority : null, [
    postcode,
  ]);
}
