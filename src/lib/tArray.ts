import i18n from '@/lib/i18n';
import sentry from '@/lib/sentry';

/**
 * Convenience method to iterate an array of translations for a given key
 * If the key does not exist, it will log an error to Sentry and return
 * an empty array instead of throwing an error
 */
export default function tArray(tKey: string) {
  if (!i18n.exists(tKey)) {
    sentry.captureMessage(`Missing translation key: ${tKey}`);
    return [];
  }

  return i18n.t(tKey, { returnObjects: true }) as string[];
}
