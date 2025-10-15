import { Suspense } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import {
  Await,
  Form,
  useLoaderData,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/composition/Wrap/Wrap';
import '@/components/composition/BorderedList/BorderedList';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import PopularMaterials from '@/components/template/PopularMaterials/PopularMaterials';
import TipContent from '@/components/template/TipContent/TipContent';
import useFormValidation from '@/lib/useFormValidation';
import { Material } from '@/types/locatorApi';

import { MaterialSearchLoaderResponse } from './search.loader';

export default function MaterialSearchPage() {
  const { t } = useTranslation();
  const { postcode } = useParams();
  const location = useLocation();
  const form = useFormValidation('search');
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const { popularMaterials: popularMaterialsPromise, tip: tipPromise } =
    useLoaderData() as MaterialSearchLoaderResponse;

  useEffect(() => {
    form.submitting.value = false;
  }, [search, location]);

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
              <Form method="post" onSubmit={form.handleSubmit}>
                <diamond-form-group>
                  <label htmlFor="locator-material-input">
                    {t('actions.searchAgain')}
                  </label>
                  <MaterialSearchInput
                    handleInput={form.handleInput}
                    submitting={form.submitting.value}
                    valid={form.valid.value}
                    includeFeedbackForm
                  ></MaterialSearchInput>
                </diamond-form-group>
              </Form>
            </diamond-enter>

            <Suspense fallback={/* No loading UI necessary */ null}>
              <Await resolve={popularMaterialsPromise}>
                {(popularMaterials) => (
                  <PopularMaterials
                    materials={popularMaterials}
                    generatePath={generatePopularMaterialPath}
                  />
                )}
              </Await>
            </Suspense>
          </diamond-section>
        </locator-wrap>
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
