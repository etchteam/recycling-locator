import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import TipContent from '@/components/content/TipContent/TipContent';
import Menu from '@/components/control/Menu/Menu';
import NavLink from '@/components/control/NavBar/NavLink';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocalAuthority } from '@/hooks/useLocalAuthority';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { useTip } from '@/hooks/useTip';
import i18n from '@/lib/i18n';

export default function HomeRecyclingLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const locale = i18n.language;
  const { postcode, data: postcodeData } = usePostcode();
  const layoutRef = useRef();
  const { data: localAuthority, loading: laLoading } = useLocalAuthority();
  const { data: tip, loading: tipLoading } = useTip({
    path: '/:postcode/home',
  });
  const open = useSignal(false);
  useScrollRestoration(layoutRef);
  const homeTipImgSrc = `${publicPath}images/home-tip.svg`;
  const city = postcodeData?.city;

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        {open.value ? (
          <locator-header-content>
            <Link href={`/${postcode}`}>
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
              <Link href={`/${postcode}`}>
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
                  {!laLoading && localAuthority && (
                    <diamond-enter type="fade">
                      <p>{localAuthority.name}</p>
                    </diamond-enter>
                  )}
                </div>
              </locator-header-title>
            </locator-header-content>
          </>
        )}
      </locator-header>
      <div slot="layout-main" id="locator-layout-main" ref={layoutRef}>
        {open.value ? (
          <Menu
            handleClose={() => (open.value = false)}
            postcode={postcode}
            city={city}
          />
        ) : (
          <>
            {localAuthority && (
              <locator-nav-bar>
                <nav>
                  <ul>
                    <li>
                      <NavLink href={`/${postcode}/home`}>
                        {t('homeRecycling.nav.collections')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink href={`/${postcode}/home/recycling-centre`}>
                        {t('homeRecycling.nav.hwrc')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink href={`/${postcode}/home/contact`}>
                        {t('homeRecycling.nav.contact')}
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </locator-nav-bar>
            )}
            <diamond-section padding="lg">
              <locator-wrap>{children}</locator-wrap>
            </diamond-section>
          </>
        )}
      </div>
      <locator-tip slot="layout-aside" text-align="center">
        <locator-wrap>
          {!tipLoading && tip ? (
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
              {!laLoading && localAuthority && (
                <diamond-enter type="fade">
                  <diamond-button width="full-width">
                    <a
                      href={localAuthority.recyclingUri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {localAuthority.name}
                      <locator-icon icon="external"></locator-icon>
                    </a>
                  </diamond-button>
                </diamond-enter>
              )}
            </>
          )}
        </locator-wrap>
      </locator-tip>
    </locator-layout>
  );
}
