import { Location, LocationsResponse } from '@/types/locatorApi';

function isLocationsResponse(
  input: LocationsResponse | Location,
): input is LocationsResponse {
  return 'items' in input;
}

export default function getCompanyNames(
  input: LocationsResponse | Location,
): string[] {
  const locations = isLocationsResponse(input) ? input.items : [input];

  const names = locations.flatMap((location) =>
    location.locations
      .map((l) => l.company?.name)
      .filter((name): name is string => Boolean(name)),
  );

  return [...new Set(names)];
}
