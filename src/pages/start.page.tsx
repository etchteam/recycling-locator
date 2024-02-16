import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-router-dom';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/control/LocationInput/LocationInput';
import StartLayout from '@/pages/layout';

export default function StartPage() {
  const { t } = useTranslation();
  const submitting = useSignal(false);

  return (
    <StartLayout>
      <locator-wrap>
        <diamond-section padding="lg">
          <h2>{t('start.title')}</h2>
          <Form method="post" onSubmit={() => (submitting.value = true)}>
            <diamond-form-group class="diamond-spacing-bottom-md">
              <label htmlFor="location-input">Where are you?</label>
              <locator-location-input
                placeholder={t('start.placeholder')}
              ></locator-location-input>
            </diamond-form-group>
            <diamond-button width="full-width" variant="primary">
              <button type="submit" disabled={submitting.value}>
                Get started
              </button>
            </diamond-button>
          </Form>
        </diamond-section>
      </locator-wrap>
    </StartLayout>
  );
}