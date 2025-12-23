import { useTranslation } from 'react-i18next';

import LocationForm from '@/components/control/LocationForm/LocationForm';

/**
 * The user only has to enter a location to skip straight to the home recycling page.
 */
export default function HomeRecyclingStartPage() {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('start.homeRecycling.title')}</h2>
      <LocationForm action="/home" />
    </>
  );
}
