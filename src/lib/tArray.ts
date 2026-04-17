import i18n from '@/lib/i18n';
import { captureException } from '@/lib/sentry';

function translationsLoaded() {
  const lng = i18n.resolvedLanguage ?? i18n.language;
  return i18n.isInitialized && i18n.hasResourceBundle(lng, 'translation');
}

/**
 * Convenience method to iterate an array of translations for a given key
 * If the key does not exist, it will log an error to Sentry and return
 * an empty array instead of throwing an error
 */
export default function tArray(tKey: string) {
  if (!i18n.exists(tKey)) {
    // Only report when bundle loaded; load failures reported via
    // i18n `failedLoading` handler in @/lib/i18n
    if (translationsLoaded()) {
      captureException(new Error(`Missing translation key: ${tKey}`), {
        component: 'tArray',
      });
    }
    return [];
  }

  return i18n.t(tKey, { returnObjects: true }) as string[];
}
