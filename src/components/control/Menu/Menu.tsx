import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter-preact';

import Footer from '@/components/content/Footer/Footer';
import { IconAttributes } from '@/components/content/Icon/Icon';
import formatPostcode from '@/lib/formatPostcode';
import { CustomElement } from '@/types/customElement';

export default function Menu({
  handleClose,
  postcode,
  city,
}: {
  readonly handleClose: () => void;
  readonly postcode: string;
  readonly city?: string;
}) {
  const { t } = useTranslation();
  const [location] = useLocation();

  const items: {
    icon: IconAttributes['icon'];
    text: string;
    href: string;
  }[] = [
    {
      icon: 'pin',
      text: t('components.menu.changeLocation'),
      href: '/?autofocus=true',
    },
    {
      icon: 'search',
      text: t('components.menu.recycleSpecificItem'),
      href: `/${encodeURIComponent(postcode)}?autofocus=true`,
    },
    {
      icon: 'home',
      text: t('components.menu.homeRecycling'),
      href: `/${encodeURIComponent(postcode)}/home`,
    },
    {
      icon: 'distance',
      text: t('components.menu.findNearbyPlaces'),
      href: `/${encodeURIComponent(postcode)}/places`,
    },
    {
      icon: 'refill',
      text: t('components.menu.refill'),
      href: `/${encodeURIComponent(postcode)}/refill`,
    },
  ];

  const handleClick = (event: Event, href: string) => {
    if (encodeURI(location) === href.split('?')[0]) {
      // If the link is already active, close the menu
      event.preventDefault();
      handleClose();
    }
  };

  return (
    <locator-menu>
      <evg-enter type="fade">
        <locator-context-header>
          <div>
            <span className="evg-text-weight-bold">
              {formatPostcode(postcode)}
            </span>{' '}
            {city ? <>&ndash; {city}</> : null}
          </div>
        </locator-context-header>
      </evg-enter>
      <evg-section padding="md">
        <locator-wrap>
          <evg-enter type="fade" class="evg-spacing-bottom-md">
            <p className="evg-text-size-heading-sm">
              {t('components.menu.whatDoYouWantToDo')}
            </p>
          </evg-enter>
          <nav>
            <ul className="locator-menu__menu-list">
              {items.map((item, i) => (
                <li key={item.icon} className="evg-spacing-bottom-md">
                  <evg-enter type="fade" delay={i * 0.1}>
                    <locator-icon-link key={item.icon} border>
                      <Link
                        href={item.href}
                        onClick={(event) => handleClick(event, item.href)}
                      >
                        <locator-icon-circle>
                          <locator-icon icon={item.icon} color="primary" />
                        </locator-icon-circle>
                        {item.text}
                      </Link>
                    </locator-icon-link>
                  </evg-enter>
                </li>
              ))}
            </ul>
          </nav>
          <evg-enter type="fade" delay={items.length * 0.1}>
            <hr className="evg-spacing-bottom-md" />
            <Footer />
          </evg-enter>
        </locator-wrap>
      </evg-section>
    </locator-menu>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-menu': CustomElement;
    }
  }
}
