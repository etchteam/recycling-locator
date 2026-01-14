import { ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useRoute, useSearchParams } from 'wouter-preact';

import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import HeaderWithMenu, {
  MenuLayout,
} from '@/components/content/HeaderLayouts/HeaderWithMenu';
import NavLink from '@/components/control/NavBar/NavLink';
import { useAppState } from '@/hooks/AppStateProvider';
import useScrollRestoration from '@/hooks/useScrollRestoration';

const pages = ['intro', 'guide', 'options', 'benefits', 'sign-up'];

export function RefillAside({ postcode }: { readonly postcode: string }) {
  const { t } = useTranslation();
  const { publicPath } = useAppState();
  const generalTipImgSrc = `${publicPath}images/material-tip.svg`;

  return (
    <locator-tip slot="layout-aside" text-align="center">
      <locator-wrap>
        <img src={generalTipImgSrc} alt="" />
        <p className="evg-text-weight-bold">{t('refill.aside.subtitle')}</p>
        <h2>{t('refill.aside.title')}</h2>
        <p>{t('refill.aside.content')}</p>
        <evg-enter type="fade">
          <evg-button width="full-width">
            <Link href={'/' + postcode}>{t('refill.aside.cta')}</Link>
          </evg-button>
        </evg-enter>
      </locator-wrap>
    </locator-tip>
  );
}

function RefillSubtitle() {
  const { t } = useTranslation();

  return (
    <p className="text-color-positive text-italic evg-text-weight-bold">
      {t('refill.header.comingSoon')}
    </p>
  );
}

export default function RefillLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHome] = useRoute('/refill');
  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';
  const layoutRef = useRef();

  useScrollRestoration(layoutRef);

  // Show menu when on home page with postcode, otherwise show back button
  const showMenu = postcode && isHome;
  const backFallback = isHome ? '/' : `/refill${postcodeQuery}`;

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        {showMenu ? (
          <HeaderWithMenu
            logoType="icon-only"
            logoHref={`/${postcode}`}
            title={t('refill.header.title')}
            subtitle={<RefillSubtitle />}
            menuOpen={menuOpen}
            onToggleMenu={() => setMenuOpen(!menuOpen)}
            mainContentId="locator-layout-main"
          />
        ) : (
          <HeaderWithBackButton
            logoType="icon-only"
            logoHref="/"
            title={t('refill.header.title')}
            subtitle={<RefillSubtitle />}
            backFallback={backFallback}
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
                        (page === 'intro' ? '/refill' : `/refill/${page}`) +
                        postcodeQuery
                      }
                    >
                      {t(`refill.nav.${page}.title`)}
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
      <RefillAside postcode={postcode || ''} />
    </locator-layout>
  );
}
