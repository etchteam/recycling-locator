import { Route, Switch } from 'wouter-preact';

import ErrorBoundary from '@/lib/ErrorBoundary';

import BenefitsPage from './benefits.page';
import RefillErrorPage from './error.page';
import GuidePage from './guide.page';
import OptionsPage from './options.page';
import RefillLayout from './refill.layout';
import RefillPage from './refill.page';
import SignUpPage from './sign-up.page';

export default function RefillRoutes() {
  return (
    <ErrorBoundary fallback={<RefillErrorPage />}>
      <Switch>
        <Route path="/refill" component={RefillPage} />
        <Route path="/refill/:rest*">
          <RefillLayout>
            <Switch>
              <Route path="/refill/guide" component={GuidePage} />
              <Route path="/refill/options" component={OptionsPage} />
              <Route path="/refill/benefits" component={BenefitsPage} />
              <Route path="/refill/sign-up" component={SignUpPage} />
            </Switch>
          </RefillLayout>
        </Route>
      </Switch>
    </ErrorBoundary>
  );
}
