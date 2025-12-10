import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/control/LocationInput/LocationInput';

import LocationForm from '../components/control/LocationForm/LocationForm';

/**
 * 404 Not Found page
 * Displayed when the user visits a route that doesn't exist
 */
export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('notFound.title.default')}</h2>
      <LocationForm label={t('notFound.label')} cta={t('notFound.cta')} />
    </>
  );
}
