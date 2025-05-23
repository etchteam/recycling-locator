import { RouteObject } from 'react-router';

import PlacesErrorPage from './error.page';
import PlacesMapPage from './map.page';
import PlaceDetailsPage from './place/details.page';
import PlaceErrorPage from './place/error.page';
import PlaceLayout from './place/place.layout';
import placeLoader from './place/place.loader';
import PlacePage from './place/place.page';
import PlacesLayout from './places.layout';
import placesLoader from './places.loader';
import PlacesPage from './places.page';
import placesSearchAtoZLoader from './search/a-z.loader';
import AtoZPage from './search/a-z.page';
import placesSearchCategoriesLoader from './search/categories.loader';
import CategoriesPage from './search/categories.page';
import placesSearchAction from './search/search.action';
import PlacesSearchLayout from './search/search.layout';
import placesSearchLoader from './search/search.loader';
import PlacesSearchPage from './search/search.page';

const routes: RouteObject[] = [
  {
    path: '/:postcode/places',
    errorElement: <PlacesErrorPage />,
    element: <PlacesLayout />,
    loader: placesLoader,
    id: 'places',
    children: [
      {
        index: true,
        element: <PlacesPage />,
      },
      {
        path: 'map',
        element: <PlacesMapPage />,
      },
    ],
  },
  {
    path: '/:postcode/places/search',
    element: <PlacesSearchLayout />,
    errorElement: <PlacesErrorPage />,
    children: [
      {
        index: true,
        element: <PlacesSearchPage />,
        action: placesSearchAction,
        loader: placesSearchLoader,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
        loader: placesSearchCategoriesLoader,
      },
      {
        path: 'a-z',
        element: <AtoZPage />,
        loader: placesSearchAtoZLoader,
      },
    ],
  },
  {
    // TODO(WRAP-207): Move to /:postcode/places/:id
    path: '/:postcode/places/:placeName/:placePostcode',
    element: <PlaceLayout />,
    errorElement: <PlaceErrorPage />,
    loader: placeLoader,
    id: 'place',
    children: [
      {
        index: true,
        element: <PlacePage />,
      },
      {
        path: 'details',
        element: <PlaceDetailsPage />,
      },
    ],
  },
];

export default routes;
