import { useRef } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import {
  Link,
  NavLink,
  Outlet,
  useParams,
  useSearchParams,
} from 'react-router';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/composition/Layout/Layout';
import '@/components/composition/Header/Header';
import '@/components/content/HeaderTitle/HeaderTitle';
import '@/components/content/Icon/Icon';
import '@/components/control/NavBar/NavBar';
import useScrollRestoration from '@/lib/useScrollRestoration';

export default function PlacesSearchLayout() {
  const { t } = useTranslation();
  const { postcode } = useParams();
  const layoutRef = useRef();
  useScrollRestoration(layoutRef);
  const [searchParams] = useSearchParams();

  return (
    <locator-layout>
      <locator-header slot="layout-header">
        <locator-header-logo>
          <Link to={`/${postcode}`}>
            <locator-logo type="logo-only"></locator-logo>
          </Link>
        </locator-header-logo>
        <locator-header-content>
          <locator-header-title>
            <h2>{t('places.search.title')}</h2>
          </locator-header-title>
          <diamond-button width="square" size="sm">
            <Link
              to={`/${postcode}/places?${searchParams.toString()}`}
              unstable_viewTransition
            >
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
                  to={`/${postcode}/places/search`}
                  unstable_viewTransition
                  end
                >
                  {t('places.search.nav.search')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${postcode}/places/search/categories`}
                  unstable_viewTransition
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
                  to={`/${postcode}/places/search/a-z`}
                  unstable_viewTransition
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
        <Outlet />
      </div>
    </locator-layout>
  );
}
