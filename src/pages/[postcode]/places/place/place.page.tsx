import { useSignal } from '@preact/signals';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst';
import { Suspense } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Await, Form } from 'react-router-dom';
import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/content/Icon/Icon';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import '@/components/control/Details/Details';
import useAnalytics from '@/lib/useAnalytics';
import useFormValidation from '@/lib/useFormValidation';
import { Location, MaterialWithCategory } from '@/types/locatorApi';

import { usePlaceLoaderData } from './place.loader';

export function placeHasMaterialName(
  search: string,
  materials: MaterialWithCategory[] = [],
): boolean {
  return materials.some((material) => {
    const materialName = material.name.toLowerCase();
    const categoryName = material.category?.name.toLowerCase();
    const safeSearch = search.toLowerCase();
    return safeSearch === materialName || safeSearch === categoryName;
  });
}

function Loading() {
  return (
    <diamond-enter type="fade-in-up">
      <locator-loading-card />
    </diamond-enter>
  );
}

function PlacePageContent({ location }: { readonly location: Location }) {
  const { t } = useTranslation();
  const form = useFormValidation('search');
  const { recordEvent } = useAnalytics();
  const search = useSignal<string>('');
  const materials = location.locations?.flatMap((l) => l.materials);
  const materialCategories = groupBy(materials, 'category.name');
  const materialCategoryNames = Object.keys(materialCategories);
  const hasSearchedForMaterial =
    search.value && placeHasMaterialName(search.value, materials);

  if (location.error) {
    throw new Error(location.error);
  }

  const handleSearch = (event) => {
    event.preventDefault();
    const form = event?.submitter?.form ?? undefined;
    const value = new FormData(form).get('search') as string;

    if (value) {
      recordEvent({
        category: 'PlaceDetails::MaterialSearch',
        action: value,
      });

      search.value = value;
    }
  };

  if (materialCategoryNames.length === 1) {
    const materials = uniqBy(
      materialCategories[materialCategoryNames[0]],
      'name',
    );

    return (
      <diamond-enter type="fade">
        <h3 className="diamond-spacing-bottom-md">
          {materialCategoryNames[0] === 'Others' ? (
            t('place.recycle.theseItemsAreRecycled', {
              count: materials.length,
            })
          ) : (
            <Trans
              i18nKey={'place.recycle.singleCategory'}
              components={{ bold: <strong /> }}
              values={{ category: materialCategoryNames[0] }}
            />
          )}
        </h3>
        <diamond-card border radius>
          <ul className="diamond-text-size-sm">
            {materials.map((material) => (
              <li key={material.name}>{material.name}</li>
            ))}
          </ul>
        </diamond-card>
      </diamond-enter>
    );
  }

  if (materialCategoryNames.length <= 3) {
    return (
      <diamond-enter type="fade">
        <h3 id="material-search-title" className="diamond-spacing-bottom-md">
          {t('place.recycle.theseItemsAreRecycled')}
        </h3>

        {materialCategoryNames.map((category) => (
          <diamond-card
            className="diamond-spacing-bottom-sm"
            key={category}
            border
            radius
          >
            {upperFirst(category)}
            <ul className="diamond-text-size-sm">
              {uniqBy(materialCategories[category], 'name').map((material) => (
                <li key={material.name}>{material.name}</li>
              ))}
            </ul>
          </diamond-card>
        ))}
      </diamond-enter>
    );
  }

  return (
    <diamond-enter type="fade">
      <h3 id="material-search-title" className="diamond-spacing-bottom-md">
        {t('place.recycle.title')}
      </h3>

      <diamond-enter type="fade" className="layer-one">
        <Form method="get" onSubmit={handleSearch}>
          <MaterialSearchInput
            inputLabelledBy="material-search-title"
            handleBlur={form.handleBlur}
            handleInput={form.handleInput}
            handleReset={() => (search.value = '')}
            valid={form.valid.value}
          ></MaterialSearchInput>
        </Form>
      </diamond-enter>

      <div className="diamond-spacing-top-sm diamond-spacing-bottom-md">
        {search.value && (
          <diamond-enter type="fade">
            <diamond-card
              className={`theme-${hasSearchedForMaterial ? 'positive' : 'negative'}`}
              padding="sm"
              radius
            >
              <locator-icon-text>
                <locator-icon
                  icon={`${hasSearchedForMaterial ? 'tick' : 'cross'}-circle`}
                ></locator-icon>
                <p className="diamond-text-size-sm">
                  {t(
                    `place.recycle.search.${hasSearchedForMaterial ? 'positive' : 'negative'}`,
                  )}
                </p>
              </locator-icon-text>
            </diamond-card>
          </diamond-enter>
        )}
      </div>

      <diamond-enter type="fade-in-up" delay={0.25}>
        {materialCategoryNames.map((category) => (
          <locator-details key={category} className="diamond-spacing-bottom-sm">
            <details>
              <summary>
                {upperFirst(category)}
                <locator-icon icon="expand" />
              </summary>
              <ul className="diamond-text-size-sm">
                {uniqBy(materialCategories[category], 'name').map(
                  (material) => (
                    <li key={material.name}>{material.name}</li>
                  ),
                )}
              </ul>
            </details>
          </locator-details>
        ))}
      </diamond-enter>
    </diamond-enter>
  );
}

export default function PlacePage() {
  const { location: locationPromise } = usePlaceLoaderData();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={locationPromise}>
        {(location) => <PlacePageContent location={location} />}
      </Await>
    </Suspense>
  );
}
