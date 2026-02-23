import { useTranslation } from 'react-i18next';

import LocationForm from '@/components/control/LocationForm/LocationForm';
import tArray from '@/lib/tArray';

export default function RefillStartPage() {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('refill.start.title')}</h2>
      <p>{t('refill.start.intro')}</p>
      <div className="evg-spacing-bottom-md">
        <LocationForm action="/refill" />
      </div>
      <hr className="evg-spacing-bottom-md" />
      <p className="evg-text-weight-bold evg-spacing-bottom-none">
        {t('refill.start.aside.paragraph')}
      </p>
      <ul>
        {tArray('refill.start.aside.list').map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}
