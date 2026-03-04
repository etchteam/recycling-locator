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
import { useMaterialSearchTerm } from '@/hooks/useMaterialSearchTerm';
import { useTip } from '@/hooks/useTip';
import getPropertiesByMaterial from '@/lib/getPropertiesByMaterial';

export default function MaterialPage() {
  const { postcode } = usePostcode();
  const { recordEvent } = useAnalytics();
  const [searchParams] = useSearchParams();
  const materialId = searchParams.get('materials');
  const la = useLocalAuthority();
  const locations = useLocations();
  const { searchTerm, material, category } = useMaterialSearchTerm();
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
    doorstepCollections?.data?.[
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
            className="text-decoration-none"
          >
            <locator-context-header>
              <div className="evg-text-weight-bold">{searchTerm}</div>
              <locator-icon icon="search" color="primary" />
            </locator-context-header>
          </Link>
        )}
        <evg-enter type="fade">
          <MaterialSearchStatus
            hazardous={hazardous}
            nonRecyclable={nonRecyclable}
            hasRecyclingOptions={Boolean(hasRecyclingOptions)}
            loading={
              la?.loading ||
              material?.loading ||
              category?.loading ||
              locations?.loading ||
              doorstepCollections?.loading
            }
          />

          <div className="evg-spacing-bottom-lg" />

          <evg-enter type="fade-in-up" delay={0.25}>
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

              <evg-enter type="fade-in-up" delay={1}>
                <RateThisInfo />
                <div className="evg-spacing-bottom-lg" />
              </evg-enter>
            </locator-wrap>
          </evg-enter>
        </evg-enter>
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>
          {tip?.data && <TipContent tip={tip?.data} />}
        </locator-wrap>
      </locator-tip>
    </>
  );
}
