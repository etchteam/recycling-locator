import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import LocationForm from '@/components/control/LocationForm/LocationForm';

/**
 * 404 Not Found page for refill routes without a postcode.
 * Uses /refill as the form action to keep users in the refill flow.
 */
export default function RefillNotFoundPage() {
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
