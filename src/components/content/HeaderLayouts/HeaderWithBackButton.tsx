import { HeaderTitle } from '../HeaderTitle/HeaderTitle';
import BackLink from '@/components/control/BackLink/BackLink';

import HeaderBase, { HeaderWithTitleLayoutProps } from './HeaderBase';

export interface HeaderWithBackButtonProps extends HeaderWithTitleLayoutProps {
  /**
   * Fallback path for the back button when no navigation history exists.
   */
  readonly backFallback: string;
}

/**
 * Header layout with icon logo, back button, and title/subtitle.
 * Uses contextual back navigation - returns to previous page in history,
 * or falls back to the specified path.
 * Accepts optional children for right-side content that wraps on small screens.
 */
export default function HeaderWithBackButton({
  logoType,
  logoHref,
  title,
  subtitle,
  backFallback,
  children,
}: HeaderWithBackButtonProps) {
  return (
    <HeaderBase logoHref={logoHref} logoType={logoType}>
      <HeaderTitle title={title} subtitle={subtitle}>
        <evg-button>
          <BackLink fallback={backFallback} />
        </evg-button>
      </HeaderTitle>
      {children}
    </HeaderBase>
  );
}
