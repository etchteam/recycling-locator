import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter-preact';

import HeaderWithCloseButton from '@/components/content/HeaderLayouts/HeaderWithCloseButton';
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
      <div slot="layout-header" className="display-contents">
        <HeaderWithCloseButton
          logoType="icon-only"
          logoHref={`/${postcode}`}
          title={t('places.search.title')}
          closeHref={`/${postcode}/places?${searchParams.toString()}`}
        />
      </div>
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
