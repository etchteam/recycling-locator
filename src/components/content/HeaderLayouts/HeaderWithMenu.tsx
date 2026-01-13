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
  children,
}: HeaderWithMenuProps) {
  const { t } = useTranslation();

  if (menuOpen) {
    return (
      <HeaderBase logoHref={logoHref} logoType={undefined}>
        <evg-button variant="ghost" width="square">
          <button
            type="button"
            aria-expanded="true"
            aria-controls="locator-layout-main"
            onClick={onToggleMenu}
          >
            <locator-icon
              icon="close"
              label={t('actions.close')}
              color="primary"
            />
          </button>
        </evg-button>
      </HeaderBase>
    );
  }

  return (
    <HeaderBase logoHref={logoHref}>
      <HeaderTitle
        title={title}
        subtitle={subtitle}
        actionButton={
          <button
            type="button"
            aria-expanded="false"
            aria-controls="locator-layout-main"
            onClick={onToggleMenu}
          >
            <locator-icon icon="menu" label={t('actions.menu')} />
          </button>
        }
      />
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
