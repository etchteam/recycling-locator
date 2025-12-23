import PostCodeResolver from '@/lib/PostcodeResolver';
import mapSearchParams from '@/lib/mapSearchParams';
import { handlePostcodeError } from '@/lib/postcodeErrorHandler';
import { captureException } from '@/lib/sentry';

interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

/**
 * Handles location form submission logic including geolocation and manual entry
 */
export default class LocationFormSubmitHandler {
  /**
   * Gets user's current geolocation coordinates
   */
  private static async getCurrentPosition(): Promise<GeolocationCoords> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        (error) => reject(new Error(error?.message ?? 'Geolocation error')),
      );
    });
  }

  /**
   * Builds the navigation route with postcode and query parameters
   */
  private static buildRoute(
    postcode: string,
    formData: FormData,
    path: string,
  ): string {
    const queryParams = mapSearchParams(
      ['materials', 'category', 'search'],
      formData,
    );
    let route = `/${postcode}${path}`;

    if (queryParams.toString()) {
      route += `?${queryParams.toString()}`;
    }

    return route;
  }

  /**
   * Opens the route in a new tab (for widget mode)
   */
  private static openInNewTab(route: string, locale: string): void {
    const domain =
      locale === 'cy' || window.location.host === 'walesrecycles.org.uk'
        ? 'locator.walesrecycles.org.uk'
        : 'locator.recyclenow.com';
    const url = new URL(`https://${domain}${route}`);
    url.searchParams.set('locale', locale);
    window.open(url, '_blank')?.focus();
  }

  /**
   * Navigates to the route based on form data
   */
  private static async navigate(
    postcode: string,
    formData: FormData,
    path: string,
    setLocation: (route: string) => void,
  ): Promise<void> {
    const route = LocationFormSubmitHandler.buildRoute(
      postcode,
      formData,
      path,
    );
    const shouldOpenInNewTab = formData.get('new-tab') === 'yes';

    if (shouldOpenInNewTab) {
      const locale = formData.get('locale') as string;
      LocationFormSubmitHandler.openInNewTab(route, locale);
      return;
    }

    setLocation(route);
  }

  /**
   * Handles geolocation-based location submission
   */
  static async geolocation(
    formData: FormData,
    path: string,
    setLocation: (route: string) => void,
  ): Promise<void> {
    try {
      const coords = await LocationFormSubmitHandler.getCurrentPosition();

      if (!coords.latitude || !coords.longitude) {
        throw new Error('Geolocation not found');
      }

      const postcode = await PostCodeResolver.fromLatLng(
        coords.latitude,
        coords.longitude,
      );

      await LocationFormSubmitHandler.navigate(
        postcode,
        formData,
        path,
        setLocation,
      );
    } catch (error) {
      const errorResult = handlePostcodeError(error);

      if (errorResult.shouldNavigate && errorResult.navigateTo) {
        setLocation(errorResult.navigateTo);
        return;
      }

      captureException(error, { component: 'LocationForm geolocation' });
      throw error;
    }
  }

  /**
   * Handles manual location entry submission
   */
  static async manualLocation(
    locationValue: string,
    formData: FormData,
    path: string,
    setLocation: (route: string) => void,
  ): Promise<void> {
    try {
      const postcode = await PostCodeResolver.fromString(locationValue);
      await LocationFormSubmitHandler.navigate(
        postcode,
        formData,
        path,
        setLocation,
      );
    } catch (error) {
      const errorResult = handlePostcodeError(error);

      if (errorResult.shouldNavigate && errorResult.navigateTo) {
        setLocation(errorResult.navigateTo);
        return;
      }

      captureException(error, {
        component: 'LocationForm postcode resolution',
      });
      throw error;
    }
  }
}
