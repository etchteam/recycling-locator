import { ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useRoute } from 'wouter-preact';

import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import HeaderWithMenu, {
  MenuLayout,
} from '@/components/content/HeaderLayouts/HeaderWithMenu';
import NavLink from '@/components/control/NavBar/NavLink';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useScrollRestoration from '@/hooks/useScrollRestoration';

const pages = ['intro', 'guide', 'options', 'benefits', 'sign-up'];

export function DiscoverRefillAside() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();
  const { postcode } = usePostcode();
  const generalTipImgSrc = `${publicPath}images/material-tip.svg`;

  return (
    <locator-tip slot="layout-aside" text-align="center">
      <locator-wrap>
        <img src={generalTipImgSrc} alt="" />
        <p className="evg-text-weight-bold">
          {t('refill.discover.aside.subtitle')}
        </p>
        <h2>{t('refill.discover.aside.title')}</h2>
        <p>{t('refill.discover.aside.content')}</p>
        <evg-enter type="fade">
          <evg-button width="full-width">
            <Link href={`/${postcode}`}>{t('refill.discover.aside.cta')}</Link>
          </evg-button>
        </evg-enter>
      </locator-wrap>
    </locator-tip>
  );
}

export default function DiscoverRefillLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHome] = useRoute('/:postcode/refill/discover');
  const { postcode } = usePostcode();
  const layoutRef = useRef();

  useScrollRestoration(layoutRef);

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        {isHome ? (
          <HeaderWithBackButton
            logoType="icon-only"
            logoHref="/refill"
            title={t('refill.header.title')}
            subtitle={postcode}
            backFallback={`/${postcode}/refill`}
          />
        ) : (
          <HeaderWithMenu
            logoType="icon-only"
            title={t('refill.header.title')}
            subtitle={postcode}
            menuOpen={menuOpen}
            onToggleMenu={() => setMenuOpen(!menuOpen)}
            mainContentId="locator-layout-main"
          />
        )}
      </div>
      <div slot="layout-main" id="locator-layout-main" ref={layoutRef}>
        <MenuLayout
          menuOpen={menuOpen}
          onCloseMenu={() => setMenuOpen(false)}
          postcode={postcode ?? undefined}
        >
          <locator-nav-bar>
            <nav>
              <ul>
                {pages.map((page) => (
                  <li key={page}>
                    <NavLink
                      href={
                        page === 'intro'
                          ? `/${postcode}/refill/discover`
                          : `/${postcode}/refill/discover/${page}`
                      }
                    >
                      {t(`refill.discover.nav.${page}.label`)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </locator-nav-bar>
          <locator-wrap large-screen-only={isHome}>
            <evg-section padding="lg">{children}</evg-section>
          </locator-wrap>
        </MenuLayout>
      </div>
      <DiscoverRefillAside />
    </locator-layout>
  );
}
