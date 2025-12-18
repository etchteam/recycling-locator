import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'wouter-preact';

import LocationInput from '@/components/control/LocationInput/LocationInput';
import { useAppState } from '@/hooks/AppStateProvider';
import useFormValidation from '@/hooks/useFormValidation';
import PostCodeResolver from '@/lib/PostcodeResolver';
import i18n from '@/lib/i18n';
import mapSearchParams from '@/lib/mapSearchParams';
import { captureException } from '@/lib/sentry';

export default function LocationForm({
  label,
  cta,
  action = '/',
  children,
}: {
  readonly label?: string;
  readonly cta?: string;
  readonly action?: string;
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const form = useFormValidation('location');
  const [searchParams] = useSearchParams();
  const autofocus = searchParams.get('autofocus') === 'true';
  const geolocation = useSignal(false);
  const geolocationError = useSignal(false);
  const app = useAppState();
  const locale = i18n.language;
  const isStandalone = app.variant === 'standalone';

  useEffect(() => {
    form.submitting.value = false;
  }, [location, form.submitting]);

  async function resolveAndNavigate(formData: FormData, path = '') {
    const locationValue = formData.get('location') as string;
    const lat = Number(formData.get('lat'));
    const lng = Number(formData.get('lng'));
    const postcode =
      lat && lng
        ? await PostCodeResolver.fromLatLng(lat, lng)
        : await PostCodeResolver.fromString(locationValue);
    const openInNewTab = formData.get('new-tab') === 'yes';
    const queryParams = mapSearchParams(
      ['materials', 'category', 'search'],
      formData,
    );
    let route = `/${postcode}${path}`;

    if (queryParams.toString()) {
      route += `?${queryParams.toString()}`;
    }

    if (openInNewTab) {
      const locale = formData.get('locale') as string;
      const domain =
        locale === 'cy' || window.location.host === 'walesrecycles.org.uk'
          ? 'locator.walesrecycles.org.uk'
          : 'locator.recyclenow.com';
      const url = new URL(`https://${domain}${route}`);
      url.searchParams.set('locale', locale);
      // Open the standalone app in a new tab
      window.open(url, '_blank')?.focus();
      // Don't navigate in widget mode
      return;
    }

    setLocation(route);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    geolocationError.value = false;

    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);

    if (!geolocation.value) {
      // Manual location entry
      const locationValue = formData.get('location') as string;

      if (!locationValue || !form.valid.value) {
        form.valid.value = false;
        return;
      }

      form.submitting.value = true;

      try {
        await resolveAndNavigate(formData, action === '/' ? '' : action);
      } catch (error) {
        form.submitting.value = false;

        const errorMessage = error instanceof Error ? error.message : '';

        // Navigate to not-found page for specific "not found" errors
        if (errorMessage === PostCodeResolver.ERROR_NOT_IN_UK) {
          setLocation('/not-found?reason=notInTheUK');
          return;
        }

        if (
          errorMessage === PostCodeResolver.ERROR_SEARCH_FAILED ||
          errorMessage === PostCodeResolver.ERROR_POSTCODE_NOT_FOUND
        ) {
          setLocation('/not-found');
          return;
        }

        captureException(error, {
          component: 'LocationForm postcode resolution',
        });
      }

      return;
    }

    // Geolocation
    form.submitting.value = true;
    const checkbox = formElement.querySelector(
      'input[name="geolocation"]',
    ) as HTMLInputElement;

    try {
      const response = await new Promise<GeolocationCoordinates>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve(coords),
            (error) => reject(new Error(error?.message ?? 'Geolocation error')),
          );
        },
      );

      if (!response?.latitude || !response?.longitude) {
        throw new Error('Geolocation not found');
      }

      formData.set('lat', response.latitude.toString());
      formData.set('lng', response.longitude.toString());

      await resolveAndNavigate(formData, action === '/' ? '' : action);
    } catch (error) {
      geolocation.value = false;
      form.submitting.value = false;
      if (checkbox) {
        checkbox.checked = false;
      }
      geolocationError.value = true;

      captureException(error, { component: 'LocationForm geolocation' });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="locale" value={locale} />
      <diamond-form-group className="diamond-spacing-bottom-md">
        <label htmlFor="location-input">{label ?? t('start.label')}</label>
        <LocationInput
          autofocus={autofocus}
          handleBlur={form.handleBlur}
          handleInput={form.handleInput}
          disabled={geolocation.value}
          valid={form.valid.value || geolocation.value}
        ></LocationInput>
      </diamond-form-group>
      {isStandalone ? (
        <diamond-grid
          align-items="center"
          className="diamond-spacing-bottom-md"
        >
          <diamond-grid-item>
            <diamond-radio-checkbox
              state={geolocationError.value ? 'invalid' : undefined}
              className="diamond-text-size-sm"
            >
              <label>
                <input
                  type="checkbox"
                  name="geolocation"
                  value="yes"
                  onChange={(event) =>
                    (geolocation.value = (
                      event.target as HTMLInputElement
                    ).checked)
                  }
                  aria-invalid={geolocationError.value}
                  aria-errormessage={
                    geolocationError.value ? 'geolocation-error' : undefined
                  }
                />
                {t('start.geolocation.label')}
              </label>
            </diamond-radio-checkbox>
          </diamond-grid-item>
          <diamond-grid-item>
            <locator-highlight
              id="geolocation-error"
              className={`diamond-text-size-xs ${geolocationError.value ? 'theme-negative' : 'theme-info'}`}
            >
              {t('start.geolocation.permission')}
            </locator-highlight>
          </diamond-grid-item>
        </diamond-grid>
      ) : (
        <diamond-grid
          align-items="center"
          className="diamond-spacing-bottom-md"
        >
          <diamond-grid-item>
            <diamond-radio-checkbox className="diamond-text-size-sm">
              <label>
                <input type="checkbox" name="new-tab" value="yes" />
                {t('start.newTab.label')}
              </label>
            </diamond-radio-checkbox>
          </diamond-grid-item>
          <diamond-grid-item>
            <locator-highlight className="diamond-text-size-xs theme-positive">
              {t('start.newTab.bestExperience')}
            </locator-highlight>
          </diamond-grid-item>
        </diamond-grid>
      )}
      {children}
      <diamond-button width="full-width" variant="primary">
        <button type="submit" disabled={form.submitting.value}>
          {cta ?? t('start.cta')}
        </button>
      </diamond-button>
    </form>
  );
}
