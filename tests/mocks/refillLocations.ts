import config from '@/config';
import { LocationsResponse as LocationsResponseType } from '@/types/locatorApi';

const LOGO =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E';

export const REFILL_LOCATIONS_ENDPOINT = `${config.locatorApiPath}refill-locations/**`;

export const RefillLocationsResponse: LocationsResponseType = {
  items: [
    {
      id: '1001',
      distance: 0.5,
      name: 'Green Refills',
      address: 'High Street, Barnstaple, EX31 1AA',
      latitude: 51.0801,
      longitude: -4.061,
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Green Refills Ltd',
            refillCategories: [
              { id: '1', name: 'Food' },
              { id: '2', name: 'Cleaning' },
            ],
          },
        },
      ],
    },
    {
      id: '1002',
      distance: 1.2,
      name: 'Eco Store',
      address: 'Market Street, Barnstaple, EX31 2BB',
      latitude: 51.075,
      longitude: -4.058,
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Eco Store Ltd',
            refillCategories: [{ id: '3', name: 'Personal Care' }],
          },
        },
      ],
    },
    {
      id: '1003',
      distance: 2.8,
      name: 'Refill Hub',
      address: 'Station Road, Barnstaple, EX31 3CC',
      latitude: 51.072,
      longitude: -4.052,
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Refill Hub Ltd',
            refillCategories: [
              { id: '1', name: 'Food' },
              { id: '2', name: 'Cleaning' },
              { id: '3', name: 'Personal Care' },
            ],
          },
        },
      ],
    },
  ],
  meta: {
    latitude: 51.07872831826983,
    longitude: -4.05529069017698,
    radius: 25,
  },
  pagination: {
    total: 3,
    page: 1,
  },
};

export const RefillLocationsFilteredResponse: LocationsResponseType = {
  items: [RefillLocationsResponse.items[0], RefillLocationsResponse.items[2]],
  meta: RefillLocationsResponse.meta,
  pagination: {
    total: 2,
    page: 1,
  },
};

export const RefillLocationsWithBrandsResponse: LocationsResponseType = {
  items: [
    {
      ...RefillLocationsResponse.items[0],
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Ecover',
            refillCategories: [{ id: '2', name: 'Cleaning' }],
          },
        },
      ],
    },
    {
      ...RefillLocationsResponse.items[1],
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Faith in Nature',
            refillCategories: [{ id: '3', name: 'Personal Care' }],
          },
        },
      ],
    },
    {
      ...RefillLocationsResponse.items[2],
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Ecover',
            refillCategories: [{ id: '2', name: 'Cleaning' }],
          },
        },
      ],
    },
  ],
  brands: [
    { id: '272', name: 'Ecover', description: null, logo: LOGO },
    { id: '270', name: 'Faith in Nature', description: null, logo: LOGO },
  ],
  meta: RefillLocationsResponse.meta,
  pagination: {
    total: 3,
    page: 1,
  },
};

/**
 * One brand with a logo (Ecover) and one with only a description. Only the
 * brand with a logo should render.
 */
export const RefillLocationsWithUnknownBrandResponse: LocationsResponseType = {
  items: [
    {
      ...RefillLocationsResponse.items[0],
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Ecover',
            refillCategories: [{ id: '2', name: 'Cleaning' }],
          },
        },
      ],
    },
    {
      ...RefillLocationsResponse.items[1],
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Independent Refill Co',
            refillCategories: [{ id: '3', name: 'Personal Care' }],
          },
        },
      ],
    },
  ],
  brands: [
    { id: '272', name: 'Ecover', description: null, logo: LOGO },
    {
      id: '900',
      name: 'Independent Refill Co',
      description: 'A local refill shop.',
      logo: null,
    },
  ],
  meta: RefillLocationsResponse.meta,
  pagination: {
    total: 2,
    page: 1,
  },
};

/**
 * Companies with no brand data, so the proxy returns no brands. The brands card
 * should not render at all.
 */
export const RefillLocationsAllUnknownBrandsResponse: LocationsResponseType = {
  items: [
    {
      ...RefillLocationsResponse.items[0],
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Independent Refill Co',
            refillCategories: [{ id: '2', name: 'Cleaning' }],
          },
        },
      ],
    },
    {
      ...RefillLocationsResponse.items[1],
      locations: [
        {
          locationType: 'REFILL',
          source: 'wrap',
          materials: [],
          company: {
            name: 'Another Unknown Shop',
            refillCategories: [{ id: '3', name: 'Personal Care' }],
          },
        },
      ],
    },
  ],
  brands: [],
  meta: RefillLocationsResponse.meta,
  pagination: {
    total: 2,
    page: 1,
  },
};

export const RefillLocationsEmptyResponse: LocationsResponseType = {
  items: [],
  meta: RefillLocationsResponse.meta,
  pagination: {
    total: 0,
    page: 1,
  },
};
