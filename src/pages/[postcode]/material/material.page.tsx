import { Suspense } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import {
  Await,
  Link,
  useLoaderData,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/canvas/Loading/Loading';
import '@/components/content/Icon/Icon';
import '@/components/canvas/LoadingCard/LoadingCard';
import '@/components/canvas/Hero/Hero';
import '@/components/composition/Wrap/Wrap';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import TipContent from '@/components/template/TipContent/TipContent';
import getPropertiesByMaterial from '@/lib/getPropertiesByMaterial';
import useAnalytics from '@/lib/useAnalytics';

import NearbyPlaces from './NearbyPlaces';
import NotRecyclable from './NotRecyclable';
import RecycleAtHome from './RecycleAtHome';
import {
  DeferredMaterialLoaderResponse,
  AwaitedMaterialLoaderResponse,
} from './material.loader';
export function Loading() {
  const { t } = useTranslation();

  return (
    <locator-loading>
      <locator-hero size="full">
        <locator-icon icon="distance" color="muted" />
        <h3 className="diamond-spacing-bottom-lg">{t('material.loading')}</h3>
        <diamond-enter type="fade-in-up" className="diamond-spacing-bottom-md">
          <locator-loading-card />
        </diamond-enter>
        <diamond-enter type="fade-in-up" delay={1}>
          <locator-loading-card />
        </diamond-enter>
      </locator-hero>
    </locator-loading>
  );
}

function MaterialPageContent({
  localAuthority,
  locations,
}: Readonly<Partial<AwaitedMaterialLoaderResponse>>) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const propertiesCollectingThisMaterial = getPropertiesByMaterial(
    localAuthority.properties,
    {
      materials: searchParams.get('materials'),
      category: searchParams.get('category'),
    },
  );
  const recyclableAtHome = propertiesCollectingThisMaterial !== undefined;
  const recyclableNearby = locations.items.length > 0;
  const recyclable = recyclableAtHome || recyclableNearby;

  return (
    <diamond-enter type="fade">
      {recyclable ? (
        <>
          <locator-hero variant="positive" size="full">
            <locator-wrap>
              <diamond-enter type="fade" delay={0.4}>
                <locator-icon icon="tick-circle" />
                <h3>{t('material.hero.yes')}</h3>
              </diamond-enter>
            </locator-wrap>
          </locator-hero>
          <diamond-enter type="fade-in-up" delay={0.25}>
            <locator-wrap>
              <section className="diamond-spacing-bottom-lg">
                <RecycleAtHome
                  allProperties={localAuthority.properties}
                  propertiesCollectingThisMaterial={
                    propertiesCollectingThisMaterial
                  }
                />
              </section>
              <section className="diamond-spacing-bottom-lg">
                <NearbyPlaces locations={locations} />
              </section>
              <section className="diamond-spacing-bottom-lg">
                <RateThisInfo />
              </section>
            </locator-wrap>
          </diamond-enter>
        </>
      ) : (
        <>
          <locator-hero variant="negative" size="reduced">
            <locator-wrap>
              <diamond-enter type="fade" delay={0.4}>
                <locator-icon-text>
                  <locator-icon icon="cross-circle"></locator-icon>
                  <h3 className="diamond-text-size-md">
                    {t('material.hero.no')}
                  </h3>
                </locator-icon-text>
              </diamond-enter>
            </locator-wrap>
          </locator-hero>
          <diamond-enter type="fade-in-up" delay={0.25}>
            <locator-wrap className="diamond-spacing-top-md">
              <section className="diamond-spacing-bottom-lg">
                <NotRecyclable localAuthority={localAuthority} />
              </section>
              <section className="diamond-spacing-bottom-lg">
                <RateThisInfo />
              </section>
            </locator-wrap>
          </diamond-enter>
        </>
      )}
    </diamond-enter>
  );
}

export default function MaterialPage() {
  const { postcode } = useParams();
  const { recordEvent } = useAnalytics();
  const {
    tip: tipPromise,
    localAuthority: localAuthorityPromise,
    locations: locationsPromise,
  } = useLoaderData() as DeferredMaterialLoaderResponse;
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  useEffect(() => {
    if (search) {
      recordEvent({
        category: 'MaterialResult::MaterialSearch',
        action: search,
      });
    }
  }, [search]);

  return (
    <>
      <div slot="layout-main">
        {search && (
          <Link
            to={`/${postcode}/material/search`}
            className="diamond-text-decoration-none"
          >
            <locator-context-header>
              <div className="diamond-text-weight-bold">{search}</div>
              <locator-icon icon="search" color="primary" />
            </locator-context-header>
          </Link>
        )}
        <Suspense fallback={<Loading />}>
          <Await
            resolve={Promise.all([localAuthorityPromise, locationsPromise])}
          >
            {([localAuthority, locations]) => {
              return (
                <MaterialPageContent
                  localAuthority={localAuthority}
                  locations={locations}
                />
              );
            }}
          </Await>
        </Suspense>
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>
          <Suspense fallback={null}>
            <Await resolve={tipPromise}>
              {(tip) => <TipContent tip={tip} />}
            </Await>
          </Suspense>
        </locator-wrap>
      </locator-tip>
    </>
  );
}
