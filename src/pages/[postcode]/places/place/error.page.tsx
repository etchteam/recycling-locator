import { useTranslation } from 'react-i18next';

import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import { usePostcode } from '@/lib/PostcodeContext';

import PlaceLayout from './place.layout';

/**
 * Individual place details error boundary
 */
export default function PlaceErrorPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <PlaceLayout>
      <ErrorPage
        link={`/${postcode}/places`}
        message={t('place.error.message')}
        cta={t('actions.tryAgain')}
      />
    </PlaceLayout>
  );
}
