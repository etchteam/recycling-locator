import { useTranslation } from 'react-i18next';

import { LocalAuthority } from '@/types/locatorApi';

export default function HazardousWarning({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { t } = useTranslation();
  const tContext = 'material.hazardousWarning';

  return (
    <evg-card radius="sm">
      <evg-card-content>
        <locator-icon-text className="evg-spacing-bottom-xs">
          <locator-icon-circle variant="negative">
            <locator-icon icon="close"></locator-icon>
          </locator-icon-circle>
          <h3>{t(`${tContext}.title`)}</h3>
        </locator-icon-text>
        <p className="evg-text-size-body-xs evg-spacing-bottom-sm">
          {t(`${tContext}.content`)}
        </p>
        <evg-button width="full-width">
          <a
            href={`${localAuthority.recyclingUri}?utm_source=wrap-recycling-locator`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {localAuthority.name}
          </a>
        </evg-button>
      </evg-card-content>
    </evg-card>
  );
}
