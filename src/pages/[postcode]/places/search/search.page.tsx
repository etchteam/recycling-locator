import { useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'wouter-preact';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import PopularMaterials from '@/components/content/PopularMaterials/PopularMaterials';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useFormValidation from '@/hooks/useFormValidation';
import { usePopularMaterials } from '@/hooks/usePopularMaterials';
import { Material } from '@/types/locatorApi';

export default function PlacesSearchPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const [location] = useLocation();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const autofocus = searchParams.get('autofocus') === 'true';
  const form = useFormValidation('search');
  const { data: popularMaterials, loading } = usePopularMaterials();

  useEffect(() => {
    form.submitting.value = false;
  }, [search, location]);

  function generatePopularMaterialPath(material: Material) {
    const placesSearchParams = new URLSearchParams();
    placesSearchParams.set('materials', material.id);
    placesSearchParams.set('search', material.name);
    return `/${postcode}/places?${placesSearchParams.toString()}`;
  }

  return (
    <diamond-section padding="lg">
      <locator-wrap>
        <h3 id="places-search-label">{t('places.search.label')}</h3>
        <diamond-enter type="fade" className="layer-one">
          <form onSubmit={form.handleSubmit}>
            <diamond-form-group>
              <MaterialSearchInput
                inputLabelledBy="places-search-label"
                autofocus={autofocus}
                handleInput={form.handleInput}
                submitting={form.submitting.value}
                valid={form.valid.value}
                checkMaterial
                includeFeedbackForm
              ></MaterialSearchInput>
            </diamond-form-group>
          </form>
        </diamond-enter>
        {!loading && popularMaterials && (
          <PopularMaterials
            materials={popularMaterials}
            generatePath={generatePopularMaterialPath}
          />
        )}
      </locator-wrap>
    </diamond-section>
  );
}
