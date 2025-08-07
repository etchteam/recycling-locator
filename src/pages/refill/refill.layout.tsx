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
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router';

import { useAppState } from '@/lib/AppState';
import useScrollRestoration from '@/lib/useScrollRestoration';

const pages = ['intro', 'guide', 'options', 'benefits', 'sign-up'];

export function RefillAside() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();
  const generalTipImgSrc = `${publicPath}images/material-tip.svg`;

  return (
    <locator-tip slot="layout-aside" text-align="center">
      <locator-wrap>
        <img src={generalTipImgSrc} alt="" />
        <p className="diamond-text-weight-bold">{t('refill.aside.subtitle')}</p>
        <h2>{t('refill.aside.title')}</h2>
        <p>{t('refill.aside.content')}</p>
        <diamond-enter type="fade">
          <diamond-button width="full-width">
            <Link to={'/'} unstable_viewTransition>
              {t('refill.aside.cta')}
            </Link>
          </diamond-button>
        </diamond-enter>
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
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);

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
      <div slot="layout-main" id="locator-layout-main" ref={layoutRef}>
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
      <RefillAside />
    </locator-layout>
  );
}
