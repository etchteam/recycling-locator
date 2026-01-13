import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';

import Menu from '@/components/control/Menu/Menu';

import HeaderBase, {
  HeaderTitle,
  HeaderWithTitleLayoutProps,
} from './HeaderBase';

export interface HeaderWithMenuProps extends HeaderWithTitleLayoutProps {
  /**
   * Whether the menu is currently open.
   */
  readonly menuOpen: boolean;
  /**
   * Callback to toggle the menu open/closed state.
   */
  readonly onToggleMenu: () => void;
  /**
   * ID of the main content area controlled by this header's toggle button.
   * Used for aria-controls attribute for accessibility.
   */
  readonly mainContentId: string;
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
  onToggleMenu,
  mainContentId,
  children,
}: HeaderWithMenuProps) {
  const { t } = useTranslation();

  return (
    <HeaderBase
      logoHref={logoHref}
      logoType={menuOpen ? undefined : 'logo-only'}
    >
      <HeaderTitle
        title={menuOpen ? undefined : title}
        subtitle={menuOpen ? undefined : subtitle}
      >
        <evg-button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={mainContentId}
            onClick={onToggleMenu}
          >
            <locator-icon
              icon={menuOpen ? 'close' : 'menu'}
              label={t(`actions.${menuOpen ? 'close' : 'menu'}`)}
              color="primary"
            />
          </button>
        </evg-button>
      </HeaderTitle>
      {children}
    </HeaderBase>
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
   * Whether the menu is currently open.
   */
  readonly menuOpen: boolean;
  /**
   * Callback to close the menu.
   */
  readonly onCloseMenu: () => void;
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
  onCloseMenu,
  children,
}: MenuLayoutProps) {
  if (menuOpen) {
    return <Menu handleClose={onCloseMenu} postcode={postcode} city={city} />;
  }

  return <>{children}</>;
}
