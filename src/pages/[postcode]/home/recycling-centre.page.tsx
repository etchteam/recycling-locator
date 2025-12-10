import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';
import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';

import '@/components/canvas/IconCircle/IconCircle';
import '@/components/composition/IconText/IconText';
import '@/components/content/Icon/Icon';
import Place from '@/components/content/Place/Place';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocations } from '@/hooks/useLocations';
import PostCodeResolver from '@/lib/PostcodeResolver';
import { Location } from '@/types/locatorApi';

function Loading() {
  const { t } = useTranslation();

  return (
    <>
      <section className="diamond-spacing-bottom-lg">
        <h3>{t('homeRecycling.hwrc.title')}</h3>
        <diamond-enter type="fade-in-up">
          <locator-loading-card />
        </diamond-enter>
      </section>
      <section className="diamond-spacing-bottom-lg">
        <h3 className="diamond-spacing-bottom-md">
          {t('homeRecycling.hwrc.nearbyPlaces.title')}
        </h3>
        <diamond-enter type="fade-in-up">
          <locator-loading-card />
        </diamond-enter>
      </section>
    </>
  );
}

function HomeRecyclingCentrePageContent({
  locations,
}: {
  readonly locations: Location[];
}) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  const hwrcLocations = locations.filter((location) =>
    location.locations.some((l) => l.locationType === 'HWRC'),
  );
  const hwrcLocationsCount = hwrcLocations.length;
  const otherLocationsCount = locations.length;

  return (
    <>
      <section className="diamond-spacing-bottom-lg">
        <h3>{t('homeRecycling.hwrc.title')}</h3>

        <diamond-enter type="fade">
          {hwrcLocationsCount > 0 ? (
            <>
              <p>
                {t(
                  `homeRecycling.hwrc.content${hwrcLocationsCount >= 30 ? 'ThirtyPlus' : ''}`,
                  { count: hwrcLocationsCount },
                )}
              </p>
              <diamond-card
                className="theme-info diamond-spacing-bottom-md"
                padding="sm"
                radius
              >
                <locator-icon-text>
                  <locator-icon icon="info"></locator-icon>
                  <p className="diamond-text-size-sm">
                    {t('homeRecycling.hwrc.info')}
                  </p>
                </locator-icon-text>
              </diamond-card>

              {hwrcLocations.map((location) => {
                const locationPostcode =
                  PostCodeResolver.extractPostcodeFromString(location.address);
                const locationName = encodeURIComponent(location.name);

                return (
                  <Link
                    href={`/${postcode}/places/${locationName}/${locationPostcode}`}
                    key={location.id}
                  >
                    <diamond-card
                      className="diamond-spacing-bottom-sm"
                      border
                      radius
                    >
                      <Place location={location} />
                    </diamond-card>
                  </Link>
                );
              })}
            </>
          ) : (
            <diamond-card border radius>
              <locator-icon-text>
                <locator-icon-circle variant="negative">
                  <locator-icon icon="place-hwrc"></locator-icon>
                </locator-icon-circle>
                <p className="diamond-text-weight-bold">
                  {t('homeRecycling.hwrc.content', { count: 0 })}
                </p>
              </locator-icon-text>
            </diamond-card>
          )}
        </diamond-enter>
      </section>

      <section className="diamond-spacing-bottom-lg">
        <h3 className="diamond-spacing-bottom-md">
          {t('homeRecycling.hwrc.nearbyPlaces.title')}
        </h3>

        <diamond-enter type="fade">
          <diamond-card border radius>
            <locator-icon-text className="diamond-spacing-bottom-md">
              <locator-icon-circle
                variant={otherLocationsCount === 0 ? 'negative' : 'positive'}
              >
                <locator-icon icon="place"></locator-icon>
              </locator-icon-circle>
              <h3>
                {t(
                  `homeRecycling.hwrc.nearbyPlaces.content${otherLocationsCount >= 30 ? 'ThirtyPlus' : ''}`,
                  {
                    count: otherLocationsCount,
                  },
                )}
              </h3>
            </locator-icon-text>
            <diamond-button width="full-width">
              <diamond-grid>
                <diamond-grid-item small-mobile="6">
                  <diamond-button width="full-width">
                    <Link href={`/${postcode}/places`}>
                      {t('actions.listPlaces')}
                    </Link>
                  </diamond-button>
                </diamond-grid-item>
                <diamond-grid-item small-mobile="6">
                  <diamond-button width="full-width">
                    <Link href={`/${postcode}/places/map`}>
                      {t('actions.showMap')}
                    </Link>
                  </diamond-button>
                </diamond-grid-item>
              </diamond-grid>
            </diamond-button>
          </diamond-card>
        </diamond-enter>
      </section>
    </>
  );
}

export default function HomeRecyclingCentrePage() {
  const { data: locationsData, loading } = useLocations();
  const hasLoaded = !loading && locationsData;

  if (!hasLoaded) {
    return <Loading />;
  }

  if (locationsData.error) {
    throw new Error(locationsData.error);
  }

  return <HomeRecyclingCentrePageContent locations={locationsData.items} />;
}
