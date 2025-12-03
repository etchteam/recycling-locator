import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import StartLayout from '@/pages/start.layout';

/**
 * Global app error page
 */
export default function GlobalErrorPage() {
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
