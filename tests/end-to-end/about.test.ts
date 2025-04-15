import { test, expect } from './fixtures';

test.describe('About page', () => {
  test('About page displays when info button is clicked', async ({
    widget,
    i18n,
  }) => {
    const button = widget.getByTestId('about-button').first();
    const aboutTitle = widget.getByText(i18n.t('about.title')).first();

    await expect(button).toBeVisible();
    await expect(aboutTitle).not.toBeVisible();

    await button.click();
    await expect(aboutTitle).toBeVisible();

    await button.click();
    await expect(aboutTitle).not.toBeVisible();
  });
});
