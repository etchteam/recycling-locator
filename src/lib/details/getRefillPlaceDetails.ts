import { Location } from '@/types/locatorApi';

import getNotes from './getNotes';
import getOpeningHours, { type OpeningHoursResult } from './getOpeningHours';
import getPhoneNumbers from './getPhoneNumbers';
import getWebsites from './getWebsites';

interface RefillPlaceDetails {
  phoneNumber: string | undefined;
  website: { url: string; text: string } | undefined;
  openingHours: OpeningHoursResult;
  notes: string[];
}

/**
 * Returns details for a refill place location.
 *
 * Refill locations differ from recycling locations in that their sub-locations
 * all represent the same physical shop supplied by the same brand. This means
 * there is only ever one phone number, website, set of opening hours and notes
 * to display — the first available value for each detail type is the canonical
 * one. Recycling locations, by contrast, can be served by completely different
 * companies sharing an address, each with independent contact details.
 *
 * The aggregation logic is intentionally shared with the recycling detail
 * helpers (getPhoneNumbers, getWebsites, getOpeningHours, getNotes) so that
 * cleaning, formatting and normalisation stay consistent. We simply take the
 * first result from each aggregated collection.
 */
export default function getRefillPlaceDetails(
  location: Location,
): RefillPlaceDetails {
  const phoneNumbers = getPhoneNumbers(location);
  const websites = getWebsites(location);
  const notes = getNotes(location);

  // For refill locations all sub-locations share the same brand/shop, so the
  // first aggregated value for each detail is the only one needed.
  const phoneNumber = phoneNumbers[0];
  const firstNote = notes[0];

  const firstWebsiteEntry = websites.entries().next().value;
  const website = firstWebsiteEntry
    ? { url: firstWebsiteEntry[0], text: firstWebsiteEntry[1] }
    : undefined;

  // getOpeningHours iterates all sub-locations and the last one wins via Map
  // overwrite. For refill places this is fine because all sub-locations belong
  // to the same shop — the first location with opening hours is the authoritative
  // source, so we pass a synthetic location containing only that sub-location.
  const firstLocWithHours = location.locations.find((loc) => loc.openingHours);
  const openingHours = firstLocWithHours
    ? getOpeningHours({ ...location, locations: [firstLocWithHours] })
    : { today: '', days: [] };

  return {
    phoneNumber,
    website,
    openingHours,
    notes: firstNote ? [firstNote] : [],
  };
}
