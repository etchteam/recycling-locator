import { ComponentChildren } from 'preact';
import { Link } from 'wouter-preact';

import { HeaderTitleProps } from '../HeaderTitle/HeaderTitle';
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
  readonly children?: ComponentChildren;
}

/**
 * Common props for header layouts that display a title.
 * Combines required logoHref with title/subtitle props.
 */
export type HeaderWithTitleLayoutProps = Pick<
  HeaderTitleProps,
  'title' | 'subtitle'
> &
  Pick<HeaderBaseProps, 'logoType' | 'logoHref' | 'children'>;

export function HeaderLogo({
  logoType,
  logoHref,
}: Pick<HeaderBaseProps, 'logoHref' | 'logoType'>) {
  const locale = i18n.language;

  return logoHref ? (
    <Link href={logoHref}>
      <locator-logo type={logoType} locale={locale} />
    </Link>
  ) : (
    <locator-logo type={logoType} locale={locale} />
  );
}

/**
 * Base header component that provides the common shell structure.
 * Use this as a foundation for specific header layout variants.
 */
export default function HeaderBase({
  logoType,
  logoHref,
  children,
}: HeaderBaseProps) {
  // Logo placement depends on type:
  // - 'icon-only': Renders in locator-header-logo, which is hidden on mobile
  //   via CSS and shown on larger screens with a border separator
  // - undefined (full logo): Renders inside locator-header-content so it's always
  //   visible and flows with the header content
  return (
    <locator-header>
      {logoType === 'icon-only' && (
        <locator-header-logo>
          <HeaderLogo logoHref={logoHref} logoType={logoType} />
        </locator-header-logo>
      )}
      <locator-header-content>
        {logoType !== 'icon-only' && (
          <HeaderLogo logoHref={logoHref} logoType={logoType} />
        )}
        {children}
      </locator-header-content>
    </locator-header>
  );
}
