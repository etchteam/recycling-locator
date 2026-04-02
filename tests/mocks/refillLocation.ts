import config from '@/config';
import { Location } from '@/types/locatorApi';

export const REFILL_LOCATION_ENDPOINT = `${config.locatorApiPath}refill-location/**`;

export const RefillLocationResponse: Location = {
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
      telephone: '01271 374776',
      website: 'https://www.greenrefills.co.uk',
      openingHours:
        'Monday: 09:00 - 17:00, Tuesday: 09:00 - 17:00, Wednesday: 09:00 - 17:00',
      company: {
        name: 'Ecover',
        refillCategories: [
          { id: '1', name: 'Food' },
          { id: '2', name: 'Cleaning' },
        ],
      },
    },
  ],
};

/**
 * Mock with multiple sub-locations to test first-wins detail logic:
 * - First location: telephone only (no website, no notes)
 * - Second location: website and notes (no telephone)
 * - Third location: telephone, website, and notes (should be ignored due to first-wins)
 */
export const RefillLocationMultiResponse: Location = {
  id: '1001',
  distance: 0.5,
  name: 'Multi Refills',
  address: 'High Street, Barnstaple, EX31 1AA',
  latitude: 51.0801,
  longitude: -4.061,
  locations: [
    {
      locationType: 'REFILL',
      source: 'wrap',
      materials: [],
      telephone: '01271 111111',
      company: {
        name: 'FirstSupplier',
        refillCategories: [{ id: '1', name: 'Food' }],
      },
    },
    {
      locationType: 'REFILL',
      source: 'wrap',
      materials: [],
      website: 'https://www.second-location.co.uk',
      notes: 'Notes from second location',
      company: {
        name: 'SecondSupplier',
        refillCategories: [{ id: '2', name: 'Cleaning' }],
      },
    },
    {
      locationType: 'REFILL',
      source: 'wrap',
      materials: [],
      telephone: '01271 999999',
      website: 'https://www.third-location.co.uk',
      notes: 'Notes from third location',
      company: {
        name: 'ThirdSupplier',
        refillCategories: [{ id: '3', name: 'Beauty' }],
      },
    },
  ],
};
