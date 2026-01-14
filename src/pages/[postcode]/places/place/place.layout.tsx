import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'wouter-preact';

import MapSvg from '@/components/canvas/MapSvg/MapSvg';
import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import NavLink from '@/components/control/NavBar/NavLink';
import PlacesMap from '@/components/control/PlacesMap/PlacesMap';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import { usePlace } from '@/hooks/usePlace';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import directions from '@/lib/directions';
import { Location } from '@/types/locatorApi';

function PlaceMap({ location }: { readonly location: Location }) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { postcode } = usePostcode();
  const { recordEvent } = useAnalytics();

  const mapSearchParams = new URLSearchParams(searchParams);
  mapSearchParams.set('lat', String(location.latitude));
  mapSearchParams.set('lng', String(location.longitude));
  mapSearchParams.set('activeLocation', location.id);
  const mapUrl = `/${postcode}/places/map?${mapSearchParams.toString()}`;

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
      <locator-places-map-card>
        <evg-grid>
          <evg-grid-item small-mobile="6">
            <evg-button width="full-width" size="sm">
              <Link href={mapUrl}>
                <locator-icon icon="map" />
                {t('actions.showMap')}
              </Link>
            </evg-button>
          </evg-grid-item>
          <evg-grid-item small-mobile="6">
            <evg-button width="full-width" size="sm">
              <a
                href={directions(postcode, location.address)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  recordEvent({
                    category: 'PlaceDetails::Directions',
                    action: location.address,
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
    </PlacesMap>
  );
}

export default function PlaceLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { postcode } = usePostcode();
  const params = useParams<{ placeName: string; placePostcode: string }>();
  const placeName = params.placeName;
  const placePostcode = params.placePostcode;
  const { data: location, loading: locationLoading } = usePlace(
    placeName,
    placePostcode,
  );
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);
  const safePlaceName = encodeURIComponent(placeName);
  const queryString = searchParams ? `?${searchParams.toString()}` : '';

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithBackButton
          logoType="icon-only"
          logoHref={`/${postcode}`}
          title={placeName}
          subtitle={placePostcode === 'null' ? '' : placePostcode}
          backFallback={`/${postcode}/places?${searchParams.toString()}`}
        />
      </div>
      <div slot="layout-main" ref={layoutRef}>
        <locator-nav-bar>
          <nav>
            <ul>
              <li>
                <NavLink
                  href={`/${postcode}/places/${safePlaceName}/${placePostcode}${queryString}`}
                  path="/:postcode/places/:placeName/:placePostcode"
                >
                  {t('place.nav.recycle')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  href={`/${postcode}/places/${safePlaceName}/${placePostcode}/details${queryString}`}
                  path="/:postcode/places/:placeName/:placePostcode/details"
                >
                  {t('place.nav.details')}
                </NavLink>
              </li>
            </ul>
          </nav>
        </locator-nav-bar>
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
