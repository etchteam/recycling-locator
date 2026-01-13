import { ComponentChildren } from 'preact';
import { Link } from 'wouter-preact';

import { LogoAttributes } from '@/components/content/Logo/Logo';
import i18n from '@/lib/i18n';

export interface HeaderBaseProps {
  /**
   * Link destination for the logo. If not provided, logo is not wrapped in a link.
   */
  readonly logoHref?: string;
  /**
   * Logo type passed to locator-logo.
   * Defaults to 'logo-only' (icon only). Set to undefined for full logo.
   */
  readonly logoType?: LogoAttributes['type'];
  /**
   * Content to render in the header content area.
   */
  readonly children: ComponentChildren;
}

/**
 * Base header component that provides the common shell structure.
 * Use this as a foundation for specific header layout variants.
 */
export default function HeaderBase({
  logoHref,
  logoType = 'logo-only',
  children,
}: HeaderBaseProps) {
  const locale = i18n.language;

  const logo = <locator-logo type={logoType} locale={locale} />;

  return (
    <locator-header>
      {logoType === 'logo-only' && (
        <locator-header-logo>
          {logoHref ? <Link href={logoHref}>{logo}</Link> : logo}
        </locator-header-logo>
      )}
      <locator-header-content>
        {logoType !== 'logo-only' &&
          (logoHref ? <Link href={logoHref}>{logo}</Link> : logo)}
        {children}
      </locator-header-content>
    </locator-header>
  );
}
