import { useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/control/LocationInput/LocationInput';
import LocationForm from '@/components/control/LocationForm/LocationForm';

/**
 * The user only has to enter a location to skip straight to the home recycling page.
 */
export default function HomeRecyclingStartPage() {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('start.homeRecycling.title')}</h2>
      <LocationForm action="/home-recycling" />
    </>
  );
}
