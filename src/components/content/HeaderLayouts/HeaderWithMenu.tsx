import { Signal, useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import Menu from '@/components/control/Menu/Menu';
import i18n from '@/lib/i18n';

export interface HeaderWithMenuProps {
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
   * Signal to control the menu open state.
   */
  readonly menuOpen: Signal<boolean>;
  /**
   * Optional content to display on the right side of the header.
   * On small screens, this wraps below the title.
   */
  readonly children?: ComponentChildren;
}

/**
 * Header layout with icon logo, menu button, and title.
 * When menu is open, shows full logo and close button instead.
 * Accepts optional children for right-side content that wraps on small screens.
 */
export default function HeaderWithMenu({
  logoHref,
  title,
  subtitle,
  menuOpen,
  children,
}: HeaderWithMenuProps) {
  const { t } = useTranslation();
  const locale = i18n.language;

  if (menuOpen.value) {
    return (
      <locator-header>
        <locator-header-content>
          <Link href={logoHref}>
            <locator-logo locale={locale} />
          </Link>
          <evg-button variant="ghost" width="square">
            <button
              type="button"
              aria-expanded="true"
              aria-controls="locator-layout-main"
              onClick={() => (menuOpen.value = false)}
            >
              <locator-icon
                icon="close"
                label={t('actions.close')}
                color="primary"
              />
            </button>
          </evg-button>
        </locator-header-content>
      </locator-header>
    );
  }

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
            <button
              type="button"
              aria-expanded="false"
              aria-controls="locator-layout-main"
              onClick={() => (menuOpen.value = true)}
            >
              <locator-icon icon="menu" label={t('actions.menu')} />
            </button>
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

export interface MenuLayoutProps {
  /**
   * The postcode for the Menu component.
   */
  readonly postcode?: string;
  /**
   * The city for the Menu component.
   */
  readonly city?: string;
  /**
   * Signal to control the menu open state.
   */
  readonly menuOpen: Signal<boolean>;
  /**
   * Content to render when menu is closed.
   */
  readonly children: ComponentChildren;
}

/**
 * Helper component for rendering either the Menu or main content
 * based on the menu open state. Use with HeaderWithMenu.
 */
export function MenuLayout({
  postcode,
  city,
  menuOpen,
  children,
}: MenuLayoutProps) {
  if (menuOpen.value) {
    return (
      <Menu
        handleClose={() => (menuOpen.value = false)}
        postcode={postcode}
        city={city}
      />
    );
  }

  return <>{children}</>;
}

/**
 * Hook to create a menu open signal for use with HeaderWithMenu and MenuLayout.
 */
export function useMenuOpen() {
  return useSignal(false);
}
