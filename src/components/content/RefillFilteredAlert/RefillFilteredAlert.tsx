import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import { CustomElement } from '@/types/customElement';

interface RefillFilteredAlertProps {
  readonly count: number;
}

export default function RefillFilteredAlert({
  count,
}: RefillFilteredAlertProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = searchParams.get('categories');

  if (!categories) {
    return null;
  }

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('categories');
    setSearchParams(newParams);
  };

  const variant = count > 0 ? 'positive-light' : 'negative-light';

  return (
    <evg-enter type="fade">
      <evg-alert variant={variant}>
        <locator-refill-alert>
          <p>
            <Trans
              i18nKey="refill.filters.filteredCount"
              components={{ bold: <strong /> }}
              values={{
                count,
                category: t(`refill.filters.${categories}`),
              }}
            />
          </p>
          <evg-button variant="ghost" size="sm">
            <button type="button" onClick={handleClearFilters}>
              {t('refill.filters.clearFilters')}
            </button>
          </evg-button>
        </locator-refill-alert>
      </evg-alert>
    </evg-enter>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-refill-alert': CustomElement;
    }
  }
}
