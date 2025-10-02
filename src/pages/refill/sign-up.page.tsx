import fetchJsonp from 'fetch-jsonp';
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

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState('');

  const action =
    'https://wrap.us1.list-manage.com/subscribe/post-json?u=65343110dd35be920e719fccd&amp;id=3d85122919&amp;f_id=00ffd3e0f0';

  async function handleSubmit(event) {
    event.preventDefault();
    const signupForm = event?.submitter?.form ?? event.target;

    const newErrors = { ...errors };
    Object.keys(errors).forEach((key) => {
      newErrors[key] = false;
    });
    setError('');

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

    setIsSubmitting(true);

    try {
      const formData = new FormData(signupForm);
      const params = new URLSearchParams();

      for (const [key, value] of formData.entries()) {
        params.append(key, value.toString());
      }

      // Submit using fetch-jsonp to avoid CORS issues
      const response = await fetchJsonp(`${action}&${params.toString()}`, {
        timeout: 10000,
        jsonpCallback: 'c',
      });
      const result = await response.json();

      if (result.result === 'success') {
        // Display already subscribed message from MailChimp if user tries to sign up again
        setIsSubmitted(result.msg || t('refill.sign-up.success.confirmation'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.msg || t('refill.sign-up.error'));
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      let errorMessage = error.message || t('refill.sign-up.error');

      // Remove error number prefix from MailChimp errors (e.g., "0 - This email address...")
      if (
        typeof errorMessage === 'string' &&
        errorMessage.match(/^\d+\s*-\s*/)
      ) {
        errorMessage = errorMessage.replace(/^\d+\s*-\s*/, '');
      }

      setError(errorMessage);
      setIsSubmitting(false);
    }
  }

  return (
    <diamond-section padding="lg">
      <div aria-live="polite" role="status" aria-atomic="true">
        {isSubmitted && (
          <>
            <h2>{t('refill.sign-up.success.title')}</h2>
            <p className="text-color-positive diamond-text-size-sm">
              {isSubmitted}
            </p>
            <p>{t('refill.sign-up.success.description')}</p>
          </>
        )}
      </div>

      {!isSubmitted && (
        <>
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
                  disabled={isSubmitting || !!isSubmitted}
                  onChange={() =>
                    setErrors((prev) => ({ ...prev, name: false }))
                  }
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
                  autoComplete="email"
                  placeholder={
                    t('refill.sign-up.form.email.placeholder') as string
                  }
                  required
                  disabled={isSubmitting || !!isSubmitted}
                  onChange={() =>
                    setErrors((prev) => ({ ...prev, email: false }))
                  }
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
                  disabled={isSubmitting || !!isSubmitted}
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
                    disabled={isSubmitting || !!isSubmitted}
                    onChange={() =>
                      setErrors((prev) => ({ ...prev, gdpr: false }))
                    }
                  />
                  <Trans
                    i18nKey={'refill.sign-up.form.gdpr.label'}
                    components={{
                      a: (
                        <Link
                          to={t('refill.sign-up.form.gdpr.link') as string}
                        />
                      ),
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
              {error}
            </p>

            <diamond-button
              variant="primary"
              width="full-width"
              className="diamond-spacing-bottom-md"
            >
              <button type="submit" disabled={isSubmitting || !!isSubmitted}>
                {isSubmitting
                  ? t('refill.sign-up.loading')
                  : t('refill.sign-up-button')}
              </button>
            </diamond-button>
          </Form>
        </>
      )}

      <p>
        <Trans
          i18nKey={'refill.sign-up.business'}
          components={{
            a: <Link to={t('refill.sign-up.businessLink') as string} />,
          }}
        />
      </p>
    </diamond-section>
  );
}
