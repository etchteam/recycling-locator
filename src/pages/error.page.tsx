import { useRouteError } from 'react-router';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import { captureException } from '@/lib/sentry';
import StartLayout from '@/pages/start.layout';

/**
 * Global app error boundary
 */
export default function GlobalErrorPage() {
  const error = useRouteError();
  captureException(error, { route: 'Global error boundary' });

  return (
    <StartLayout>
      <locator-wrap>
        <diamond-section padding="lg">
          <ErrorPage />
        </diamond-section>
      </locator-wrap>
    </StartLayout>
  );
}
