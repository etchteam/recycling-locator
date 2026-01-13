import { ComponentChildren } from 'preact';
import { Link } from 'wouter-preact';

import BackLink from '@/components/control/BackLink/BackLink';

export interface HeaderWithBackButtonProps {
  /**
   * Link destination for the logo.
   */
  readonly logoHref: string;
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
  /**
   * Optional content to display on the right side of the header.
   * On small screens, this wraps below the title.
   */
  readonly children?: ComponentChildren;
}

/**
 * Header layout with icon logo, back button, and title/subtitle.
 * Uses contextual back navigation - returns to previous page in history,
 * or falls back to the specified path.
 * Accepts optional children for right-side content that wraps on small screens.
 */
export default function HeaderWithBackButton({
  logoHref,
  title,
  subtitle,
  backFallback,
  children,
}: HeaderWithBackButtonProps) {
  return (
    <locator-header>
      <locator-header-logo>
        <Link href={logoHref}>
          <locator-logo type="logo-only" />
        </Link>
      </locator-header-logo>
      <locator-header-content-wrap>
        <locator-header-title>
          <evg-button>
            <BackLink fallback={backFallback} />
          </evg-button>
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </locator-header-title>
        {children}
      </locator-header-content-wrap>
    </locator-header>
  );
}
