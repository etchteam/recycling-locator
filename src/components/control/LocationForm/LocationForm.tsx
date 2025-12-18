import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'wouter-preact';

import LocationInput from '@/components/control/LocationInput/LocationInput';
import { useAppState } from '@/hooks/AppStateProvider';
import useFormValidation from '@/hooks/useFormValidation';
import i18n from '@/lib/i18n';

import LocationFormSubmitHandler from './LocationFormSubmitHandler';

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

  function resetGeolocationState(formElement: HTMLFormElement): void {
    geolocation.value = false;
    geolocationError.value = true;

    const checkbox = formElement.querySelector(
      'input[name="geolocation"]',
    ) as HTMLInputElement | null;

    if (checkbox) {
      checkbox.checked = false;
    }
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    geolocationError.value = false;

    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const path = action === '/' ? '' : action;

    if (geolocation.value) {
      form.submitting.value = true;

      try {
        await LocationFormSubmitHandler.geolocation(
          formData,
          path,
          setLocation,
        );
      } catch {
        form.submitting.value = false;
        resetGeolocationState(formElement);
      }

      return;
    }

    const locationValue = formData.get('location') as string;

    if (!locationValue || !form.valid.value) {
      form.valid.value = false;
      return;
    }

    form.submitting.value = true;

    try {
      await LocationFormSubmitHandler.manualLocation(
        locationValue,
        formData,
        path,
        setLocation,
      );
    } catch {
      form.submitting.value = false;
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
