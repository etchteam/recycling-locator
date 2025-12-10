import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'wouter-preact';

import MapSvg from '@/components/canvas/MapSvg/MapSvg';
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
        <diamond-grid>
          <diamond-grid-item small-mobile="6">
            <diamond-button width="full-width" size="sm">
              <Link href={mapUrl}>
                <locator-icon icon="map" />
                {t('actions.showMap')}
              </Link>
            </diamond-button>
          </diamond-grid-item>
          <diamond-grid-item small-mobile="6">
            <diamond-button width="full-width" size="sm">
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
            </diamond-button>
          </diamond-grid-item>
        </diamond-grid>
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

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        <locator-header-logo>
          <Link href={`/${postcode}`}>
            <locator-logo type="logo-only"></locator-logo>
          </Link>
        </locator-header-logo>
        <locator-header-content>
          <locator-header-title>
            <diamond-button>
              <Link href={`/${postcode}/places?${searchParams.toString()}`}>
                <locator-icon icon="arrow-left" label="Back"></locator-icon>
              </Link>
            </diamond-button>
            <div>
              <h2>{placeName}</h2>
              <p>{placePostcode !== 'null' ? placePostcode : ''}</p>
            </div>
          </locator-header-title>
        </locator-header-content>
      </locator-header>
      <div slot="layout-main" ref={layoutRef}>
        <locator-nav-bar>
          <nav>
            <ul>
              <li>
                <Link
                  href={`/${postcode}/places/${safePlaceName}/${placePostcode}?${searchParams.toString()}`}
                >
                  {t('place.nav.recycle')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${postcode}/places/${safePlaceName}/${placePostcode}/details?${searchParams.toString()}`}
                >
                  {t('place.nav.details')}
                </Link>
              </li>
            </ul>
          </nav>
        </locator-nav-bar>
        <diamond-section padding="lg">
          <locator-wrap>{children}</locator-wrap>
        </diamond-section>
      </div>
      <div slot="layout-aside" className="display-contents">
        {!locationLoading &&
          (location?.latitude ? <PlaceMap location={location} /> : <MapSvg />)}
      </div>
    </locator-layout>
  );
}
