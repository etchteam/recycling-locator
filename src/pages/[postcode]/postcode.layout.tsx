import { ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useRoute } from 'wouter-preact';

import MapSvg from '@/components/canvas/MapSvg/MapSvg';
import About from '@/components/content/About/About';
import HeaderWithCloseButton from '@/components/content/HeaderLayouts/HeaderWithCloseButton';
import HeaderWithInfoButton from '@/components/content/HeaderLayouts/HeaderWithInfoButton';
import PlacesMap from '@/components/control/PlacesMap/PlacesMap';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocations } from '@/hooks/useLocations';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import sentry from '@/lib/sentry';

function MapLoadingFallback() {
  return (
    <locator-loading>
      <locator-hero size="full">
        <locator-icon icon="distance" color="muted"></locator-icon>
      </locator-hero>
    </locator-loading>
  );
}

function MapErrorFallback() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <MapSvg>
      <evg-button width="full-width">
        <Link href={`/${postcode}/places/map`}>
          {t('postcode.exploreTheMap')}
          <locator-icon icon="map" color="primary"></locator-icon>
        </Link>
      </evg-button>
    </MapSvg>
  );
}

export function PostcodeLayoutAside() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const { data: locations, loading, error } = useLocations();

  if (loading) {
    return <MapLoadingFallback />;
  }

  if (error || locations?.error) {
    // This can happen when the postcode is not found by the API but is found by HERE maps
    // The postcode checks on the API are stricter
    if (locations?.error) {
      sentry.setTag('route', 'PostcodeAside');
      sentry.captureMessage(locations.error);
      sentry.clear();
    }

    return <MapErrorFallback />;
  }

  if (!locations) {
    return <MapErrorFallback />;
  }

  return (
    <PlacesMap
      latitude={locations.meta.latitude}
      longitude={locations.meta.longitude}
      locations={locations.items}
      static
    >
      <Link href={`/${postcode}/places/map`} aria-label={t('actions.showMap')}>
        <locator-places-map-scrim />
      </Link>
      <locator-places-map-card padding="none">
        <evg-button width="full-width">
          <Link href={`/${postcode}/places/map`}>
            {t('postcode.exploreTheMap')}
            <locator-icon icon="map" color="primary"></locator-icon>
          </Link>
        </evg-button>
      </locator-places-map-card>
    </PlacesMap>
  );
}

export default function PostcodeLayout({
  children,
}: {
  readonly children: ComponentChildren;
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [isRescueMeRecyclePage] = useRoute('/:postcode/rescue-me-recycle');
  const { postcode } = usePostcode();
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        {isRescueMeRecyclePage ? (
          <HeaderWithCloseButton
            logoType={undefined}
            closeHref={`/${postcode}`}
          />
        ) : (
          <HeaderWithInfoButton
            infoOpen={infoOpen}
            onToggleInfo={() => setInfoOpen(!infoOpen)}
          />
        )}
      </div>
      <div slot="layout-main" id="locator-layout-main" ref={layoutRef}>
        {infoOpen ? (
          <locator-wrap>
            <evg-section padding="lg">
              <About />
            </evg-section>
          </locator-wrap>
        ) : (
          children
        )}
      </div>
      <div slot="layout-aside" className="display-contents">
        <PostcodeLayoutAside />
      </div>
    </locator-layout>
  );
}
