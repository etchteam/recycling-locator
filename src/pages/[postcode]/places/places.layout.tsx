import { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import HeaderWithMenu, {
  MenuLayout,
} from '@/components/content/HeaderLayouts/HeaderWithMenu';
import { usePostcode } from '@/hooks/PostcodeProvider';
import { useLocations } from '@/hooks/useLocations';
import { useMaterialSearchTerm } from '@/hooks/useMaterialSearchTerm';
import formatPostcode from '@/lib/formatPostcode';
import mapSearchParams from '@/lib/mapSearchParams';

export default function PlacesLayout({
  children,
}: {
  readonly children?: ComponentChildren;
}) {
  const { t } = useTranslation();
  const { postcode, data: postcodeData } = usePostcode();
  const { data: locations, loading: locationsLoading } = useLocations();
  const { searchTerm, loading: searchTermLoading } = useMaterialSearchTerm();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const city = postcodeData?.city;
  const query = mapSearchParams(
    ['materials', 'category', 'search', 'autofocus'],
    {
      materials: searchParams.get('materials'),
      category: searchParams.get('category'),
      search: searchTerm,
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
      <div slot="layout-header" className="display-contents">
        <HeaderWithMenu
          logoHref={`/${postcode}`}
          title={t('places.title')}
          subtitle={formatPostcode(postcode)}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen(!menuOpen)}
          mainContentId="locator-layout-main"
        >
          <locator-header-search>
            {searchTerm && !locationsLoading && !searchTermLoading && (
              <evg-enter type="fade">
                <locator-tag-button
                  variant={
                    locations?.items.length > 0 &&
                    searchParams.get('materials') !== 'undefined'
                      ? 'positive'
                      : 'negative'
                  }
                >
                  <button type="button" onClick={handleResetSearch}>
                    {searchTerm}
                    <locator-icon
                      icon="close"
                      label={t('actions.resetSearch')}
                    />
                  </button>
                </locator-tag-button>
              </evg-enter>
            )}
            <Link href={`/${postcode}/places/search?${query.toString()}`}>
              {!searchTerm && t('places.searchPlaceholder')}
              <locator-icon icon="search" color="primary" />
            </Link>
          </locator-header-search>
        </HeaderWithMenu>
      </div>
      <div slot="layout-main" id="locator-layout-main">
        <MenuLayout
          menuOpen={menuOpen}
          onCloseMenu={() => setMenuOpen(false)}
          postcode={postcode}
          city={city}
        >
          {children}
        </MenuLayout>
      </div>
    </locator-layout>
  );
}
