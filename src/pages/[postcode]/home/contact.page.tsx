import { useTranslation } from 'react-i18next';

import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { useLocalAuthority } from '@/hooks/useLocalAuthority';
import { getLinkText } from '@/lib/details/getWebsites';
import tArray from '@/lib/tArray';
import { LocalAuthority } from '@/types/locatorApi';

function HomeRecyclingContactPageContent({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { t } = useTranslation();
  const tContext = 'homeRecycling.contact';

  return (
    <evg-enter type="fade">
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
                {tArray(`${tContext}.notes.list`).map((item) => (
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
      <div className="evg-spacing-top-sm evg-spacing-bottom-md evg-text-size-body-xs">
        <span className="text-color-muted">
          {t('common.updated')}:{' '}
          {new Intl.DateTimeFormat('en-GB').format(
            new Date(localAuthority.lastUpdate),
          )}
        </span>
      </div>

      <RateThisInfo />
    </evg-enter>
  );
}

export default function HomeRecyclingContactPage() {
  const { t } = useTranslation();
  const { data: localAuthority, loading } = useLocalAuthority();
  const hasLoaded = !loading && localAuthority;

  return (
    <>
      <h3 className="evg-spacing-bottom-md">
        {t(`homeRecycling.contact.title`)}
      </h3>
      {hasLoaded && (
        <HomeRecyclingContactPageContent localAuthority={localAuthority} />
      )}
    </>
  );
}
