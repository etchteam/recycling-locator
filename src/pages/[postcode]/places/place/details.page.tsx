import Linkify from 'linkify-react';
import nl2br from 'nl2br';
import { Suspense } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { Await } from 'react-router';

import '@/components/composition/BorderedList/BorderedList';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import cleanupAddress from '@/lib/cleanupAddress';
import getCollectionDetails from '@/lib/details/getCollectionDetails';
import getNotes from '@/lib/details/getNotes';
import getOpeningHours from '@/lib/details/getOpeningHours';
import getPhoneNumbers from '@/lib/details/getPhoneNumbers';
import getWebsites from '@/lib/details/getWebsites';
import { Location } from '@/types/locatorApi';

import { usePlaceLoaderData } from './place.loader';

function getOpeningHoursClass(idx: number, hours: string): string {
  if (idx !== 0) {
    return '';
  }

  if (hours.toLocaleLowerCase().includes('open')) {
    return 'text-color-positive';
  }

  return 'text-color-negative';
}

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
    <diamond-enter type="fade">
      <locator-bordered-list size="sm" className="diamond-spacing-bottom-md">
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
          {websites.length > 0 && (
            <div>
              <dt>
                <locator-icon icon="link" /> {t('place.details.website')}
              </dt>
              {websites.map((site) => (
                <dd key={site}>
                  <a
                    href={`${site}?utm_source=wrap-recycling-locator`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {site}
                  </a>
                </dd>
              ))}
            </div>
          )}
          {openingHours.length > 0 && (
            <div>
              <dt>
                <locator-icon icon="schedule" />{' '}
                {t('place.details.openingHours')}
              </dt>
              {openingHours.map((hours, idx) => (
                <dd class={getOpeningHoursClass(idx, hours)} key={hours}>
                  {idx === 0 ? <mark>{hours}</mark> : hours}
                </dd>
              ))}
            </div>
          )}
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
              {notes.map((note) => (
                <dd key={note}>
                  {
                    <Linkify
                      options={{
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        nl2br: true,
                        defaultProtocol: 'https',
                        format: (value) => {
                          return value.includes('https://what3words.com')
                            ? value.replace('https://what3words.com/', '///')
                            : value;
                        },
                      }}
                    >
                      {note}
                    </Linkify>
                  }
                </dd>
              ))}
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
