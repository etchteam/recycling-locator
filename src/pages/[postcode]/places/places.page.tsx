import { useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import LoadingPlacesList from '@/components/content/LoadingPlacesList/LoadingPlacesList';
import Place from '@/components/content/Place/Place';
import TipContent from '@/components/content/TipContent/TipContent';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import { useLocations } from '@/hooks/useLocations';
import { usePaginatedLocations } from '@/hooks/usePaginatedLocations';
import { useTip } from '@/hooks/useTip';
import PostCodeResolver from '@/lib/PostcodeResolver';
import formatPostcode from '@/lib/formatPostcode';

function Places() {
  const { postcode } = usePostcode();
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const materials = searchParams.get('materials');
  const locationsResult = useLocations();
  const {
    data: locations,
    count,
    currentPage,
    hasMore,
    isInitialLoad,
    loadMore,
    loadMoreRef,
  } = usePaginatedLocations(locationsResult);
  const showLocations = count > 0 && materials !== 'undefined';
  const locationSearchParams = new URLSearchParams(searchParams);
  locationSearchParams.set('page', String(currentPage));

  useEffect(() => {
    if (search) {
      recordEvent({
        category: `PlacesList::MaterialSearch::${showLocations ? '' : 'Empty'}`,
        action: search,
      });
    }
  }, [search]);

  if (isInitialLoad) {
    return <LoadingPlacesList />;
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
      {hasMore && (
        <evg-grid justify-content="center">
          <evg-grid-item small-mobile="12" small-tablet="6" large-tablet="4">
            <evg-button width="full-width">
              <button type="button" ref={loadMoreRef} onClick={loadMore}>
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
