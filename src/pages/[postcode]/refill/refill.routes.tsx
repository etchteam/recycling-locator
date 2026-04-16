import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';
import { useAppState } from '@/hooks/AppStateProvider';

import DiscoverRefillPage from './discover/discover.page';
import RefillPlacesRoutes from './places/places.routes';
import RefillLayout from './refill.layout';
import RefillPage from './refill.page';

function RefillTheme({ children }: { readonly children: ComponentChildren }) {
  const { theme } = useAppState();

  if (theme) {
    return children;
  }

  return <div className="theme-preset-purple">{children}</div>;
}

export default function RefillRoutes() {
  const { t } = useTranslation();

  return (
    <RefillTheme>
      <ErrorBoundaryPage
        link="/refill"
        message={t('refill.error.message')}
        cta={t('actions.tryAgain')}
      >
        <Switch>
          <Route path="/:postcode/refill">
            <RefillLayout>
              <RefillPage />
            </RefillLayout>
          </Route>

          <Route
            path="/:postcode/refill/discover"
            component={DiscoverRefillPage}
          />

          <Route path="/:postcode/refill/*?" component={RefillPlacesRoutes} />
        </Switch>
      </ErrorBoundaryPage>
    </RefillTheme>
  );
}
