import { Location } from '@/types/locatorApi';

import getNotes from './getNotes';
import getOpeningHours, { type OpeningHoursResult } from './getOpeningHours';
import getPhoneNumbers from './getPhoneNumbers';
import getWebsites from './getWebsites';

interface RefillPlaceDetails {
  phoneNumber: string | undefined;
  website: { url: string; text: string } | undefined;
  openingHours: OpeningHoursResult;
  note: string | undefined;
}

export default function getRefillPlaceDetails(
  location: Location,
): RefillPlaceDetails {
  const phoneNumber = getPhoneNumbers(location)[0];
  const note = getNotes(location)[0];

  const [url, text] = [...getWebsites(location).entries()][0] ?? [];
  const website = url ? { url, text } : undefined;

  const firstLocWithHours = location.locations.find((loc) => loc.openingHours);
  const openingHours = firstLocWithHours
    ? getOpeningHours({ ...location, locations: [firstLocWithHours] })
    : { today: '', days: [] };

  return { phoneNumber, website, openingHours, note };
}
