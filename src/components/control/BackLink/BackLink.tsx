import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';

import { useNavigation } from '@/hooks/NavigationProvider';

export interface BackLinkProps {
  /**
   * The path to navigate to if there's no navigation history.
   */
  readonly fallback: string;
  /**
   * Optional accessible label for the back button.
   * Defaults to translated "Back" text.
   */
  readonly label?: string;
  /**
   * Optional visible content to render after the arrow icon, e.g. a text label.
   */
  readonly children?: ComponentChildren;
}

/**
 * A contextual back link that navigates to the previous page in history,
 * or falls back to a specified path if no history exists.
 */
export default function BackLink({ fallback, label, children }: BackLinkProps) {
  const { t } = useTranslation();
  const { navigateBack } = useNavigation();

  function handleClick(event: Event) {
    event.preventDefault();
    navigateBack({ fallback });
  }

  return (
    <a href={fallback} onClick={handleClick}>
      {children ? (
        <locator-icon-text>
          <locator-icon icon="arrow-left" label={label} />
          <span>{children}</span>
        </locator-icon-text>
      ) : (
        <locator-icon icon="arrow-left" label={label ?? t('actions.back')} />
      )}
    </a>
  );
}
