import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Link, useSearchParams } from 'react-router';

export default function SignUpPage() {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    postcode: false,
    gdpr: false,
  });

  const [error, setError] = useState(false);

  const action =
    'https://wrap.us1.list-manage.com/subscribe/post?u=65343110dd35be920e719fccd&amp;id=3d85122919&amp;f_id=00ffd3e0f0';

  async function handleSubmit(event) {
    event.preventDefault();
    const signupForm = event?.submitter?.form ?? event.target;

    const newErrors = { ...errors };
    Object.keys(errors).forEach((key) => {
      newErrors[key] = false;
    });
    setError(false);

    Object.keys(errors).forEach((key) => {
      const input = signupForm.querySelector(
        `#${key}-input`,
      ) as HTMLInputElement;
      if (!input.validity.valid) {
        newErrors[key] = true;
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error === true);
    if (hasErrors) {
      return;
    }

    Object.assign(signupForm, { action, method: 'post', onsubmit: null });

    try {
      signupForm.submit();
    } catch (error) {
      setError(true);
    }
  }

  return (
    <diamond-section padding="lg">
      <h2>{t('refill.sign-up.title')}</h2>
      <p>{t('refill.sign-up.description')}</p>
      <Form onSubmit={handleSubmit} noValidate>
        <input
          type="hidden"
          tabIndex={-1}
          aria-hidden="true"
          name="b_65343110dd35be920e719fccd_3d85122919"
          value=""
        />
        <diamond-form-group className="diamond-spacing-bottom-md">
          <label htmlFor="name-input">
            {t('refill.sign-up.form.name.label')}
          </label>
          <diamond-input>
            <input
              id="name-input"
              name="MMERGE6"
              type="text"
              required
              onChange={() => setErrors((prev) => ({ ...prev, name: false }))}
            />
          </diamond-input>
          {errors.name && (
            <p
              id="name-error"
              className="text-color-negative diamond-text-size-sm"
              aria-live="polite"
            >
              {t('refill.sign-up.form.name.error')}
            </p>
          )}
        </diamond-form-group>
        <diamond-form-group className="diamond-spacing-bottom-md">
          <label htmlFor="email-input">
            {t('refill.sign-up.form.email.label')}
          </label>
          <diamond-input>
            <input
              id="email-input"
              name="EMAIL"
              type="email"
              placeholder={t('refill.sign-up.form.email.placeholder') as string}
              required
              onChange={() => setErrors((prev) => ({ ...prev, email: false }))}
            />
          </diamond-input>
          {errors.email && (
            <p
              id="email-error"
              className="text-color-negative diamond-text-size-sm"
              aria-live="polite"
            >
              {t('refill.sign-up.form.email.error')}
            </p>
          )}
        </diamond-form-group>
        <diamond-form-group className="diamond-spacing-bottom-md">
          <label htmlFor="postcode-input">
            {t('refill.sign-up.form.postcode.label')}
          </label>
          <diamond-input>
            <locator-icon icon="pin" color="primary" />
            <input
              id="postcode-input"
              name="MMERGE5"
              type="text"
              defaultValue={postcode}
              placeholder={
                t('refill.sign-up.form.postcode.placeholder') as string
              }
              required
              onChange={() =>
                setErrors((prev) => ({ ...prev, postcode: false }))
              }
            />
          </diamond-input>
          {errors.postcode && (
            <p
              id="postcode-error"
              className="text-color-negative diamond-text-size-sm"
              aria-live="polite"
            >
              {t('refill.sign-up.form.postcode.error')}
            </p>
          )}
        </diamond-form-group>

        <diamond-form-group className="diamond-spacing-bottom-md">
          <diamond-radio-checkbox className="diamond-spacing-bottom-none">
            <label>
              <input
                type="checkbox"
                id="gdpr-input"
                name="gdpr-input"
                required
                onChange={() => setErrors((prev) => ({ ...prev, gdpr: false }))}
              />
              <Trans
                i18nKey={'refill.sign-up.form.gdpr.label'}
                components={{
                  a: <Link to="https://www.recyclenow.com/privacy-policy" />,
                }}
              />
            </label>
          </diamond-radio-checkbox>
          {errors.gdpr && (
            <p
              id="gdpr-error"
              className="text-color-negative diamond-text-size-sm"
              aria-live="polite"
            >
              {t('refill.sign-up.form.gdpr.error')}
            </p>
          )}
        </diamond-form-group>

        <p
          className="text-color-negative diamond-text-size-sm"
          aria-live="polite"
        >
          {error && t('refill.sign-up.form.error')}
        </p>

        <diamond-button
          variant="primary"
          width="full-width"
          className="diamond-spacing-bottom-md"
        >
          <button type="submit">Sign up</button>
        </diamond-button>
      </Form>
      <p>
        <Trans
          i18nKey={'refill.sign-up.business'}
          components={{
            a: (
              <Link to="https://www.wrap.ngo/take-action/recycle-now/recycling-locator-tool" />
            ),
          }}
        />
      </p>
    </diamond-section>
  );
}
