import { ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

import HeaderWithMenu, {
  MenuLayout,
} from '@/components/content/HeaderLayouts/HeaderWithMenu';
import TipContent from '@/components/content/TipContent/TipContent';
import NavLink from '@/components/control/NavBar/NavLink';
import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocalAuthority } from '@/hooks/useLocalAuthority';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { useTip } from '@/hooks/useTip';

export default function HomeRecyclingLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { publicPath } = useAppState();
  const { t } = useTranslation();
  const { postcode, data: postcodeData } = usePostcode();
  const layoutRef = useRef();
  const { data: localAuthority, loading: laLoading } = useLocalAuthority();
  const { data: tip, loading: tipLoading } = useTip({
    path: '/:postcode/home',
  });
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollRestoration(layoutRef);
  const homeTipImgSrc = `${publicPath}images/home-tip.svg`;
  const city = postcodeData?.city;

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithMenu
          logoHref={`/${postcode}`}
          title={t('homeRecycling.title')}
          subtitle={!laLoading && localAuthority ? localAuthority.name : ''}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen(!menuOpen)}
        />
      </div>
      <div slot="layout-main" id="locator-layout-main" ref={layoutRef}>
        <MenuLayout
          menuOpen={menuOpen}
          onCloseMenu={() => setMenuOpen(false)}
          postcode={postcode}
          city={city}
        >
          {localAuthority && (
            <locator-nav-bar>
              <nav>
                <ul>
                  <li>
                    <NavLink href={`/${postcode}/home`} path="/:postcode/home">
                      {t('homeRecycling.nav.collections')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      href={`/${postcode}/home/recycling-centre`}
                      path="/:postcode/home/recycling-centre"
                    >
                      {t('homeRecycling.nav.hwrc')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      href={`/${postcode}/home/contact`}
                      path="/:postcode/home/contact"
                    >
                      {t('homeRecycling.nav.contact')}
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </locator-nav-bar>
          )}
          <evg-section padding="lg">
            <locator-wrap>{children}</locator-wrap>
          </evg-section>
        </MenuLayout>
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
                className="evg-spacing-bottom-sm"
              />
              <h2>{t('homeRecycling.aside.title')}</h2>
              <p>{t('homeRecycling.aside.content')}</p>
              {!laLoading && localAuthority && (
                <evg-enter type="fade">
                  <evg-button width="full-width">
                    <a
                      href={localAuthority.recyclingUri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {localAuthority.name}
                      <locator-icon icon="external"></locator-icon>
                    </a>
                  </evg-button>
                </evg-enter>
              )}
            </>
          )}
        </locator-wrap>
      </locator-tip>
    </locator-layout>
  );
}
