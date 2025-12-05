import { Suspense } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { Await } from 'react-router';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/composition/BorderedList/BorderedList';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { getLinkText } from '@/lib/details/getWebsites';
import { LocalAuthority } from '@/types/locatorApi';

import { useHomeRecyclingLoaderData } from './home.loader';

function HomeRecyclingContactPageContent({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { t } = useTranslation();
  const tContext = 'homeRecycling.contact';

  return (
    <diamond-enter type="fade">
      <locator-bordered-list size="sm">
        <h4 className="text-color-muted">{localAuthority.name}</h4>
        <dl>
          <div>
            <dt>{t(`${tContext}.website`)}</dt>
            <dd>
              <a
                href={`${localAuthority.recyclingUri}?utm_source=wrap-recycling-locator`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getLinkText(localAuthority.recyclingUri)}
              </a>
            </dd>
          </div>
          <div>
            <dt>{t(`${tContext}.phone`)}</dt>
            <dd>{localAuthority.enquiryNumber}</dd>
          </div>
          <div>
            <dt>{t(`${tContext}.notes.title`)}</dt>
            <dd>
              <p>{t(`${tContext}.notes.paragraphOne`)}</p>
              <ul>
                {(t(`${tContext}.notes.list`) as string[]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{t(`${tContext}.notes.paragraphTwo`)}</p>
              <p>{t(`${tContext}.notes.paragraphThree`)}</p>
            </dd>
          </div>
        </dl>
      </locator-bordered-list>
      <hr />
      <div className="diamond-spacing-top-sm diamond-spacing-bottom-md diamond-text-size-sm">
        <span className="text-color-muted">
          {t('common.updated')}:{' '}
          {new Intl.DateTimeFormat('en-GB').format(
            new Date(localAuthority.lastUpdate),
          )}
        </span>
      </div>

      <RateThisInfo />
    </diamond-enter>
  );
}

export default function HomeRecyclingContactPage() {
  const { t } = useTranslation();
  const { localAuthority: localAuthorityPromise } =
    useHomeRecyclingLoaderData();

  return (
    <>
      <h3 className="diamond-spacing-bottom-md">
        {t(`homeRecycling.contact.title`)}
      </h3>
      <Suspense fallback={/* hitting loading here is unexpected */ null}>
        <Await resolve={localAuthorityPromise}>
          {(localAuthority) => (
            <HomeRecyclingContactPageContent localAuthority={localAuthority} />
          )}
        </Await>
      </Suspense>
    </>
  );
}
