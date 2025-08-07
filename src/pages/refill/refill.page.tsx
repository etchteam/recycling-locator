import { useTranslation } from 'react-i18next';

import '@etchteam/diamond-ui/canvas/Section/Section';
import RefillLayout from './refill.layout';

export default function RefillPage() {
  const { t } = useTranslation();

  return (
    <RefillLayout>
      <diamond-section padding="lg">
        <h2>{t('refill.start.title')}</h2>
        <p className="text-color-positive text-italic">
          {t('refill.start.comingSoon')}
        </p>
      </diamond-section>
    </RefillLayout>
  );
}
