import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import '@etchteam/diamond-ui/composition/Enter/Enter';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/composition/BorderedList/BorderedList';
import Footer from '@/components/content/Footer/Footer';
import { IconAttributes } from '@/components/content/Icon/Icon';
import '@/components/control/IconLink/IconLink';
import formatPostcode from '@/lib/formatPostcode';
import { usePostcodeLoaderData } from '@/pages/[postcode]/postcode.loader';

export default function Menu({
  handleClose,
}: {
  readonly handleClose: () => void;
}) {
  const { postcode, city } = usePostcodeLoaderData();
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
  ];

  const handleClick = (event: Event, to: string) => {
    if (location.pathname === to.split('?')[0]) {
      // If the link is already active, close the menu
      event.preventDefault();
      handleClose();
    }
  };

  return (
    <>
      <diamond-enter type="fade">
        <locator-context-header>
          <div>
            <span className="diamond-text-weight-bold">
              {formatPostcode(postcode)}
            </span>{' '}
            &ndash; {city}
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
          <locator-bordered-list>
            <nav>
              <ul>
                {items.map((item, i) => (
                  <li key={item.icon}>
                    <diamond-enter type="fade" delay={i * 0.1}>
                      <locator-icon-link key={item.icon}>
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
          </locator-bordered-list>
          <diamond-enter type="fade" delay={items.length * 0.1}>
            <hr className="diamond-spacing-bottom-md" />
            <Footer />
          </diamond-enter>
        </locator-wrap>
      </diamond-section>
    </>
  );
}
