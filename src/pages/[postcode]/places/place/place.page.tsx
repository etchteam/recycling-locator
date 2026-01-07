import { useSignal } from '@preact/signals';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'wouter-preact';

import MaterialSearchBanner from '@/components/content/MaterialSearchBanner/MaterialSearchBanner';
import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import RateThisInfo from '@/components/control/RateThisInfo/RateThisInfo';
import useAnalytics from '@/hooks/useAnalytics';
import useFormValidation from '@/hooks/useFormValidation';
import { usePlace } from '@/hooks/usePlace';
import materialNameSearch from '@/lib/materialNameSearch';
import { Location } from '@/types/locatorApi';

function Loading() {
  return (
    <evg-enter type="fade-in-up">
      <locator-loading-card />
    </evg-enter>
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
  const materialRecyclableHere =
    search.value && materialNameSearch(search.value, materials);

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

      // Wait before setting the new value to make it clear the UI has changed
      search.value = '';
      setTimeout(() => {
        search.value = value;
      }, 200);
    }
  };

  if (materialCategoryNames.length === 1) {
    const materials = uniqBy(
      materialCategories[materialCategoryNames[0]],
      'name',
    );

    return (
      <evg-enter type="fade">
        <h3 className="evg-spacing-bottom-md">
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
        <evg-card radius="sm">
          <evg-card-content>
            <ul className="evg-text-size-body-xs">
              {materials.map((material) => (
                <li key={material.name}>{material.name}</li>
              ))}
            </ul>
          </evg-card-content>
        </evg-card>
      </evg-enter>
    );
  }

  if (materialCategoryNames.length <= 3) {
    return (
      <evg-enter type="fade">
        <h3 id="material-search-title" className="evg-spacing-bottom-md">
          {t('place.recycle.theseItemsAreRecycled')}
        </h3>

        {materialCategoryNames.map((category) => (
          <evg-card
            className="evg-spacing-bottom-sm"
            key={category}
            radius="sm"
          >
            <evg-card-content>
              {upperFirst(category)}
              <ul className="evg-text-size-body-xs">
                {uniqBy(materialCategories[category], 'name').map(
                  (material) => (
                    <li key={material.name}>{material.name}</li>
                  ),
                )}
              </ul>
            </evg-card-content>
          </evg-card>
        ))}
      </evg-enter>
    );
  }

  return (
    <evg-enter type="fade">
      <h3 id="material-search-title" className="evg-spacing-bottom-md">
        {t('place.recycle.title')}
      </h3>

      <evg-enter type="fade" className="layer-one">
        <form onSubmit={handleSearch}>
          <MaterialSearchInput
            inputLabelledBy="material-search-title"
            handleInput={form.handleInput}
            handleReset={() => (search.value = '')}
            valid={form.valid.value}
            checkMaterial
          ></MaterialSearchInput>
        </form>
      </evg-enter>

      <div className="evg-spacing-top-sm evg-spacing-bottom-md">
        <MaterialSearchBanner
          search={search.value}
          searchResult={materialRecyclableHere}
          message={String(
            t(
              `place.recycle.search.${materialRecyclableHere ? 'positive' : 'negative'}`,
            ),
          )}
        ></MaterialSearchBanner>
      </div>

      <evg-enter type="fade-in-up" delay={0.25}>
        {materialCategoryNames.map((category) => (
          <locator-details key={category} className="evg-spacing-bottom-sm">
            <details>
              <summary>
                {upperFirst(category)}
                <locator-icon icon="expand" />
              </summary>
              <ul className="evg-text-size-body-xs">
                {uniqBy(materialCategories[category], 'name').map(
                  (material) => (
                    <li key={material.name}>{material.name}</li>
                  ),
                )}
              </ul>
            </details>
          </locator-details>
        ))}
      </evg-enter>
    </evg-enter>
  );
}

export default function PlacePage() {
  const params = useParams<{ placeName: string; placePostcode: string }>();
  const { data: location, loading } = usePlace(
    params.placeName,
    params.placePostcode,
  );

  if (loading || !location) {
    return <Loading />;
  }

  return (
    <>
      <PlacePageContent location={location} />
      <evg-enter className="evg-spacing-top-md" type="fade" delay={0.25}>
        <RateThisInfo />
      </evg-enter>
    </>
  );
}
