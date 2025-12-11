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
    <diamond-card border radius>
      <locator-icon-text className="diamond-spacing-bottom-xs">
        <locator-icon-circle variant="negative">
          <locator-icon icon="close"></locator-icon>
        </locator-icon-circle>
        <h3>{t(`${tContext}.title`)}</h3>
      </locator-icon-text>
      <p className="diamond-text-size-sm">{t(`${tContext}.content`)}</p>
      <diamond-button width="full-width">
        <a
          href={`${localAuthority.recyclingUri}?utm_source=wrap-recycling-locator`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {localAuthority.name}
        </a>
      </diamond-button>
    </diamond-card>
  );
}
