import { useTranslation } from 'react-i18next';

interface MaterialSearchStatusProps {
  readonly hazardous?: boolean;
  readonly nonRecyclable?: boolean;
  readonly hasRecyclingOptions?: boolean;
  readonly loading?: boolean;
}

export default function MaterialSearchStatus({
  hazardous = false,
  nonRecyclable = false,
  hasRecyclingOptions = false,
  loading = false,
}: MaterialSearchStatusProps) {
  const { t } = useTranslation();

  if (hazardous) {
    return (
      <locator-hero variant="hazardous" size="reduced">
        <locator-wrap>
          <evg-enter type="fade">
            <evg-row gap="sm">
              <locator-icon icon="warning" />
              <h3 className="evg-text-size-body-md">
                {t('material.hero.hazardous')}
              </h3>
            </evg-row>
          </evg-enter>
        </locator-wrap>
      </locator-hero>
    );
  }

  if (hasRecyclingOptions) {
    return (
      <locator-hero variant="positive" size="full">
        <locator-wrap>
          <evg-enter type="fade">
            <locator-icon icon="tick-circle" />
            <h3>{t('material.hero.yes')}</h3>
          </evg-enter>
        </locator-wrap>
      </locator-hero>
    );
  }

  if (nonRecyclable || (!hasRecyclingOptions && !hazardous && !loading)) {
    return (
      <locator-hero variant="negative" size="reduced">
        <locator-wrap>
          <evg-enter type="fade">
            <locator-icon-text>
              <locator-icon icon="cross-circle" />
              <h3 className="evg-text-size-body-lg">
                {nonRecyclable
                  ? t('material.hero.no')
                  : t('material.hero.noOptions')}
              </h3>
            </locator-icon-text>
          </evg-enter>
        </locator-wrap>
      </locator-hero>
    );
  }

  return (
    <locator-hero size="full">
      <locator-wrap>
        <locator-icon icon="distance" color="muted" />
        <h3>{t('material.loading')}</h3>
      </locator-wrap>
    </locator-hero>
  );
}
