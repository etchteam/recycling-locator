import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/composition/BorderedList/BorderedList';
import Footer from '@/components/content/Footer/Footer';
import { IconAttributes } from '@/components/content/Icon/Icon';
import '@/components/control/IconLink/IconLink';
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
  const location = useLocation();

  const items: {
    icon: IconAttributes['icon'];
    text: string;
    to: string;
  }[] = [
    {
      icon: 'pin',
      text: t('components.menu.changeLocation'),
      to: '/?autofocus=true',
    },
    {
      icon: 'search',
      text: t('components.menu.recycleSpecificItem'),
      to: `/${encodeURIComponent(postcode)}?autofocus=true`,
    },
    {
      icon: 'home',
      text: t('components.menu.homeRecycling'),
      to: `/${encodeURIComponent(postcode)}/home`,
    },
    {
      icon: 'distance',
      text: t('components.menu.findNearbyPlaces'),
      to: `/${encodeURIComponent(postcode)}/places`,
    },
    {
      icon: 'refill',
      text: t('components.menu.refill'),
      to: `/refill?${encodeURIComponent(postcode)}`,
    },
  ];

  const handleClick = (event: Event, to: string) => {
    if (location.pathname === to.split('?')[0]) {
      // If the link is already active, close the menu
      event.preventDefault();
      handleClose();
    }
  };

  return (
    <locator-menu>
      <diamond-enter type="fade">
        <locator-context-header>
          <div>
            <span className="diamond-text-weight-bold">
              {formatPostcode(postcode)}
            </span>{' '}
            {city ? `&ndash; ${city}` : null}
          </div>
        </locator-context-header>
      </diamond-enter>
      <diamond-section padding="md">
        <locator-wrap>
          <diamond-enter type="fade" class="diamond-spacing-bottom-md">
            <p className="diamond-text-size-h4">
              {t('components.menu.whatDoYouWantToDo')}
            </p>
          </diamond-enter>
          <nav>
            <ul className="locator-menu__menu-list">
              {items.map((item, i) => (
                <li key={item.icon} className="diamond-spacing-bottom-md">
                  <diamond-enter type="fade" delay={i * 0.1}>
                    <locator-icon-link key={item.icon} border>
                      <Link
                        to={item.to}
                        onClick={(event) => handleClick(event, item.to)}
                      >
                        <locator-icon-circle>
                          <locator-icon icon={item.icon} color="primary" />
                        </locator-icon-circle>
                        {item.text}
                      </Link>
                    </locator-icon-link>
                  </diamond-enter>
                </li>
              ))}
            </ul>
          </nav>
          <diamond-enter type="fade" delay={items.length * 0.1}>
            <hr className="diamond-spacing-bottom-md" />
            <Footer />
          </diamond-enter>
        </locator-wrap>
      </diamond-section>
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
