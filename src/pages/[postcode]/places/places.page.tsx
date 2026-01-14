import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/compat';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import Place from '@/components/content/Place/Place';
import TipContent from '@/components/content/TipContent/TipContent';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import { useLocations } from '@/hooks/useLocations';
import { useTip } from '@/hooks/useTip';
import PostCodeResolver from '@/lib/PostcodeResolver';
import formatPostcode from '@/lib/formatPostcode';

function Loading() {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="evg-text-size-body-lg evg-spacing-bottom-md">
        {t('places.loading')}
      </h3>
      <locator-places-grid>
        <ul>
          <li>
            <evg-enter type="fade-in-up">
              <locator-loading-card></locator-loading-card>
            </evg-enter>
          </li>
          <li>
            <evg-enter type="fade-in-up" delay={0.5}>
              <locator-loading-card></locator-loading-card>
            </evg-enter>
          </li>
          <li>
            <evg-enter type="fade-in-up" delay={1}>
              <locator-loading-card></locator-loading-card>
            </evg-enter>
          </li>
        </ul>
      </locator-places-grid>
    </>
  );
}

function Places() {
  const { postcode } = usePostcode();
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();
  const loadMoreButton = useRef<HTMLButtonElement>(null);
  const lastLoadMoreOffset = useSignal<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const materials = searchParams.get('materials');
  const { data: locations, loading } = useLocations();
  const count = locations?.items?.length ?? 0;
  const showLocations = count > 0 && materials !== 'undefined';
  const limit = locations?.pagination?.total ?? 30;
  const currentPage = limit / 30;
  const maxLimit = 120;
  const showLoadMore = showLocations && count >= limit && limit !== maxLimit;
  const locationSearchParams = new URLSearchParams(searchParams);
  locationSearchParams.set('page', String(currentPage));

  // Only show full loading state if we have no data yet
  const isInitialLoad = loading && !locations;

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

  if (isInitialLoad) {
    return <Loading />;
  }

  if (!locations) {
    return null;
  }

  if (locations.error) {
    throw new Error(locations.error);
  }

  const handleResetSearch = () => {
    searchParams.delete('materials');
    searchParams.delete('category');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  return (
    <evg-enter type="fade">
      {showLocations ? (
        <>
          <h3
            id="places-count"
            className="evg-text-size-heading-sm evg-spacing-bottom-md"
          >
            {t('places.count', { count })}
          </h3>
          <locator-places-grid className="evg-spacing-bottom-lg">
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
                        href={`/${postcode}/places/${locationName}/${locationPostcode}?${locationSearchParams.toString()}`}
                      >
                        <evg-enter type="fade">
                          <evg-card radius="sm">
                            <evg-card-content>
                              <Place location={location} />
                            </evg-card-content>
                          </evg-card>
                        </evg-enter>
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
          <evg-card className="evg-spacing-top-md" radius="sm">
            <evg-card-content>
              <locator-icon-text className="evg-spacing-bottom-xs">
                <locator-icon-circle variant="negative">
                  <locator-icon icon="place"></locator-icon>
                </locator-icon-circle>
                <h3>{t('material.nearbyPlaces.noPlaces.title')}</h3>
              </locator-icon-text>
              <p className="evg-spacing-bottom-sm">
                {t('material.nearbyPlaces.noPlaces.content', {
                  postcode: formatPostcode(postcode),
                })}
              </p>
              <evg-button width="full-width" className="evg-spacing-bottom-sm">
                <Link href={`/${postcode}/places/search`}>
                  {t('actions.searchAgain')}
                </Link>
              </evg-button>
              <evg-button width="full-width">
                <button type="button" onClick={handleResetSearch}>
                  {t('places.viewAll')}
                </button>
              </evg-button>
            </evg-card-content>
          </evg-card>
        </locator-wrap>
      )}
      {showLoadMore && (
        <evg-grid justify-content="center">
          <evg-grid-item small-mobile="12" small-tablet="6" large-tablet="4">
            <evg-button width="full-width">
              <button
                type="button"
                ref={loadMoreButton}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', String(Number(currentPage) + 1));
                  setSearchParams(newParams);
                }}
              >
                {t('actions.loadMore')}
              </button>
            </evg-button>
          </evg-grid-item>
        </evg-grid>
      )}
    </evg-enter>
  );
}

export default function PlacesPage() {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const [searchParams] = useSearchParams();
  const { data: tip, loading: tipLoading } = useTip({ path: 'places' });
  const materialTipImgSrc = `${publicPath}images/material-tip.svg`;

  return (
    <locator-wrap max-width="none" gutter="fluid">
      <evg-section padding="md">
        <section className="evg-spacing-bottom-lg">
          <Places />
        </section>
      </evg-section>
      <section>
        {!tipLoading && (
          <evg-enter type="fade-in-up">
            <locator-tip text-align="center" wrap="wrap">
              <img src={tip?.image ?? materialTipImgSrc} alt="" />
              <locator-tip-content>
                <TipContent
                  tip={tip}
                  ctaWidth="full-width-mobile"
                  showImage={false}
                />
                {/** Space for the fab */}
                <div className="evg-spacing-bottom-xl"></div>
              </locator-tip-content>
            </locator-tip>
          </evg-enter>
        )}
      </section>
      <evg-enter type="fade" delay={0.25}>
        <locator-fab sticky>
          <evg-button size="sm" variant="primary">
            <Link href={`/${postcode}/places/map?${searchParams.toString()}`}>
              <locator-icon icon="map"></locator-icon>
              {t('actions.showMap')}
            </Link>
          </evg-button>
        </locator-fab>
      </evg-enter>
    </locator-wrap>
  );
}
