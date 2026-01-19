import { Signal, useSignal } from '@preact/signals';
import { useEffect } from 'preact/compat';
import { useLocation, useSearchParams } from 'wouter-preact';

import { useLocations } from '@/hooks/useLocations';
import mapSearchParams from '@/lib/mapSearchParams';
import { Location, LocationsResponse } from '@/types/locatorApi';

export interface UseLocationsMapResult {
  /** Locations data from API */
  data: LocationsResponse | null;
  /** Whether data is currently loading */
  loading: boolean;
  /** Default map center latitude from API response */
  defaultLatitude: number | undefined;
  /** Default map center longitude from API response */
  defaultLongitude: number | undefined;
  /** Currently selected location */
  activeLocation: Signal<Location | null>;
  /** Whether to show the "Search this area" button */
  showSearchThisArea: Signal<boolean>;
  /** Handler for map marker clicks */
  handleMarkerClick: (location: Location) => void;
  /** Handler for map zoom changes */
  handleZoom: (zoom: number) => void;
  /** Handler for map drag/pan */
  handleDrag: (geoPoint: H.geo.Point) => void;
  /** Handler for "Search this area" button click */
  handleSearchThisArea: (event: Event) => void;
}

// Zoom level to search radius/page mapping
const zoomLevelMap: Record<number, { zoomRadius: number; zoomPage: number }> = {
  9: { zoomRadius: 64, zoomPage: 4 },
  10: { zoomRadius: 54, zoomPage: 3 },
  11: { zoomRadius: 44, zoomPage: 2 },
  12: { zoomRadius: 34, zoomPage: 2 },
  13: { zoomRadius: 24, zoomPage: 1 },
  14: { zoomRadius: 14, zoomPage: 1 },
  15: { zoomRadius: 4, zoomPage: 1 },
};

// Minimum drag distance in meters to trigger "search this area"
const DRAG_THRESHOLD_METERS = 1500;

/**
 * Hook for map-based location viewing with zoom/pan interactions
 */
export function useLocationsMap(): UseLocationsMapResult {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: locations, loading } = useLocations();

  const defaultActiveLocationId = searchParams.get('activeLocation');
  const defaultLatitude = locations?.meta?.latitude;
  const defaultLongitude = locations?.meta?.longitude;

  const activeLocation = useSignal<Location | null>(null);
  const showSearchThisArea = useSignal(false);
  const pendingChanges = useSignal<{
    page?: number;
    radius?: number;
    lat?: number;
    lng?: number;
  }>({});

  const currentLat = searchParams.get('lat')
    ? Number.parseFloat(searchParams.get('lat')!)
    : defaultLatitude;
  const currentLng = searchParams.get('lng')
    ? Number.parseFloat(searchParams.get('lng')!)
    : defaultLongitude;

  // Set active location from URL param when data loads
  useEffect(() => {
    if (locations && defaultActiveLocationId) {
      const foundLocation = locations.items.find(
        (loc) => loc.id === defaultActiveLocationId,
      );

      if (foundLocation) {
        activeLocation.value = foundLocation;
      }
    }
  }, [locations, defaultActiveLocationId]);

  // Reset "search this area" when route changes
  useEffect(() => {
    showSearchThisArea.value = false;
  }, [location]);

  const handleMarkerClick = (clickedLocation: Location) => {
    activeLocation.value = clickedLocation;
  };

  const handleZoom = (zoom: number) => {
    const zoomConfig = zoomLevelMap[Math.floor(zoom)];

    if (!zoomConfig) {
      return;
    }

    const { zoomRadius, zoomPage } = zoomConfig;
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
    if (currentLat === undefined || currentLng === undefined) {
      return;
    }

    const distance = geoPoint.distance({ lat: currentLat, lng: currentLng });

    if (distance > DRAG_THRESHOLD_METERS) {
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

  return {
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
  };
}
