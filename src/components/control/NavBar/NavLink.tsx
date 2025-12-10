import { ComponentChildren } from 'preact';
import { Link, useRoute } from 'wouter-preact';

export default function NavLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: ComponentChildren;
}) {
  const [isActive] = useRoute(href);

  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  );
}
