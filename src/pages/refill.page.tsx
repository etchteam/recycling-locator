import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/control/LocationInput/LocationInput';

import tArray from '@/lib/tArray';
import StartLayout from '@/pages/start.layout';

import LocationForm from './LocationForm';

export default function RefillStartPage() {
  const { t } = useTranslation();

  return (
    <StartLayout>
      <locator-wrap>
        <diamond-section padding="lg">
          <h2>{t('refill.start.title')}</h2>
          <p>{t('refill.start.intro')}</p>
          <LocationForm action="/refill" />
          <hr className="diamond-spacing-top-lg" />
          <p className="diamond-spacing-top-md">
            {t('refill.start.aside.paragraph')}
          </p>
          <ul>
            {tArray('refill.start.aside.list').map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </diamond-section>
      </locator-wrap>
    </StartLayout>
  );
}
