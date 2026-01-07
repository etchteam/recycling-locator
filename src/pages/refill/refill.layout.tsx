import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useRoute, useSearchParams } from 'wouter-preact';

import Menu from '@/components/control/Menu/Menu';
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
  const [isHome] = useRoute('/refill');

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
            <Link href={`/${postcode}`}>
              {/* replace with refill logo */}
              <locator-logo type="logo-only"></locator-logo>
            </Link>
            <evg-button variant="ghost" width="square">
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
            </evg-button>
          </locator-header-content>
        ) : (
          <>
            <locator-header-logo>
              {/* replace with refill logo */}
              <locator-logo type="logo-only"></locator-logo>
            </locator-header-logo>
            <locator-header-content>
              <locator-header-title>
                <evg-button>
                  {postcode && isHome ? (
                    <FullMenu handleClick={() => (open.value = !open.value)} />
                  ) : (
                    <Link href={isHome ? '/' : `/refill${postcodeQuery}`}>
                      <locator-icon
                        icon="arrow-left"
                        label="Back"
                      ></locator-icon>
                    </Link>
                  )}
                </evg-button>
                <div>
                  <h2>{t('refill.header.title')}</h2>
                  <p className="text-color-positive text-italic evg-text-weight-bold">
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
          </>
        )}
      </div>
      <RefillAside postcode={postcode || ''} />
    </locator-layout>
  );
}
