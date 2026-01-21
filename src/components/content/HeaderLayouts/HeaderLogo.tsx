import { Link, useRoute } from 'wouter-preact';

import { LogoAttributes } from '@/components/content/Logo/Logo';
import i18n from '@/lib/i18n';

export interface HeaderLogoProps {
  /**
   * Link destination for the logo. If not provided, logo is not wrapped in a link.
   */
  readonly logoHref?: string;
  /**
   * Logo type passed to locator-logo.
   * Defaults to 'logo-only' (icon only). Set to undefined for full logo.
   */
  readonly logoType?: LogoAttributes['type'];
}

/**
 * Header logo component that optionally wraps the logo in a link and
 * automatically detects refill routes and renders the appropriate logo variant.
 */
export function HeaderLogo({ logoType, logoHref }: HeaderLogoProps) {
  const locale = i18n.language;
  const [isRefillRoute] = useRoute('/:postcode/refill/:rest*');
  const [isRefillHome] = useRoute('/:postcode/refill');
  const [isRefillStart] = useRoute('/refill');

  const isRefill = isRefillRoute || isRefillHome || isRefillStart;
  const variant = isRefill ? 'refill' : undefined;

  if (logoHref) {
    return (
      <Link href={logoHref}>
        <locator-logo type={logoType} locale={locale} variant={variant} />
      </Link>
    );
  }

  return <locator-logo type={logoType} locale={locale} variant={variant} />;
}
