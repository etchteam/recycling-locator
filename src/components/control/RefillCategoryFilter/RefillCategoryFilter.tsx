import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import { CustomElement } from '@/types/customElement';

const REFILL_CATEGORIES = [
  { key: 'all', icon: 'refill-all', param: null },
  { key: 'Food', icon: 'refill-food', param: 'Food' },
  { key: 'Cleaning', icon: 'refill-cleaning', param: 'Cleaning' },
  { key: 'Personal Care', icon: 'refill-care', param: 'Personal Care' },
] as const;

export default function RefillCategoryFilter() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('categories') ?? null;

  const handleFilter = (param: string | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (param === null) {
      newParams.delete('categories');
    } else {
      newParams.set('categories', param);
    }

    setSearchParams(newParams);
  };

  return (
    <nav aria-label={t('refill.filters.label')}>
      <locator-refill-filter>
        <ul className="list-style-none">
          {REFILL_CATEGORIES.map((cat) => (
            <li key={cat.key}>
              <evg-chip>
                <button
                  type="button"
                  aria-pressed={activeCategory === cat.param}
                  aria-controls="refill-places-count"
                  onClick={() => handleFilter(cat.param)}
                >
                  <locator-icon icon={cat.icon} />
                  {i18n.exists(`refill.filters.${cat.key}_full`) ? (
                    <>
                      <span className="filter-label-short">
                        {t(`refill.filters.${cat.key}`)}
                      </span>
                      <span className="filter-label-full">
                        {t(`refill.filters.${cat.key}_full`)}
                      </span>
                    </>
                  ) : (
                    t(`refill.filters.${cat.key}`)
                  )}
                </button>
              </evg-chip>
            </li>
          ))}
        </ul>
      </locator-refill-filter>
    </nav>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-refill-filter': CustomElement;
    }
  }
}
