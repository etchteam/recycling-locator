import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';

import BenefitsPage from './benefits.page';
import GuidePage from './guide.page';
import OptionsPage from './options.page';
import RefillLayout from './refill.layout';
import RefillPage from './refill.page';
import SignUpPage from './sign-up.page';

export default function RefillRoutes() {
  const { t } = useTranslation();

  return (
    <RefillLayout>
      <ErrorBoundaryPage
        link="/refill"
        message={t('refill.error.message')}
        cta={t('actions.tryAgain')}
      >
        <Switch>
          <Route path="/refill" component={RefillPage} />
          <Route path="/refill/guide" component={GuidePage} />
          <Route path="/refill/options" component={OptionsPage} />
          <Route path="/refill/benefits" component={BenefitsPage} />
          <Route path="/refill/sign-up" component={SignUpPage} />
        </Switch>
      </ErrorBoundaryPage>
    </RefillLayout>
  );
}
