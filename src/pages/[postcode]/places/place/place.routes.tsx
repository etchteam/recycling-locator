import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';
import { usePostcode } from '@/hooks/PostcodeProvider';

import PlaceDetailsPage from './details.page';
import PlaceLayout from './place.layout';
import PlacePage from './place.page';

export default function PlaceRoutes() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <PlaceLayout>
      <ErrorBoundaryPage
        link={`/${postcode}/places`}
        message={t('place.error.message')}
        cta={t('actions.tryAgain')}
      >
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
      </ErrorBoundaryPage>
    </PlaceLayout>
  );
}
