import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import useAnalytics from '@/hooks/useAnalytics';
import i18n from '@/lib/i18n';

export interface InfoHeaderProps {
  readonly infoOpen: boolean;
  readonly handleOpenInfo: () => void;
}

export default function InfoHeader({
  infoOpen,
  handleOpenInfo,
}: InfoHeaderProps) {
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();
  const locale = i18n.language;

  useEffect(() => {
    if (infoOpen === true) {
      recordEvent({
        category: 'About',
        action: 'Open',
      });
    }
  }, [infoOpen, recordEvent]);

  return (
    <locator-header>
      <locator-header-content>
        <locator-logo locale={locale}></locator-logo>
        <evg-button variant="ghost" width="square">
          <button
            type="button"
            data-testid="about-button"
            aria-expanded={infoOpen}
            aria-controls="locator-layout-main"
            onClick={handleOpenInfo}
          >
            <locator-icon
              icon={infoOpen ? 'close' : 'info'}
              label={t(`about.button.${infoOpen ? 'close' : 'view'}`)}
              color="primary"
            ></locator-icon>
          </button>
        </evg-button>
      </locator-header-content>
    </locator-header>
  );
}
