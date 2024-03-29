import { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Form, useLocation, useSearchParams } from 'react-router-dom';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';

import LocationInput from '@/components/control/LocationInput/LocationInput';
import useFormValidation from '@/lib/useFormValidation';

export default function LocationForm({
  label,
  cta,
  action = '/',
  children,
}: {
  readonly label?: string;
  readonly cta?: string;
  readonly action?: string;
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const form = useFormValidation('location');
  const [searchParams] = useSearchParams();
  const autofocus = searchParams.get('autofocus') === 'true';

  useEffect(() => {
    form.submitting.value = false;
  }, [location]);

  return (
    <Form action={action} method="post" onSubmit={form.handleSubmit}>
      <diamond-form-group className="diamond-spacing-bottom-md">
        <label htmlFor="location-input">{label ?? t('start.label')}</label>
        <LocationInput
          autofocus={autofocus}
          handleBlur={form.handleBlur}
          handleInput={form.handleInput}
          valid={form.valid.value}
        ></LocationInput>
      </diamond-form-group>
      {children}
      <diamond-button width="full-width" variant="primary">
        <button type="submit" disabled={form.submitting.value}>
          {cta ?? t('start.cta')}
        </button>
      </diamond-button>
    </Form>
  );
}
