import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import RefillNotFoundPage from '../not-found.page';
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
        <Route path="/:postcode/refill/places/map">
          <RefillPlacesLayout title={t('refill.places.title')}>
            <RefillMapPage />
          </RefillPlacesLayout>
        </Route>
        <Route
          path="/:postcode/refill/places/:id/*?"
          component={RefillPlaceRoutes}
        />
        <Route path="/:postcode/refill/places">
          <RefillPlacesLayout title={t('refill.places.title')}>
            <RefillPlacesPage />
          </RefillPlacesLayout>
        </Route>
        <Route path="/:postcode/refill/home-delivery">
          <RefillPlacesLayout title={t('refill.places.title')}>
            <HomeDeliveryPage />
          </RefillPlacesLayout>
        </Route>
        <Route>
          <RefillNotFoundPage />
        </Route>
      </Switch>
    </ErrorBoundaryPage>
  );
}
