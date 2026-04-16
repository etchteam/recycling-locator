import nl2br from 'nl2br';
import { useTranslation } from 'react-i18next';
import { useParams } from 'wouter-preact';

import OpeningHours from '@/components/content/OpeningHours/OpeningHours';
import PlaceNotes from '@/components/content/PlaceNotes/PlaceNotes';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { usePlace } from '@/hooks/usePlace';
import cleanupAddress from '@/lib/cleanupAddress';
import getCollectionDetails from '@/lib/details/getCollectionDetails';
import getNotes from '@/lib/details/getNotes';
import getOpeningHours from '@/lib/details/getOpeningHours';
import getPhoneNumbers from '@/lib/details/getPhoneNumbers';
import getWebsites from '@/lib/details/getWebsites';
import { Location } from '@/types/locatorApi';

function PlaceDetailsPageContent({
  location,
}: {
  readonly location: Location;
}) {
  const { t } = useTranslation();

  if (location.error) {
    throw new Error(location.error);
  }

  const phoneNumbers = getPhoneNumbers(location);
  const websites = getWebsites(location);
  const openingHours = getOpeningHours(location);
  const notes = getNotes(location);
  const address = cleanupAddress(location.address);
  const collectionDetails = getCollectionDetails(location);

  return (
    <evg-enter type="fade">
      <locator-bordered-list size="sm" className="evg-spacing-bottom-md">
        <dl>
          <div>
            <dt>
              <locator-icon icon="pin" /> {t('place.details.address')}
            </dt>
            <dd>{address}</dd>
          </div>
          {phoneNumbers.length > 0 && (
            <div>
              <dt>
                <locator-icon icon="call" /> {t('place.details.phone')}
              </dt>
              {phoneNumbers.map((num) => (
                <dd key={num}>
                  <a href={`tel:${num}`}>{num}</a>
                </dd>
              ))}
            </div>
          )}
          {websites.size > 0 && (
            <div>
              <dt>
                <locator-icon icon="link" /> {t('place.details.website')}
              </dt>
              {[...websites].map(([site, linkText]) => (
                <dd key={site}>
                  <a
                    href={`${site}?utm_source=wrap-recycling-locator`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkText}
                  </a>
                </dd>
              ))}
            </div>
          )}
          <OpeningHours openingHours={openingHours} />
          {collectionDetails.length > 0 && (
            <div>
              <dt>
                <locator-icon icon="collection" />{' '}
                {t('place.details.collectionDetails')}
              </dt>
              {collectionDetails.map((details) => (
                <dd key={details}>{nl2br(details)}</dd>
              ))}
            </div>
          )}
          {notes.length > 0 && (
            <div>
              <dt>
                <locator-icon icon="docs" /> {t('place.details.notes')}
              </dt>
              <PlaceNotes notes={notes} />
            </div>
          )}
        </dl>
      </locator-bordered-list>

      <RateThisInfo />
    </evg-enter>
  );
}

export default function PlaceDetailsPage() {
  const { t } = useTranslation();
  const params = useParams<{ placeName: string; placePostcode: string }>();
  const { data: location, loading } = usePlace(
    params.placeName,
    params.placePostcode,
  );

  if (loading || !location) {
    return null;
  }

  return (
    <>
      <h3 className="evg-spacing-bottom-md">{t('place.details.title')}</h3>
      <PlaceDetailsPageContent location={location} />
    </>
  );
}
