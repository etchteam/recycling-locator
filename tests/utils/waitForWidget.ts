import { Page } from '@playwright/test';

export async function waitForWidget(page: Page) {
  const widget = page.locator('recycling-locator');
  await widget.evaluate(async (node) => {
    return new Promise((resolve) => {
      node.addEventListener('ready', resolve);
      // If ready hasn't emitted after 2 seconds, resolve anyway
      setTimeout(resolve, 2000);
    });
  });
  return widget;
}
