import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter-preact';

import { ErrorBoundaryPage } from '@/components/ErrorBoundary';
import { usePostcode } from '@/hooks/PostcodeProvider';

import AtoZPage from './a-z.page';
import CategoriesPage from './categories.page';
import PlacesSearchLayout from './search.layout';
import PlacesSearchPage from './search.page';

export default function SearchRoutes() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();

  return (
    <PlacesSearchLayout>
      <ErrorBoundaryPage
        link={`/${postcode}/places/search`}
        message={t('places.error.message')}
        cta={t('actions.tryAgain')}
      >
        <Switch>
          <Route path="/:postcode/places/search" component={PlacesSearchPage} />
          <Route
            path="/:postcode/places/search/categories"
            component={CategoriesPage}
          />
          <Route path="/:postcode/places/search/a-z" component={AtoZPage} />
        </Switch>
      </ErrorBoundaryPage>
    </PlacesSearchLayout>
  );
}
