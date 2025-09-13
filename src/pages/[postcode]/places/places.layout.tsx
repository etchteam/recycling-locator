import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { Suspense } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { Await, Link, Outlet, useParams, useSearchParams } from 'react-router';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/composition/Layout/Layout';
import '@/components/composition/PlacesHeader/PlacesHeader';
import '@/components/content/HeaderTitle/HeaderTitle';
import '@/components/content/Icon/Icon';
import '@/components/control/TagButton/TagButton';
import { usePostcodeLoaderData } from '../postcode.loader';
import Menu from '@/components/control/Menu/Menu';
import formatPostcode from '@/lib/formatPostcode';
import i18n from '@/lib/i18n';
import mapSearchParams from '@/lib/mapSearchParams';

import { usePlacesLoaderData } from './places.loader';

export default function PlacesLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const locale = i18n.language;
  const { postcode } = useParams();
  const loaderData = usePlacesLoaderData();
  const { city } = usePostcodeLoaderData();
  const locationsPromise = loaderData?.locations;
  const open = useSignal(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const query = mapSearchParams(
    ['materials', 'category', 'search', 'autofocus'],
    {
      materials: searchParams.get('materials'),
      category: searchParams.get('category'),
      search,
      autofocus: 'true',
    },
  );

  const handleResetSearch = () => {
    searchParams.delete('materials');
    searchParams.delete('category');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

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
            <locator-places-header>
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
                  <h2>{t('places.title')}</h2>
                  <p>{formatPostcode(postcode)}</p>
                </div>
              </locator-header-title>
              <locator-places-header-search>
                {search && (
                  <Suspense fallback={null}>
                    <Await resolve={locationsPromise}>
                      {(locations) => (
                        <diamond-enter type="fade">
                          <locator-tag-button
                            variant={
                              locations?.items.length > 0 &&
                              searchParams.get('materials') !== 'undefined'
                                ? 'positive'
                                : 'negative'
                            }
                          >
                            <button type="button" onClick={handleResetSearch}>
                              {search}
                              <locator-icon
                                icon="close"
                                label={t('actions.resetSearch')}
                              />
                            </button>
                          </locator-tag-button>
                        </diamond-enter>
                      )}
                    </Await>
                  </Suspense>
                )}
                <Link
                  to={`/${postcode}/places/search?${query.toString()}`}
                  unstable_viewTransition
                >
                  {!search && t('places.searchPlaceholder')}
                  <locator-icon icon="search" color="primary" />
                </Link>
              </locator-places-header-search>
            </locator-places-header>
          </>
        )}
      </locator-header>
      <div slot="layout-main" id="locator-layout-main">
        {open.value ? (
          <Menu
            handleClose={() => (open.value = false)}
            postcode={postcode}
            city={city}
          />
        ) : (
          <>
            <Outlet />
            {children}
          </>
        )}
      </div>
    </locator-layout>
  );
}
