import { expect } from '@playwright/test';
import { t } from 'i18next';
import { test } from 'vitest';

import describeEndToEndTest from '../utils/describeEndToEndTest';

describeEndToEndTest('About page', () => {
  test('About page displays when info button is clicked', async ({ page }) => {
    const button = page.getByTestId('about-button').first();
    const aboutTitle = page.getByText(t('about.title')).first();
    await expect(button).toBeVisible();
    await expect(aboutTitle).not.toBeVisible();
    await button.click();
    await expect(aboutTitle).toBeVisible();
    await button.click();
    await expect(aboutTitle).not.toBeVisible();
  });
});
