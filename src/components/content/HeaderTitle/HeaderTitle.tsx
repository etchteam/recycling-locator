import { ComponentChildren } from 'preact';

import { CustomElement } from '@/types/customElement';

export interface HeaderTitleProps {
  /**
   * The main title text displayed in the header.
   */
  readonly title?: string;
  /**
   * Optional subtitle content displayed below the title.
   * Can be a string or custom JSX for unique formatting.
   */
  readonly subtitle?: ComponentChildren;
  /**
   * Whether to place the title before or after the children
   * @default title-last
   */
  readonly variant?: 'title-first' | 'title-last';
  /**
   * Optional content displayed before the title (e.g., back button, menu button).
   */
  readonly children?: ComponentChildren;
}

/**
 * Title/subtitle component for use within header layouts.
 * Renders a title with optional subtitle and leading content slot.
 */
export function HeaderTitle({
  title,
  subtitle,
  variant,
  children,
}: HeaderTitleProps) {
  return (
    <locator-header-title variant={variant}>
      {children}
      {title && (
        <div className="locator-header-title-content">
          <h2>{title}</h2>
          {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
        </div>
      )}
    </locator-header-title>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-header-title': CustomElement<{
        variant?: HeaderTitleProps['variant'];
      }>;
    }
  }
}
