import HeaderBase, { HeaderBaseProps } from './HeaderBase';

export interface HeaderWithTitleProps
  extends Omit<HeaderBaseProps, 'children'> {
  /**
   * The main title text displayed in the header.
   */
  readonly title: string;
  /**
   * Optional subtitle text displayed below the title.
   */
  readonly subtitle?: string;
}

/**
 * Header layout with icon logo and title (plus optional subtitle).
 * No action button before the title - use HeaderWithBackButton for that.
 */
export default function HeaderWithTitle({
  logoHref,
  logoType,
  title,
  subtitle,
}: HeaderWithTitleProps) {
  return (
    <HeaderBase logoHref={logoHref} logoType={logoType}>
      <locator-header-title>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </locator-header-title>
    </HeaderBase>
  );
}
