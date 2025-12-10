import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import ErrorBoundary, { ErrorPage } from '@/components/ErrorBoundary';
import { usePostcode } from '@/hooks/PostcodeProvider';

import CollectionPage from './collection.page';
import HomeRecyclingContactPage from './contact.page';
import HomeRecyclingLayout from './home.layout';
import HomeRecyclingPage from './home.page';
import HomeRecyclingCentrePage from './recycling-centre.page';

export default function HomeRecyclingRoutes() {
  const { postcode } = usePostcode();
  const { t } = useTranslation();

  return (
    <ErrorBoundary
      fallback={
        <HomeRecyclingLayout>
          <ErrorPage
            link={`/${postcode}/home`}
            message={t('homeRecycling.error.message')}
            cta={t('actions.tryAgain')}
          />
        </HomeRecyclingLayout>
      }
    >
      <Switch>
        <Route path="/:postcode/home/collection" component={CollectionPage} />
        <Route path="/:postcode/home/*?">
          <HomeRecyclingLayout>
            <Switch>
              <Route path="/:postcode/home" component={HomeRecyclingPage} />
              <Route
                path="/:postcode/home/recycling-centre"
                component={HomeRecyclingCentrePage}
              />
              <Route
                path="/:postcode/home/contact"
                component={HomeRecyclingContactPage}
              />
            </Switch>
          </HomeRecyclingLayout>
        </Route>
      </Switch>
    </ErrorBoundary>
  );
}
