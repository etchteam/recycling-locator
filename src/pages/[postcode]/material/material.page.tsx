import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/canvas/Loading/Loading';
import '@/components/content/Icon/Icon';
import '@/components/canvas/LoadingCard/LoadingCard';
import '@/components/canvas/Hero/Hero';
import '@/components/composition/Wrap/Wrap';
import TipContent from '@/components/content/TipContent/TipContent';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import { useDoorstepCollections } from '@/hooks/useDoorstepCollections';
import { useLocalAuthority } from '@/hooks/useLocalAuthority';
import { useLocations } from '@/hooks/useLocations';
import { useMaterial } from '@/hooks/useMaterial';
import { useSearchParams } from '@/hooks/useSearchParams';
import { useTip } from '@/hooks/useTip';
import getPropertiesByMaterial from '@/lib/getPropertiesByMaterial';

import DoorstepCollection from './DoorstepCollection';
import HazardousWarning from './HazardousWarning';
import NearbyPlaces from './NearbyPlaces';
import RecycleAtHome from './RecycleAtHome';

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
  doorstepCollections,
}: {
  readonly localAuthority: any;
  readonly locations: any;
  readonly material: any;
  readonly doorstepCollections: any[];
}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const propertiesCollectingThisMaterial = getPropertiesByMaterial(
    localAuthority.properties,
    {
      materials: searchParams.get('materials'),
      category: searchParams.get('category'),
    },
  );
  const doorstepCollection =
    doorstepCollections[Math.floor(Math.random() * doorstepCollections.length)];
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
            {doorstepCollection && (
              <DoorstepCollection
                collection={doorstepCollection}
                material={material}
              />
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
          {doorstepCollection && (
            <DoorstepCollection
              collection={doorstepCollection}
              material={material}
            />
          )}
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
  const { postcode } = usePostcode();
  const { recordEvent } = useAnalytics();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const materialId = searchParams.get('materials');

  // Fetch data using hooks
  const localAuthorityResult = useLocalAuthority();
  const locationsResult = useLocations();
  const materialResult = useMaterial(materialId);
  const doorstepCollectionsResult = useDoorstepCollections(materialId);
  const tipResult = useTip({ materialId: materialId || undefined });

  useEffect(() => {
    if (search) {
      recordEvent({
        category: 'MaterialResult::MaterialSearch',
        action: search,
      });
    }
  }, [search]);

  // Combine loading states
  const loading =
    localAuthorityResult.loading ||
    locationsResult.loading ||
    materialResult.loading ||
    doorstepCollectionsResult.loading;

  // Check for errors
  const error =
    localAuthorityResult.error ||
    locationsResult.error ||
    materialResult.error ||
    doorstepCollectionsResult.error;

  return (
    <>
      <div slot="layout-main">
        {search && (
          <Link
            href={`/${postcode}/material/search`}
            className="diamond-text-decoration-none"
          >
            <locator-context-header>
              <div className="diamond-text-weight-bold">{search}</div>
              <locator-icon icon="search" color="primary" />
            </locator-context-header>
          </Link>
        )}
        {loading ? (
          <Loading />
        ) : error ? (
          <div>Error loading material data</div>
        ) : (
          <MaterialPageContent
            localAuthority={localAuthorityResult.data}
            locations={locationsResult.data}
            doorstepCollections={doorstepCollectionsResult.data || []}
            material={materialResult.data}
          />
        )}
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>
          {tipResult.data && <TipContent tip={tipResult.data} />}
        </locator-wrap>
      </locator-tip>
    </>
  );
}
