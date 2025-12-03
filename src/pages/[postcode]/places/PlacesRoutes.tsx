import { Route, Switch } from 'wouter-preact';

import ErrorBoundary from '@/lib/ErrorBoundary';

import PlacesMapPage from './map.page';
import PlaceDetailsPage from './place/details.page';
import PlaceErrorPage from './place/error.page';
import PlaceLayout from './place/place.layout';
import PlacePage from './place/place.page';
import PlacesLayout from './places.layout';
import PlacesPage from './places.page';
import AtoZPage from './search/a-z.page';
import CategoriesPage from './search/categories.page';
import PlacesSearchLayout from './search/search.layout';
import PlacesSearchPage from './search/search.page';

export default function PlacesRoutes() {
  return (
    <Switch>
      <Route path="/:postcode/places/search/:rest*">
        <PlacesSearchLayout>
          <Switch>
            <Route
              path="/:postcode/places/search"
              component={PlacesSearchPage}
            />
            <Route
              path="/:postcode/places/search/categories"
              component={CategoriesPage}
            />
            <Route path="/:postcode/places/search/a-z" component={AtoZPage} />
          </Switch>
        </PlacesSearchLayout>
      </Route>

      <Route path="/:postcode/places/:placeName/:placePostcode/:rest*">
        <ErrorBoundary fallback={<PlaceErrorPage />}>
          <PlaceLayout>
            <Switch>
              <Route
                path="/:postcode/places/:placeName/:placePostcode"
                component={PlacePage}
              />
              <Route
                path="/:postcode/places/:placeName/:placePostcode/details"
                component={PlaceDetailsPage}
              />
            </Switch>
          </PlaceLayout>
        </ErrorBoundary>
      </Route>

      <Route path="/:postcode/places/:rest*">
        <PlacesLayout>
          <Switch>
            <Route path="/:postcode/places" component={PlacesPage} />
            <Route path="/:postcode/places/map" component={PlacesMapPage} />
          </Switch>
        </PlacesLayout>
      </Route>
    </Switch>
  );
}
