import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'wouter-preact';

import MapSvg from '@/components/canvas/MapSvg/MapSvg';
import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import PlacesMap from '@/components/control/PlacesMap/PlacesMap';
import PlacesMapCard from '@/components/control/PlacesMap/PlacesMapCard';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useRefillPlace } from '@/hooks/useRefillPlace';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import PostCodeResolver from '@/lib/PostcodeResolver';
import { Location } from '@/types/locatorApi';

function PlaceMap({ location }: { readonly location: Location }) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { postcode } = usePostcode();

  const mapSearchParams = new URLSearchParams(searchParams);
  mapSearchParams.set('lat', String(location.latitude));
  mapSearchParams.set('lng', String(location.longitude));
  mapSearchParams.set('activeLocation', location.id);
  const mapUrl = `/${postcode}/refill/map?${mapSearchParams.toString()}`;

  return (
    <PlacesMap
      latitude={location.latitude}
      longitude={location.longitude}
      locations={[location]}
      activeLocationId={location.id}
      static
    >
      <Link href={mapUrl} aria-label={t('actions.showMap')}>
        <locator-places-map-scrim />
      </Link>
      <PlacesMapCard
        variant="preview"
        location={location}
        primaryAction={
          <evg-button width="full-width" size="sm">
            <Link href={mapUrl}>
              <locator-icon icon="map" />
              {t('actions.showMap')}
            </Link>
          </evg-button>
        }
      />
    </PlacesMap>
  );
}

export default function RefillPlaceLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { postcode } = usePostcode();
  const [searchParams] = useSearchParams();
  const params = useParams<{ id: string }>();
  const { data: location, loading: locationLoading } = useRefillPlace(
    params.id,
  );
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithBackButton
          logoType="icon-only"
          logoHref={`/${postcode}`}
          title={location?.name}
          subtitle={
            location
              ? PostCodeResolver.extractPostcodeFromString(location.address)
              : ''
          }
          backFallback={`/${postcode}/refill?${searchParams.toString()}`}
        />
      </div>
      <div slot="layout-main" ref={layoutRef}>
        <evg-section padding="lg">
          <locator-wrap>{children}</locator-wrap>
        </evg-section>
      </div>
      <div slot="layout-aside" className="display-contents">
        {!locationLoading &&
          (location?.latitude ? <PlaceMap location={location} /> : <MapSvg />)}
      </div>
    </locator-layout>
  );
}
