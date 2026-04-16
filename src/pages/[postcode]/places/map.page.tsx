import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import LoadingPlacesMap from '@/components/content/LoadingPlacesMap/LoadingPlacesMap';
import PlacesMap from '@/components/control/PlacesMap/PlacesMap';
import PlacesMapCard from '@/components/control/PlacesMap/PlacesMapCard';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocations } from '@/hooks/useLocations';
import { useLocationsMap } from '@/hooks/useLocationsMap';
import PostCodeResolver from '@/lib/PostcodeResolver';

export default function PlacesMapPage() {
  const { postcode } = usePostcode();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const locationsResult = useLocations();
  const {
    data: locations,
    loading,
    defaultLatitude,
    defaultLongitude,
    activeLocation,
    showSearchThisArea,
    handleMarkerClick,
    handleZoom,
    handleDrag,
    handleSearchThisArea,
  } = useLocationsMap(locationsResult);

  if (loading || !locations) {
    return <LoadingPlacesMap />;
  }

  if (locations.error) {
    throw new Error(locations.error);
  }

  const activeLocationPostcode = PostCodeResolver.extractPostcodeFromString(
    activeLocation.value?.address,
  );
  const activeLocationName = encodeURIComponent(
    activeLocation.value?.name ?? '',
  );

  return (
    <evg-enter type="fade">
      <PlacesMap
        latitude={defaultLatitude}
        longitude={defaultLongitude}
        locations={locations.items}
        activeLocationId={activeLocation.value?.id}
        onMarkerClick={handleMarkerClick}
        onZoom={handleZoom}
        onDrag={handleDrag}
      >
        {showSearchThisArea.value && (
          <locator-fab position="top">
            <evg-button>
              <button type="button" onClick={handleSearchThisArea}>
                <locator-icon icon="sync" />
                {t('places.map.searchThisArea')}
              </button>
            </evg-button>
          </locator-fab>
        )}
        {activeLocation.value ? (
          <PlacesMapCard
            variant="interactive"
            location={activeLocation.value}
            onClose={() => (activeLocation.value = null)}
            primaryAction={
              <evg-button width="full-width" variant="primary" size="sm">
                <Link
                  href={`/${postcode}/places/${activeLocationName}/${activeLocationPostcode}?${searchParams.toString()}`}
                >
                  {t('actions.viewDetails')}
                </Link>
              </evg-button>
            }
          />
        ) : (
          <evg-enter type="fade" delay={0.5}>
            <locator-fab>
              <evg-button size="sm" variant="primary">
                <Link href={`/${postcode}/places?${searchParams.toString()}`}>
                  <locator-icon icon="list"></locator-icon>
                  {t('actions.showList')}
                </Link>
              </evg-button>
            </locator-fab>
          </evg-enter>
        )}
      </PlacesMap>
    </evg-enter>
  );
}
