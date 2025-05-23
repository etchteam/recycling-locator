import nl2br from 'nl2br';
import { Suspense } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { Await } from 'react-router';

import '@/components/composition/BorderedList/BorderedList';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { Location } from '@/types/locatorApi';

import { usePlaceLoaderData } from './place.loader';

function PlaceDetailsPageContent({
  location,
}: {
  readonly location: Location;
}) {
  const { t } = useTranslation();

  if (location.error) {
    throw new Error(location.error);
  }

  return (
    <diamond-enter type="fade">
      <locator-bordered-list size="sm" className="diamond-spacing-bottom-md">
        <dl>
          <div>
            <dt>{t('place.details.address')}</dt>
            <dd>{location.address}</dd>
          </div>
          {location.telephone && (
            <div>
              <dt>{t('place.details.phone')}</dt>
              <dd>{location.telephone}</dd>
            </div>
          )}
          {location.website && (
            <div>
              <dt>{t('place.details.website')}</dt>
              <dd>
                <a
                  href={location.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {location.website}
                </a>
              </dd>
            </div>
          )}
          {location.openingHours && (
            <div>
              <dt>{t('place.details.openingHours')}</dt>
              <dd>{nl2br(location.openingHours)}</dd>
            </div>
          )}
          {location.collectionDetails && (
            <div>
              <dt>{t('place.details.collectionDetails')}</dt>
              <dd>{nl2br(location.collectionDetails)}</dd>
            </div>
          )}
          {location.notes && (
            <div>
              <dt>{t('place.details.notes')}</dt>
              <dd>{nl2br(location.notes)}</dd>
            </div>
          )}
        </dl>
      </locator-bordered-list>

      <RateThisInfo />
    </diamond-enter>
  );
}

export default function PlaceDetailsPage() {
  const { t } = useTranslation();
  const { location: locationPromise } = usePlaceLoaderData();

  return (
    <>
      <h3 className="diamond-spacing-bottom-md">{t('place.details.title')}</h3>

      <Suspense fallback={null}>
        <Await resolve={locationPromise}>
          {(location) => <PlaceDetailsPageContent location={location} />}
        </Await>
      </Suspense>
    </>
  );
}
