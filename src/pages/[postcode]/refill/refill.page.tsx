import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import LoadingPlacesList from '@/components/content/LoadingPlacesList/LoadingPlacesList';
import Place from '@/components/content/Place/Place';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { usePaginatedLocations } from '@/hooks/usePaginatedLocations';
import { useRefillLocations } from '@/hooks/useRefillLocations';

function RefillLocations() {
  const { postcode } = usePostcode();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const locationsResult = useRefillLocations();
  const {
    data: locations,
    count,
    currentPage,
    hasMore,
    isInitialLoad,
    loadMore,
    loadMoreRef,
  } = usePaginatedLocations(locationsResult);
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

  if (count === 0) {
    return null;
  }

  return (
    <evg-enter type="fade">
      <h3
        id="refill-places-count"
        className="evg-text-size-heading-sm evg-spacing-bottom-md"
      >
        {t('places.count', { count })}
      </h3>
      <locator-places-grid className="evg-spacing-bottom-lg">
        <nav aria-labelledby="refill-places-count">
          <ul>
            {locations.items.map((location) => {
              return (
                <li key={`${location.id}`}>
                  <Link
                    href={`/${postcode}/refill/${location.id}?${locationSearchParams.toString()}`}
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

export default function RefillPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const [searchParams] = useSearchParams();

  return (
    <locator-wrap max-width="none" gutter="fluid">
      <evg-section padding="md">
        <section className="evg-spacing-bottom-lg">
          <locator-icon-link border className="evg-spacing-top-md">
            <Link href={`/${postcode}/refill/discover`}>
              <locator-icon-circle>
                <locator-icon icon="refill" color="primary"></locator-icon>
              </locator-icon-circle>
              <div>
                <h4 className="text-size-base evg-spacing-bottom-none">
                  {t('postcode.options.refill.title')}
                </h4>
                <p className="evg-text-size-body-xs">
                  {t('postcode.options.refill.description')}
                </p>
              </div>
            </Link>
          </locator-icon-link>
          <RefillLocations />
        </section>
      </evg-section>
      <evg-enter type="fade" delay={0.25}>
        <locator-fab sticky>
          <evg-button size="sm" variant="primary">
            <Link href={`/${postcode}/refill/map?${searchParams.toString()}`}>
              <locator-icon icon="map"></locator-icon>
              {t('actions.showMap')}
            </Link>
          </evg-button>
        </locator-fab>
      </evg-enter>
    </locator-wrap>
  );
}
