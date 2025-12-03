import { useTranslation } from 'react-i18next';

import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import { usePostcode } from '@/lib/PostcodeContext';

import HomeRecyclingLayout from './home.layout';

/**
 * Home recycling error boundary
 */
export default function HomeRecyclingErrorPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <HomeRecyclingLayout>
      <ErrorPage
        link={`/${postcode}/home`}
        message={t('homeRecycling.error.message')}
        cta={t('actions.tryAgain')}
      />
    </HomeRecyclingLayout>
  );
}
