import config from '@/config';
import { DoorstepCollection } from '@/types/locatorApi';

export const DOORSTEP_COLLECTIONS_ENDPOINT = `${config.locatorApiPath}doorstep-collections/**`;

export const DoorstepCollectionsResponse: DoorstepCollection[] = [
  {
    id: '1',
    provider: 'RecyclePlus',
    bookingUrl: 'https://example.com/book',
    nextCollectionDate: '2025-01-15',
  },
];

export const EmptyDoorstepCollectionsResponse: DoorstepCollection[] = [];
