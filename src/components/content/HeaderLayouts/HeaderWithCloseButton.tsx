import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { HeaderTitle } from '../HeaderTitle/HeaderTitle';

import HeaderBase, { HeaderBaseProps } from './HeaderBase';

export interface HeaderWithCloseButtonProps
  extends Omit<HeaderBaseProps, 'children'> {
  /**
   * Optional title text displayed in the header.
   */
  readonly title?: string;
  /**
   * Optional subtitle content displayed below the title.
   */
  readonly subtitle?: ComponentChildren;
  /**
   * The path to navigate to when the close button is clicked.
   */
  readonly closeHref: string;
}

/**
 * Header layout with icon logo, title, and close button.
 * Used for overlay/modal-style views like search.
 */
export default function HeaderWithCloseButton({
  logoType,
  logoHref,
  title,
  subtitle,
  closeHref,
}: HeaderWithCloseButtonProps) {
  const { t } = useTranslation();

  return (
    <HeaderBase logoHref={logoHref} logoType={logoType}>
      {title && <HeaderTitle title={title} subtitle={subtitle} />}
      <evg-button variant="ghost" width="square">
        <Link href={closeHref}>
          <locator-icon
            icon="close"
            color="primary"
            label={t('actions.close')}
          />
        </Link>
      </evg-button>
    </HeaderBase>
  );
}
