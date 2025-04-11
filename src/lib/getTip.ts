import * as Sentry from '@sentry/browser';
import random from 'lodash/random';

import i18n from '@/lib/i18n';
import { RecyclingMeta } from '@/types/locatorApi';

import LocatorApi from './LocatorApi';

/**
 * Get a tip for a material or path, falling back to a random generic tip
 */
export default function getTip(
  meta: RecyclingMeta[],
  options: {
    path?: string;
    materialId?: string | number;
    country?: string;
  } = {},
): RecyclingMeta {
  const tips = [];

  if (options.materialId) {
    tips.push(
      ...meta.filter((m) => m.materials.includes(Number(options.materialId))),
    );
  }

  if (options.path) {
    tips.push(...meta.filter((m) => m.path === options.path));
  }

  if (tips.length === 0) {
    tips.push(...meta.filter((m) => m.materials.length === 0 && !m.path));
  }

  return tips[random(0, tips.length - 1)] ?? null;
}

/**
 * Log and ignore all tip errors because not having the content isn't a blocker
 */
function handleTipError(error: Error) {
  Sentry.captureException(error, {
    tags: { route: 'Get tip' },
  });
}

async function getTipCountry(): Promise<'ENGLAND' | 'WALES'> {
  const determineCountry = (): 'ENGLAND' | 'WALES' => {
    const isWelshLocale = i18n.language === 'cy' || i18n.language === 'cy-GB';
    const isWalesRecycles = window.location.host.includes('walesrecycles');
    return isWelshLocale || isWalesRecycles ? 'WALES' : 'ENGLAND';
  };

  if (!i18n.isInitialized) {
    return new Promise((resolve) => {
      i18n.on('initialized', () => {
        resolve(determineCountry());
      });
    });
  }

  return determineCountry();
}

/**
 * Get a tip for a given path name
 *
 * @param path - The path to get the tip for (a path can be set in the admin)
 * @param fallback – whether to fallback to a random tip if no tip is found for the path
 */
export async function getTipByPath(
  path: string,
  { fallback }: { fallback?: boolean } = { fallback: true },
) {
  try {
    const country = await getTipCountry();
    const url = `recycling-meta?categories=HINT&country=${country}`;

    if (fallback) {
      const meta = await LocatorApi.get<RecyclingMeta[]>(url);

      return getTip(meta, { path });
    } else {
      const tips = await LocatorApi.get<RecyclingMeta[]>(`${url}&path=${path}`);

      return tips?.[0] ?? null;
    }
  } catch (error) {
    handleTipError(error);
    return Promise.resolve(null);
  }
}

export async function getTipByMaterial(materialId: string) {
  try {
    const country = await getTipCountry();
    const meta = await LocatorApi.get<RecyclingMeta[]>(
      `recycling-meta?categories=HINT&country=${country}`,
    );
    return getTip(meta, { materialId });
  } catch (error) {
    handleTipError(error);
    return Promise.resolve(null);
  }
}
