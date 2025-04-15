import uniqueId from 'lodash/uniqueId';

import config from '@/config';
import i18n from '@/lib/i18n';

interface LocatorApiRequestOptions {
  method?: 'get' | 'post';
  body?: FormData;
}

export default class LocatorApi {
  static async request<T>(
    url: string,
    options: LocatorApiRequestOptions,
  ): Promise<T> {
    const locale =
      !i18n.language || i18n.language === 'en' ? 'en-GB' : i18n.language;
    const fullUrl = new URL(`${config.locatorApiPath}${url}`);
    fullUrl.searchParams.set('lang', locale);

    const response = await fetch(fullUrl.toString(), {
      headers: {
        'X-Request-ID':
          window?.crypto?.randomUUID?.() ?? uniqueId('request-id'),
        'X-Requested-With': config.packageVersion,
        'Accept-Language': locale,
      },
      ...options,
    });

    return response.json();
  }

  static async get<T>(url: string): Promise<T> {
    return LocatorApi.request<T>(url, { method: 'get' });
  }

  static async post<T>(url: string, body: FormData): Promise<T> {
    return LocatorApi.request<T>(url, { method: 'post', body });
  }
}
