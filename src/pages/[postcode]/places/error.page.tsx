import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import { usePostcode } from '@/lib/PostcodeContext';

import PlacesLayout from './places.layout';

/**
 * Places/nearby locations error boundary
 */
export default function PlacesErrorPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <PlacesLayout>
      <locator-wrap>
        <diamond-section padding="lg">
          <ErrorPage
            link={`/${postcode}/places`}
            message={t('places.error.message')}
            cta={t('actions.tryAgain')}
          />
        </diamond-section>
      </locator-wrap>
    </PlacesLayout>
  );
}
