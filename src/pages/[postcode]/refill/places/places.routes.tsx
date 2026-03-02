import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';
import { usePostcode } from '@/hooks/PostcodeProvider';

import HomeDeliveryPage from './home-delivery.page';
import RefillMapPage from './map.page';
import RefillPlaceRoutes from './place/place.routes';
import RefillPlacesLayout from './places.layout';
import RefillPlacesPage from './places.page';

export default function RefillPlacesRoutes() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <ErrorBoundaryPage
      link={`/${postcode}/refill`}
      message={t('refill.error.message')}
      cta={t('actions.tryAgain')}
    >
      <Switch>
        <Route
          path="/:postcode/refill/places/:id/*?"
          component={RefillPlaceRoutes}
        />
        <Route path="/:postcode/refill/*?">
          <RefillPlacesLayout title={t('refill.places.title')}>
            <Switch>
              <Route
                path="/:postcode/refill/places"
                component={RefillPlacesPage}
              />
              <Route
                path="/:postcode/refill/places/map"
                component={RefillMapPage}
              />
              <Route
                path="/:postcode/refill/home-delivery"
                component={HomeDeliveryPage}
              />
            </Switch>
          </RefillPlacesLayout>
        </Route>
      </Switch>
    </ErrorBoundaryPage>
  );
}
