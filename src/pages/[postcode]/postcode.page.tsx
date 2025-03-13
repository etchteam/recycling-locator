import * as Sentry from '@sentry/browser';
import { Suspense } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, Form, Await, useSearchParams } from 'react-router-dom';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/canvas/ContextHeader/ContextHeader';
import MapSvg from '@/components/canvas/MapSvg/MapSvg';
import '@/components/canvas/IconCircle/IconCircle';
import '@/components/canvas/Loading/Loading';
import '@/components/canvas/Hero/Hero';
import '@/components/composition/Wrap/Wrap';
import '@/components/composition/BorderedList/BorderedList';
import '@/components/content/Icon/Icon';
import '@/components/control/IconLink/IconLink';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import PlacesMap from '@/components/control/PlacesMap/PlacesMap';
import formatPostcode from '@/lib/formatPostcode';
import useAnalytics from '@/lib/useAnalytics';
import useFormValidation from '@/lib/useFormValidation';
import StartLayout from '@/pages/start.layout';

import { usePostcodeLoaderData } from './postcode.loader';

function MapLoadingFallback() {
  return (
    <locator-loading>
      <locator-hero size="full">
        <locator-icon icon="distance" color="muted"></locator-icon>
      </locator-hero>
    </locator-loading>
  );
}

function MapErrorFallback({ postcode }: { readonly postcode: string }) {
  const { t } = useTranslation();

  return (
    <MapSvg>
      <diamond-button width="full-width">
        <Link to={`/${postcode}/places/map`}>
          {t('postcode.exploreTheMap')}
          <locator-icon icon="map" color="primary"></locator-icon>
        </Link>
      </diamond-button>
    </MapSvg>
  );
}

function Aside({ postcode }: { readonly postcode: string }) {
  const { t } = useTranslation();
  const { locationsPromise } = usePostcodeLoaderData();

  return (
    <Suspense fallback={<MapLoadingFallback />}>
      <Await
        resolve={locationsPromise.data.locations}
        errorElement={<MapErrorFallback postcode={postcode} />}
      >
        {(locations) => {
          if (locations.error) {
            // This can happen when the postcode is not found by the API but is found by HERE maps
            // The postcode checks on the API are stricter
            Sentry.captureMessage(locations.error, {
              tags: { route: 'PostcodeAside' },
            });

            return <MapErrorFallback postcode={postcode} />;
          }

          return (
            <PlacesMap
              latitude={locations.meta.latitude}
              longitude={locations.meta.longitude}
              locations={locations.items}
              static
            >
              <Link
                to={`/${postcode}/places/map`}
                aria-label={t('actions.showMap')}
              >
                <locator-places-map-scrim />
              </Link>
              <locator-places-map-card padding="none">
                <diamond-button width="full-width">
                  <Link to={`/${postcode}/places/map`}>
                    {t('postcode.exploreTheMap')}
                    <locator-icon icon="map" color="primary"></locator-icon>
                  </Link>
                </diamond-button>
              </locator-places-map-card>
            </PlacesMap>
          );
        }}
      </Await>
    </Suspense>
  );
}

export default function PostcodePage() {
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();
  const { postcode, city } = usePostcodeLoaderData();
  const [searchParams] = useSearchParams();
  const autofocus = searchParams.get('autofocus') === 'true';
  const form = useFormValidation('search');

  useEffect(() => {
    recordEvent({
      category: 'LocationSearch',
      action: `${city}, ${postcode}`,
    });
  }, [city, postcode]);

  return (
    <StartLayout aside={<Aside postcode={postcode} />}>
      <locator-context-header>
        <div>
          <span className="diamond-text-weight-bold">
            {formatPostcode(postcode)}
          </span>
          {city && <>&nbsp;&ndash; {city}</>}
        </div>
        <diamond-button variant="text" size="sm">
          <Link to="/">
            <locator-icon icon="close" color="primary"></locator-icon>
          </Link>
        </diamond-button>
      </locator-context-header>
      <locator-wrap>
        <diamond-section padding="lg">
          <diamond-enter type="fade" className="layer-one">
            <h2
              id="material-search-title"
              className="diamond-text-size-h3 diamond-spacing-bottom-md"
            >
              {t('postcode.title')}
            </h2>

            <Form method="post" onSubmit={form.handleSubmit}>
              <MaterialSearchInput
                inputLabelledBy="material-search-title"
                autofocus={autofocus}
                handleBlur={form.handleBlur}
                handleInput={form.handleInput}
                submitting={form.submitting.value}
                valid={form.valid.value}
                includeFeedbackForm
              ></MaterialSearchInput>
            </Form>
          </diamond-enter>

          <diamond-enter type="fade-in-up" delay={0.25}>
            <locator-bordered-list className="diamond-spacing-top-lg">
              <nav>
                <ul>
                  <li>
                    <locator-icon-link>
                      <Link to={`/${postcode}/home`} unstable_viewTransition>
                        <locator-icon-circle>
                          <locator-icon
                            icon="home"
                            color="primary"
                          ></locator-icon>
                        </locator-icon-circle>
                        {t('postcode.options.home')}
                      </Link>
                    </locator-icon-link>
                  </li>
                  <li>
                    <locator-icon-link>
                      <Link to={`/${postcode}/places`} unstable_viewTransition>
                        <locator-icon-circle>
                          <locator-icon
                            icon="distance"
                            color="primary"
                          ></locator-icon>
                        </locator-icon-circle>
                        {t('postcode.options.nearest')}
                      </Link>
                    </locator-icon-link>
                  </li>
                </ul>
              </nav>
            </locator-bordered-list>
          </diamond-enter>
        </diamond-section>
      </locator-wrap>
    </StartLayout>
  );
}
