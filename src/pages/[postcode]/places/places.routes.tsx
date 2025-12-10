import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import ErrorBoundary, { ErrorPage } from '@/components/ErrorBoundary';
import { usePostcode } from '@/hooks/PostcodeProvider';

import PlacesMapPage from './map.page';
import PlaceRoutes from './place/place.routes';
import PlacesLayout from './places.layout';
import PlacesPage from './places.page';
import SearchRoutes from './search/search.routes';

export default function PlacesRoutes() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <ErrorBoundary
      fallback={
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
      }
    >
      <Switch>
        <Route path="/:postcode/places/search/:*?" component={SearchRoutes} />
        <Route
          path="/:postcode/places/:placeName/:placePostcode/*?"
          component={PlaceRoutes}
        />
        <Route path="/:postcode/places/*?">
          <PlacesLayout>
            <Switch>
              <Route path="/:postcode/places" component={PlacesPage} />
              <Route path="/:postcode/places/map" component={PlacesMapPage} />
            </Switch>
          </PlacesLayout>
        </Route>
      </Switch>
    </ErrorBoundary>
  );
}
