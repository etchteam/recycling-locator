import { useTranslation } from 'react-i18next';
import { useParams, useRouteError } from 'react-router';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import ErrorPage from '@/components/template/ErrorPage/ErrorPage';
import { captureException } from '@/lib/sentry';

import PlacesLayout from './places.layout';

export default function PlacesErrorPage() {
  const { t } = useTranslation();
  const { postcode } = useParams();
  const error = useRouteError();
  captureException(error, { route: 'Places error boundary' });

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
