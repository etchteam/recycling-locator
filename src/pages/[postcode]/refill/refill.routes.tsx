import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';

import DiscoverRefillRoutes from './discover/discover.routes';
import RefillMapPage from './map.page';
import RefillPlaceRoutes from './place/place.routes';
import RefillLayout from './refill.layout';
import RefillPage from './refill.page';

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
        <Route path="/:postcode/refill/map">
          <RefillLayout>
            <RefillMapPage />
          </RefillLayout>
        </Route>
        <Route
          path="/:postcode/refill/discover/*?"
          component={DiscoverRefillRoutes}
        />
        <Route path="/:postcode/refill/:id/*?" component={RefillPlaceRoutes} />
      </Switch>
    </ErrorBoundaryPage>
  );
}
