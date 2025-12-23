import { useTranslation, Trans } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import PlacesMap from '@/components/control/PlacesMap/PlacesMap';
import { usePostcode } from '@/hooks/PostcodeProvider';
import mapSearchParams from '@/lib/mapSearchParams';
import { LocationsResponse } from '@/types/locatorApi';

function NoPlaces() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const tContext = 'material.nearbyPlaces.noPlaces';

  return (
    <diamond-card border radius>
      <locator-icon-text className="diamond-spacing-bottom-xs">
        <locator-icon-circle variant="negative">
          <locator-icon icon="place"></locator-icon>
        </locator-icon-circle>
        <h3>{t(`${tContext}.title`)}</h3>
      </locator-icon-text>
      <p className="diamond-text-size-sm">
        {t(`${tContext}.content`, { postcode })}
      </p>
      <diamond-button width="full-width">
        <Link href={`/${postcode}/material/search`}>
          {t('actions.searchAgain')}
        </Link>
      </diamond-button>
    </diamond-card>
  );
}

function Places({
  locations,
  nonRecyclable,
}: {
  readonly locations: LocationsResponse;
  readonly nonRecyclable: boolean;
}) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const [searchParams] = useSearchParams();
  const tContext = nonRecyclable
    ? 'material.nearbyPlaces.disposal'
    : 'material.nearbyPlaces.places';
  const count = locations.items.length;

  const placesSearchParams = mapSearchParams(
    ['materials', 'category', 'search'],
    searchParams,
  );

  return (
    <diamond-card padding="none" border radius>
      <diamond-card>
        <locator-icon-text className="diamond-spacing-bottom-xs">
          <locator-icon-circle variant="positive">
            <locator-icon icon="place"></locator-icon>
          </locator-icon-circle>
          <h3>{t(`${tContext}.title`)}</h3>
        </locator-icon-text>
        <p className="diamond-text-size-sm">
          <Trans
            i18nKey={`${tContext}.content${count >= 30 ? 'ThirtyPlus' : ''}`}
            components={{ bold: <strong /> }}
            values={{ count }}
          />
        </p>
      </diamond-card>
      <locator-places-map-wrapper>
        <PlacesMap
          latitude={locations.meta.latitude}
          longitude={locations.meta.longitude}
          locations={locations.items}
          static
        >
          <Link
            href={`/${postcode}/places?${placesSearchParams.toString()}`}
            aria-label={t('actions.showMap')}
          >
            <locator-places-map-scrim />
          </Link>
        </PlacesMap>
      </locator-places-map-wrapper>
      <diamond-card>
        <diamond-grid>
          <diamond-grid-item small-mobile="6">
            <diamond-button width="full-width">
              <Link
                href={`/${postcode}/places?${placesSearchParams.toString()}`}
              >
                {t('actions.listPlaces')}
              </Link>
            </diamond-button>
          </diamond-grid-item>
          <diamond-grid-item small-mobile="6">
            <diamond-button width="full-width">
              <Link
                href={`/${postcode}/places/map?${placesSearchParams.toString()}`}
              >
                {t('actions.showMap')}
              </Link>
            </diamond-button>
          </diamond-grid-item>
        </diamond-grid>
      </diamond-card>
    </diamond-card>
  );
}

export default function NearbyPlaces({
  locations,
  nonRecyclable,
}: {
  readonly locations: LocationsResponse;
  readonly nonRecyclable?: boolean;
}) {
  const hasLocations = locations.items.length > 0;

  if (hasLocations) {
    return <Places locations={locations} nonRecyclable={nonRecyclable} />;
  }

  return <NoPlaces />;
}
