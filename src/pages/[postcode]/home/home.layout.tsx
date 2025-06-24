import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { Suspense } from 'preact/compat';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Await, Link, NavLink, Outlet, useParams } from 'react-router';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';

import '@/components/composition/Layout/Layout';
import '@/components/composition/Header/Header';
import '@/components/canvas/Tip/Tip';
import '@/components/composition/Wrap/Wrap';
import '@/components/content/HeaderTitle/HeaderTitle';
import '@/components/content/Icon/Icon';
import '@/components/control/NavBar/NavBar';
import Menu from '@/components/control/Menu/Menu';
import TipContent from '@/components/template/TipContent/TipContent';
import { useAppState } from '@/lib/AppState';
import i18n from '@/lib/i18n';
import useScrollRestoration from '@/lib/useScrollRestoration';

import { useHomeRecyclingLoaderData } from './home.loader';

export default function HomeRecyclingLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const locale = i18n.language;
  const { postcode } = useParams();
  const layoutRef = useRef();
  const data = useHomeRecyclingLoaderData();
  const open = useSignal(false);
  useScrollRestoration(layoutRef);
  const localAuthority = data?.localAuthority;
  const tipPromise = data?.tip;
  const homeTipImgSrc = `${publicPath}images/home-tip.svg`;

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        {open.value ? (
          <locator-header-content>
            <Link to={`/${postcode}`}>
              <locator-logo locale={locale}></locator-logo>
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
              <Link to={`/${postcode}`}>
                <locator-logo type="logo-only"></locator-logo>
              </Link>
            </locator-header-logo>
            <locator-header-content>
              <locator-header-title>
                <diamond-button>
                  <button
                    type="button"
                    aria-expanded="false"
                    aria-controls="locator-layout-main"
                    onClick={() => (open.value = !open.value)}
                  >
                    <locator-icon
                      icon="menu"
                      label={t('actions.menu')}
                    ></locator-icon>
                  </button>
                </diamond-button>
                <div>
                  <h2>{t('homeRecycling.title')}</h2>
                  <Suspense fallback={null}>
                    <Await resolve={localAuthority}>
                      {(la) => (
                        <diamond-enter type="fade">
                          <p>{la.name}</p>
                        </diamond-enter>
                      )}
                    </Await>
                  </Suspense>
                </div>
              </locator-header-title>
            </locator-header-content>
          </>
        )}
      </locator-header>
      <div slot="layout-main" id="locator-layout-main" ref={layoutRef}>
        {open.value ? (
          <Menu handleClose={() => (open.value = false)} />
        ) : (
          <>
            {localAuthority && (
              <locator-nav-bar>
                <nav>
                  <ul>
                    <li>
                      <NavLink
                        to={`/${postcode}/home`}
                        unstable_viewTransition
                        end
                      >
                        {t('homeRecycling.nav.collections')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/${postcode}/home/recycling-centre`}
                        unstable_viewTransition
                      >
                        {t('homeRecycling.nav.hwrc')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/${postcode}/home/contact`}
                        unstable_viewTransition
                      >
                        {t('homeRecycling.nav.contact')}
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </locator-nav-bar>
            )}
            <diamond-section padding="lg">
              <locator-wrap>
                <Outlet />
                {children}
              </locator-wrap>
            </diamond-section>
          </>
        )}
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>
          <Suspense fallback={null}>
            <Await resolve={tipPromise}>
              {(tip) =>
                tip ? (
                  <TipContent tip={tip} />
                ) : (
                  <>
                    <img
                      src={homeTipImgSrc}
                      alt=""
                      className="diamond-spacing-bottom-sm"
                    />
                    <h2>{t('homeRecycling.aside.title')}</h2>
                    <p>{t('homeRecycling.aside.content')}</p>
                    <Suspense fallback={null}>
                      <Await resolve={localAuthority}>
                        {(la) => (
                          <diamond-enter type="fade">
                            <diamond-button width="full-width">
                              <a
                                href={la.recyclingUri}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {la.name}
                                <locator-icon icon="external"></locator-icon>
                              </a>
                            </diamond-button>
                          </diamond-enter>
                        )}
                      </Await>
                    </Suspense>
                  </>
                )
              }
            </Await>
          </Suspense>
        </locator-wrap>
      </locator-tip>
    </locator-layout>
  );
}
