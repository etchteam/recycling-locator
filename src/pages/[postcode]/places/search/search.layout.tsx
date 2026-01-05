import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import NavLink from '@/components/control/NavBar/NavLink';
import { usePostcode } from '@/hooks/PostcodeProvider';
import useScrollRestoration from '@/hooks/useScrollRestoration';

export default function PlacesSearchLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const { postcode } = usePostcode();
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);
  const [searchParams] = useSearchParams();

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        <locator-header-logo>
          <Link href={`/${postcode}`}>
            <locator-logo type="logo-only"></locator-logo>
          </Link>
        </locator-header-logo>
        <locator-header-content>
          <locator-header-title>
            <h2>{t('places.search.title')}</h2>
          </locator-header-title>
          <diamond-button width="square" size="sm">
            <Link href={`/${postcode}/places?${searchParams.toString()}`}>
              <locator-icon
                icon="close"
                color="primary"
                label={t('actions.close')}
              />
            </Link>
          </diamond-button>
        </locator-header-content>
      </locator-header>
      <div slot="layout-main" ref={layoutRef}>
        <locator-nav-bar>
          <nav>
            <ul>
              <li>
                <NavLink
                  href={`/${postcode}/places/search`}
                  path="/:postcode/places/search"
                >
                  {t('places.search.nav.search')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  href={`/${postcode}/places/search/categories`}
                  path="/:postcode/places/search/categories"
                >
                  <span className="hidden-tablet">
                    {t('places.search.nav.categories')}
                  </span>
                  <span className="hidden visible-tablet">
                    {t('places.search.nav.recyclingCategories')}
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  href={`/${postcode}/places/search/a-z`}
                  path="/:postcode/places/search/a-z"
                >
                  <span className="hidden-tablet">
                    {t('places.search.nav.aToZ')}
                  </span>
                  <span className="hidden visible-tablet">
                    {t('places.search.nav.aToZofItems')}
                  </span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </locator-nav-bar>
        {children}
      </div>
    </locator-layout>
  );
}
