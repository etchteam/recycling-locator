import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import ErrorPage from '@/components/template/ErrorPage/ErrorPage';

import RefillLayout from './refill.layout';

/**
 * Refill section error boundary
 */
export default function RefillErrorPage() {
  const { t } = useTranslation();

  return (
    <RefillLayout>
      <locator-wrap>
        <diamond-section padding="lg">
          <ErrorPage
            link="/refill"
            message={t('refill.error.message')}
            cta={t('actions.tryAgain')}
          />
        </diamond-section>
      </locator-wrap>
    </RefillLayout>
  );
}
