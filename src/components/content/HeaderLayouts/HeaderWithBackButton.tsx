import BackLink from '@/components/control/BackLink/BackLink';

import HeaderBase, { HeaderBaseProps } from './HeaderBase';

export interface HeaderWithBackButtonProps
  extends Omit<HeaderBaseProps, 'children'> {
  /**
   * The main title text displayed in the header.
   */
  readonly title: string;
  /**
   * Optional subtitle text displayed below the title.
   */
  readonly subtitle?: string;
  /**
   * Fallback path for the back button when no navigation history exists.
   */
  readonly backFallback: string;
}

/**
 * Header layout with icon logo, back button, and title/subtitle.
 * Uses contextual back navigation - returns to previous page in history,
 * or falls back to the specified path.
 */
export default function HeaderWithBackButton({
  logoHref,
  logoType,
  title,
  subtitle,
  backFallback,
}: HeaderWithBackButtonProps) {
  return (
    <HeaderBase logoHref={logoHref} logoType={logoType}>
      <locator-header-title>
        <evg-button>
          <BackLink fallback={backFallback} />
        </evg-button>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </locator-header-title>
    </HeaderBase>
  );
}
