import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { IconAttributes } from '@/components/content/Icon/Icon';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useRefillLocations } from '@/hooks/useRefillLocations';

interface NavLinkProps {
  readonly href: string;
  readonly icon: IconAttributes['icon'];
  readonly title: string;
  readonly description: string;
}

function NavLink({ href, icon, title, description }: NavLinkProps) {
  return (
    <locator-icon-link border className="evg-spacing-top-md">
      <Link href={href}>
        <locator-icon-circle>
          <locator-icon icon={icon} color="primary"></locator-icon>
        </locator-icon-circle>
        <div>
          <h4 className="text-size-base evg-spacing-bottom-none">{title}</h4>
          <p className="evg-text-size-body-xs">{description}</p>
        </div>
      </Link>
    </locator-icon-link>
  );
}

export default function RefillPage() {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const { data: refillLocations } = useRefillLocations();

  const navLinks: NavLinkProps[] = [
    {
      href: `/${postcode}/refill/places`,
      icon: 'refill',
      title: t('refill.explore.nearestLocations.title'),
      description: t('refill.explore.nearestLocations.description', {
        count: refillLocations?.items?.length ?? 0,
      }),
    },
    {
      href: `/${postcode}/refill/home-delivery`,
      icon: 'home',
      title: t('refill.explore.homeDelivery.title'),
      description: t('refill.explore.homeDelivery.description'),
    },
    {
      href: `/${postcode}/refill/discover`,
      icon: 'info',
      title: t('refill.explore.gettingStarted.title'),
      description: t('refill.explore.gettingStarted.description'),
    },
    {
      href: `/${postcode}/refill/discover/sign-up`,
      icon: 'home-pin',
      title: t('refill.explore.signUp.title'),
      description: t('refill.explore.signUp.description'),
    },
  ];

  return (
    <locator-wrap max-width="none" gutter="fluid">
      <evg-section padding="md">
        <h2>{t('refill.explore.title')}</h2>
        <section className="evg-spacing-bottom-lg">
          <ul className="list-style-none">
            {navLinks.map(({ href, icon, title, description }) => (
              <li key={href} className="evg-spacing-top-md">
                <NavLink
                  href={href}
                  icon={icon}
                  title={title}
                  description={description}
                />
              </li>
            ))}
          </ul>

          <evg-grid className="evg-spacing-top-sm" align-items="center">
            <evg-grid-item grow>
              <hr aria-hidden="true" />
            </evg-grid-item>
            <evg-grid-item>
              <span className="evg-text-size-body-xs">{t('common.or')}</span>
            </evg-grid-item>
            <evg-grid-item grow>
              <hr aria-hidden="true" />
            </evg-grid-item>
          </evg-grid>

          <NavLink
            href={`/${postcode}`}
            icon="recycle"
            title={t('refill.explore.recyclingOptions.title')}
            description={t('refill.explore.recyclingOptions.description')}
          />
        </section>
      </evg-section>
    </locator-wrap>
  );
}
