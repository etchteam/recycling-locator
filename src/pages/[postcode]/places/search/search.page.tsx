import { Suspense } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import {
  Await,
  Form,
  useLoaderData,
  useParams,
  useSearchParams,
} from 'react-router';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import PopularMaterials from '@/components/template/PopularMaterials/PopularMaterials';
import useFormValidation from '@/lib/useFormValidation';
import { Material } from '@/types/locatorApi';

import { PlacesSearchLoaderResponse } from './search.loader';

export default function PlacesSearchPage() {
  const { t } = useTranslation();
  const { postcode } = useParams();
  const { popularMaterials: popularMaterialsPromise } =
    useLoaderData() as PlacesSearchLoaderResponse;
  const [searchParams] = useSearchParams();
  const autofocus = searchParams.get('autofocus') === 'true';
  const form = useFormValidation('search');

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
          <Form method="post" onSubmit={form.handleSubmit}>
            <diamond-form-group>
              <MaterialSearchInput
                inputLabelledBy="places-search-label"
                autofocus={autofocus}
                handleBlur={form.handleBlur}
                handleInput={form.handleInput}
                submitting={form.submitting.value}
                valid={form.valid.value}
                includeFeedbackForm
              ></MaterialSearchInput>
            </diamond-form-group>
          </Form>
        </diamond-enter>
        <Suspense fallback={null}>
          <Await resolve={popularMaterialsPromise}>
            {(popularMaterials) => (
              <PopularMaterials
                materials={popularMaterials}
                generatePath={generatePopularMaterialPath}
              />
            )}
          </Await>
        </Suspense>
      </locator-wrap>
    </diamond-section>
  );
}
