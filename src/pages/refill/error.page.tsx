import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import { captureException } from '@/lib/sentry';

import RefillLayout from './refill.layout';

export default function RefillErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();
  captureException(error, { route: 'Refill error boundary' });

  return (
    <RefillLayout>
      <locator-wrap>
        <diamond-section padding="lg">
          <ErrorPage
            link={`/refill`}
            message={t('refill.error.message')}
            cta={t('actions.tryAgain')}
          />
        </diamond-section>
      </locator-wrap>
    </RefillLayout>
  );
}
