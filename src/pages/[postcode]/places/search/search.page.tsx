import { useTranslation } from 'react-i18next';
import { Form } from 'react-router-dom';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';

import MaterialSearchInput from '@/components/control/MaterialSearchInput/MaterialSearchInput';
import useFormValidation from '@/lib/useFormValidation';

export default function PlacesSearchPage() {
  const { t } = useTranslation();
  const form = useFormValidation('search');

  return (
    <>
      <h3 id="places-search-label">{t('places.search.label')}</h3>
      <Form method="post" onSubmit={form.handleSubmit}>
        <diamond-form-group>
          <MaterialSearchInput
            inputLabelledBy="places-search-label"
            handleBlur={form.handleBlur}
            handleInput={form.handleInput}
            submitting={form.submitting.value}
            valid={form.valid.value}
          ></MaterialSearchInput>
        </diamond-form-group>
      </Form>
    </>
  );
}
