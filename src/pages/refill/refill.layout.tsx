import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useSearchParams,
} from 'react-router';

import Menu from '@/components/control/Menu/Menu';
import { useAppState } from '@/lib/AppState';
import useScrollRestoration from '@/lib/useScrollRestoration';

import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/composition/Layout/Layout';
import '@/components/composition/Header/Header';
import '@/components/content/Logo/Logo';
import '@/components/content/Icon/Icon';
import '@/components/canvas/Tip/Tip';
import '@/components/composition/Wrap/Wrap';

const pages = ['intro', 'guide', 'options', 'benefits', 'sign-up'];

export function RefillAside({ postcode }: { readonly postcode: string }) {
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
            <Link to={'/' + postcode} unstable_viewTransition>
              {t('refill.aside.cta')}
            </Link>
          </diamond-button>
        </diamond-enter>
      </locator-wrap>
    </locator-tip>
  );
}

export function FullMenu({
  handleClick,
}: {
  readonly handleClick?: () => boolean;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-expanded="false"
      aria-controls="locator-layout-main"
      onClick={handleClick}
    >
      <locator-icon icon="menu" label={t('actions.menu')}></locator-icon>
    </button>
  );
}

export default function StartLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const open = useSignal(false);
  const location = useLocation();
  const isHome = location.pathname === '/refill';

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';

  const layoutRef = useRef();
  useScrollRestoration(layoutRef);

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        {open.value ? (
          <locator-header-content>
            <Link to={`/${postcode}`}>
              {/* replace with refill logo */}
              <locator-logo type="logo-only"></locator-logo>
            </Link>
            <diamond-button width="square" size="sm">
              <button
                type="button"
                aria-expanded="true"
                aria-controls="locator-layout-main"
                onClick={() => (open.value = !open.value)}
              >
                <locator-icon
                  icon="close"
                  label={t('actions.close')}
                  color="primary"
                ></locator-icon>
              </button>
            </diamond-button>
          </locator-header-content>
        ) : (
          <>
            <locator-header-logo>
              {/* replace with refill logo */}
              <locator-logo type="logo-only"></locator-logo>
            </locator-header-logo>
            <locator-header-content>
              <locator-header-title>
                <diamond-button>
                  {postcode && isHome ? (
                    <FullMenu handleClick={() => (open.value = !open.value)} />
                  ) : (
                    <Link
                      to={isHome ? '/' : `/refill${postcodeQuery}`}
                      unstable_viewTransition
                    >
                      <locator-icon
                        icon="arrow-left"
                        label="Back"
                      ></locator-icon>
                    </Link>
                  )}
                </diamond-button>
                <div>
                  <h2>{t('refill.header.title')}</h2>
                  <p className="text-color-positive text-italic diamond-text-weight-bold">
                    {t('refill.header.comingSoon')}
                  </p>
                </div>
              </locator-header-title>
            </locator-header-content>
          </>
        )}
      </locator-header>
      <div slot="layout-main" id="locator-layout-main" ref={layoutRef}>
        {open.value ? (
          <Menu handleClose={() => (open.value = false)} postcode={postcode} />
        ) : (
          <>
            <locator-nav-bar>
              <nav>
                <ul>
                  {pages.map((page) => (
                    <li key={page}>
                      <NavLink
                        to={
                          (page === 'intro' ? '/refill' : `/refill/${page}`) +
                          postcodeQuery
                        }
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
            <locator-wrap large-screen-only>
              <Outlet />
              {children}
            </locator-wrap>
          </>
        )}
      </div>
      <RefillAside postcode={postcode || ''} />
    </locator-layout>
  );
}
