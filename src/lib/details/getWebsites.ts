import { Location } from '@/types/locatorApi';

export function cleanLink(website: string): string | null {
  if (!website) {
    return null;
  }

  const trimmed = website.trim().toLocaleLowerCase();

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getLinkText(website: string): string {
  const linkText = website.replaceAll(/^https?:\/\//gi, '');

  if (linkText.startsWith('www.')) {
    return linkText.slice(4);
  }

  return linkText;
}

export default function getWebsites(location: Location): Map<string, string> {
  const mappedWebsites = new Map<string, string>();

  location.locations
    .map(({ website }) => cleanLink(website))
    .filter(Boolean)
    .forEach((site) => mappedWebsites.set(site, getLinkText(site)));

  return mappedWebsites;
}
