import { LoaderFunctionArgs, useRouteLoaderData } from 'react-router';

import LocatorApi from '@/lib/LocatorApi';
import PostCodeResolver from '@/lib/PostcodeResolver';
import i18n from '@/lib/i18n';
import { LocationsResponse } from '@/types/locatorApi';

interface PostcodeLoaderResponse {
  postcode: string;
  city: string;
  locationsPromise: { data: Record<string, unknown> };
}

export default async function postcodeLoader({
  params,
}: LoaderFunctionArgs): Promise<PostcodeLoaderResponse> {
  try {
    const postcode = params.postcode;
    const geocode = await PostCodeResolver.getValidGeocodeData(postcode);
    const locations = LocatorApi.get<LocationsResponse>(
      `locations/${postcode}?limit=30&radius=25`,
    );
    const isInWales = geocode.items[0].address.state === 'Wales';

    if (i18n.language === 'en' && isInWales) {
      // Use English Welsh for Wales locations
      i18n.changeLanguage('cy-GB');
    } else if (i18n.language === 'cy-GB' && !isInWales) {
      // Handle the user changing back to an English location in the same session
      i18n.changeLanguage('en');
    }

    return {
      postcode,
      city: geocode.items[0].address.city,
      locationsPromise: { data: { locations } },
    };
  } catch (error) {
    if (error instanceof Error) {
      if (
        [
          PostCodeResolver.ERROR_NOT_IN_UK,
          PostCodeResolver.ERROR_SEARCH_FAILED,
        ].includes(error.message)
      ) {
        throw new Response(error.message, { status: 404 });
      }
    }

    throw error;
  }
}

export function usePostcodeLoaderData() {
  return useRouteLoaderData('postcode') as PostcodeLoaderResponse;
}
