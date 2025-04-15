import i18n from 'i18next';

import en from '../../public/translations/en.json' with { type: 'json' };

export default function provideI18n() {
  return new Promise<typeof i18n>((resolve) => {
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
      () => resolve(i18n),
    );
  });
}
