import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { IconAttributes } from '@/components/content/Icon/Icon';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useRefillLocations } from '@/hooks/useRefillLocations';
import formatPostcode from '@/lib/formatPostcode';
import getRefillCategoryAvailability from '@/lib/getRefillCategoryAvailability';

interface NavLinkProps {
  readonly href: string;
  readonly icon: IconAttributes['icon'];
  readonly title?: string;
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
          {title && (
            <h4 className="text-size-base evg-text-weight-bold evg-spacing-bottom-none">
              {title}
            </h4>
          )}
          <p className="evg-text-size-body-xs">{description}</p>
        </div>
      </Link>
    </locator-icon-link>
  );
}

function Loading() {
  return (
    <evg-enter type="fade-in-up">
      <locator-loading-card className="evg-spacing-top-md" />
    </evg-enter>
  );
}

function RecyclingLink({ postcode }: { readonly postcode: string }) {
  const { t } = useTranslation();
  return (
    <>
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
    </>
  );
}

function RefillOptions({ postcode }: { readonly postcode: string }) {
  const { t } = useTranslation();
  const { data: refillLocations, loading: locationsLoading } =
    useRefillLocations();
  const { publicPath } = useAppState();

  const categories = ['mixed-food', 'cleaning', 'personal-care'];

  const navCards = ['guide', 'home-delivery'];

  const navLinks: NavLinkProps[] = [
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

  if (locationsLoading) {
    return <Loading />;
  }

  if (refillLocations.items?.length === 0) {
    return (
      <>
        <evg-card
          className="evg-spacing-top-md theme-negative-muted"
          radius="sm"
          padding="sm"
        >
          <evg-card-content>
            <evg-row>
              <locator-icon-circle variant="negative" transparent>
                <locator-icon icon="pin"></locator-icon>
              </locator-icon-circle>
              <div>
                <h3 className="evg-spacing-bottom-none">
                  {t('refill.explore.noPlaces.title')}
                </h3>
                <p className="evg-text-size-body-xs">
                  {t('refill.explore.noPlaces.description')}
                </p>
              </div>
            </evg-row>
          </evg-card-content>
        </evg-card>
        <ul className="list-style-none">
          <li className="evg-spacing-top-md">
            <NavLink
              href={`/${postcode}/refill/discover/sign-up`}
              icon="home-pin"
              description={t('refill.explore.signUp.description')}
            />
          </li>
        </ul>

        <p className="evg-text-size-body evg-spacing-top-md evg-spacing-bottom-sm">
          You still have options
        </p>
        <ul className="list-style-none">
          {navCards.map((page) => (
            <li key={page} className="evg-spacing-bottom-md">
              <locator-card-link>
                <Link href={`/${postcode}/refill/discover/${page}`}>
                  <locator-card-link-img>
                    <img
                      src={`${publicPath}images/refill/${page}.webp`}
                      alt=""
                    />
                  </locator-card-link-img>
                  <locator-card-link-content>
                    <p className="evg-text-weight-bold evg-spacing-bottom-none">
                      {t(`refill.discover.nav.${page}.title`)}
                    </p>
                    <p>{t(`refill.discover.nav.${page}.description`)}</p>
                  </locator-card-link-content>
                </Link>
              </locator-card-link>
            </li>
          ))}
        </ul>
        <RecyclingLink postcode={postcode} />
      </>
    );
  }

  return (
    <>
      <NavLink
        href={`/${postcode}/refill/places`}
        icon="refill"
        title={t('refill.explore.nearestLocations.title')}
        description={t('refill.explore.nearestLocations.description', {
          count: refillLocations.items?.length ?? 0,
        })}
      />
      {getRefillCategoryAvailability(refillLocations.items) && (
        <>
          <p className="evg-text-size-body evg-spacing-top-md evg-spacing-bottom-sm">
            Refill your favourites
          </p>
          <locator-overflow largeScreen wrapCards>
            <ul>
              {categories.map((category) => (
                <li key={category}>
                  <locator-category-card>
                    <Link
                      href={`/${postcode}/refill/places?category=${category}`}
                    >
                      <img
                        src={`${publicPath}images/refill/categories/${category}.webp`}
                        alt=""
                        width="180"
                        height="220"
                      />
                      <evg-chip variant="light">
                        <span>
                          <locator-icon
                            icon={category as IconAttributes['icon']}
                          ></locator-icon>
                          {t(`refill.category.${category}`)}
                        </span>
                      </evg-chip>
                    </Link>
                  </locator-category-card>
                </li>
              ))}
            </ul>
          </locator-overflow>
        </>
      )}
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
      <RecyclingLink postcode={postcode} />
    </>
  );
}

export default function RefillPage() {
  const { t } = useTranslation();
  const { data: postcodeData } = usePostcode();
  const postcode = postcodeData?.postcode || '';
  const city = postcodeData?.city || '';

  return (
    <>
      <locator-context-header>
        <div>
          <span className="evg-text-weight-bold">
            {formatPostcode(postcode)}
          </span>
          {city && <>&nbsp;&ndash; {city}</>}
        </div>
        <evg-button variant="ghost" size="sm">
          <Link href="/refill">{t('actions.change')}</Link>
        </evg-button>
      </locator-context-header>
      <locator-wrap max-width="none" gutter="fluid">
        <evg-section padding="md">
          <h2>{t('refill.explore.title')}</h2>
          <RefillOptions postcode={postcode} />
        </evg-section>
      </locator-wrap>
    </>
  );
}
