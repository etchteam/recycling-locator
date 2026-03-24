import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import TipContent from '@/components/content/TipContent/TipContent';
import CollectionsNav from '@/components/control/CollectionsNav/CollectionsNav';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocalAuthority } from '@/hooks/useLocalAuthority';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { useTip } from '@/hooks/useTip';
import { LocalAuthority } from '@/types/locatorApi';

function BulkyCollectionPageContent({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { t } = useTranslation();
  const collections = localAuthority.bulkyWaste ?? [];

  return (
    <>
      <CollectionsNav
        propertyTypes={Object.keys(localAuthority.properties)}
        hasBulkyWaste={collections.length > 0}
        currentlySelected={t('homeRecycling.bulkyCollection.title')}
      />
      <evg-enter type="fade">
        <evg-section padding="lg">
          <locator-wrap>
            <h3>{t('homeRecycling.bulkyCollection.heading')}</h3>
            <p>{t('homeRecycling.bulkyCollection.info')}</p>
            <hr className="evg-spacing-bottom-lg" />
            {collections.map((collection) => (
              <div className="evg-spacing-bottom-lg" key={collection.id}>
                <h4
                  className="evg-spacing-bottom-md
                evg-text-size-heading-xs evg-text-weight-bold"
                >
                  {collections.length > 1
                    ? collection.name
                    : t('homeRecycling.bulkyCollection.serviceDetails')}
                </h4>
                <evg-list variant="unstyled">
                  <ul>
                    {collection.cost != null && (
                      <li>
                        {t('homeRecycling.bulkyCollection.cost', {
                          cost: collection.cost,
                        })}
                      </li>
                    )}
                    {collection.maxItems != null && (
                      <li>
                        {t('homeRecycling.bulkyCollection.maxItems', {
                          count: collection.maxItems,
                        })}
                      </li>
                    )}
                    {collection.notes && <li>{collection.notes}</li>}
                  </ul>
                </evg-list>
              </div>
            ))}
            {localAuthority.bulkyWasteUri && (
              <>
                <hr className="evg-spacing-bottom-lg" />
                <p className="evg-spacing-bottom-lg">
                  {t('homeRecycling.bulkyCollection.link')}
                </p>

                <evg-button
                  width="full-width"
                  size="sm"
                  className="evg-spacing-bottom-lg"
                >
                  <a
                    href={localAuthority.bulkyWasteUri}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {localAuthority.name}
                    <locator-icon icon="external"></locator-icon>
                  </a>
                </evg-button>
              </>
            )}
            <RateThisInfo />
          </locator-wrap>
        </evg-section>
      </evg-enter>
    </>
  );
}

export default function BulkyCollectionPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const { data: localAuthority, loading: loadingLocalAuthority } =
    useLocalAuthority();
  const { data: tip, loading: loadingTip } = useTip({
    path: `/${postcode}/home/bulky-collection`,
  });
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);

  console.log('la', localAuthority);

  const hasLoadedLocalAuthority = !loadingLocalAuthority && localAuthority;
  const hasLoadedTip = !loadingTip && tip;

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithBackButton
          logoType="icon-only"
          logoHref={`/${postcode}`}
          title={t('homeRecycling.collection.title')}
          subtitle={hasLoadedLocalAuthority ? localAuthority.name : ''}
          backFallback={`/${postcode}/home`}
        />
      </div>
      <div slot="layout-main" ref={layoutRef}>
        {hasLoadedLocalAuthority && (
          <BulkyCollectionPageContent localAuthority={localAuthority} />
        )}
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>{hasLoadedTip && <TipContent tip={tip} />}</locator-wrap>
      </locator-tip>
    </locator-layout>
  );
}
