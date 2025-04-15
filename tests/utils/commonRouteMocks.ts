import { BrowserContext } from '@playwright/test';

import en from '../../public/translations/en.json' with { type: 'json' };
import {
  RECYCLING_META_ENDPOINT,
  RecyclingMetaResponse,
} from '../mocks/recyclingMeta';

export function translationRouteMock(browser: BrowserContext) {
  return browser.route('**/translations/en.json', (route) => {
    route.fulfill({ json: en });
  });
}

export function recyclingMetaRouteMock(browser: BrowserContext) {
  return browser.route(RECYCLING_META_ENDPOINT, (route) => {
    route.fulfill({
      json: RecyclingMetaResponse,
    });
  });
}

export function autoSuggestRouteMock(browser: BrowserContext) {
  return browser.route('**/autosuggest*', (route) => {
    route.fulfill({
      json: { items: [] },
    });
  });
}
