import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/control/LocationInput/LocationInput';

import LocationForm from '@/components/control/LocationForm/LocationForm';
import tArray from '@/lib/tArray';

export default function StartPage() {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('start.title')}</h2>
      <ul>
        {tArray('start.aside.list').map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="diamond-spacing-bottom-md">
        <LocationForm />
      </div>
    </>
  );
}
