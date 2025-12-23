import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import PopularMaterials from '@/components/content/PopularMaterials/PopularMaterials';
import MaterialSearchForm from '@/components/control/MaterialSearchForm/MaterialSearchForm';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { usePopularMaterials } from '@/hooks/usePopularMaterials';
import { Material } from '@/types/locatorApi';

export default function PlacesSearchPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const [searchParams] = useSearchParams();
  const autofocus = searchParams.get('autofocus') === 'true';
  const { data: popularMaterials, loading } = usePopularMaterials();

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
          <MaterialSearchForm
            path="places"
            inputLabelledBy="places-search-label"
            autofocus={autofocus}
            checkMaterial
            includeFeedbackForm
          />
          {!loading && popularMaterials && (
            <PopularMaterials
              materials={popularMaterials}
              generatePath={generatePopularMaterialPath}
            />
          )}
        </diamond-enter>
      </locator-wrap>
    </diamond-section>
  );
}
