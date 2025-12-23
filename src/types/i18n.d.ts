import 'i18next';
import { Locale } from './locale';

declare module 'i18next' {
  interface i18n {
    language: Locale;
  }

  interface CustomTypeOptions {
    returnNull: false;
  }
}
