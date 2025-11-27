import { Suspense } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { Link, Form, Await, useSearchParams } from 'react-router';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/control/Link/Link';

import '@/components/canvas/ContextHeader/ContextHeader';
import MapSvg from '@/components/canvas/MapSvg/MapSvg';
import '@/components/canvas/IconCircle/IconCircle';
import '@/components/canvas/Loading/Loading';
import '@/components/canvas/Hero/Hero';
import '@/components/composition/Wrap/Wrap';
import '@/components/composition/BorderedList/BorderedList';
import '@/components/content/Icon/Icon';
import '@/components/content/RescueMeRecyclePromo/RescueMeRecyclePromo';
import '@/components/control/IconLink/IconLink';
import '@/components/canvas/LoadingCard/LoadingCard';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import PlacesMap from '@/components/control/PlacesMap/PlacesMap';
import { useAppState } from '@/lib/AppState';
import formatPostcode from '@/lib/formatPostcode';
import i18n from '@/lib/i18n';
import sentry from '@/lib/sentry';
import useAnalytics from '@/lib/useAnalytics';
import useFormValidation from '@/lib/useFormValidation';
import StartLayout from '@/pages/start.layout';

import { usePostcodeLoaderData } from './postcode.loader';

function Loading() {
  return (
    <diamond-enter type="fade-in-up">
      <locator-loading-card className="diamond-spacing-top-md" />
    </diamond-enter>
  );
}

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

export function PostcodeAside({ postcode }: { readonly postcode: string }) {
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
            sentry.setTag('route', 'PostcodeAside');
            sentry.captureMessage(locations.error);
            sentry.clear();

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
  const { publicPath } = useAppState();
  const { recordEvent } = useAnalytics();
  const { postcode, city, locationsPromise } = usePostcodeLoaderData();
  const [searchParams] = useSearchParams();
  const autofocus = searchParams.get('autofocus') === 'true';
  const form = useFormValidation('search');
  const locale = i18n.language;

  useEffect(() => {
    recordEvent({
      category: 'LocationSearch',
      action: `${city}, ${postcode}`,
    });
  }, [city, postcode, recordEvent]);

  return (
    <StartLayout aside={<PostcodeAside postcode={postcode} />}>
      <locator-context-header>
        <div>
          <span className="diamond-text-weight-bold">
            {formatPostcode(postcode)}
          </span>
          {city && <>&nbsp;&ndash; {city}</>}
        </div>
        <diamond-button variant="text" size="sm">
          <Link to="/">{t('actions.change')}</Link>
        </diamond-button>
      </locator-context-header>
      <locator-wrap>
        <diamond-section padding="lg">
          <diamond-enter type="fade" className="layer-one">
            <h2
              id="material-search-title"
              className="diamond-text-size-h3 diamond-spacing-bottom-sm"
            >
              {t('postcode.title')}
            </h2>

            <Form method="post" onSubmit={form.handleSubmit}>
              <diamond-form-group>
                <label htmlFor="locator-material-input">
                  {t('components.materialSearchInput.label')}
                </label>
                <MaterialSearchInput
                  inputLabelledBy="material-search-title"
                  autofocus={autofocus}
                  handleInput={form.handleInput}
                  submitting={form.submitting.value}
                  valid={form.valid.value}
                  includeFeedbackForm
                ></MaterialSearchInput>
              </diamond-form-group>
            </Form>
            <p className="diamond-spacing-top-sm">
              <diamond-link>
                <Trans
                  i18nKey={'components.materialSearchInput.searchList'}
                  components={{
                    a: (
                      <Link
                        to={`/${postcode}/places/search/a-z`}
                        className="locator-report-missing-material__toggle"
                      />
                    ),
                  }}
                />
              </diamond-link>
            </p>
          </diamond-enter>

          <diamond-enter type="fade-in-up" delay={0.25}>
            <hr className="diamond-spacing-top-md" />
            {city && (
              <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-md">
                {t('postcode.exploreNearby', { city })}
              </h3>
            )}
            <nav className={locale === 'en' ? 'diamond-spacing-bottom-lg' : ''}>
              <dl>
                <locator-icon-link border className="diamond-spacing-top-md">
                  <Link to={`/${postcode}/home`} unstable_viewTransition>
                    <locator-icon-circle>
                      <locator-icon icon="home" color="primary"></locator-icon>
                    </locator-icon-circle>
                    <div>
                      <dt>{t('postcode.options.home.title')}</dt>
                      <dd className="diamond-text-size-sm">
                        {t('postcode.options.home.description')}
                      </dd>
                    </div>
                  </Link>
                </locator-icon-link>
                <Suspense fallback={<Loading />}>
                  <Await resolve={locationsPromise.data.locations}>
                    {(locations) => (
                      <locator-icon-link
                        border
                        className="diamond-spacing-top-md"
                      >
                        <Link
                          to={`/${postcode}/places`}
                          unstable_viewTransition
                        >
                          <locator-icon-circle>
                            <locator-icon
                              icon="distance"
                              color="primary"
                            ></locator-icon>
                          </locator-icon-circle>
                          <div>
                            <dt>{t('postcode.options.nearest.title')}</dt>
                            <dd className="diamond-text-size-sm">
                              {t('postcode.options.nearest.description', {
                                count: locations.items?.length ?? 0,
                              })}
                            </dd>
                          </div>
                        </Link>
                      </locator-icon-link>
                    )}
                  </Await>
                </Suspense>
                <diamond-grid
                  className="diamond-spacing-top-sm"
                  align-items="center"
                >
                  <diamond-grid-item grow>
                    <hr aria-hidden="true" />
                  </diamond-grid-item>
                  <diamond-grid-item>
                    <span className="diamond-text-size-sm">
                      {t('common.or')}
                    </span>
                  </diamond-grid-item>
                  <diamond-grid-item grow>
                    <hr aria-hidden="true" />
                  </diamond-grid-item>
                </diamond-grid>
                <locator-icon-link border className="diamond-spacing-top-md">
                  <Link to={`/${postcode}/refill`} unstable_viewTransition>
                    <locator-icon-circle>
                      <locator-icon
                        icon="refill"
                        color="primary"
                      ></locator-icon>
                    </locator-icon-circle>
                    <div>
                      <dt>{t('postcode.options.refill.title')}</dt>
                      <dd className="diamond-text-size-sm">
                        {t('postcode.options.refill.description')}
                      </dd>
                    </div>
                  </Link>
                </locator-icon-link>
              </dl>
            </nav>
            {locale === 'en' &&
              !window.location.host.includes('walesrecycles') && (
                <locator-rescue-me-recycle-promo>
                  <Link
                    to={`/${postcode}/rescue-me-recycle`}
                    unstable_viewTransition
                  >
                    <img
                      src={`${publicPath}images/rescue-me-recycle.webp`}
                      alt={t('rescueMeRecycle.imgAlt')}
                      width="254"
                      height="120"
                    />
                  </Link>
                </locator-rescue-me-recycle-promo>
              )}
          </diamond-enter>
        </diamond-section>
      </locator-wrap>
    </StartLayout>
  );
}
