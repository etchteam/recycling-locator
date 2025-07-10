import { Location } from '@/types/locatorApi';

export default function getPhoneNumbers(location: Location): string[] {
  const phoneNumbers = location.locations
    .map((loc) => loc.telephone)
    .filter(Boolean)
    .map((num) => num.replace(/[^0-9+]/g, ''))
    .filter((num, index, self) => self.indexOf(num) === index);

  return phoneNumbers;
}
