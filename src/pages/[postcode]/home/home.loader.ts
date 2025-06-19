import { LoaderFunctionArgs, useRouteLoaderData } from 'react-router';

import LocatorApi from '@/lib/LocatorApi';
import { getTipByPath } from '@/lib/getTip';
import { LocalAuthority, RecyclingMeta } from '@/types/locatorApi';

export interface HomeRecyclingLoaderResponse {
  localAuthority: Promise<LocalAuthority>;
  tip: Promise<RecyclingMeta>;
}

export default function homeRecyclingLoader({ params }: LoaderFunctionArgs) {
  const postcode = params.postcode;
  const localAuthority = LocatorApi.getInstance().get<LocalAuthority>(
    `local-authority/${postcode}`,
  );
  const tip = getTipByPath('/:postcode/home', { fallback: false });

  return { localAuthority, tip };
}

export function useHomeRecyclingLoaderData() {
  return useRouteLoaderData('home-recycling') as HomeRecyclingLoaderResponse;
}
