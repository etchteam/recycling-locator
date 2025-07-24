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
    const instance = Axios.create({
      baseURL: config.locatorApiPath,
    });
    this.axios = setupCache(instance);
  }

  public static getInstance(): LocatorApi {
    if (!LocatorApi.instance) {
      LocatorApi.instance = new LocatorApi();
    }
    return LocatorApi.instance;
  }

  /**
   * Removes leading and trailing slashes from a path.
   * Trailing slashes cause issues with the API in production.
   * @param path
   * @returns
   */
  private cleanPath(path: string): string {
    return path.replace(/^\/+|\/+$/g, '');
  }

  async request<T>(path: string, body?: FormData): Promise<T> {
    const locale =
      !i18n.language || i18n.language === 'en' ? 'en-GB' : i18n.language;

    const fullOptions = {
      headers: {
        'X-Request-ID':
          window?.crypto?.randomUUID?.() ?? uniqueId('request-id'),
        'X-Requested-With': config.packageVersion,
        'Accept-Language': locale,
      },
      params: new URLSearchParams([['lang', locale]]),
      cache: {
        interpretHeader: false,
      },
    };

    let response: CacheAxiosResponse<T, unknown>;

    if (body) {
      response = await this.axios.post(this.cleanPath(path), body, fullOptions);
    } else {
      response = await this.axios.get(this.cleanPath(path), fullOptions);
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
