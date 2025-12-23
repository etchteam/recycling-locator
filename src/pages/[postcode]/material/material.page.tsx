import { useEffect } from 'preact/hooks';
import { Link, useSearchParams } from 'wouter-preact';

import MaterialSearchSections from '@/components/content/MaterialSearchSections/MaterialSearchSections';
import MaterialSearchStatus from '@/components/content/MaterialSearchStatus/MaterialSearchStatus';
import TipContent from '@/components/content/TipContent/TipContent';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import { useDoorstepCollections } from '@/hooks/useDoorstepCollections';
import { useLocalAuthority } from '@/hooks/useLocalAuthority';
import { useLocations } from '@/hooks/useLocations';
import { useMaterial } from '@/hooks/useMaterial';
import { useTip } from '@/hooks/useTip';
import getPropertiesByMaterial from '@/lib/getPropertiesByMaterial';

export default function MaterialPage() {
  const { postcode } = usePostcode();
  const { recordEvent } = useAnalytics();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');
  const materialId = searchParams.get('materials');
  const la = useLocalAuthority();
  const locations = useLocations();
  const material = useMaterial(materialId);
  const doorstepCollections = useDoorstepCollections(materialId);
  const tip = useTip({ materialId });
  const propertiesCollectingThisMaterial = getPropertiesByMaterial(
    la?.data?.properties,
    {
      materials: searchParams.get('materials'),
      category: searchParams.get('category'),
    },
  );
  const doorstepCollection =
    doorstepCollections?.[
      Math.floor(Math.random() * doorstepCollections?.data?.length)
    ];
  const nonRecyclable = material?.data?.nonRecyclable;
  const hazardous = material?.data?.hazardous;
  const hasRecyclingOptions =
    propertiesCollectingThisMaterial ||
    locations?.data?.items.length > 0 ||
    doorstepCollection;

  useEffect(() => {
    if (searchTerm) {
      recordEvent({
        category: 'MaterialResult::MaterialSearch',
        action: searchTerm,
      });
    }
  }, [searchTerm, recordEvent]);

  return (
    <>
      <div slot="layout-main">
        {searchTerm && (
          <Link
            href={`/${postcode}/material/search`}
            className="diamond-text-decoration-none"
          >
            <locator-context-header>
              <div className="diamond-text-weight-bold">{searchTerm}</div>
              <locator-icon icon="search" color="primary" />
            </locator-context-header>
          </Link>
        )}
        <diamond-enter type="fade">
          <MaterialSearchStatus
            hazardous={hazardous}
            nonRecyclable={nonRecyclable}
            hasRecyclingOptions={hasRecyclingOptions}
            loading={
              la?.loading ||
              material?.loading ||
              locations?.loading ||
              doorstepCollections?.loading
            }
          />

          <div className="diamond-spacing-bottom-lg" />

          <diamond-enter type="fade-in-up" delay={0.25}>
            <locator-wrap>
              <MaterialSearchSections
                la={la}
                locations={locations}
                doorstepCollections={doorstepCollections}
                doorstepCollection={doorstepCollection}
                material={material}
                propertiesCollectingThisMaterial={
                  propertiesCollectingThisMaterial
                }
                hazardous={hazardous}
                nonRecyclable={nonRecyclable}
              />

              <diamond-enter type="fade-in-up" delay={1}>
                <RateThisInfo />
                <div className="diamond-spacing-bottom-lg" />
              </diamond-enter>
            </locator-wrap>
          </diamond-enter>
        </diamond-enter>
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>
          {tip?.data && <TipContent tip={tip?.data} />}
        </locator-wrap>
      </locator-tip>
    </>
  );
}
