/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, Locator } from '@playwright/test';
import i18next from 'i18next';

import {
  translationRouteMock,
  recyclingMetaRouteMock,
  autoSuggestRouteMock,
} from '../utils/commonRouteMocks';
import provideI18n from '../utils/providei18n';
import { waitForWidget } from '../utils/waitForWidget';

export const test = base.extend<{ i18n: typeof i18next; widget: Locator }>({
  i18n: async ({ context }, use) => {
    const i18n = await provideI18n();
    await translationRouteMock(context);
    await use(i18n);
  },

  widget: async ({ page, context }, use) => {
    await page.goto('/');
    await recyclingMetaRouteMock(context);
    await autoSuggestRouteMock(context);
    const widget = await waitForWidget(page);
    await use(widget);
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';
