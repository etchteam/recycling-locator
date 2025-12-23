import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';
import { usePostcode } from '@/hooks/PostcodeProvider';

import MaterialLayout from './material.layout';
import MaterialPage from './material.page';
import MaterialSearchPage from './search.page';

export default function MaterialRoutes() {
  const { postcode } = usePostcode();
  const { t } = useTranslation();

  return (
    <MaterialLayout>
      <ErrorBoundaryPage
        link={`/${postcode}/material/search`}
        message={t('material.error.message')}
        cta={t('actions.searchAgain')}
      >
        <Switch>
          <Route path="/:postcode/material" component={MaterialPage} />
          <Route
            path="/:postcode/material/search"
            component={MaterialSearchPage}
          />
        </Switch>
      </ErrorBoundaryPage>
    </MaterialLayout>
  );
}
