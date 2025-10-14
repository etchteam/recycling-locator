import type { service } from '@here/maps-api-for-javascript';

import config from '@/config';
import i18n from '@/lib/i18n';
import { Locale } from '@/types/locale';
import { PostcodeResponse } from '@/types/locatorApi';

import LocatorApi from './LocatorApi';
import formatPostcode from './formatPostcode';

interface HereMapsGeocodeResponse {
  items: {
    address: {
      city: string;
      countryName: string;
      state: string;
      postalCode?: string;
    };
    position: {
      lat: number;
      lng: number;
    };
  }[];
}

export default class PostCodeResolver {
  static readonly ERROR_POSTCODE_NOT_FOUND = 'Postcode not found';
  static readonly ERROR_SEARCH_FAILED = 'Search failed';
  static readonly ERROR_NOT_IN_UK = 'Not in the UK';
  static readonly ERROR_POSTCODE_TYPO = 'Postcode incorrect';
  static readonly POSTCODE_REGEX =
    /(GIR ?0AA|[A-PR-UWYZ](\d{1,2}|([A-HK-Y]\d([\dABEHMNPRV-Y])?)|\d[A-HJKPS-UW]) ?\d[ABD-HJLNP-UW-Z]{2})/i;

  static async getValidGeocodeData(
    location: string,
  ): Promise<HereMapsGeocodeResponse> {
    const locale = i18n.language;
    const { default: H } = await import(
      // @ts-expect-error TS can't find the maps types
      '@here/maps-api-for-javascript/bin/mapsjs.bundle'
    );
    const apikey = config.mapsPlacesKey;
    const platform = new H.service.Platform({ apikey });
    const service = platform.getSearchService() as service.SearchService;
    let query: { q?: string; qq?: string; lang?: Locale } = { q: location };

    if (PostCodeResolver.extractPostcodeFromString(location) === location) {
      // If the location is a postcode, use a postalCode Qualified Query (qq)
      // Uses formatting because searches for postcodes with a space are more reliable
      query = { qq: `postalCode=${formatPostcode(location)}` };
    }

    if (locale === 'cy') {
      query.lang = 'cy';
    }

    const geocode: HereMapsGeocodeResponse = await new Promise(
      (resolve, reject) => {
        service.geocode(query, resolve, reject);
      },
    );

    if (geocode?.items?.length === 0) {
      throw new Error(PostCodeResolver.ERROR_SEARCH_FAILED);
    }

    const { countryName } = geocode.items[0].address;
    const countryNameLower = countryName.toLowerCase();

    if (!['united kingdom', 'y deyrnas unedig'].includes(countryNameLower)) {
      throw new Error(PostCodeResolver.ERROR_NOT_IN_UK);
    }

    return geocode;
  }

  static extractPostcodeFromString(locationOrPostcode: string): string | null {
    const matches = PostCodeResolver.POSTCODE_REGEX.exec(locationOrPostcode);
    return matches ? matches[0] : null;
  }

  /**
   * Geo code only returns a partial postcode.
   * Resolve the lat/lng to get the full postcode.
   */
  static async fromLatLng(lat: number, lng: number): Promise<string> {
    const safeLat = encodeURIComponent(lat);
    const safeLng = encodeURIComponent(lng);
    const response = await LocatorApi.getInstance().get<PostcodeResponse>(
      `postcode/${safeLat},${safeLng}`,
    );

    if (response.error || !response.postcode) {
      throw Error(
        response.error === 'Not Found'
          ? PostCodeResolver.ERROR_POSTCODE_NOT_FOUND
          : PostCodeResolver.ERROR_SEARCH_FAILED,
      );
    }

    return response.postcode;
  }

  /**
   * Take a location string then:
   * 1. Test it’s a valid UK address
   * 2. If the location geocode returns is different return a typo error
   * 3. If the location contains a valid postcode return it
   * 4. If the location does not contain a postcode use the lat/lng to get the postcode
   */
  static async fromString(location: string): Promise<string> {
    const geocode = await PostCodeResolver.getValidGeocodeData(location);

    const geocodePostalCode = geocode.items[0].address.postalCode ?? null;

    const extractedPostcode =
      PostCodeResolver.extractPostcodeFromString(location);

    if (extractedPostcode) {
      const formattedPostcode = formatPostcode(extractedPostcode);
      if (geocodePostalCode === formattedPostcode) {
        return formattedPostcode;
      }
      throw new Error(PostCodeResolver.ERROR_POSTCODE_TYPO, {
        cause: geocodePostalCode,
      });
    }

    const { lat, lng } = geocode.items[0].position;

    return PostCodeResolver.fromLatLng(lat, lng);
  }
}
