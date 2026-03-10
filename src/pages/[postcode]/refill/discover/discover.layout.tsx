import { ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useRoute } from 'wouter-preact';

import HeaderWithBackButton from '@/components/content/HeaderLayouts/HeaderWithBackButton';
import { MenuLayout } from '@/components/content/HeaderLayouts/HeaderWithMenu';
import NavLink from '@/components/control/NavBar/NavLink';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useRefillLocations } from '@/hooks/useRefillLocations';
import useScrollRestoration from '@/hooks/useScrollRestoration';

const pages = ['intro', 'guide', 'options', 'benefits'];

export default function DiscoverRefillLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDiscover] = useRoute('/:postcode/refill/discover');
  const { postcode } = usePostcode();
  const layoutRef = useRef();

  const { data: refillLocations, loading: locationsLoading } =
    useRefillLocations();

  useScrollRestoration(layoutRef);

  return (
    <locator-layout>
      <div slot="layout-header" className="display-contents">
        <HeaderWithBackButton
          logoType="icon-only"
          logoHref="/refill"
          title={t('refill.header.title')}
          subtitle={postcode}
          backFallback={`/${postcode}/refill`}
        />
      </div>
      <div slot="layout-main" id="locator-layout-main" ref={layoutRef}>
        <MenuLayout
          menuOpen={menuOpen}
          onCloseMenu={() => setMenuOpen(false)}
          postcode={postcode ?? undefined}
        >
          {!isDiscover && (
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
          )}
          <locator-wrap max-width="extra-wide" gutter="fluid">
            <evg-section padding="lg">{children}</evg-section>
            {!locationsLoading && (
              <evg-section>
                <locator-tip wrap="wrap" type="image">
                  <img src="/images/refill/refill-tip.webp" alt="" />
                  {refillLocations?.items?.length > 0 ? (
                    <locator-tip-content>
                      <h2>{t('refill.discover.tip.withLocations.title')}</h2>
                      <p>
                        {t('refill.discover.tip.withLocations.description')}
                      </p>
                      <evg-button>
                        <Link href={`/${postcode}/refill/`}>
                          {t('refill.discover.tip.withLocations.cta', {
                            count: refillLocations?.items?.length,
                          })}
                        </Link>
                      </evg-button>
                    </locator-tip-content>
                  ) : (
                    <locator-tip-content>
                      <h2>{t('refill.discover.tip.noLocations.title')}</h2>
                      <p>{t('refill.discover.tip.noLocations.description')}</p>
                      <evg-button>
                        <Link href={`/${postcode}/refill/sign-up`}>
                          {t('refill.discover.alerts.title')}
                        </Link>
                      </evg-button>
                    </locator-tip-content>
                  )}
                </locator-tip>
              </evg-section>
            )}
          </locator-wrap>
        </MenuLayout>
      </div>
    </locator-layout>
  );
}
