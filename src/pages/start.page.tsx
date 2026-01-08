import { useTranslation } from 'react-i18next';

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
      <div className="evg-spacing-bottom-md">
        <LocationForm />
      </div>
    </>
  );
}
