import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import LocationForm from '../components/control/LocationForm/LocationForm';

/**
 * 404 Not Found page
 * Displayed when the user visits a route that doesn't exist
 * Shows different title based on error reason (notInTheUK, etc.)
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
