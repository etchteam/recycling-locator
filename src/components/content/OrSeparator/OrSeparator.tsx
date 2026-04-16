import { useTranslation } from 'react-i18next';

export default function OrSeparator() {
  const { t } = useTranslation();

  return (
    <evg-grid className="evg-spacing-top-sm" align-items="center">
      <evg-grid-item grow>
        <hr aria-hidden="true" />
      </evg-grid-item>
      <evg-grid-item>
        <span className="evg-text-size-body-xs">{t('common.or')}</span>
      </evg-grid-item>
      <evg-grid-item grow>
        <hr aria-hidden="true" />
      </evg-grid-item>
    </evg-grid>
  );
}
