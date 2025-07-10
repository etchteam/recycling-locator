import { Location } from '@/types/locatorApi';

export default function getCollectionDetails(location: Location): string[] {
  return location.locations
    .map((loc) => loc.collectionDetails?.trim())
    .filter(Boolean);
}
