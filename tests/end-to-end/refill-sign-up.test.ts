import {
  GEOCODE_ENDPOINT,
  PostcodeGeocodeResponse,
} from '../mocks/geocode';

import { test, expect } from './fixtures';

const MAILCHIMP_ENDPOINT = '**/subscribe/post-json*';

function jsonpResponse(callbackParam: string, data: object) {
  return {
    contentType: 'application/javascript',
    body: `${callbackParam}(${JSON.stringify(data)})`,
  };
}

function getJsonpCallback(url: string): string {
  const parsed = new URL(url);
  return parsed.searchParams.get('c') || '__jp0';
}

test.describe('Refill sign-up page', () => {
  test('Page renders with title', async ({ page, widget, i18n }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/sign-up'),
    );

    const title = widget
      .getByText(i18n.t('refill.discover.sign-up.title'))
      .first();

    await expect(title).toBeVisible();
  });

  test('Submitting empty form shows validation errors', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/sign-up'),
    );

    const title = widget
      .getByText(i18n.t('refill.discover.sign-up.title'))
      .first();
    await expect(title).toBeVisible();

    const submitButton = widget.getByRole('button', {
      name: i18n.t('refill.discover.sign-up.button'),
    });
    await submitButton.click();

    const nameError = widget
      .getByText(i18n.t('refill.discover.sign-up.form.name.error'))
      .first();
    const emailError = widget
      .getByText(i18n.t('refill.discover.sign-up.form.email.error'))
      .first();
    const gdprError = widget
      .getByText(i18n.t('refill.discover.sign-up.form.gdpr.error'))
      .first();

    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();
    await expect(gdprError).toBeVisible();
  });

  test('Successful form submission shows success message', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(MAILCHIMP_ENDPOINT, (route) => {
      const callback = getJsonpCallback(route.request().url());
      route.fulfill(
        jsonpResponse(callback, { result: 'success', msg: 'Thank you' }),
      );
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/sign-up'),
    );

    const title = widget
      .getByText(i18n.t('refill.discover.sign-up.title'))
      .first();
    await expect(title).toBeVisible();

    await widget.locator('#name-input').fill('Test User');
    await widget.locator('#email-input').fill('test@example.com');
    await widget.locator('#gdpr-input').check();

    const submitButton = widget.getByRole('button', {
      name: i18n.t('refill.discover.sign-up.button'),
    });
    await submitButton.click();

    const successTitle = widget
      .getByText(i18n.t('refill.discover.sign-up.success.title'))
      .first();

    await expect(successTitle).toBeVisible();
  });

  test('Already subscribed shows appropriate message', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(MAILCHIMP_ENDPOINT, (route) => {
      const callback = getJsonpCallback(route.request().url());
      route.fulfill(
        jsonpResponse(callback, {
          result: 'success',
          msg: "You're already subscribed",
        }),
      );
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/sign-up'),
    );

    const title = widget
      .getByText(i18n.t('refill.discover.sign-up.title'))
      .first();
    await expect(title).toBeVisible();

    await widget.locator('#name-input').fill('Test User');
    await widget.locator('#email-input').fill('test@example.com');
    await widget.locator('#gdpr-input').check();

    const submitButton = widget.getByRole('button', {
      name: i18n.t('refill.discover.sign-up.button'),
    });
    await submitButton.click();

    const alreadyMessage = widget
      .getByText(i18n.t('refill.discover.sign-up.success.already'))
      .first();

    await expect(alreadyMessage).toBeVisible();
  });

  test('Failed submission shows error message', async ({
    page,
    widget,
    i18n,
  }) => {
    await page.route(GEOCODE_ENDPOINT, (route) => {
      route.fulfill({ json: PostcodeGeocodeResponse });
    });

    await page.route(MAILCHIMP_ENDPOINT, (route) => {
      const callback = getJsonpCallback(route.request().url());
      route.fulfill(
        jsonpResponse(callback, {
          result: 'error',
          msg: '0 - This email address is invalid',
        }),
      );
    });

    await widget.evaluate((node) =>
      node.setAttribute('path', '/EX32 7RB/refill/sign-up'),
    );

    const title = widget
      .getByText(i18n.t('refill.discover.sign-up.title'))
      .first();
    await expect(title).toBeVisible();

    await widget.locator('#name-input').fill('Test User');
    await widget.locator('#email-input').fill('test@example.com');
    await widget.locator('#gdpr-input').check();

    const submitButton = widget.getByRole('button', {
      name: i18n.t('refill.discover.sign-up.button'),
    });
    await submitButton.click();

    const errorMessage = widget
      .getByText('This email address is invalid')
      .first();

    await expect(errorMessage).toBeVisible();
  });
});
