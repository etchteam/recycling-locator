import { Route, Switch } from 'wouter-preact';

import CollectionPage from './collection.page';
import HomeRecyclingContactPage from './contact.page';
import HomeRecyclingLayout from './home.layout';
import HomeRecyclingPage from './home.page';
import HomeRecyclingCentrePage from './recycling-centre.page';

export default function HomeRecyclingRoutes() {
  return (
    <Switch>
      <Route path="/:postcode/home/collection" component={CollectionPage} />
      <Route path="/:postcode/home/:rest*">
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
  );
}
