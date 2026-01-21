import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import LocationForm from '@/components/control/LocationForm/LocationForm';
import { useMaterialSearchTerm } from '@/hooks/useMaterialSearchTerm';
import tArray from '@/lib/tArray';

/**
 * Starting with a pre-filled material search form, the user only has to enter a location to
 * skip straight to the material result page.
 *
 * Examples of valid start paths:
 * - /material?materials=1&search=Plastic drinks bottles
 * - /material?materials=1,2,3&search=Plastic wrapping
 * - /material?category=1&search=Cardboard
 * - /material?category=1 (The search term will be resolved if none is provided)
 */
export default function MaterialStartPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const materials = searchParams.get('materials');
  const category = searchParams.get('category');
  const { searchTerm } = useMaterialSearchTerm();

  return (
    <>
      <h2>
        <Trans
          i18nKey={'start.material.title'}
          components={{ bold: <strong /> }}
          values={{ material: searchTerm?.toLocaleLowerCase() }}
        />
      </h2>
      <LocationForm action="/material">
        {searchTerm && <input type="hidden" name="search" value={searchTerm} />}
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
