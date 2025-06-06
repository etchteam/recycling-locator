import { Suspense } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { Await, Link, useParams } from 'react-router';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/canvas/Card/Card';

import '@/components/canvas/LoadingCard/LoadingCard';
import '@/components/content/Container/Container';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import SchemeContainerSummary from '@/components/template/SchemeContainerSummary/SchemeContainerSummary';
import sortPropertyTypes from '@/lib/sortPropertyTypes';
import { LocalAuthority } from '@/types/locatorApi';

import { useHomeRecyclingLoaderData } from './home.loader';

function Loading() {
  return (
    <diamond-enter type="fade-in-up">
      <locator-loading-card />
    </diamond-enter>
  );
}

function PropertyList({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { postcode } = useParams();
  const properties = sortPropertyTypes(localAuthority.properties);
  const propertyTypes = Object.keys(properties);

  return (
    <diamond-enter type="fade">
      {propertyTypes.map((propertyType) => {
        const safePropertyType = encodeURIComponent(propertyType);
        const property = properties[propertyType];
        const containers = property.flatMap((scheme) => scheme.containers);

        return (
          <Link
            to={`/${postcode}/home/collection?propertyType=${safePropertyType}`}
            key={safePropertyType}
          >
            <diamond-card className="diamond-spacing-bottom-md" border radius>
              <h4 className="diamond-spacing-bottom-md">{propertyType}</h4>
              <SchemeContainerSummary containers={containers} limit={3} />
            </diamond-card>
          </Link>
        );
      })}

      <RateThisInfo />
    </diamond-enter>
  );
}

export default function HomeRecyclingPage() {
  const { t } = useTranslation();
  const { localAuthority } = useHomeRecyclingLoaderData();

  return (
    <section className="diamond-spacing-bottom-lg">
      <h3>{t('homeRecycling.collections.title')}</h3>
      <p>{t('homeRecycling.collections.help')}</p>

      <Suspense fallback={<Loading />}>
        <Await resolve={localAuthority}>
          {(la) => <PropertyList localAuthority={la} />}
        </Await>
      </Suspense>
    </section>
  );
}
