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
    <evg-card radius="sm">
      <evg-card-content>
        <locator-icon-text className="evg-spacing-bottom-xs">
          <locator-icon-circle variant="negative">
            <locator-icon icon="place"></locator-icon>
          </locator-icon-circle>
          <h3>{t(`${tContext}.title`)}</h3>
        </locator-icon-text>
        <p className="evg-text-size-body-xs evg-spacing-bottom-sm">
          {t(`${tContext}.content`, { postcode })}
        </p>
        <evg-button width="full-width">
          <Link href={`/${postcode}/material/search`}>
            {t('actions.searchAgain')}
          </Link>
        </evg-button>
      </evg-card-content>
    </evg-card>
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
    <evg-card padding="none" radius="sm">
      <evg-card>
        <evg-card-content>
          <locator-icon-text className="evg-spacing-bottom-xs">
            <locator-icon-circle variant="positive">
              <locator-icon icon="place"></locator-icon>
            </locator-icon-circle>
            <h3>{t(`${tContext}.title`)}</h3>
          </locator-icon-text>
          <p className="evg-text-size-body-xs">
            <Trans
              i18nKey={`${tContext}.content${count >= 30 ? 'ThirtyPlus' : ''}`}
              components={{ bold: <strong /> }}
              values={{ count }}
            />
          </p>
        </evg-card-content>
      </evg-card>
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
      <evg-card>
        <evg-card-content>
          <evg-grid>
            <evg-grid-item small-mobile="6">
              <evg-button width="full-width">
                <Link
                  href={`/${postcode}/places?${placesSearchParams.toString()}`}
                >
                  {t('actions.listPlaces')}
                </Link>
              </evg-button>
            </evg-grid-item>
            <evg-grid-item small-mobile="6">
              <evg-button width="full-width">
                <Link
                  href={`/${postcode}/places/map?${placesSearchParams.toString()}`}
                >
                  {t('actions.showMap')}
                </Link>
              </evg-button>
            </evg-grid-item>
          </evg-grid>
        </evg-card-content>
      </evg-card>
    </evg-card>
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
