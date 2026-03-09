import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';

import BenefitsPage from './benefits.page';
import DiscoverRefillLayout from './discover.layout';
import DiscoverRefillPage from './discover.page';
import GuidePage from './guide.page';
import HomeRefillPage from './home.page';
import OptionsPage from './options.page';

export default function DiscoverRefillRoutes() {
  const { t } = useTranslation();

  return (
    <DiscoverRefillLayout>
      <ErrorBoundaryPage
        link="/:postcode/refill"
        message={t('refill.error.message')}
        cta={t('actions.tryAgain')}
      >
        <Switch>
          <Route
            path="/:postcode/refill/discover"
            component={DiscoverRefillPage}
          />

          <Route path="/:postcode/refill/home" component={HomeRefillPage} />
          <Route
            path="/:postcode/refill/discover/guide"
            component={GuidePage}
          />
          <Route
            path="/:postcode/refill/discover/options"
            component={OptionsPage}
          />
          <Route
            path="/:postcode/refill/discover/benefits"
            component={BenefitsPage}
          />
        </Switch>
      </ErrorBoundaryPage>
    </DiscoverRefillLayout>
  );
}
