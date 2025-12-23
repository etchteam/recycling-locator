import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'wouter-preact';

import PopularMaterials from '@/components/content/PopularMaterials/PopularMaterials';
import TipContent from '@/components/content/TipContent/TipContent';
import MaterialSearchForm from '@/components/control/MaterialSearchForm/MaterialSearchForm';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { usePopularMaterials } from '@/hooks/usePopularMaterials';
import { useTip } from '@/hooks/useTip';
import { Material } from '@/types/locatorApi';

export default function MaterialSearchPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const [location] = useLocation();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const { data: popularMaterials } = usePopularMaterials();
  const { data: tip } = useTip({ path: location });

  function generatePopularMaterialPath(material: Material) {
    const materialSearchParams = new URLSearchParams();
    materialSearchParams.set('materials', material.id);
    materialSearchParams.set('search', material.name);
    return `/${postcode}/material?${materialSearchParams.toString()}`;
  }

  return (
    <>
      <div slot="layout-main">
        <locator-wrap>
          <diamond-section padding="lg">
            <diamond-enter type="fade" className="layer-one">
              {search && (
                <h3>
                  {t('material.search.notFound')}{' '}
                  <span className="diamond-text-weight-bold">
                    {search.toLocaleLowerCase()}
                  </span>
                </h3>
              )}
              <MaterialSearchForm
                path="material"
                label={t('actions.searchAgain')}
                defaultValue={search ?? ''}
                defaultInvalid={!!search}
                checkMaterial
                includeFeedbackForm
              />
            </diamond-enter>

            {popularMaterials && (
              <PopularMaterials
                materials={popularMaterials}
                generatePath={generatePopularMaterialPath}
              />
            )}
          </diamond-section>
        </locator-wrap>
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>{tip && <TipContent tip={tip} />}</locator-wrap>
      </locator-tip>
    </>
  );
}
