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

import HazardousWarning from './HazardousWarning';
import NearbyPlaces from './NearbyPlaces';
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

export function HeroFormatted({
  variant,
  title,
}: {
  readonly variant: 'negative' | 'positive' | 'hazardous';
  readonly title: string;
}) {
  if (variant === 'negative') {
    return (
      <locator-hero variant="negative" size="reduced">
        <locator-wrap>
          <diamond-enter type="fade" delay={0.4}>
            <locator-icon-text>
              <locator-icon icon="cross-circle" />
              <h3 className="diamond-text-size-md">{title}</h3>
            </locator-icon-text>
          </diamond-enter>
        </locator-wrap>
      </locator-hero>
    );
  }
  return (
    <locator-hero variant={variant} size="full">
      <locator-wrap>
        <diamond-enter type="fade" delay={0.4}>
          <locator-icon
            icon={variant === 'positive' ? 'tick-circle' : 'info'}
          />
          <h3>{title}</h3>
        </diamond-enter>
      </locator-wrap>
    </locator-hero>
  );
}

function MaterialPageContent({
  localAuthority,
  locations,
  material,
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
  const recyclableOptions = recyclableAtHome || recyclableNearby;
  const nonRecyclable = material.nonRecyclable;
  const hazardous = material.hazardous;

  if (nonRecyclable) {
    return (
      <diamond-enter type="fade">
        <HeroFormatted
          variant={hazardous ? 'hazardous' : 'negative'}
          title={
            hazardous ? t('material.hero.hazardous') : t('material.hero.no')
          }
        />
        <diamond-enter type="fade-in-up" delay={0.25}>
          <locator-wrap className={!hazardous ? 'diamond-spacing-top-lg' : ''}>
            {hazardous ? (
              <section className="diamond-spacing-bottom-lg">
                <HazardousWarning localAuthority={localAuthority} />
              </section>
            ) : null}
            {propertiesCollectingThisMaterial && (
              <section className="diamond-spacing-bottom-lg">
                <RecycleAtHome
                  allProperties={localAuthority.properties}
                  propertiesCollectingThisMaterial={
                    propertiesCollectingThisMaterial
                  }
                  recyclable={false}
                />
              </section>
            )}
            {locations.items.length > 0 && (
              <section className="diamond-spacing-bottom-lg">
                <NearbyPlaces locations={locations} recyclable={false} />
              </section>
            )}
            <section className="diamond-spacing-bottom-lg">
              <RateThisInfo />
            </section>
          </locator-wrap>
        </diamond-enter>
      </diamond-enter>
    );
  }

  return (
    <diamond-enter type="fade">
      <HeroFormatted
        variant={recyclableOptions ? 'positive' : 'negative'}
        title={
          recyclableOptions
            ? t('material.hero.yes')
            : t('material.hero.noOptions')
        }
      />
      <diamond-enter type="fade-in-up" delay={0.25}>
        <locator-wrap
          className={!recyclableOptions && 'diamond-spacing-top-lg'}
        >
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
    material: materialPromise,
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
            resolve={Promise.all([
              localAuthorityPromise,
              locationsPromise,
              materialPromise,
            ])}
          >
            {([localAuthority, locations, material]) => {
              return (
                <MaterialPageContent
                  localAuthority={localAuthority}
                  locations={locations}
                  material={material}
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
