import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import SchemeContainerSummary from '@/components/content/SchemeContainerSummary/SchemeContainerSummary';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocalAuthority } from '@/hooks/useLocalAuthority';
import sortPropertyTypes from '@/lib/sortPropertyTypes';
import { LocalAuthority } from '@/types/locatorApi';

function Loading() {
  return (
    <evg-enter type="fade-in-up">
      <locator-loading-card />
    </evg-enter>
  );
}

function PropertyList({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { postcode } = usePostcode();
  const properties = sortPropertyTypes(localAuthority.properties);
  const propertyTypes = Object.keys(properties);

  return (
    <evg-enter type="fade">
      {propertyTypes.map((propertyType) => {
        const safePropertyType = encodeURIComponent(propertyType);
        const property = properties[propertyType];
        const containers = property.flatMap((scheme) => scheme.containers);

        return (
          <Link
            href={`/${postcode}/home/collection?propertyType=${safePropertyType}`}
            key={safePropertyType}
          >
            <evg-card className="evg-spacing-bottom-md" radius="sm">
              <evg-card-content>
                <h4 className="evg-spacing-bottom-md">{propertyType}</h4>
                <SchemeContainerSummary containers={containers} limit={3} />
              </evg-card-content>
            </evg-card>
          </Link>
        );
      })}

      <RateThisInfo />
    </evg-enter>
  );
}

export default function HomeRecyclingPage() {
  const { t } = useTranslation();
  const { data: localAuthority, loading } = useLocalAuthority();
  const hasLoaded = !loading && localAuthority;

  return (
    <section className="evg-spacing-bottom-lg">
      <h3>{t('homeRecycling.collections.title')}</h3>
      <p>{t('homeRecycling.collections.help')}</p>

      {!hasLoaded && <Loading />}
      {hasLoaded && <PropertyList localAuthority={localAuthority} />}
    </section>
  );
}
