import { useEffect, useState } from 'preact/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import LocationForm from '@/components/control/LocationForm/LocationForm';
import LocatorApi from '@/lib/LocatorApi';
import { captureException } from '@/lib/sentry';
import tArray from '@/lib/tArray';
import { MaterialWithCategory } from '@/types/locatorApi';

async function getMaterialsOrCategoryNameById(
  materials: string,
  category: string,
): Promise<string> {
  try {
    const materialData =
      await LocatorApi.getInstance().get<MaterialWithCategory[]>('materials');

    if (category) {
      const foundMaterialWithCategory = materialData.find(
        (m) => String(m.category.id) === category,
      );
      return foundMaterialWithCategory?.category?.name ?? '';
    }

    // The user can pass multiple materials separated by commas
    // But we have no way to form a sensible search term from that
    // So we'll just use the first material instead
    const materialId = materials.split(',')[0];
    const foundMaterial = materialData.find((m) => String(m.id) === materialId);
    return foundMaterial?.name ?? '';
  } catch (error) {
    captureException(error, { component: 'MaterialStartPage' });
  }
}

/**
 * Starting with a pre-filled material search form, the user only has to enter a location to
 * skip straight to the material result page.
 *
 * Examples of valid start paths:
 * - /material?materials=1&search=Plastic drinks bottles
 * - /material?materials=1,2,3search=Plastic wrapping
 * - /material?category=1&search=Cardboard
 * - /material?category=1 (The search term will be resolved if none is provided)
 */
export default function MaterialStartPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const materials = searchParams.get('materials');
  const category = searchParams.get('category');
  const [search, setSearch] = useState(searchParams.get('search'));

  useEffect(() => {
    async function findMaterialSearchTerm() {
      const searchTerm = await getMaterialsOrCategoryNameById(
        materials,
        category,
      );

      setSearch(searchTerm);
    }

    if (!search && (materials || category)) {
      // We haven't been given a search term so we'll have to do some work to find it
      findMaterialSearchTerm();
    }
  }, [search]);

  return (
    <>
      <h2>
        <Trans
          i18nKey={'start.material.title'}
          components={{ bold: <strong /> }}
          values={{ material: search?.toLocaleLowerCase() }}
        />
      </h2>
      <LocationForm action="/material">
        {search && <input type="hidden" name="search" value={search} />}
        {materials && (
          <input type="hidden" name="materials" value={materials} />
        )}
        {category && <input type="hidden" name="category" value={category} />}
      </LocationForm>
      <hr className="evg-spacing-top-lg" />
      <p className="evg-spacing-top-md">{t('start.aside.paragraph')}</p>
      <ul>
        {tArray('start.aside.list').map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}
