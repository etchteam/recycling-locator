import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';

import DiscoverRefillPage from './discover/discover.page';
import RefillPlacesRoutes from './places/places.routes';
import RefillLayout from './refill.layout';
import RefillPage from './refill.page';
import SignUpPage from './sign-up/sign-up.page';

export default function RefillRoutes() {
  const { t } = useTranslation();

  return (
    <ErrorBoundaryPage
      link="/refill"
      message={t('refill.error.message')}
      cta={t('actions.tryAgain')}
    >
      <Switch>
        <Route path="/:postcode/refill">
          <RefillLayout>
            <RefillPage />
          </RefillLayout>
        </Route>

        <Route
          path="/:postcode/refill/discover"
          component={DiscoverRefillPage}
        />

        <Route path="/:postcode/refill/sign-up" component={SignUpPage} />

        <Route path="/:postcode/refill/*?" component={RefillPlacesRoutes} />
      </Switch>
    </ErrorBoundaryPage>
  );
}
