import Axios from 'axios';
import {
  AxiosCacheInstance,
  CacheAxiosResponse,
  setupCache,
} from 'axios-cache-interceptor';
import uniqueId from 'lodash/uniqueId';

import config from '@/config';
import i18n from '@/lib/i18n';

export default class LocatorApi {
  private static instance: LocatorApi;
  private readonly axios: AxiosCacheInstance;

  private constructor() {
    const instance = Axios.create();
    this.axios = setupCache(instance);
  }

  public static getInstance(): LocatorApi {
    if (!LocatorApi.instance) {
      LocatorApi.instance = new LocatorApi();
    }
    return LocatorApi.instance;
  }

  async request<T>(url: string, body?: FormData): Promise<T> {
    const locale =
      !i18n.language || i18n.language === 'en' ? 'en-GB' : i18n.language;
    const fullUrl = new URL(`${config.locatorApiPath}${url}`);
    fullUrl.searchParams.set('lang', locale);

    const fullOptions = {
      headers: {
        'X-Request-ID':
          window?.crypto?.randomUUID?.() ?? uniqueId('request-id'),
        'X-Requested-With': config.packageVersion,
        'Accept-Language': locale,
      },
      cache: {
        interpretHeader: false,
      },
    };

    let response: CacheAxiosResponse<T, unknown>;

    if (body) {
      response = await this.axios.post(fullUrl.toString(), body, fullOptions);
    } else {
      response = await this.axios.get(fullUrl.toString(), fullOptions);
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Locator API request failed with status ${response.status}: ${response.statusText}`,
      );
    }

    return response.data;
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url);
  }

  async post<T>(url: string, body: FormData): Promise<T> {
    return this.request<T>(url, body);
  }
}
