import { Route, Switch } from 'wouter-preact';

import { PostcodeProvider } from '@/hooks/PostcodeProvider';

import HomeRecyclingRoutes from './home/home.routes';
import MaterialRoutes from './material/material.routes';
import PlacesRoutes from './places/places.routes';
import PostcodeLayout from './postcode.layout';
import PostcodePage from './postcode.page';
import RescueMeRecyclePage from './rescue-me-recycle.page';

export default function PostcodeRoutes() {
  return (
    <PostcodeProvider>
      <Switch>
        <Route path="/:postcode">
          <PostcodeLayout>
            <PostcodePage />
          </PostcodeLayout>
        </Route>
        <Route path="/:postcode/rescue-me-recycle">
          <PostcodeLayout>
            <RescueMeRecyclePage />
          </PostcodeLayout>
        </Route>
        <Route path="/:postcode/home/*?" component={HomeRecyclingRoutes} />
        <Route path="/:postcode/material/*?" component={MaterialRoutes} />
        <Route path="/:postcode/places/*?" component={PlacesRoutes} />
      </Switch>
    </PostcodeProvider>
  );
}
