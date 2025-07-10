import { Location } from '@/types/locatorApi';

export default function getWebsites(location: Location): string[] {
  const websites = location.locations
    .map((loc) => loc.website)
    .filter(Boolean)
    .map((site) => {
      const trimmed = site.trim();
      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    })
    .filter((site, index, self) => self.indexOf(site) === index);

  return websites;
}
