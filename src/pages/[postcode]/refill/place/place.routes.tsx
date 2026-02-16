import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';
import { usePostcode } from '@/hooks/PostcodeProvider';

import RefillPlaceLayout from './place.layout';
import RefillPlacePage from './place.page';

export default function RefillPlaceRoutes() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <RefillPlaceLayout>
      <ErrorBoundaryPage
        link={`/${postcode}/refill`}
        message={t('place.error.message')}
        cta={t('actions.tryAgain')}
      >
        <Switch>
          <Route
            path="/:postcode/refill/:placeName/:placePostcode"
            component={RefillPlacePage}
          />
        </Switch>
      </ErrorBoundaryPage>
    </RefillPlaceLayout>
  );
}
