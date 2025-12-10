import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/compat';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';
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
import Place from '@/components/content/Place/Place';
import TipContent from '@/components/content/TipContent/TipContent';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import { useLocations } from '@/hooks/useLocations';
import { useSearchParams } from '@/hooks/useSearchParams';
import { useTip } from '@/hooks/useTip';
import PostCodeResolver from '@/lib/PostcodeResolver';
import formatPostcode from '@/lib/formatPostcode';

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

  if (loading || !locations) {
    return <Loading />;
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
                        href={`/${postcode}/places/${locationName}/${locationPostcode}?${locationSearchParams.toString()}`}
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
              <Link href={`/${postcode}/places/search`}>
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
            <diamond-button width="full-width">
              <button
                type="button"
                ref={loadMoreButton}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  const newLimit = Math.min(limit + 30, maxLimit);
                  newParams.set('limit', String(newLimit));
                  setSearchParams(newParams);
                }}
              >
                {t('actions.loadMore')}
              </button>
            </diamond-button>
          </diamond-grid-item>
        </diamond-grid>
      )}
    </diamond-enter>
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
      <diamond-section padding="md">
        <section className="diamond-spacing-bottom-lg">
          <Places />
        </section>
      </diamond-section>
      <section>
        {!tipLoading && (
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
      </section>
      <diamond-enter type="fade" delay={0.25}>
        <locator-fab sticky>
          <diamond-button size="sm" variant="primary">
            <Link href={`/${postcode}/places/map?${searchParams.toString()}`}>
              <locator-icon icon="map"></locator-icon>
              {t('actions.showMap')}
            </Link>
          </diamond-button>
        </locator-fab>
      </diamond-enter>
    </locator-wrap>
  );
}
