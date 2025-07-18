import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/composition/Layout/Layout';
import '@/components/composition/Header/Header';
import '@/components/content/Logo/Logo';
import '@/components/content/Icon/Icon';
import '@/components/canvas/Tip/Tip';
import '@/components/composition/Wrap/Wrap';

import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router';

import { useAppState } from '@/lib/AppState';

const pages = ['intro', 'guide', 'options', 'benefits', 'alerts'];

export function ReviewsAside() {
  const { publicPath } = useAppState();
  const generalTipImgSrc = `${publicPath}images/refill-tip.svg`;

  return (
    <locator-tip type="image">
      <locator-wrap>
        <img src={generalTipImgSrc} alt="Illustration of person refilling" />
      </locator-wrap>
    </locator-tip>
  );
}

export default function StartLayout({
  isHome = false,
  children,
}: {
  readonly isHome?: boolean;
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        <locator-header-logo>
          {/* replace with refill logo */}
          <locator-logo type="logo-only"></locator-logo>
        </locator-header-logo>
        <locator-header-content>
          <locator-header-title>
            <diamond-button>
              <Link to={isHome ? '/' : '/refill'} unstable_viewTransition>
                <locator-icon icon="arrow-left" label="Back"></locator-icon>
              </Link>
            </diamond-button>
            <div>
              <h2>{t('refill.header.title')}</h2>
              <p className="text-color-positive text-italic diamond-text-weight-bold">
                {t('refill.header.comingSoon')}
              </p>
            </div>
          </locator-header-title>
        </locator-header-content>
      </locator-header>
      <div slot="layout-main" id="locator-layout-main">
        <locator-nav-bar>
          <nav>
            <ul>
              {pages.map((page) => (
                <li key={page}>
                  <NavLink
                    to={page === 'intro' ? `/refill` : `/refill/${page}`}
                    unstable_viewTransition
                    end
                  >
                    {t(`refill.nav.${page}.title`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </locator-nav-bar>
        <locator-wrap>
          <Outlet />
          {children}
        </locator-wrap>
      </div>
      <div
        slot="layout-aside"
        className="display-contents hidden visible-tablet"
      >
        <ReviewsAside />
      </div>
    </locator-layout>
  );
}
