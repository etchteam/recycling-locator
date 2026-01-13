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
}

/**
 * A contextual back link that navigates to the previous page in history,
 * or falls back to a specified path if no history exists.
 */
export default function BackLink({ fallback, label }: BackLinkProps) {
  const { t } = useTranslation();
  const { navigateBack } = useNavigation();
  const ariaLabel = label ?? t('actions.back');

  function handleClick(event: Event) {
    event.preventDefault();
    navigateBack({ fallback });
  }

  return (
    <a href={fallback} onClick={handleClick}>
      <locator-icon icon="arrow-left" label={ariaLabel} />
    </a>
  );
}
