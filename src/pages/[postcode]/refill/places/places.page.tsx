import { Trans, useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import LoadingPlacesList from '@/components/content/LoadingPlacesList/LoadingPlacesList';
import Place from '@/components/content/Place/Place';
import RefillBrands from '@/components/content/RefillBrands/RefillBrands';
import RefillFilteredAlert from '@/components/content/RefillFilteredAlert/RefillFilteredAlert';
import RefillCategoryFilter from '@/components/control/RefillCategoryFilter/RefillCategoryFilter';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { usePaginatedLocations } from '@/hooks/usePaginatedLocations';
import { useRefillLocations } from '@/hooks/useRefillLocations';
import getCompanyNames from '@/lib/getCompanyNames';

function RefillLocations() {
  const { postcode } = usePostcode();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const locationsResult = useRefillLocations();
  const unfilteredResult = useRefillLocations({ unfiltered: true });
  const {
    data: locations,
    count,
    currentPage,
    hasMore,
    isInitialLoad,
    loadMore,
    loadMoreRef,
  } = usePaginatedLocations(locationsResult);
  const totalCount = unfilteredResult.data?.items?.length ?? count;
  const locationSearchParams = new URLSearchParams(searchParams);
  locationSearchParams.set('page', String(currentPage));

  if (isInitialLoad) {
    return <LoadingPlacesList />;
  }

  if (!locations) {
    return null;
  }

  if (locations.error) {
    throw new Error(locations.error);
  }

  return (
    <evg-enter type="fade">
      <evg-grid
        wrap="wrap"
        justify-content="space-between"
        align-items="center"
        className="evg-spacing-bottom-md"
      >
        <evg-grid-item small-mobile="12" small-tablet="auto">
          <h3
            id="refill-places-count"
            className="evg-text-size-heading-sm evg-spacing-bottom-none"
          >
            {t('refill.places.count', { count: totalCount })}
          </h3>
        </evg-grid-item>
        {totalCount > 0 && (
          <evg-grid-item small-mobile="12" small-tablet="auto">
            <RefillCategoryFilter />
          </evg-grid-item>
        )}
      </evg-grid>
      <div className="evg-spacing-bottom-md">
        {totalCount === 0 ? (
          <evg-alert variant="neutral-light">
            <p>
              <Trans
                i18nKey="refill.places.noPlacesAlert"
                components={{
                  a: <Link href={`/${postcode}/refill/sign-up`} />,
                }}
              />
            </p>
          </evg-alert>
        ) : (
          <RefillFilteredAlert count={count} />
        )}
      </div>
      {count > 0 && (
        <>
          <locator-places-grid className="evg-spacing-bottom-lg">
            <nav aria-labelledby="refill-places-count">
              <ul>
                {locations.items.map((location) => {
                  return (
                    <li key={`${location.id}`}>
                      <Link
                        href={`/${postcode}/refill/places/${location.id}?${locationSearchParams.toString()}`}
                      >
                        <evg-enter type="fade">
                          <evg-card radius="sm">
                            <evg-card-content>
                              <Place location={location} variant="refill" />
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
          {hasMore && (
            <evg-grid justify-content="center">
              <evg-grid-item
                small-mobile="12"
                small-tablet="6"
                large-tablet="4"
              >
                <evg-button width="full-width">
                  <button type="button" ref={loadMoreRef} onClick={loadMore}>
                    {t('actions.loadMore')}
                  </button>
                </evg-button>
              </evg-grid-item>
            </evg-grid>
          )}
          <RefillBrands companyNames={getCompanyNames(locations)} />
        </>
      )}
    </evg-enter>
  );
}

export default function RefillPlacesPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const { publicPath } = useAppState();
  const [searchParams] = useSearchParams();

  return (
    <locator-wrap max-width="none" gutter="fluid">
      <evg-section padding="md">
        <section className="evg-spacing-bottom-lg">
          <RefillLocations />
        </section>
        <evg-grid wrap="wrap" className="evg-spacing-bottom-lg">
          <evg-grid-item small-mobile="12" large-mobile="6">
            <locator-card-link>
              <Link href={`/${postcode}/refill/discover`}>
                <locator-card-link-img>
                  <img src={`${publicPath}images/refill/guide.webp`} alt="" />
                </locator-card-link-img>
                <locator-card-link-content>
                  <p className="evg-text-weight-bold evg-spacing-bottom-none">
                    {t('refill.discover.nav.guide.title')}
                  </p>
                  <p>{t('refill.discover.nav.guide.description')}</p>
                </locator-card-link-content>
              </Link>
            </locator-card-link>
          </evg-grid-item>
          <evg-grid-item small-mobile="12" large-mobile="6">
            <locator-card-link>
              <Link href={`/${postcode}/refill/home-delivery`}>
                <locator-card-link-img>
                  <img
                    src={`${publicPath}images/refill/home-delivery.webp`}
                    alt=""
                  />
                </locator-card-link-img>
                <locator-card-link-content>
                  <p className="evg-text-weight-bold evg-spacing-bottom-none">
                    {t('refill.discover.nav.home-delivery.title')}
                  </p>
                  <p>{t('refill.discover.nav.home-delivery.description')}</p>
                </locator-card-link-content>
              </Link>
            </locator-card-link>
          </evg-grid-item>
        </evg-grid>
      </evg-section>
      <evg-enter type="fade" delay={0.25}>
        <locator-fab sticky>
          <evg-button size="sm" variant="primary">
            <Link
              href={`/${postcode}/refill/places/map?${searchParams.toString()}`}
            >
              <locator-icon icon="map"></locator-icon>
              {t('actions.showMap')}
            </Link>
          </evg-button>
        </locator-fab>
      </evg-enter>
    </locator-wrap>
  );
}
