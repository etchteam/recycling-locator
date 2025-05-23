import { useTranslation } from 'react-i18next';
import { useParams, useRouteError } from 'react-router';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import { captureException } from '@/lib/sentry';

export default function MaterialErrorPage() {
  const { t } = useTranslation();
  const { postcode } = useParams();
  const error = useRouteError();
  captureException(error, { route: 'Material result error boundary' });

  return (
    <locator-wrap>
      <diamond-section padding="lg">
        <ErrorPage
          link={`/${postcode}/material/search`}
          message={t('material.error.message')}
          cta={t('actions.searchAgain')}
        />
      </diamond-section>
    </locator-wrap>
  );
}
