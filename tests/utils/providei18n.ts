import i18n from 'i18next';

import en from '../../public/translations/en.json';

export default function provideI18n() {
  return new Promise<void>((resolve) => {
    i18n.init(
      {
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
        ns: ['translations'],
        defaultNS: 'translations',
        resources: {
          en: {
            translations: en,
          },
        },
      },
      () => resolve(),
    );
  });
}
