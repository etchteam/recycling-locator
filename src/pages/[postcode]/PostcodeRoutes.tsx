import { Route, Switch } from 'wouter-preact';

import ErrorBoundary from '@/lib/ErrorBoundary';

import HomeRecyclingRoutes from './home/HomeRecyclingRoutes';
import HomeRecyclingErrorPage from './home/error.page';
import MaterialRoutes from './material/MaterialRoutes';
import MaterialErrorPage from './material/error.page';
import PlacesRoutes from './places/PlacesRoutes';
import PlacesErrorPage from './places/error.page';
import PostcodePage from './postcode.page';
import RescueMeRecyclePage from './rescue-me-recycle';

export default function PostcodeRoutes() {
  return (
    <Switch>
      <Route path="/:postcode" component={PostcodePage} />
      <Route
        path="/:postcode/rescue-me-recycle"
        component={RescueMeRecyclePage}
      />
      <Route path="/:postcode/home/:rest*">
        <ErrorBoundary fallback={<HomeRecyclingErrorPage />}>
          <HomeRecyclingRoutes />
        </ErrorBoundary>
      </Route>
      <Route path="/:postcode/material/:rest*">
        <ErrorBoundary fallback={<MaterialErrorPage />}>
          <MaterialRoutes />
        </ErrorBoundary>
      </Route>
      <Route path="/:postcode/places/:rest*">
        <ErrorBoundary fallback={<PlacesErrorPage />}>
          <PlacesRoutes />
        </ErrorBoundary>
      </Route>
    </Switch>
  );
}
