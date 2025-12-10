import { useSignal } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/composition/Layout/Layout';
import '@/components/composition/PlacesHeader/PlacesHeader';
import '@/components/content/HeaderTitle/HeaderTitle';
import '@/components/content/Icon/Icon';
import '@/components/control/TagButton/TagButton';
import Menu from '@/components/control/Menu/Menu';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocations } from '@/hooks/useLocations';
import formatPostcode from '@/lib/formatPostcode';
import i18n from '@/lib/i18n';
import mapSearchParams from '@/lib/mapSearchParams';

export default function PlacesLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const locale = i18n.language;
  const { postcode, data: postcodeData } = usePostcode();
  const { data: locations, loading: locationsLoading } = useLocations();
  const open = useSignal(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const city = postcodeData?.city;
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
                {search && !locationsLoading && locations && (
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
                <Link href={`/${postcode}/places/search?${query.toString()}`}>
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
          <>{children}</>
        )}
      </div>
    </locator-layout>
  );
}
