import { useTranslation } from 'react-i18next';

export default function LoadingPlacesMap() {
  const { t } = useTranslation();

  return (
    <locator-loading>
      <locator-hero size="full">
        <locator-icon icon="distance" color="muted" />
        <h3>{t('places.loading')}</h3>
      </locator-hero>
    </locator-loading>
  );
}
