import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import { IconAttributes } from '@/components/content/Icon/Icon';
import { REFILL_CATEGORIES } from '@/lib/refillCategories';
import { CustomElement } from '@/types/customElement';

function FilterChip({
  icon,
  filterKey,
  pressed,
  onClick,
}: {
  readonly icon: IconAttributes['icon'];
  readonly filterKey: string;
  readonly pressed: boolean;
  readonly onClick: () => void;
}) {
  const { t, i18n } = useTranslation();

  return (
    <evg-chip>
      <button
        type="button"
        aria-pressed={pressed}
        aria-controls="refill-places-count"
        onClick={onClick}
      >
        <locator-icon icon={icon} />
        {i18n.exists(`refill.filters.${filterKey}_full`) ? (
          <>
            <span className="filter-label-short">
              {t(`refill.filters.${filterKey}`)}
            </span>
            <span className="filter-label-full">
              {t(`refill.filters.${filterKey}_full`)}
            </span>
          </>
        ) : (
          t(`refill.filters.${filterKey}`)
        )}
      </button>
    </evg-chip>
  );
}

export default function RefillCategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
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
          <li>
            <FilterChip
              icon="refill-all"
              filterKey="all"
              pressed={activeCategory === null}
              onClick={() => handleFilter(null)}
            />
          </li>
          {REFILL_CATEGORIES.map((cat) => (
            <li key={cat.key}>
              <FilterChip
                icon={cat.slug}
                filterKey={cat.key}
                pressed={activeCategory === cat.param}
                onClick={() => handleFilter(cat.param)}
              />
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
