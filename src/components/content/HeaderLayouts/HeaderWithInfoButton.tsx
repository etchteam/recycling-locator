import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

import useAnalytics from '@/hooks/useAnalytics';

import HeaderBase from './HeaderBase';

export interface HeaderWithInfoButtonProps {
  /**
   * Whether the info panel is currently open.
   */
  readonly infoOpen: boolean;
  /**
   * Callback to toggle the info panel open/closed state.
   */
  readonly onToggleInfo: () => void;
  /**
   * ID of the main content area controlled by this header's toggle button.
   * Used for aria-controls attribute for accessibility.
   */
  readonly mainContentId: string;
}

/**
 * Header layout with full logo and info/close toggle button.
 * Used on start and postcode pages to show the about panel.
 * Tracks analytics when info panel is opened.
 */
export default function HeaderWithInfoButton({
  infoOpen,
  onToggleInfo,
  mainContentId,
}: HeaderWithInfoButtonProps) {
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();

  useEffect(() => {
    if (infoOpen === true) {
      recordEvent({
        category: 'About',
        action: 'Open',
      });
    }
  }, [infoOpen, recordEvent]);

  return (
    <HeaderBase logoType={undefined}>
      <evg-button variant="ghost" width="square">
        <button
          type="button"
          data-testid="about-button"
          aria-expanded={infoOpen}
          aria-controls={mainContentId}
          onClick={onToggleInfo}
        >
          <locator-icon
            icon={infoOpen ? 'close' : 'info'}
            label={t(`about.button.${infoOpen ? 'close' : 'view'}`)}
            color="primary"
          />
        </button>
      </evg-button>
    </HeaderBase>
  );
}
