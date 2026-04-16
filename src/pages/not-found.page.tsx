import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import LocationForm from '../components/control/LocationForm/LocationForm';

/**
 * 404 page for recycling routes without a postcode.
 * e.g. /not-found, /unknown-route
 * Shows a location form so users can enter a postcode to get started.
 */
export default function NotFoundPage() {
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
      <LocationForm label={t('notFound.label')} cta={t('notFound.cta')} />
    </>
  );
}
