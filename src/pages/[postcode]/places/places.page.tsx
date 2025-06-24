import { useSignal } from '@preact/signals';
import { Suspense, useEffect } from 'preact/compat';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import {
  Await,
  FetcherWithComponents,
  Link,
  useFetcher,
  useNavigation,
  useParams,
  useSearchParams,
} from 'react-router';
import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Wrap/Wrap';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/canvas/IconCircle/IconCircle';
import '@/components/canvas/LoadingCard/LoadingCard';
import '@/components/composition/IconText/IconText';
import '@/components/content/Icon/Icon';
import '@/components/control/Fab/Fab';
import Place from '@/components/template/Place/Place';
import TipContent from '@/components/template/TipContent/TipContent';
import { useAppState } from '@/lib/AppState';
import PostCodeResolver from '@/lib/PostcodeResolver';
import formatPostcode from '@/lib/formatPostcode';
import useAnalytics from '@/lib/useAnalytics';
import { LocationsResponse } from '@/types/locatorApi';

import { PlacesLoaderResponse, usePlacesLoaderData } from './places.loader';

function Loading() {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="diamond-text-size-md diamond-spacing-bottom-md">
        {t('places.loading')}
      </h3>
      <locator-places-grid>
        <ul>
          <li>
            <diamond-enter type="fade-in-up">
              <locator-loading-card></locator-loading-card>
            </diamond-enter>
          </li>
          <li>
            <diamond-enter type="fade-in-up" delay={0.5}>
              <locator-loading-card></locator-loading-card>
            </diamond-enter>
          </li>
          <li>
            <diamond-enter type="fade-in-up" delay={1}>
              <locator-loading-card></locator-loading-card>
            </diamond-enter>
          </li>
        </ul>
      </locator-places-grid>
    </>
  );
}

function Places({
  locations: loadedLocations,
}: {
  readonly locations: LocationsResponse;
}) {
  const { postcode } = useParams();
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();
  const fetcher = useFetcher() as FetcherWithComponents<PlacesLoaderResponse>;
  const loadMoreButton = useRef<HTMLButtonElement>(null);
  const lastLoadMoreOffset = useSignal<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const materials = searchParams.get('materials');
  const category = searchParams.get('category');

  // The loader is used initially then the fetcher is used to load more
  const fetchedLocations = fetcher.data?.locations;
  const locations = (fetchedLocations ?? loadedLocations) as LocationsResponse;

  if (locations.error) {
    throw new Error(locations.error);
  }

  const count = locations.items?.length ?? 0;
  const showLocations = count > 0 && materials !== 'undefined';
  const limit = locations.pagination?.total ?? 30;
  const currentPage = limit / 30;
  const maxLimit = 120;
  const showLoadMore = showLocations && count >= limit && limit !== maxLimit;
  const locationSearchParams = new URLSearchParams(searchParams);
  locationSearchParams.set('page', String(currentPage));

  const handleResetSearch = () => {
    searchParams.delete('materials');
    searchParams.delete('category');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (search) {
      recordEvent({
        category: `PlacesList::MaterialSearch::${showLocations ? '' : 'Empty'}`,
        action: search,
      });
    }
  }, [search]);

  useEffect(() => {
    const offset = loadMoreButton.current?.offsetTop - 200;

    if (lastLoadMoreOffset.value === 0) {
      lastLoadMoreOffset.value = offset;
    } else {
      // Scroll back to where the load more button used to be to fix a bug where some browsers
      // stick users at the bottom of the scroll area ignoring the new content being added above
      loadMoreButton.current
        ?.closest('locator-layout')
        ?.shadowRoot?.querySelector('[part="main"]')
        ?.scrollTo({ top: lastLoadMoreOffset.value });
      lastLoadMoreOffset.value = offset;
    }
  }, [count]);

  return (
    <diamond-enter type="fade">
      {showLocations ? (
        <>
          <h3
            id="places-count"
            className="diamond-text-size-md diamond-spacing-bottom-md"
          >
            {t('places.count', { count })}
          </h3>
          <locator-places-grid className="diamond-spacing-bottom-lg">
            <nav aria-labelledby="places-count">
              <ul>
                {locations.items.map((location) => {
                  const locationPostcode =
                    PostCodeResolver.extractPostcodeFromString(
                      location.address,
                    );
                  const locationName = encodeURIComponent(location.name);

                  return (
                    <li key={`${location.id}`}>
                      <Link
                        to={`/${postcode}/places/${locationName}/${locationPostcode}?${locationSearchParams.toString()}`}
                      >
                        <diamond-enter type="fade">
                          <diamond-card border radius>
                            <Place location={location} />
                          </diamond-card>
                        </diamond-enter>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </locator-places-grid>
        </>
      ) : (
        <locator-wrap>
          <diamond-card className="diamond-spacing-top-md" border radius>
            <locator-icon-text className="diamond-spacing-bottom-xs">
              <locator-icon-circle variant="negative">
                <locator-icon icon="place"></locator-icon>
              </locator-icon-circle>
              <h3>{t('material.nearbyPlaces.noPlaces.title')}</h3>
            </locator-icon-text>
            <p>
              {t('material.nearbyPlaces.noPlaces.content', {
                postcode: formatPostcode(postcode),
              })}
            </p>
            <diamond-button
              width="full-width"
              className="diamond-spacing-bottom-sm"
            >
              <Link to={`/${postcode}/places/search`}>
                {t('actions.searchAgain')}
              </Link>
            </diamond-button>
            <diamond-button width="full-width">
              <button type="button" onClick={handleResetSearch}>
                {t('places.viewAll')}
              </button>
            </diamond-button>
          </diamond-card>
        </locator-wrap>
      )}
      {showLoadMore && (
        <diamond-grid justify-content="center">
          <diamond-grid-item
            small-mobile="12"
            small-tablet="6"
            large-tablet="4"
          >
            <fetcher.Form method="GET" action={`/${postcode}/places`}>
              <input
                type="hidden"
                name="page"
                value={Number(currentPage) + 1}
              />
              {materials && (
                <input type="hidden" name="materials" value={materials} />
              )}
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              <diamond-button width="full-width">
                <button
                  type="submit"
                  disabled={fetcher.state !== 'idle'}
                  ref={loadMoreButton}
                >
                  {t('actions.loadMore')}
                </button>
              </diamond-button>
            </fetcher.Form>
          </diamond-grid-item>
        </diamond-grid>
      )}
    </diamond-enter>
  );
}

export default function PlacesPage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { postcode } = useParams();
  const { locations: locationsPromise, tip: tipPromise } =
    usePlacesLoaderData();
  const [searchParams] = useSearchParams();
  const isLoadingCurrentPath =
    navigation.state === 'loading' &&
    navigation.location.pathname === `/${postcode}/places`;
  const materialTipImgSrc = `${publicPath}images/material-tip.svg`;

  return (
    <locator-wrap max-width="none" gutter="fluid">
      <diamond-section padding="md">
        <section className="diamond-spacing-bottom-lg">
          {isLoadingCurrentPath ? (
            <Loading />
          ) : (
            <Suspense fallback={<Loading />}>
              <Await resolve={locationsPromise}>
                {(locations) => <Places locations={locations} />}
              </Await>
            </Suspense>
          )}
        </section>
      </diamond-section>
      <section>
        <Suspense fallback={null}>
          <Await resolve={tipPromise}>
            {(tip) => (
              <diamond-enter type="fade-in-up">
                <locator-tip text-align="center" wrap="wrap">
                  <img src={tip?.image ?? materialTipImgSrc} alt="" />
                  <locator-tip-content>
                    <TipContent
                      tip={tip}
                      ctaWidth="full-width-mobile"
                      showImage={false}
                    />
                    {/** Space for the fab */}
                    <div className="diamond-spacing-bottom-xl"></div>
                  </locator-tip-content>
                </locator-tip>
              </diamond-enter>
            )}
          </Await>
        </Suspense>
      </section>
      <diamond-enter type="fade" delay={0.25}>
        <locator-fab sticky>
          <diamond-button size="sm" variant="primary">
            <Link to={`/${postcode}/places/map?${searchParams.toString()}`}>
              <locator-icon icon="map"></locator-icon>
              {t('actions.showMap')}
            </Link>
          </diamond-button>
        </locator-fab>
      </diamond-enter>
    </locator-wrap>
  );
}
