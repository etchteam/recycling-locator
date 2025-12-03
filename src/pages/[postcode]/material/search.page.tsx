import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter-preact';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/composition/Wrap/Wrap';
import '@/components/composition/BorderedList/BorderedList';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import PopularMaterials from '@/components/template/PopularMaterials/PopularMaterials';
import TipContent from '@/components/template/TipContent/TipContent';
import { usePopularMaterials } from '@/hooks/usePopularMaterials';
import { useSearchParams } from '@/hooks/useSearchParams';
import { useTip } from '@/hooks/useTip';
import { usePostcode } from '@/lib/PostcodeContext';
import useFormValidation from '@/lib/useFormValidation';
import { Material } from '@/types/locatorApi';

export default function MaterialSearchPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const [location] = useLocation();
  const form = useFormValidation('search');
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  // Fetch data using hooks
  const popularMaterialsResult = usePopularMaterials();
  const tipResult = useTip({ path: location });

  useEffect(() => {
    form.submitting.value = false;
  }, [search, location]);

  function generatePopularMaterialPath(material: Material) {
    const materialSearchParams = new URLSearchParams();
    materialSearchParams.set('materials', material.id);
    materialSearchParams.set('search', material.name);
    return `/${postcode}/material?${materialSearchParams.toString()}`;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    await form.handleSubmit(e);
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
              <form method="post" onSubmit={handleSubmit}>
                <diamond-form-group>
                  <label htmlFor="locator-material-input">
                    {t('actions.searchAgain')}
                  </label>
                  <MaterialSearchInput
                    handleInput={form.handleInput}
                    submitting={form.submitting.value}
                    valid={form.valid.value}
                    defaultValue={search ?? ''}
                    defaultInvalid={!!search}
                    checkMaterial
                    includeFeedbackForm
                  ></MaterialSearchInput>
                </diamond-form-group>
              </form>
            </diamond-enter>

            {popularMaterialsResult.data && (
              <PopularMaterials
                materials={popularMaterialsResult.data}
                generatePath={generatePopularMaterialPath}
              />
            )}
          </diamond-section>
        </locator-wrap>
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>
          {tipResult.data && <TipContent tip={tipResult.data} />}
        </locator-wrap>
      </locator-tip>
    </>
  );
}
