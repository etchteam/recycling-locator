import { Route, Switch } from 'wouter-preact';

import MaterialLayout from './material.layout';
import MaterialPage from './material.page';
import MaterialSearchPage from './search.page';

export default function MaterialRoutes() {
  return (
    <MaterialLayout>
      <Switch>
        <Route path="/:postcode/material" component={MaterialPage} />
        <Route
          path="/:postcode/material/search"
          component={MaterialSearchPage}
        />
      </Switch>
    </MaterialLayout>
  );
}
