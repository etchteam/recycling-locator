import { ComponentChildren } from 'preact';
import { Link, useRoute } from 'wouter-preact';

export interface NavLinkProps {
  /**
   * The link href to navigate to.
   */
  readonly href: string;
  /**
   * An optional path to match against for active state.
   * If not provided, `href` is used.
   */
  readonly path?: string;
  readonly children: ComponentChildren;
}

export default function NavLink({ href, path, children }: NavLinkProps) {
  const hrefWithoutSearch = href.split('?')[0];
  const [isActive] = useRoute(path ?? hrefWithoutSearch);

  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  );
}
