import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import Place from '@/components/content/Place/Place';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocations } from '@/hooks/useLocations';
import PostCodeResolver from '@/lib/PostcodeResolver';
import { Location } from '@/types/locatorApi';

function Loading() {
  const { t } = useTranslation();

  return (
    <>
      <section className="evg-spacing-bottom-lg">
        <h3>{t('homeRecycling.hwrc.title')}</h3>
        <evg-enter type="fade-in-up">
          <locator-loading-card />
        </evg-enter>
      </section>
      <section className="evg-spacing-bottom-lg">
        <h3 className="evg-spacing-bottom-md">
          {t('homeRecycling.hwrc.nearbyPlaces.title')}
        </h3>
        <evg-enter type="fade-in-up">
          <locator-loading-card />
        </evg-enter>
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
      <section className="evg-spacing-bottom-lg">
        <h3>{t('homeRecycling.hwrc.title')}</h3>

        <evg-enter type="fade">
          {hwrcLocationsCount > 0 ? (
            <>
              <p>
                {t(
                  `homeRecycling.hwrc.content${hwrcLocationsCount >= 30 ? 'ThirtyPlus' : ''}`,
                  { count: hwrcLocationsCount },
                )}
              </p>
              <evg-card
                className="theme-info evg-spacing-bottom-md"
                padding="sm"
                radius="sm"
              >
                <evg-card-content>
                  <locator-icon-text>
                    <locator-icon icon="info"></locator-icon>
                    <p className="evg-text-size-body-xs">
                      {t('homeRecycling.hwrc.info')}
                    </p>
                  </locator-icon-text>
                </evg-card-content>
              </evg-card>

              {hwrcLocations.map((location) => {
                const locationPostcode =
                  PostCodeResolver.extractPostcodeFromString(location.address);
                const locationName = encodeURIComponent(location.name);

                return (
                  <Link
                    href={`/${postcode}/places/${locationName}/${locationPostcode}`}
                    key={location.id}
                  >
                    <evg-card className="evg-spacing-bottom-sm" radius="sm">
                      <evg-card-content>
                        <Place location={location} />
                      </evg-card-content>
                    </evg-card>
                  </Link>
                );
              })}
            </>
          ) : (
            <evg-card radius="sm">
              <evg-card-content>
                <locator-icon-text>
                  <locator-icon-circle variant="negative">
                    <locator-icon icon="place-hwrc"></locator-icon>
                  </locator-icon-circle>
                  <p className="evg-text-weight-bold">
                    {t('homeRecycling.hwrc.content', { count: 0 })}
                  </p>
                </locator-icon-text>
              </evg-card-content>
            </evg-card>
          )}
        </evg-enter>
      </section>

      <section className="evg-spacing-bottom-lg">
        <h3 className="evg-spacing-bottom-md">
          {t('homeRecycling.hwrc.nearbyPlaces.title')}
        </h3>

        <evg-enter type="fade">
          <evg-card radius="sm">
            <evg-card-content>
              <locator-icon-text className="evg-spacing-bottom-md">
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
              <evg-button width="full-width">
                <evg-grid>
                  <evg-grid-item small-mobile="6">
                    <evg-button width="full-width">
                      <Link href={`/${postcode}/places`}>
                        {t('actions.listPlaces')}
                      </Link>
                    </evg-button>
                  </evg-grid-item>
                  <evg-grid-item small-mobile="6">
                    <evg-button width="full-width">
                      <Link href={`/${postcode}/places/map`}>
                        {t('actions.showMap')}
                      </Link>
                    </evg-button>
                  </evg-grid-item>
                </evg-grid>
              </evg-button>
            </evg-card-content>
          </evg-card>
        </evg-enter>
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
