import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useSearchParams } from 'wouter-preact';

import Place from '@/components/content/Place/Place';
import PlacesMap from '@/components/control/PlacesMap/PlacesMap';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import { useLocations } from '@/hooks/useLocations';
import PostCodeResolver from '@/lib/PostcodeResolver';
import directions from '@/lib/directions';
import mapSearchParams from '@/lib/mapSearchParams';
import { Location } from '@/types/locatorApi';

function Loading() {
  const { t } = useTranslation();

  return (
    <locator-loading>
      <locator-hero size="full">
        <locator-icon icon="distance" color="muted" />
        <h3>{t('places.loading')}</h3>
      </locator-hero>
    </locator-loading>
  );
}

export function PlacesMapPageContent() {
  const { postcode } = usePostcode();
  const { t } = useTranslation();
  const [location] = useLocation();
  const { recordEvent } = useAnalytics();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultActiveLocationId = searchParams.get('activeLocation');
  const { data: locations, loading } = useLocations();
  const defaultLatitude = locations?.meta?.latitude;
  const defaultLongitude = locations?.meta?.longitude;
  const activeLocation = useSignal<Location | null>(null);
  const showSearchThisArea = useSignal(false);
  const currentLat = searchParams.get('lat')
    ? Number.parseFloat(searchParams.get('lat'))
    : defaultLatitude;
  const currentLng = searchParams.get('lng')
    ? Number.parseFloat(searchParams.get('lng'))
    : defaultLongitude;
  // Track pending changes for "search this area" button
  const pendingChanges = useSignal<{
    page?: number;
    radius?: number;
    lat?: number;
    lng?: number;
  }>({});

  useEffect(() => {
    if (locations && defaultActiveLocationId) {
      const location = locations.items.find(
        (location) => location.id === defaultActiveLocationId,
      );

      if (location) {
        activeLocation.value = location;
      }
    }
  }, [locations, defaultActiveLocationId]);

  useEffect(() => {
    showSearchThisArea.value = false;
  }, [location]);

  if (loading || !locations) {
    return <Loading />;
  }

  if (locations.error) {
    throw new Error(locations.error);
  }

  const activeLocationPostcode = PostCodeResolver.extractPostcodeFromString(
    activeLocation.value?.address,
  );
  const activeLocationName = encodeURIComponent(activeLocation.value?.name);

  const handleMarkerClick = (location: Location) => {
    activeLocation.value = location;
  };

  const handleZoom = (zoom: number) => {
    const zoomLevelMilesMap = {
      9: { zoomRadius: 64, zoomPage: 4 },
      10: { zoomRadius: 54, zoomPage: 3 },
      11: { zoomRadius: 44, zoomPage: 2 },
      12: { zoomRadius: 34, zoomPage: 2 },
      13: { zoomRadius: 24, zoomPage: 1 },
      14: { zoomRadius: 14, zoomPage: 1 },
      15: { zoomRadius: 4, zoomPage: 1 },
    };

    const { zoomRadius, zoomPage } = zoomLevelMilesMap[Math.floor(zoom)];
    const currentRadius = Number.parseInt(searchParams.get('radius') || '25');
    const currentPage = Number.parseInt(searchParams.get('page') || '1');

    if (currentRadius !== zoomRadius || currentPage !== zoomPage) {
      pendingChanges.value = {
        ...pendingChanges.value,
        radius: zoomRadius,
        page: zoomPage,
      };
      showSearchThisArea.value = true;
    }
  };

  const handleDrag = (geoPoint: H.geo.Point) => {
    const distance = geoPoint.distance({ lat: currentLat, lng: currentLng });

    if (distance > 1500) {
      pendingChanges.value = {
        ...pendingChanges.value,
        lat: geoPoint.lat,
        lng: geoPoint.lng,
      };
      showSearchThisArea.value = true;
    }
  };

  const handleSearchThisArea = (event: Event) => {
    event.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    const updatedParams = mapSearchParams(
      ['page', 'radius', 'lat', 'lng'],
      pendingChanges.value,
    );

    updatedParams.forEach((value, key) => {
      newParams.set(key, value);
    });

    setSearchParams(newParams);
    pendingChanges.value = {};
    showSearchThisArea.value = false;
  };

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
          <locator-places-map-card>
            <evg-grid>
              <evg-grid-item grow shrink>
                <Place location={activeLocation.value} withAddress={false} />
              </evg-grid-item>
              <evg-grid-item>
                <evg-button variant="ghost">
                  <button
                    type="button"
                    onClick={() => (activeLocation.value = null)}
                  >
                    <locator-icon
                      icon="close"
                      color="primary"
                      label={t('actions.close')}
                    />
                  </button>
                </evg-button>
              </evg-grid-item>
            </evg-grid>
            <evg-grid>
              <evg-grid-item small-mobile="6">
                <evg-button width="full-width" variant="primary" size="sm">
                  <Link
                    href={`/${postcode}/places/${activeLocationName}/${activeLocationPostcode}?${searchParams.toString()}`}
                  >
                    {t('actions.viewDetails')}
                  </Link>
                </evg-button>
              </evg-grid-item>
              <evg-grid-item small-mobile="6">
                <evg-button width="full-width" size="sm">
                  <a
                    href={directions(postcode, activeLocation.value.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      recordEvent({
                        category: 'PlacesMap::Directions',
                        action: activeLocation.value.address,
                      });
                    }}
                  >
                    {t('actions.directions')}
                    <locator-icon icon="external" />
                  </a>
                </evg-button>
              </evg-grid-item>
            </evg-grid>
          </locator-places-map-card>
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

export default function PlacesMapPage() {
  return <PlacesMapPageContent />;
}
