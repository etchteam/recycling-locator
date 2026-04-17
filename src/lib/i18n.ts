import i18n from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import config from '@/config';
import { captureException } from '@/lib/sentry';
import { Locale } from '@/types/locale';

i18n
  // load translation using http -> see /public/translations
  // https://github.com/i18next/i18next-http-backend
  .use(HttpBackend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next);

i18n.on('failedLoading', (lng, ns, msg) => {
  captureException(
    new Error(`i18n failed loading ${lng}/${ns}: ${msg}`),
    { component: 'i18n' },
    { lng, ns },
  );
});

/**
 * Init i18next with the given locale.
 **/
export function i18nInit(
  locale: Locale = 'en',
  publicPath = config.publicPath,
) {
  // For all options read: https://www.i18next.com/overview/configuration-options
  i18n.init<HttpBackendOptions>({
    fallbackLng: 'en',
    lng: locale,
    debug: import.meta.env.MODE === 'development',
    load: 'currentOnly',
    backend: {
      loadPath: `${publicPath}translations/{{lng}}.json`,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    returnObjects: true,
  });
}

export default i18n;
