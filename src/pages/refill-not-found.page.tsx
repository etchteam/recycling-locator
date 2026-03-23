import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import LocationForm from '@/components/control/LocationForm/LocationForm';

/**
 * 404 page for refill routes without a postcode.
 * e.g. /refill/unknown-route
 * Shows a location form with action="/refill" so users stay in the refill flow.
 */
export default function RefillStartNotFoundPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');

  const title =
    reason === 'notInTheUK'
      ? t('notFound.title.notInTheUK')
      : t('notFound.title.default');

  return (
    <>
      <h2>{title}</h2>
      <LocationForm
        label={t('notFound.label')}
        cta={t('notFound.cta')}
        action="/refill"
      />
    </>
  );
}
