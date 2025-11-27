import { test, expect } from './fixtures';

test.describe('Refill pages', () => {
  test('Refill pages display', async ({ widget, i18n }) => {
    await widget.evaluate((node) => node.setAttribute('path', '/refill'));
    const refillTitle = widget.getByText(i18n.t('refill.discover.title')).first();

    await expect(refillTitle).toBeVisible();
  });
});
